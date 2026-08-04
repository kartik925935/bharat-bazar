/**
 * Unified seed script — seeds users directly via the Supabase service role client.
 *
 * Workflow per user:
 *   1. Create auth user via `auth.admin.createUser()` with `user_metadata`
 *      → The `handle_new_user` trigger auto-provisions: profiles, user_roles,
 *        sellers, shops, bank_accounts, seller_performance, seller_documents.
 *   2. For sellers: post-creation updates with encrypted/hashed data:
 *      - bcrypt hash of password → sellers.password_hash
 *      - AES-GCM encrypted document numbers → seller_documents.document_number
 *      - AES-GCM encrypted bank account number → bank_accounts.account_number
 *
 * Run: npm run seed
 */

import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

if (typeof globalThis.WebSocket === 'undefined') {
  (globalThis as any).WebSocket = class WebSocket {};
}

dotenv.config({ path: '.env.local' });

// ---------------------------------------------------------------------------
// AES-GCM encryption (Node.js WebCrypto — same format as browser util)
// ---------------------------------------------------------------------------
async function encryptField(plain: string, keyBase64: string): Promise<string> {
  const keyRaw = Buffer.from(keyBase64, 'base64');
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

  const combined = new Uint8Array(iv.byteLength + cipher.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipher), iv.byteLength);

  return Buffer.from(combined).toString('base64');
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------
interface SeedUser {
  email: string;
  password: string;
  fullName: string;
  role: 'customer' | 'seller' | 'admin';
  phone: string;
  // Seller-specific fields (ignored for non-sellers)
  sellerType?: string;
  shopName?: string;
  shopDescription?: string;
  city?: string;
  state?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  bankAccountName?: string;
  bankName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
}

const SEED_USERS: SeedUser[] = [
  {
    email: 'customer@test.com',
    password: 'Test@123',
    fullName: 'Priya Sharma',
    role: 'customer',
    phone: '+919876543210',
  },
  {
    email: 'seller@test.com',
    password: 'Seller@123',
    fullName: 'Ravi Kumar',
    role: 'seller',
    phone: '+918765432109',
    sellerType: 'artisan',
    shopName: 'Ravi Kumar Crafts',
    shopDescription: 'Traditional handcrafted items from the heart of Rajasthan.',
    city: 'Bhilwara',
    state: 'Rajasthan',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '9876-5432-1098',
    bankAccountName: 'Ravi Kumar',
    bankName: 'State Bank of India',
    bankAccountNumber: '12345678901234',
    ifscCode: 'SBIN0001234',
  },
  {
    email: 'admin@bharatbazaar.com',
    password: 'Admin@123',
    fullName: 'Admin',
    role: 'admin',
    phone: '+917654321098',
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }
  if (!encryptionKey) {
    console.error('❌  Missing ENCRYPTION_KEY in .env.local');
    process.exit(1);
  }

  console.log(`\n🔗  Connecting to Supabase at ${supabaseUrl}\n`);

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  for (const user of SEED_USERS) {
    console.log(`── ${user.email} (${user.role}) ──`);

    // --- Check if already exists -------------------------------------------
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('  ✗ Failed to list users:', listError.message);
      continue;
    }

    const existing = listData.users.find((u) => u.email === user.email);
    if (existing) {
      console.log(`  ⏭  Already exists (ID: ${existing.id}), skipping.`);
      continue;
    }

    // --- Build user_metadata -----------------------------------------------
    const nameParts = user.fullName.trim().split(' ');
    const metadata: Record<string, string | undefined> = {
      first_name: nameParts[0],
      last_name: nameParts.slice(1).join(' ') || '',
      full_name: user.fullName,
      role: user.role,
      phone: user.phone,
    };

    // For sellers: pass shop/doc/bank info for the trigger, but encrypt
    // sensitive values BEFORE they hit the trigger.
    if (user.role === 'seller') {
      metadata.seller_type = user.sellerType;
      metadata.shop_name = user.shopName;
      metadata.shop_description = user.shopDescription;
      metadata.city = user.city;
      metadata.state = user.state;
      metadata.account_name = user.bankAccountName;
      metadata.bank_name = user.bankName;
      metadata.ifsc = user.ifscCode;

      // Encrypt sensitive fields BEFORE passing through metadata
      // so the trigger stores ciphertext, not plaintext.
      if (user.aadhaarNumber) {
        metadata.aadhar = await encryptField(user.aadhaarNumber, encryptionKey);
        console.log('  🔒 Encrypted Aadhaar number');
      }
      if (user.panNumber) {
        metadata.pan = await encryptField(user.panNumber, encryptionKey);
        console.log('  🔒 Encrypted PAN number');
      }
      if (user.bankAccountNumber) {
        metadata.account_number = await encryptField(user.bankAccountNumber, encryptionKey);
        console.log('  🔒 Encrypted bank account number');
      }
    }

    // --- Create auth user --------------------------------------------------
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: metadata,
    });

    if (createError) {
      console.error(`  ✗ Auth user creation failed: ${createError.message}`);
      continue;
    }

    const userId = createData.user.id;
    console.log(`  ✓ Auth user created (ID: ${userId})`);
    console.log(`  ✓ Trigger provisioned profile + role`);

    // --- Seller post-processing: store password hash -----------------------
    if (user.role === 'seller') {
      // Hash the password with bcrypt
      const passwordHash = await bcrypt.hash(user.password, 10);
      console.log('  🔑 Hashed password with bcrypt');

      // Look up the seller row created by the trigger
      const { data: sellerRow, error: sellerLookupErr } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (sellerLookupErr || !sellerRow) {
        console.error('  ✗ Could not find seller row:', sellerLookupErr?.message ?? 'no row');
        continue;
      }

      // Store the bcrypt hash
      const { error: hashUpdateErr } = await supabase
        .from('sellers')
        .update({ password_hash: passwordHash })
        .eq('id', sellerRow.id);

      if (hashUpdateErr) {
        console.error('  ✗ Failed to store password hash:', hashUpdateErr.message);
      } else {
        console.log('  ✓ Stored password_hash on sellers row');
      }

      console.log('  ✓ Trigger provisioned seller + shop + bank + performance + documents');
    }
  }

  console.log('\n✅  Seed complete.\n');
}

seed().catch((err) => {
  console.error('💥  Seed script crashed:', err);
  process.exit(1);
});
