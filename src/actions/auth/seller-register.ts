'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { encryptField } from '@/lib/utils/encryption.server';
import bcrypt from 'bcryptjs';

export interface SellerRegisterInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  shopName?: string;
  shopDescription?: string;
  category?: string;
  city?: string;
  state?: string;
  experience?: string;
  accountName?: string;
  bank?: string;
  accountNumber?: string;
  ifsc?: string;
  aadhar?: string;
  pan?: string;
}

/**
 * Registers a new seller using the Supabase Admin client.
 * - Hashes the password with bcrypt for platform-level verification.
 * - Encrypts sensitive fields (Aadhaar, PAN, bank account) with AES-GCM
 *   before passing through user_metadata, so the `handle_new_user` trigger
 *   stores ciphertext — never plaintext.
 * - Creates the auth user with email_confirm: true so the seller
 *   can log in immediately without waiting for email verification.
 * - After creation, updates the sellers row with the bcrypt password hash.
 */
export async function registerSeller(input: SellerRegisterInput): Promise<{
  success: boolean;
  error?: string;
  userId?: string;
}> {
  try {
    const adminSupabase = createAdminClient();

    // Build first/last name
    const nameParts = input.fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    // --- Hash password with bcrypt ---
    const passwordHash = await bcrypt.hash(input.password, 10);

    // --- Encrypt sensitive fields with AES-GCM ---
    const encryptedAadhar = input.aadhar
      ? await encryptField(input.aadhar)
      : undefined;
    const encryptedPan = input.pan
      ? await encryptField(input.pan)
      : undefined;
    const encryptedAccountNumber = input.accountNumber
      ? await encryptField(input.accountNumber)
      : undefined;

    // Create auth user via admin API — email_confirm: true skips verification email.
    // The handle_new_user trigger provisions profiles, user_roles, sellers,
    // shops, bank_accounts, seller_performance, and seller_documents.
    // Encrypted values are passed through user_metadata so the trigger
    // stores ciphertext, not plaintext.
    const { data: createData, error: createError } = await adminSupabase.auth.admin.createUser({
      email: input.email.toLowerCase().trim(),
      password: input.password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        full_name: input.fullName,
        role: 'seller',
        phone: input.phone,
        shop_name: input.shopName,
        shop_description: input.shopDescription,
        category: input.category,
        city: input.city,
        state: input.state,
        experience: input.experience,
        account_name: input.accountName,
        bank_name: input.bank,
        account_number: encryptedAccountNumber ?? '000000000000',
        ifsc: input.ifsc,
        aadhar: encryptedAadhar,
        pan: encryptedPan ?? '',
      },
    });

    if (createError) {
      console.error('[registerSeller] Auth user creation failed:', createError.message);
      return { success: false, error: createError.message };
    }

    const userId = createData.user?.id;
    if (!userId) {
      return { success: false, error: 'User creation succeeded but no user ID was returned.' };
    }

    // --- Post-creation: store bcrypt hash on the sellers row ---
    const { data: sellerRow, error: sellerLookupErr } = await adminSupabase
      .from('sellers')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (sellerRow && !sellerLookupErr) {
      const { error: hashUpdateErr } = await adminSupabase
        .from('sellers')
        .update({ password_hash: passwordHash })
        .eq('id', sellerRow.id);

      if (hashUpdateErr) {
        console.error('[registerSeller] Failed to store password hash:', hashUpdateErr.message);
        // Non-fatal: the user is created, they can log in — hash can be set later
      }
    }

    return { success: true, userId };
  } catch (err: any) {
    console.error('[registerSeller] Unexpected error:', err);
    return { success: false, error: err.message || 'Registration failed unexpectedly.' };
  }
}
