import { z } from 'zod'

// Reviews
export const saReviewModerationSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  adminNote: z.string().max(500).optional(),
})
export type SAReviewModerationInput = z.infer<typeof saReviewModerationSchema>

export const saReviewBulkSchema = z.object({
  reviewIds: z.array(z.string()).min(1),
  decision: z.enum(['approved', 'rejected']),
})

// Notifications
export const saNotificationPreferencesSchema = z.object({
  emailOnCritical: z.boolean(),
  emailOnHigh: z.boolean(),
  browserPushEnabled: z.boolean(),
  mutedTypes: z.array(z.enum([
    'new_seller_application', 'kyc_submitted', 'product_submitted',
    'order_sla_breach', 'dispute_opened', 'dispute_escalated',
    'payment_failed', 'reconciliation_mismatch', 'coupon_abuse_detected',
    'review_flagged', 'system_alert', 'settlement_processed', 'admin_action',
  ])),
})
export type SANotificationPreferencesInput = z.infer<typeof saNotificationPreferencesSchema>

// Support Tickets
export const saTicketReplySchema = z.object({
  message: z.string().min(5, 'Message too short').max(2000),
  isInternal: z.boolean().default(false),
  attachments: z.array(z.string()).optional(),
})
export type SATicketReplyInput = z.infer<typeof saTicketReplySchema>

export const saTicketUpdateSchema = z.object({
  status: z.enum(['open', 'in_progress', 'waiting_for_user', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignedAdminId: z.string().optional(),
  tags: z.array(z.string()).optional(),
})
export type SATicketUpdateInput = z.infer<typeof saTicketUpdateSchema>
