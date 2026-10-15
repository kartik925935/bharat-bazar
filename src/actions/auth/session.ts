'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { User } from '@supabase/supabase-js'

export type UserRole =
  | 'super admin'
  | 'super_admin'
  | 'admin'
  | 'user'
  | 'customer'
  | 'seller'
  | 'delivery partner'
  | 'delivery_partner'

export interface ExtendedUser extends User {
  role?: UserRole;
  roles?: string[];
}

/**
 * Normalizes role names so that 'user' and 'customer',
 * 'super admin' and 'super_admin', 'delivery partner' and 'delivery_partner'
 * are treated as equivalent.
 */
function normalizeRole(role: string): string {
  const r = role.toLowerCase().trim()
  if (r === 'user' || r === 'customer') return 'customer'
  if (r === 'super admin' || r === 'super_admin') return 'super_admin'
  if (r === 'delivery partner' || r === 'delivery_partner') return 'delivery_partner'
  return r
}

export async function getSession() {
  const supabase = await createClient()
  try {
    // Authenticate and verify user using getUser()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return null

    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error fetching session:', error)
    return null
  }
}

export async function getUser(): Promise<ExtendedUser | null> {
  const supabase = await createClient()
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Securely query DB user_roles table joined with roles
    let userRolesList: string[] = []
    
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('roles(name, level)')
      .eq('user_id', user.id)

    if (!rolesError && userRoles && userRoles.length > 0) {
      userRolesList = userRoles
        .map((ur: any) => ur.roles?.name)
        .filter(Boolean)
    } else {
      // Fallback with admin client if RLS is restricted in certain contexts
      try {
        const adminSupabase = createAdminClient()
        const { data: adminRoles } = await adminSupabase
          .from('user_roles')
          .select('roles(name, level)')
          .eq('user_id', user.id)

        if (adminRoles && adminRoles.length > 0) {
          userRolesList = adminRoles
            .map((ur: any) => ur.roles?.name)
            .filter(Boolean)
        }
      } catch {
        // Ignore fallback failure
      }
    }

    // Determine primary role by hierarchy: super_admin > admin > seller > delivery_partner > customer
    const roleHierarchy = ['super_admin', 'admin', 'seller', 'delivery_partner', 'customer']
    let primaryRole: UserRole = 'customer'

    if (userRolesList.length > 0) {
      for (const hRole of roleHierarchy) {
        if (userRolesList.some(r => normalizeRole(r) === hRole)) {
          primaryRole = hRole as UserRole
          break
        }
      }
    } else {
      // Default to customer if no roles are provisioned in DB
      primaryRole = 'customer'
    }

    return {
      ...user,
      role: primaryRole,
      roles: userRolesList
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await getUser()
  
  if (!user) {
    return { authorized: false, user: null }
  }

  const normalizedAllowed = allowedRoles.map(r => normalizeRole(r))
  const userNormalizedRoles = (user.roles && user.roles.length > 0)
    ? user.roles.map(r => normalizeRole(r))
    : [normalizeRole(user.role || 'customer')]

  const isAuthorized = userNormalizedRoles.some(r => normalizedAllowed.includes(r))

  if (!isAuthorized) {
    return { authorized: false, user }
  }
  
  return { authorized: true, user }
}
