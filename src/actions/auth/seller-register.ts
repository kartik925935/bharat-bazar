'use server';

import { createAdminClient } from '@/lib/supabase/admin';

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
 * - Creates the auth user with email_confirm: true so the seller
 *   can log in immediately without waiting for email verification.
 * - Passes all seller metadata in user_metadata so the database
 *   trigger (handle_new_user) can atomically create:
 *   profiles, user_roles, sellers, shops, bank_accounts,
 *   seller_performance, and seller_documents.
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

    // Create auth user via admin API — email_confirm: true skips verification email
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
        account_number: input.accountNumber,
        ifsc: input.ifsc,
        aadhar: input.aadhar,
        pan: input.pan || '',
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

    return { success: true, userId };
  } catch (err: any) {
    console.error('[registerSeller] Unexpected error:', err);
    return { success: false, error: err.message || 'Registration failed unexpectedly.' };
  }
}
