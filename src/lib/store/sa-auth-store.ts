'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SASuperAdmin } from '@/types/super-admin.types'
import { MOCK_SA_CREDENTIALS, MOCK_SUPER_ADMIN, simulateNetworkDelay } from '@/lib/mock/sa-auth.mock'
import { useSAStore } from '@/lib/store/super-admin-store'
import type { SACredentialsInput } from '@/lib/validators/sa-validators'

export type SAAuthStage = 'credentials' | 'totp' | 'device' | 'success'

interface SASession {
  token: string
  expiresAt: string
}

interface SAAuthState {
  session: SASession | null
  isAuthenticated: boolean
  superAdmin: SASuperAdmin | null
  currentStage: SAAuthStage
  emailForFlow: string | null
  failedAttempts: Record<SAAuthStage, number>
  lockedUntil: Record<SAAuthStage, number | null>
  trustedDeviceId: string | null
  isLoading: boolean
  error: string | null
  resendCooldownEndsAt: number | null
}

interface SAAuthActions {
  submitCredentials: (data: SACredentialsInput) => Promise<{ success: boolean; error?: string }>
  submitTotp: (code: string) => Promise<{ success: boolean; error?: string; skipDeviceStage?: boolean }>
  resendTotp: () => Promise<void>
  submitDeviceOtp: (code: string, trustDevice: boolean) => Promise<{ success: boolean; error?: string }>
  resendDeviceOtp: () => Promise<void>
  goToStage: (stage: SAAuthStage) => void
  goBack: () => void
  logout: () => void
  checkSession: () => boolean
  clearError: () => void
  isLockedOut: (stage: SAAuthStage) => boolean
  getLockoutSecondsRemaining: (stage: SAAuthStage) => number
}

// Simple deterministic hash for device fingerprinting
function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return `dev_${Math.abs(hash).toString(16)}`
}

export function generateDeviceFingerprint(): string {
  if (typeof window === 'undefined') return 'ssr_device'
  const str = `${navigator.userAgent}${window.screen.width}${window.screen.height}`
  return hashString(str)
}

const INITIAL_STATE: SAAuthState = {
  session: null,
  isAuthenticated: false,
  superAdmin: null,
  currentStage: 'credentials',
  emailForFlow: null,
  failedAttempts: { credentials: 0, totp: 0, device: 0, success: 0 },
  lockedUntil: { credentials: null, totp: null, device: null, success: null },
  trustedDeviceId: null,
  isLoading: false,
  error: null,
  resendCooldownEndsAt: null,
}

