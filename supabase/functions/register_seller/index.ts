// supabase/functions/register_seller/index.ts

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

/**
 * Helper: encrypt a plain text using AES‑GCM with a base64‑encoded key.
 * Returns base64(iv + ciphertext).
 */
async function encryptText(plain: string, keyBase64: string): Promise<string> {
  const keyRaw = Buffer.from(keyBase64, 'base64');
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyRaw,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96‑bit nonce
  const encoded = new TextEncoder().encode(plain);
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, encoded);
  const combined = new Uint8Array(iv.byteLength + cipher.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipher), iv.byteLength);
  return Buffer.from(combined).toString('base64');
}

/**
 * Edge Function entry point.
 * Expects a JSON payload containing:
 *   - seller: { ...SellerProfile fields without id, password } (including plain password)
 *   - documents?: [{ document_number, document_type, file_url }]
 *   - bank_accounts?: [{ account_number, ifsc_code, ... }]
 */
export const handler = async (req: Request): Promise<Response> => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!supabaseUrl || !serviceKey || !encryptionKey) {
      return new Response(JSON.stringify({ error: 'Missing environment variables' }), { status: 500 });
    }

    const payload = await req.json();
    const { seller, documents = [], bank_accounts = [] } = payload;

    // ---------- simple validation ----------
    if (!seller?.email || !seller?.password) {
      return new Response(JSON.stringify({ error: 'email and password are required' }), { status: 400 });
    }

    // ---------- password hashing ----------
    const hashedPassword = await bcrypt.hash(seller.password, 10);

    // ---------- encryption of sensitive fields ----------
    const encryptedDocs = await Promise.all(
      documents.map(async (doc: any) => {
        const encNumber = await encryptText(doc.document_number, encryptionKey);
        return { ...doc, document_number: encNumber };
      })
    );

    const encryptedBanks = await Promise.all(
      bank_accounts.map(async (bank: any) => {
        const encAcc = await encryptText(bank.account_number, encryptionKey);
        return { ...bank, account_number: encAcc };
      })
    );

    // ---------- Supabase client (service role) ----------
    const supabase = createClient(supabaseUrl, serviceKey);

    // Insert seller with hashed password
    const { data: sellerData, error: sellerError } = await supabase
      .from('sellers')
      .insert([{ ...seller, password: hashedPassword }])
      .single();
    if (sellerError) throw sellerError;
    const sellerId = (sellerData as any).id;

    // Insert related encrypted records if any
    if (encryptedDocs.length) {
      const docsToInsert = encryptedDocs.map((d: any) => ({ ...d, seller_id: sellerId }));
      const { error } = await supabase.from('seller_documents').insert(docsToInsert);
      if (error) throw error;
    }
    if (encryptedBanks.length) {
      const banksToInsert = encryptedBanks.map((b: any) => ({ ...b, seller_id: sellerId }));
      const { error } = await supabase.from('bank_accounts').insert(banksToInsert);
      if (error) throw error;
    }

    return new Response(JSON.stringify({ success: true, sellerId }), { status: 200 });
  } catch (e: any) {
    console.error('Register function error', e);
    return new Response(JSON.stringify({ error: e.message ?? 'Internal error' }), { status: 500 });
  }
};
