import { z } from 'zod'

// ============================================
// AUTH VALIDATORS
// ============================================

export const saCredentialsSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberEmail: z.boolean(),
})
export type SACredentialsInput = z.infer<typeof saCredentialsSchema>

// Alias for backward compat
export const saLoginSchema = saCredentialsSchema
export type SALoginInput = SACredentialsInput

export const saTotpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Authenticator code must be 6 digits'),
})
export type SATotpInput = z.infer<typeof saTotpSchema>

export const saDeviceVerifySchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'Verification code must be 6 digits'),
  trustDevice: z.boolean().default(false),
})
export type SADeviceVerifyInput = z.infer<typeof saDeviceVerifySchema>

// ============================================
// ADMIN MANAGEMENT VALIDATORS
// ============================================

export const saAdminEditSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Enter a valid email address'),
  role: z.enum(['SENIOR_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN', 'FINANCE_ADMIN', 'CONTENT_ADMIN', 'DELIVERY_ADMIN', 'CUSTOM_ADMIN']),
  department: z.string().min(2, 'Department is required'),
  status: z.enum(['active', 'inactive', 'suspended', 'pending']),
})
export type SAAdminEditInput = z.infer<typeof saAdminEditSchema>

export const saPanelRequestReviewSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  reviewNote: z.string().min(5, 'Please provide a brief note (min 5 characters)').max(500),
})
export type SAPanelRequestReviewInput = z.infer<typeof saPanelRequestReviewSchema>
