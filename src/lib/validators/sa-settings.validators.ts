// src/lib/validators/sa-settings.validators.ts
import { z } from 'zod'

export const saPlatformSettingsSchema = z.object({
  commissionRateDefault: z.coerce.number().min(0).max(30),
  returnWindowDays: z.coerce.number().min(1).max(30),
  settlementCycleDays: z.coerce.number().min(1).max(30),
  minSettlementAmount: z.coerce.number().min(0),
  sellerRegistrationFee: z.coerce.number().min(0),
  maxProductsPerSeller: z.coerce.number().min(1).max(10000),
  minProductImages: z.coerce.number().min(1).max(20),
  productCompletenessThreshold: z.coerce.number().min(0).max(100),
  sellerAutoSuspendAfterDays: z.coerce.number().min(1).max(365),
  orderAcceptanceSlaHours: z.coerce.number().min(1).max(72),
  dispatchSlaHours: z.coerce.number().min(1).max(168),
  maxCodOrderValue: z.coerce.number().min(0),
})
export type SAPlatformSettingsInput = z.infer<typeof saPlatformSettingsSchema>

export const saMaintenanceModeSchema = z.object({
  enabled: z.boolean(),
  message: z.string().min(10).max(500),
  scheduledEnd: z.string().datetime().optional(),
})
export type SAMaintenanceModeInput = z.infer<typeof saMaintenanceModeSchema>

export const saFeatureFlagSchema = z.object({
  feature: z.enum([
    'googleOAuthEnabled', 'codEnabled', 'guestCheckoutEnabled',
    'reviewsEnabled', 'wishlistEnabled', 'sellerStoriesEnabled',
    'flashSaleEnabled', 'referralProgramEnabled', 'bulkImportEnabled',
  ]),
  enabled: z.boolean(),
})
export type SAFeatureFlagInput = z.infer<typeof saFeatureFlagSchema>
