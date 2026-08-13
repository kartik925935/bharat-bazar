'use server';

import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Checks whether an email is already registered and what role it carries.
 * Uses the admin client so it can query auth.users regardless of RLS.
 *
 * Returns:
 *  - { exists: false }                        → email is free, can register as any role
 *  - { exists: true, role: 'customer' | 'seller' | 'admin' | ... }
 */
export async function checkEmailRole(email: string): Promise<{
  exists: boolean;
  role?: string;
  error?: string;
}> {
  try {
    const adminSupabase = createAdminClient();
    const normalizedEmail = email.toLowerCase().trim();

    // Look up the auth user by email using the admin API
    const { data, error } = await adminSupabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) {
      console.error('[checkEmailRole] Admin list users error:', error.message);
      // Fail open — don't block registration on a lookup error
      return { exists: false };
    }

    const match = data.users.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    if (!match) return { exists: false };

    // Prefer the role stored in user_roles table (authoritative)
    const { data: roleRow } = await adminSupabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', match.id)
      .maybeSingle();

    const roleName =
      (roleRow?.roles as any)?.name ||
      match.user_metadata?.role ||
      'customer';

    return { exists: true, role: roleName };
  } catch (err: any) {
    console.error('[checkEmailRole] Unexpected error:', err);
    return { exists: false }; // Fail open
  }
}
