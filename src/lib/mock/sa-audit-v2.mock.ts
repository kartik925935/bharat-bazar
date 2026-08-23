// src/lib/mock/sa-audit-v2.mock.ts
// Rich audit log data for Phase 11 Audit Logs page

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

const now = Date.now()
const min = (n: number) => now - n * 60000
const hr = (n: number) => now - n * 3600000
const day = (n: number) => now - n * 86400000

export const MOCK_AUDIT_LOGS_V2: SAAuditLogV2[] = [
  {
    id: 'audit_001',
    timestamp: new Date(min(5)).toISOString(),
    actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
    action: 'Approved seller application for Village Craft Collective',
    actionCode: 'SELLER_APPROVED', category: 'seller_management', severity: 'info',
    targetEntityType: 'seller', targetEntityId: 'sel_new_001', targetEntityLabel: 'Village Craft Collective',
    ipAddress: '103.21.58.xxx', userAgent: 'Chrome 121 / macOS 14.2',
    before: { kyc_status: 'under_review' }, after: { kyc_status: 'approved' },
  },
  {
    id: 'audit_002',
    timestamp: new Date(min(22)).toISOString(),
    actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
    action: 'Updated global commission rate from 10% to 12%',
    actionCode: 'COMMISSION_RATE_UPDATED', category: 'platform_settings', severity: 'critical',
    ipAddress: '103.21.58.xxx', userAgent: 'Chrome 121 / macOS 14.2',
    before: { commission_rate: 10 }, after: { commission_rate: 12 },
    metadata: { applyTo: 'platform_default', affectedSellers: 342 },
  },
  {
    id: 'audit_003',
    timestamp: new Date(min(45)).toISOString(),
    actorId: 'admin_002', actorName: 'Priya Sharma', actorRole: 'admin',
    action: 'Blocked customer account — Vikas Malhotra (coupon abuse)',
    actionCode: 'CUSTOMER_BLOCKED', category: 'customer_management', severity: 'warning',
    targetEntityType: 'customer', targetEntityId: 'cust_010', targetEntityLabel: 'Vikas Malhotra',
    ipAddress: '182.64.12.xxx', userAgent: 'Firefox 122 / Windows 11',
    before: { status: 'active' }, after: { status: 'blocked', blockReason: 'Coupon abuse — WELCOME100 used 6 times' },
  },
  {
    id: 'audit_004',
    timestamp: new Date(hr(2)).toISOString(),
    actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
    action: 'Rejected product listing — Hand-Carved Brass Diya Set (duplicate detected)',
    actionCode: 'PRODUCT_REJECTED', category: 'product_management', severity: 'info',
    targetEntityType: 'product', targetEntityId: 'prod_016', targetEntityLabel: 'Hand-Carved Brass Diya Set of 6 (Duplicate)',
    ipAddress: '103.21.58.xxx', userAgent: 'Chrome 121 / macOS 14.2',
    before: { status: 'pending_review' }, after: { status: 'rejected', rejectionReason: 'Possible duplicate of prod_001' },
  },
  {
    id: 'audit_005',
    timestamp: new Date(hr(3)).toISOString(),
    actorId: 'admin_002', actorName: 'Priya Sharma', actorRole: 'admin',
    action: 'Initiated refund of ₹8,900 for order ORD-9978',
    actionCode: 'REFUND_INITIATED', category: 'order_management', severity: 'warning',
    targetEntityType: 'order', targetEntityId: 'ord_046', targetEntityLabel: 'ORD-9978',
    ipAddress: '182.64.12.xxx', userAgent: 'Firefox 122 / Windows 11',
    before: { refund_status: 'none' }, after: { refund_status: 'initiated', amount: 8900 },
    metadata: { reason: 'Item arrived damaged — dispute resolved in customer favor' },
  },
  {
    id: 'audit_006',
    timestamp: new Date(hr(4)).toISOString(),
    actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
    action: 'Platform maintenance mode ENABLED',
    actionCode: 'MAINTENANCE_MODE_ENABLED', category: 'platform_settings', severity: 'critical',
    ipAddress: '103.21.58.xxx', userAgent: 'Chrome 121 / macOS 14.2',
    before: { maintenance_mode: false }, after: { maintenance_mode: true, scheduledEnd: '2025-01-15T04:00:00Z' },
    metadata: { reason: 'Database migration — payment schema update' },
  },
  {
    id: 'audit_007',
    timestamp: new Date(hr(5)).toISOString(),
    actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
    action: 'Super admin portal token accessed',
    actionCode: 'SA_TOKEN_ACCESSED', category: 'authentication', severity: 'info',
    ipAddress: '103.21.58.xxx', userAgent: 'Chrome 121 / macOS 14.2',
  },
  {
    id: 'audit_008',
    timestamp: new Date(hr(6)).toISOString(),
    actorId: 'admin_003', actorName: 'Rahul Gupta', actorRole: 'admin',
    action: 'Approved 12 pending reviews in bulk',
    actionCode: 'REVIEWS_BULK_APPROVED', category: 'review_management', severity: 'info',
    ipAddress: '61.12.44.xxx', userAgent: 'Chrome 120 / Windows 11',
    metadata: { count: 12 },
  },
  {
    id: 'audit_009',
    timestamp: new Date(hr(8)).toISOString(),
    actorId: 'admin_002', actorName: 'Priya Sharma', actorRole: 'admin',
    action: 'Failed login attempt — invalid credentials',
    actionCode: 'LOGIN_FAILED', category: 'authentication', severity: 'warning',
    ipAddress: '182.64.12.xxx', userAgent: 'Firefox 122 / Windows 11',
    metadata: { attempts: 2 },
  },
  {
    id: 'audit_010',
    timestamp: new Date(hr(10)).toISOString(),
    actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
    action: 'Published coupon DIWALI2024 — 25% off handicrafts',
    actionCode: 'COUPON_CREATED', category: 'coupon_management', severity: 'info',
    ipAddress: '103.21.58.xxx', userAgent: 'Chrome 121 / macOS 14.2',
    after: { code: 'DIWALI2024', discount: 25, type: 'percentage', category: 'handicrafts' },
  },
  {
    id: 'audit_011',
    timestamp: new Date(hr(12)).toISOString(),
    actorId: 'admin_003', actorName: 'Rahul Gupta', actorRole: 'admin',
    action: 'Assigned support ticket TKT-00321 to Priya Sharma',
    actionCode: 'TICKET_ASSIGNED', category: 'support', severity: 'info',
    targetEntityType: 'ticket', targetEntityId: 'tkt_321', targetEntityLabel: 'TKT-00321',
    ipAddress: '61.12.44.xxx', userAgent: 'Chrome 120 / Windows 11',
    before: { assignee: null }, after: { assignee: 'admin_002' },
  },
  {
    id: 'audit_012',
    timestamp: new Date(hr(14)).toISOString(),
    actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
    action: 'Enabled Flash Sale feature flag',
    actionCode: 'FEATURE_FLAG_TOGGLED', category: 'platform_settings', severity: 'warning',
    ipAddress: '103.21.58.xxx', userAgent: 'Chrome 121 / macOS 14.2',
    before: { flashSaleEnabled: false }, after: { flashSaleEnabled: true },
  },
  {
    id: 'audit_013',
    timestamp: new Date(hr(16)).toISOString(),
    actorId: 'admin_002', actorName: 'Priya Sharma', actorRole: 'admin',
    action: 'Suspended seller Kochi Crafters for policy violation',
    actionCode: 'SELLER_SUSPENDED', category: 'seller_management', severity: 'warning',
    targetEntityType: 'seller', targetEntityId: 'sel_045', targetEntityLabel: 'Kochi Crafters',
    ipAddress: '182.64.12.xxx', userAgent: 'Firefox 122 / Windows 11',
    before: { status: 'active' }, after: { status: 'suspended', reason: 'Repeated counterfeit complaints' },
  },
  {
    id: 'audit_014',
    timestamp: new Date(day(1)).toISOString(),
    actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
    action: 'Created new admin — Sunita Rao (Operations)',
    actionCode: 'ADMIN_CREATED', category: 'admin_management', severity: 'info',
    targetEntityType: 'admin', targetEntityId: 'admin_004', targetEntityLabel: 'Sunita Rao',
    ipAddress: '103.21.58.xxx', userAgent: 'Chrome 121 / macOS 14.2',
    after: { role: 'admin', panel: 'orders', level: 'write' },
  },
  {
    id: 'audit_015',
    timestamp: new Date(day(1) - hr(2)).toISOString(),
    actorId: 'admin_003', actorName: 'Rahul Gupta', actorRole: 'admin',
    action: 'Processed settlement ₹4,22,000 for Madhubani Masters',
    actionCode: 'SETTLEMENT_PROCESSED', category: 'finance', severity: 'info',
    targetEntityType: 'seller', targetEntityId: 'sel_012', targetEntityLabel: 'Madhubani Masters',
    ipAddress: '61.12.44.xxx', userAgent: 'Chrome 120 / Windows 11',
    after: { amount: 422000, period: '2024-12-01/2024-12-15' },
  },
  {
    id: 'audit_016',
    timestamp: new Date(day(1) - hr(3)).toISOString(),
    actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
    action: 'Successfully logged in via TOTP',
    actionCode: 'LOGIN_SUCCESS', category: 'authentication', severity: 'info',
    ipAddress: '103.21.58.xxx', userAgent: 'Chrome 121 / macOS 14.2',
  },
  {
    id: 'audit_017',
    timestamp: new Date(day(1) - hr(4)).toISOString(),
    actorId: 'admin_002', actorName: 'Priya Sharma', actorRole: 'admin',
    action: 'Flagged review REV-8821 for spam content',
    actionCode: 'REVIEW_FLAGGED', category: 'review_management', severity: 'info',
    targetEntityType: 'review', targetEntityId: 'rev_8821', targetEntityLabel: 'REV-8821',
    ipAddress: '182.64.12.xxx', userAgent: 'Firefox 122 / Windows 11',
    after: { flagReason: 'spam' },
  },
  {
    id: 'audit_018',
    timestamp: new Date(day(2)).toISOString(),
    actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
    action: 'Updated Privacy Policy to version v1.9',
    actionCode: 'LEGAL_VERSION_UPDATED', category: 'platform_settings', severity: 'warning',
    ipAddress: '103.21.58.xxx', userAgent: 'Chrome 121 / macOS 14.2',
    before: { privacyPolicyVersion: 'v1.8' }, after: { privacyPolicyVersion: 'v1.9' },
  },
  {
    id: 'audit_019',
    timestamp: new Date(day(2) - hr(2)).toISOString(),
    actorId: 'admin_003', actorName: 'Rahul Gupta', actorRole: 'admin',
    action: 'Resolved dispute for order ORD-6612 in customer favor',
    actionCode: 'DISPUTE_RESOLVED', category: 'order_management', severity: 'info',
    targetEntityType: 'order', targetEntityId: 'ord_6612', targetEntityLabel: 'ORD-6612',
    ipAddress: '61.12.44.xxx', userAgent: 'Chrome 120 / Windows 11',
    after: { resolution: 'customer_favor', refundAmount: 3200 },
  },
  {
    id: 'audit_020',
    timestamp: new Date(day(2) - hr(5)).toISOString(),
    actorId: 'admin_002', actorName: 'Priya Sharma', actorRole: 'admin',
    action: 'Unblocked customer — Anjali Desai (false positive)',
    actionCode: 'CUSTOMER_UNBLOCKED', category: 'customer_management', severity: 'info',
    targetEntityType: 'customer', targetEntityId: 'cust_023', targetEntityLabel: 'Anjali Desai',
    ipAddress: '182.64.12.xxx', userAgent: 'Firefox 122 / Windows 11',
    before: { status: 'blocked' }, after: { status: 'active' },
    metadata: { reason: 'Block was result of system false-positive — manual review cleared' },
  },
  {
    id: 'audit_021',
    timestamp: new Date(day(3)).toISOString(),
    actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
    action: 'Disabled Guest Checkout feature flag',
    actionCode: 'FEATURE_FLAG_TOGGLED', category: 'platform_settings', severity: 'critical',
    ipAddress: '103.21.58.xxx', userAgent: 'Chrome 121 / macOS 14.2',
    before: { guestCheckoutEnabled: true }, after: { guestCheckoutEnabled: false },
    metadata: { reason: 'High fraud rate from guest orders — re-enabling after identity verification review' },
  },
  {
    id: 'audit_022',
    timestamp: new Date(day(3) - hr(1)).toISOString(),
    actorId: 'admin_003', actorName: 'Rahul Gupta', actorRole: 'admin',
    action: 'Approved 5 seller applications in bulk',
    actionCode: 'SELLERS_BULK_APPROVED', category: 'seller_management', severity: 'info',
    ipAddress: '61.12.44.xxx', userAgent: 'Chrome 120 / Windows 11',
    metadata: { count: 5 },
  },
  {
    id: 'audit_023',
    timestamp: new Date(day(3) - hr(3)).toISOString(),
    actorId: 'admin_002', actorName: 'Priya Sharma', actorRole: 'admin',
    action: 'Closed support ticket TKT-00298 — issue resolved',
    actionCode: 'TICKET_CLOSED', category: 'support', severity: 'info',
    targetEntityType: 'ticket', targetEntityId: 'tkt_298', targetEntityLabel: 'TKT-00298',
    ipAddress: '182.64.12.xxx', userAgent: 'Firefox 122 / Windows 11',
  },
  {
    id: 'audit_024',
    timestamp: new Date(day(4)).toISOString(),
    actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
    action: 'Updated return window from 7 to 10 days',
    actionCode: 'SETTINGS_UPDATED', category: 'platform_settings', severity: 'warning',
    ipAddress: '103.21.58.xxx', userAgent: 'Chrome 121 / macOS 14.2',
    before: { returnWindowDays: 7 }, after: { returnWindowDays: 10 },
  },
  {
    id: 'audit_025',
    timestamp: new Date(day(4) - hr(2)).toISOString(),
    actorId: 'admin_003', actorName: 'Rahul Gupta', actorRole: 'admin',
    action: 'Deactivated coupon FLASH30 — budget exhausted',
    actionCode: 'COUPON_DEACTIVATED', category: 'coupon_management', severity: 'info',
    targetEntityType: 'coupon', targetEntityId: 'coup_015', targetEntityLabel: 'FLASH30',
    ipAddress: '61.12.44.xxx', userAgent: 'Chrome 120 / Windows 11',
    metadata: { reason: 'Budget cap reached', usageCount: 1500 },
  },
  {
    id: 'audit_026',
    timestamp: new Date(day(5)).toISOString(),
    actorId: 'admin_002', actorName: 'Priya Sharma', actorRole: 'admin',
    action: 'Rejected KYC for Jaipur Gems — address mismatch',
    actionCode: 'KYC_REJECTED', category: 'seller_management', severity: 'warning',
    targetEntityType: 'seller', targetEntityId: 'sel_067', targetEntityLabel: 'Jaipur Gems',
    ipAddress: '182.64.12.xxx', userAgent: 'Firefox 122 / Windows 11',
    after: { kyc_status: 'rejected', reason: 'Business address on form doesn\'t match Aadhaar' },
  },
  {
    id: 'audit_027',
    timestamp: new Date(day(5) - hr(4)).toISOString(),
    actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
    action: 'Super admin portal token accessed from new device',
    actionCode: 'SA_TOKEN_ACCESSED', category: 'authentication', severity: 'warning',
    ipAddress: '103.21.58.xxx', userAgent: 'Safari 17 / iOS 17.2',
    metadata: { newDevice: true, deviceFingerprint: 'fp_safari_ios' },
  },
  {
    id: 'audit_028',
    timestamp: new Date(day(6)).toISOString(),
    actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
    action: 'Processed bulk settlement for 8 sellers — ₹12.4L total',
    actionCode: 'SETTLEMENT_BULK_PROCESSED', category: 'finance', severity: 'info',
    ipAddress: '103.21.58.xxx', userAgent: 'Chrome 121 / macOS 14.2',
    metadata: { count: 8, totalAmount: 1240000 },
  },
  {
    id: 'audit_029',
    timestamp: new Date(day(6) - hr(3)).toISOString(),
    actorId: 'admin_003', actorName: 'Rahul Gupta', actorRole: 'admin',
    action: 'Escalated ticket TKT-00310 to super admin',
    actionCode: 'TICKET_ESCALATED', category: 'support', severity: 'warning',
    targetEntityType: 'ticket', targetEntityId: 'tkt_310', targetEntityLabel: 'TKT-00310',
    ipAddress: '61.12.44.xxx', userAgent: 'Chrome 120 / Windows 11',
  },
  {
    id: 'audit_030',
    timestamp: new Date(day(7)).toISOString(),
    actorId: 'admin_002', actorName: 'Priya Sharma', actorRole: 'admin',
    action: 'Published product — Warli Art Canvas (after 2nd revision)',
    actionCode: 'PRODUCT_APPROVED', category: 'product_management', severity: 'info',
    targetEntityType: 'product', targetEntityId: 'prod_089', targetEntityLabel: 'Warli Art Canvas 18x24 inch',
    ipAddress: '182.64.12.xxx', userAgent: 'Firefox 122 / Windows 11',
    before: { status: 'pending_review' }, after: { status: 'published' },
  },
]

export const AUDIT_CATEGORY_LABELS: Record<string, string> = {
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

export const AUDIT_ACTORS = [
  { id: 'admin_001', name: 'Arjun Mehta', role: 'super_admin' },
  { id: 'admin_002', name: 'Priya Sharma', role: 'admin' },
  { id: 'admin_003', name: 'Rahul Gupta', role: 'admin' },
]
