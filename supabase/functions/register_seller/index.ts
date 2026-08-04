// supabase/functions/register_seller/index.ts
//
// Edge Function for the frontend seller registration flow.
// Runs in the Deno runtime — uses Deno.env, WebCrypto, and standard APIs.
//
// Workflow:
//   1. Validate payload (email + password required)
//   2. Hash password with bcrypt
//   3. Encrypt sensitive fields (documents, bank accounts) with AES-GCM
//   4. Create auth user via admin API — the handle_new_user trigger provisions
//      profiles, user_roles, sellers, shops, bank_accounts, seller_documents, etc.
//   5. Post-creation: store bcrypt hash on sellers.password_hash
//   6. Return the new seller ID

// @ts-types="npm:@types/bcryptjs@2.4.6"
import bcrypt from 'npm:bcryptjs@3.0.3';
import { createClient } from 'npm:@supabase/supabase-js@2';

// ---------------------------------------------------------------------------
// AES-GCM encryption (Deno WebCrypto — no Buffer, no Node APIs)
// ---------------------------------------------------------------------------
function base64ToUint8(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function uint8ToBase64(arr: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin);
}

async function encryptText(plain: string, keyBase64: string): Promise<string> {
  const keyRaw = base64ToUint8(keyBase64);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyRaw,
    { name: 'AES-GCM' },
    false,
    ['encrypt'],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plain);
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, encoded);

  const cipherArr = new Uint8Array(cipher);
  const combined = new Uint8Array(iv.length + cipherArr.length);
  combined.set(iv, 0);
  combined.set(cipherArr, iv.length);

  return uint8ToBase64(combined);
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
Deno.serve(async (req: Request): Promise<Response> => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
      },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('NEXT_PUBLIC_SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const encryptionKey = Deno.env.get('ENCRYPTION_KEY');

    if (!supabaseUrl || !serviceKey || !encryptionKey) {
      return new Response(
        JSON.stringify({ error: 'Missing server environment variables' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const payload = await req.json();
    const { seller, documents = [], bank_accounts = [] } = payload;

    // ----- validation -----
    if (!seller?.email || !seller?.password) {
      return new Response(
        JSON.stringify({ error: 'email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // ----- password hash -----
    const passwordHash = await bcrypt.hash(seller.password, 10);

    // ----- encrypt sensitive fields -----
    const encryptedDocs = await Promise.all(
      documents.map(async (doc: Record<string, string>) => {
        if (doc.document_number) {
          const enc = await encryptText(doc.document_number, encryptionKey);
          return { ...doc, document_number: enc };
        }
        return doc;
      }),
    );

    const encryptedBanks = await Promise.all(
      bank_accounts.map(async (bank: Record<string, string>) => {
        if (bank.account_number) {
          const enc = await encryptText(bank.account_number, encryptionKey);
          return { ...bank, account_number: enc };
        }
        return bank;
      }),
    );

    // ----- Supabase client (service role) -----
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Build user_metadata for the trigger
    const nameParts = (seller.legalName || seller.displayName || 'Seller').trim().split(' ');
    const metadata: Record<string, string | undefined> = {
      first_name: nameParts[0],
      last_name: nameParts.slice(1).join(' ') || '',
      full_name: seller.legalName || seller.displayName,
      role: 'seller',
      phone: seller.phone,
      seller_type: seller.sellerType || 'shop_owner',
      shop_name: seller.shopName,
      shop_description: seller.shopDescription,
      city: seller.village || seller.city,
      state: seller.state,
      account_name: seller.bankAccountName || nameParts[0],
      bank_name: seller.bankName || 'Unknown Bank',
      ifsc: seller.ifscCode || 'XXXX0000000',
    };

    // Pass encrypted values through metadata for the trigger to store
    if (encryptedDocs.length > 0) {
      const aadhaar = encryptedDocs.find((d: Record<string, string>) =>
        d.document_type?.toLowerCase() === 'aadhaar'
      );
      const pan = encryptedDocs.find((d: Record<string, string>) =>
        d.document_type?.toLowerCase() === 'pan'
      );
      if (aadhaar) metadata.aadhar = aadhaar.document_number;
      if (pan) metadata.pan = pan.document_number;
    }

    if (encryptedBanks.length > 0) {
      metadata.account_number = encryptedBanks[0].account_number;
    }

    // ----- Create auth user (trigger handles provisioning) -----
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: seller.email.toLowerCase().trim(),
      password: seller.password,
      email_confirm: true,
      user_metadata: metadata,
    });

    if (createError) {
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const userId = createData.user.id;

    // ----- Post-creation: store bcrypt hash on sellers row -----
    const { data: sellerRow, error: sellerLookupErr } = await supabase
      .from('sellers')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (sellerRow && !sellerLookupErr) {
      await supabase
        .from('sellers')
        .update({ password_hash: passwordHash })
        .eq('id', sellerRow.id);
    }

    const sellerId = sellerRow?.id ?? userId;

    return new Response(
      JSON.stringify({ success: true, sellerId, userId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Internal error';
    console.error('register_seller error:', e);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
