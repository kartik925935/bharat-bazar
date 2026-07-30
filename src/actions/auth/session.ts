'use server'

import { createClient } from '@/lib/supabase/server'
import { User } from '@supabase/supabase-js'

export type UserRole = 'super admin' | 'admin' | 'user' | 'seller' | 'delivery partner'

export interface ExtendedUser extends User {
  role?: UserRole;
}

export async function getSession() {
  const supabase = await createClient()
  try {
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

    // Role is expected to be in user_metadata based on our signup flow or custom claims
    const role = (user.user_metadata?.role as UserRole) || 'user'

    return {
      ...user,
      role
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await getUser()
  
  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    return { authorized: false, user }
  }
  
  return { authorized: true, user }
}
