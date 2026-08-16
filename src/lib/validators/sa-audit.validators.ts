// src/lib/validators/sa-audit.validators.ts
import { z } from 'zod'

export const saAuditFilterSchema = z.object({
  category: z.enum([
    'authentication', 'admin_management', 'seller_management',
    'product_management', 'order_management', 'finance',
    'customer_management', 'platform_settings', 'review_management',
    'support', 'coupon_management',
  ]).optional(),
  severity: z.enum(['info', 'warning', 'critical']).optional(),
  actorId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
})
export type SAAuditFilterInput = z.infer<typeof saAuditFilterSchema>
