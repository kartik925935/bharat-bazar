// This token acts as the secret URL segment for the Super Admin portal
// In production, this MUST be stored as an environment variable
// and must be a cryptographically secure 32+ character string

export const SA_TOKEN = process.env.NEXT_PUBLIC_SA_TOKEN || 'bb-sa-7f3a9b2c4d1e8f6a0b5c3d7e2f4a9b1c'

// Helper to build SA portal URLs
export const SA_ROUTES = {
  secureAccess: (token: string) => `/${token}/secure-access`,
  dashboard: (token: string) => `/${token}/dashboard`,
  adminControl: (token: string) => `/${token}/admin-control`,
  panelRequests: (token: string) => `/${token}/panel-requests`,
  customers: (token: string) => `/${token}/customers`,
  sellers: (token: string) => `/${token}/sellers`,
  products: (token: string) => `/${token}/products`,
  orders: (token: string) => `/${token}/orders`,
  delivery: (token: string) => `/${token}/delivery`,
  finance: (token: string) => `/${token}/finance`,
  kyc: (token: string) => `/${token}/kyc-verification`,
  reviews: (token: string) => `/${token}/reviews`,
  coupons: (token: string) => `/${token}/coupons`,
  offers: (token: string) => `/${token}/offers`,
  notifications: (token: string) => `/${token}/notifications`,
  analytics: (token: string) => `/${token}/analytics`,
  auditLogs: (token: string) => `/${token}/audit-logs`,
  support: (token: string) => `/${token}/support`,
  settings: (token: string) => `/${token}/settings`,
} as const