export const useSAAuthStore = create<SAAuthState & SAAuthActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      submitCredentials: async (data) => {
        const stage: SAAuthStage = 'credentials'
        if (get().isLockedOut(stage)) return { success: false, error: 'Too many attempts. Please wait before trying again.' }

        set({ isLoading: true, error: null })
        await simulateNetworkDelay(1000)

        // Security: never log passwords to console
        const emailLower = data.email.toLowerCase().trim()
        
        // 1. Check if it's the hardcoded super admin
        const isSuperAdmin = emailLower === MOCK_SA_CREDENTIALS.email.toLowerCase() && data.password === MOCK_SA_CREDENTIALS.password
        
        // 2. Check if it's any admin created/managed in the store
        const storeAdmins = useSAStore.getState().admins
        const foundStoreAdmin = storeAdmins.find(a => a.email.toLowerCase().trim() === emailLower)
        // For mockup purposes, accept the default mock password for all store admins
        const isStoreAdmin = foundStoreAdmin && data.password === MOCK_SA_CREDENTIALS.password
        
        const isMatch = isSuperAdmin || isStoreAdmin

        if (isMatch) {
          set((s) => ({
            isLoading: false,
            emailForFlow: data.email.toLowerCase().trim(),
            currentStage: 'totp',
            failedAttempts: { ...s.failedAttempts, [stage]: 0 },
            lockedUntil: { ...s.lockedUntil, [stage]: null },
          }))
          return { success: true }
        }

        // TODO: log failed attempt to audit_logs via Supabase
        const newAttempts = get().failedAttempts[stage] + 1
        const locked = newAttempts >= 5
        set((s) => ({
          isLoading: false,
          // Generic message — never reveal which field is wrong (security best practice)
          error: 'Invalid email or password',
          failedAttempts: { ...s.failedAttempts, [stage]: newAttempts },
          lockedUntil: { ...s.lockedUntil, [stage]: locked ? Date.now() + 60_000 : null },
        }))
        return { success: false, error: 'Invalid email or password' }
      },

      submitTotp: async (code) => {
        const stage: SAAuthStage = 'totp'
        if (get().isLockedOut(stage)) return { success: false, error: 'Too many attempts. Please wait before trying again.' }

        set({ isLoading: true, error: null })
        await simulateNetworkDelay(900)

        if (code === MOCK_SA_CREDENTIALS.totpCode) {
          const fingerprint = generateDeviceFingerprint()
          const skipDeviceStage = get().trustedDeviceId === fingerprint

          if (skipDeviceStage) {
            // Device already trusted — go straight to success
            const token = `sa_mem_token_${Date.now()}`
            const expiresAt = new Date(Date.now() + 8 * 3_600_000).toISOString()
            const emailForFlow = get().emailForFlow
            const storeAdmins = useSAStore.getState().admins
            const admin = storeAdmins.find(a => a.email.toLowerCase().trim() === emailForFlow)
            
            const resolvedSuperAdmin = admin ? {
              ...MOCK_SUPER_ADMIN,
              id: admin.id,
              name: admin.name,
              email: admin.email,
              role: admin.role,
              permissions: admin.permissions,
              lastLogin: new Date().toISOString()
            } : {
              ...MOCK_SUPER_ADMIN,
              lastLogin: new Date().toISOString()
            }

            set((s) => ({
              isLoading: false,
              currentStage: 'success',
              isAuthenticated: true,
              superAdmin: resolvedSuperAdmin,
              session: { token, expiresAt }, // Memory only — NOT persisted
              failedAttempts: { ...s.failedAttempts, [stage]: 0 },
              lockedUntil: { ...s.lockedUntil, [stage]: null },
            }))
          } else {
            set((s) => ({
              isLoading: false,
              currentStage: 'device',
              failedAttempts: { ...s.failedAttempts, [stage]: 0 },
              lockedUntil: { ...s.lockedUntil, [stage]: null },
            }))
          }
          return { success: true, skipDeviceStage }
        }

        // TODO: log failed attempt to audit_logs via Supabase
        const newAttempts = get().failedAttempts[stage] + 1
        const locked = newAttempts >= 5
        set((s) => ({
          isLoading: false,
          error: 'Invalid authenticator code. Please try again.',
          failedAttempts: { ...s.failedAttempts, [stage]: newAttempts },
          lockedUntil: { ...s.lockedUntil, [stage]: locked ? Date.now() + 60_000 : null },
        }))
        return { success: false, error: 'Invalid authenticator code.' }
      },

      resendTotp: async () => {
        set({ resendCooldownEndsAt: Date.now() + 30_000 })
        await simulateNetworkDelay(400)
        // TODO: re-trigger TOTP via Supabase
      },

      submitDeviceOtp: async (code, trustDevice) => {
        const stage: SAAuthStage = 'device'
        if (get().isLockedOut(stage)) return { success: false, error: 'Too many attempts. Please wait before trying again.' }

        set({ isLoading: true, error: null })
        await simulateNetworkDelay(1000)

        if (code === MOCK_SA_CREDENTIALS.deviceOtpCode) {
          const fingerprint = generateDeviceFingerprint()
          const token = `sa_mem_token_${Date.now()}`
          const expiresAt = new Date(Date.now() + 8 * 3_600_000).toISOString()
          const emailForFlow = get().emailForFlow
          const storeAdmins = useSAStore.getState().admins
          const admin = storeAdmins.find(a => a.email.toLowerCase().trim() === emailForFlow)
          
          const resolvedSuperAdmin = admin ? {
            ...MOCK_SUPER_ADMIN,
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions,
            lastLogin: new Date().toISOString()
          } : {
            ...MOCK_SUPER_ADMIN,
            lastLogin: new Date().toISOString()
          }

          set((s) => ({
            isLoading: false,
            currentStage: 'success',
            isAuthenticated: true,
            superAdmin: resolvedSuperAdmin,
            session: { token, expiresAt }, // Memory only — NOT persisted
            trustedDeviceId: trustDevice ? fingerprint : s.trustedDeviceId,
            failedAttempts: { ...s.failedAttempts, [stage]: 0 },
            lockedUntil: { ...s.lockedUntil, [stage]: null },
          }))
          return { success: true }
        }

        // TODO: log failed attempt to audit_logs via Supabase
        const newAttempts = get().failedAttempts[stage] + 1
        const locked = newAttempts >= 5
        set((s) => ({
          isLoading: false,
          error: 'Invalid verification code. Please try again.',
          failedAttempts: { ...s.failedAttempts, [stage]: newAttempts },
          lockedUntil: { ...s.lockedUntil, [stage]: locked ? Date.now() + 60_000 : null },
        }))
        return { success: false, error: 'Invalid verification code.' }
      },

      resendDeviceOtp: async () => {
        set({ resendCooldownEndsAt: Date.now() + 30_000 })
        await simulateNetworkDelay(400)
        // TODO: re-trigger email OTP via Supabase
      },

      goToStage: (stage) => set({ currentStage: stage, error: null }),

      goBack: () => {
        const { currentStage } = get()
        set({ error: null })
        if (currentStage === 'device') set({ currentStage: 'totp' })
        else if (currentStage === 'totp') set({ currentStage: 'credentials' })
      },

      logout: () => {
        const { trustedDeviceId } = get()
        set({ ...INITIAL_STATE, trustedDeviceId }) // Keep device trust on logout
      },

      checkSession: () => {
        const { session, isAuthenticated } = get()
        if (!isAuthenticated || !session) return false
        return new Date(session.expiresAt).getTime() > Date.now()
      },

      clearError: () => set({ error: null }),

      isLockedOut: (stage) => {
        const lock = get().lockedUntil[stage]
        if (!lock) return false
        if (Date.now() > lock) {
          // Lock has expired, auto-reset
          set((s) => ({
            lockedUntil: { ...s.lockedUntil, [stage]: null },
            failedAttempts: { ...s.failedAttempts, [stage]: 0 },
          }))
          return false
        }
        return true
      },

      getLockoutSecondsRemaining: (stage) => {
        const lock = get().lockedUntil[stage]
        if (!lock) return 0
        return Math.max(0, Math.ceil((lock - Date.now()) / 1000))
      },
    }),
    {
      name: 'sa-trusted-device',
      // Only persist the device trust token — session stays in memory only
      partialize: (state) => ({ trustedDeviceId: state.trustedDeviceId }),
    }
  )
)
