import type { SASuperAdmin } from '@/types/super-admin.types'

// TEMPORARY — remove once Supabase Auth is wired in
// Demo credentials for testing the flow
export const MOCK_SA_CREDENTIALS = {
  email: 'superadmin@bharatbazaar.com',
  password: 'SecurePass@123',
  totpCode: '123456',      // hardcoded valid TOTP for demo
  deviceOtpCode: '000000', // hardcoded valid device OTP for demo
}

export const MOCK_SUPER_ADMIN: SASuperAdmin = {
  id: 'sa_001',
  email: 'superadmin@bharatbazaar.com',
  name: 'Arjun Mehta',
  avatar: '/avatars/super-admin.png',
  role: 'SUPER_ADMIN',
  createdAt: '2023-01-15T00:00:00Z',
  lastLogin: new Date().toISOString(),
  twoFactorEnabled: true,
  trustedDevices: [],
}

// Simulates network delay for realism
export const simulateNetworkDelay = (ms = 1200) =>
  new Promise((resolve) => setTimeout(resolve, ms))
