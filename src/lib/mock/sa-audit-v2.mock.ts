// src/lib/mock/sa-audit-v2.mock.ts
// Cleared for Supabase migration — data will come from real backend

export type AuditActionCategory =
  | 'authentication'
  | 'admin_management'
  | 'seller_management'
  | 'product_management'
  | 'order_management'
  | 'finance'
  | 'customer_management'
  | 'platform_settings'
  | 'review_management'
  | 'support'
  | 'coupon_management'

export type AuditSeverity = 'info' | 'warning' | 'critical'

export interface SAAuditLogV2 {
  id: string
  timestamp: string
  actorId: string
  actorName: string
  actorRole: 'super_admin' | 'admin'
  action: string
  actionCode: string
  category: AuditActionCategory
  severity: AuditSeverity
  targetEntityType?: string
  targetEntityId?: string
  targetEntityLabel?: string
  ipAddress: string
  userAgent: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

// UI label maps — these are constants, not data, kept for rendering
export const AUDIT_CATEGORY_LABELS: Record<AuditActionCategory, string> = {
  authentication: 'Authentication',
  admin_management: 'Admin Management',
  seller_management: 'Seller Management',
  product_management: 'Product Management',
  order_management: 'Order Management',
  finance: 'Finance',
  customer_management: 'Customer Management',
  platform_settings: 'Platform Settings',
  review_management: 'Review Management',
  support: 'Support',
  coupon_management: 'Coupon Management',
}

export const AUDIT_ACTORS = {
  super_admin: 'Super Admin',
  admin: 'Admin',
} as const

export const MOCK_AUDIT_LOGS_V2: SAAuditLogV2[] = []
