import { z } from 'zod'

const panelKeys = [
  'dashboard', 'analytics', 'finance', 'finance.commissions', 'finance.settlements',
  'kyc-verification', 'products', 'reviews', 'sellers', 'customers', 'orders', 'returns',
  'delivery', 'coupons', 'offers', 'panel-requests', 'settings', 'storefront', 'audit-logs', 'notifications', 'support', 'admin-control'
] as const

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const panelRequestSchema = z.object({
  panel: z.enum(panelKeys),
  level: z.enum(['view','edit','full']),
  reason: z.string().min(20, 'Reason must be at least 20 characters.'),
})

export const reviewRequestSchema = z.object({
  decision: z.enum(['approved','rejected']),
  reviewNote: z.string().optional(),
}).refine(d => d.decision !== 'rejected' || (d.reviewNote?.length ?? 0) > 5, {
  message: 'A reason is required when rejecting.',
  path: ['reviewNote'],
})
