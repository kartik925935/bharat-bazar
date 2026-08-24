import { randomInt, pick } from './seed'
import type { SAAuditLog, AuditActionCategory, AuditSeverity, AuditAction } from '@/types/super-admin.types'

const AUDIT_ACTORS = [
  { id: 'admin_001', name: 'Arjun Mehta', role: 'super_admin' as const },
  { id: 'admin_002', name: 'Priya Sharma', role: 'admin' as const },
  { id: 'admin_003', name: 'Rahul Gupta', role: 'admin' as const },
]

const IPS = ['103.21.58.42', '49.36.120.15', '117.200.45.81', '122.167.34.10', '103.87.24.55', '14.139.57.1']
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14) Safari/605',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17) Mobile Safari/604',
]

// Array of action templates to pick from to construct rich logs
const ACTION_TEMPLATES: Array<{
  actionCode: string,
  category: AuditActionCategory,
  severity: AuditSeverity,
  action: string,
  targetEntityType?: string,
  targetEntityLabel?: string,
  metadata?: Record<string, unknown>
}> = [
  { actionCode: 'SELLER_APPROVED', category: 'seller_management', severity: 'info', action: 'Approved seller application', targetEntityType: 'seller', targetEntityLabel: 'Village Craft Collective' },
  { actionCode: 'COMMISSION_RATE_UPDATED', category: 'platform_settings', severity: 'critical', action: 'Updated global commission rate', metadata: { applyTo: 'platform_default' } },
  { actionCode: 'CUSTOMER_BLOCKED', category: 'customer_management', severity: 'warning', action: 'Blocked customer account', targetEntityType: 'customer', targetEntityLabel: 'Vikas Malhotra' },
  { actionCode: 'PRODUCT_REJECTED', category: 'product_management', severity: 'info', action: 'Rejected product listing', targetEntityType: 'product', targetEntityLabel: 'Hand-Carved Brass Diya Set' },
  { actionCode: 'REFUND_INITIATED', category: 'order_management', severity: 'warning', action: 'Initiated refund', targetEntityType: 'order', targetEntityLabel: 'ORD-9978' },
  { actionCode: 'MAINTENANCE_MODE_ENABLED', category: 'platform_settings', severity: 'critical', action: 'Platform maintenance mode ENABLED' },
  { actionCode: 'SA_TOKEN_ACCESSED', category: 'authentication', severity: 'info', action: 'Super admin portal token accessed' },
  { actionCode: 'REVIEWS_BULK_APPROVED', category: 'review_management', severity: 'info', action: 'Approved reviews in bulk', metadata: { count: 12 } },
  { actionCode: 'LOGIN_FAILED', category: 'authentication', severity: 'warning', action: 'Failed login attempt — invalid credentials' },
  { actionCode: 'COUPON_CREATED', category: 'coupon_management', severity: 'info', action: 'Published coupon' },
  { actionCode: 'TICKET_ASSIGNED', category: 'support', severity: 'info', action: 'Assigned support ticket', targetEntityType: 'ticket', targetEntityLabel: 'TKT-00321' },
  { actionCode: 'LOGIN_SUCCESS', category: 'authentication', severity: 'info', action: 'Successfully logged in via TOTP' },
  { actionCode: 'REVIEW_FLAGGED', category: 'review_management', severity: 'info', action: 'Flagged review for spam content', targetEntityType: 'review', targetEntityLabel: 'REV-8821' },
  { actionCode: 'DISPUTE_RESOLVED', category: 'order_management', severity: 'info', action: 'Resolved dispute for order', targetEntityType: 'order', targetEntityLabel: 'ORD-6612' },
  { actionCode: 'CUSTOMER_UNBLOCKED', category: 'customer_management', severity: 'info', action: 'Unblocked customer', targetEntityType: 'customer', targetEntityLabel: 'Anjali Desai' },
  { actionCode: 'FEATURE_FLAG_TOGGLED', category: 'platform_settings', severity: 'critical', action: 'Disabled Guest Checkout feature flag' },
]

export function generateAuditLogs(count = 60): SAAuditLog[] {
  const logs: SAAuditLog[] = Array.from({ length: count }, (_, i) => {
    const actor = pick(AUDIT_ACTORS)
    const template = pick(ACTION_TEMPLATES)
    
    // Spread timestamps across the last 30 days
    // Ensure strict chronological order by generating them offset by `i * offsetMinutes` from now
    const minutesAgo = i * randomInt(15, 90) + randomInt(0, 10)
    const timestamp = new Date(Date.now() - minutesAgo * 60000).toISOString()

    return {
      id: `audit-${String(i + 1).padStart(4, '0')}`,
      timestamp,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: template.action,
      actionCode: template.actionCode,
      category: template.category,
      severity: template.severity,
      targetEntityType: template.targetEntityType,
      targetEntityId: template.targetEntityType ? `target-${randomInt(100, 999)}` : undefined,
      targetEntityLabel: template.targetEntityLabel,
      ipAddress: pick(IPS),
      userAgent: pick(USER_AGENTS),
      metadata: template.metadata,
    }
  })

  // Sort descending by timestamp
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
