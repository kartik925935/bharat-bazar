// MOCK ONLY — DELETE BEFORE SUPABASE MIGRATION
import type { IAuthService, SAAuthSession } from '../interfaces'
import type { SAAdmin } from '@/types/super-admin.types'
import { MOCK_SA_CREDENTIALS } from '@/lib/mock/db/sa-credentials.seed'
import { MOCK_ADMINS } from '@/lib/mock/sa-admins.mock'

const SESSION_KEY = 'sa-auth-session'

export class MockAuthService implements IAuthService {
  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; admin?: SAAdmin; error?: string }> {
    // Step 1: Find matching credential
    const credential = MOCK_SA_CREDENTIALS.find(
      (c) => c.email === email && c.password === password
    )
    if (!credential) {
      return { success: false, error: 'Invalid email or password.' }
    }

    // Step 2: Look up the admin profile
    const admin = MOCK_ADMINS.find((a) => a.id === credential.adminId)
    if (!admin) {
      return { success: false, error: 'Admin account not found.' }
    }

    // Step 3: Check account status
    if (admin.status === 'suspended') {
      return {
        success: false,
        error: 'Your account has been suspended. Contact Super Admin.',
      }
    }
    if (admin.status === 'inactive') {
      return {
        success: false,
        error: 'Your account is inactive. Contact Super Admin to reactivate.',
      }
    }
    if (admin.status === 'pending') {
      return {
        success: false,
        error: 'Your account is pending approval.',
      }
    }

    // Step 4: Persist session
    const session: SAAuthSession = {
      adminId: admin.id,
      email: admin.email,
      loggedInAt: new Date().toISOString(),
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    }

    return { success: true, admin }
  }

  async logout(adminId: string): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY)
    }
  }

  getSession(): SAAuthSession | null {
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (!raw) return null
      return JSON.parse(raw) as SAAuthSession
    } catch {
      return null
    }
  }
}
