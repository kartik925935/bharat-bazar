// src/lib/mock/sa-settings.mock.ts

export interface SAPlatformSettings {
  commissionRateDefault: number
  returnWindowDays: number
  settlementCycleDays: number
  minSettlementAmount: number
  sellerRegistrationFee: number
  maxProductsPerSeller: number
  minProductImages: number
  productCompletenessThreshold: number
  sellerAutoSuspendAfterDays: number
  orderAcceptanceSlaHours: number
  dispatchSlaHours: number
  maxCodOrderValue: number
  maintenanceMode: boolean
  maintenanceMessage: string
  maintenanceScheduledEnd?: string
  features: {
    googleOAuthEnabled: boolean
    codEnabled: boolean
    guestCheckoutEnabled: boolean
    reviewsEnabled: boolean
    wishlistEnabled: boolean
    sellerStoriesEnabled: boolean
    flashSaleEnabled: boolean
    referralProgramEnabled: boolean
    bulkImportEnabled: boolean
  }
  notifications: {
    sendEmailOnOrderConfirm: boolean
    sendEmailOnShipment: boolean
    sendEmailOnDelivery: boolean
    sendSmsOnDelivery: boolean
    sendSellerPayoutEmail: boolean
  }
  termsVersion: string
  privacyPolicyVersion: string
  lastUpdatedAt: string
  lastUpdatedBy: string
}

export const MOCK_PLATFORM_SETTINGS: SAPlatformSettings = {
  commissionRateDefault: 0,
  returnWindowDays: 0,
  settlementCycleDays: 0,
  minSettlementAmount: 0,
  sellerRegistrationFee: 0,
  maxProductsPerSeller: 0,
  minProductImages: 0,
  productCompletenessThreshold: 0,
  sellerAutoSuspendAfterDays: 0,
  orderAcceptanceSlaHours: 0,
  dispatchSlaHours: 0,
  maxCodOrderValue: 0,
  maintenanceMode: false,
  maintenanceMessage: '',
  maintenanceScheduledEnd: undefined,
  features: {
    googleOAuthEnabled: true,
    codEnabled: true,
    guestCheckoutEnabled: false,
    reviewsEnabled: true,
    wishlistEnabled: true,
    sellerStoriesEnabled: true,
    flashSaleEnabled: true,
    referralProgramEnabled: false,
    bulkImportEnabled: true,
  },
  notifications: {
    sendEmailOnOrderConfirm: true,
    sendEmailOnShipment: true,
    sendEmailOnDelivery: true,
    sendSmsOnDelivery: false,
    sendSellerPayoutEmail: true,
  },
  termsVersion: 'v2.3',
  privacyPolicyVersion: 'v1.8',
  lastUpdatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  lastUpdatedBy: 'Arjun Mehta',
}
