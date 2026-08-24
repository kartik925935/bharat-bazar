/**
 * MOCK_DB — Cleared for Supabase migration.
 * All panels will show empty states until real data is wired via Supabase.
 * DO NOT re-populate. Use Supabase instead.
 */

import type {
  SASeller, SACustomer, SAProduct, SAOrder, SADeliveryPartner,
  SASettlement, SACoupon, SAAuditLog,
} from '@/types/super-admin.types'
import type { SACommissionRecord } from './commissions.seed'
import type { SAOrderWithCommission } from './orders.seed'

export interface MockDB {
  sellers: SASeller[]
  customers: SACustomer[]
  products: SAProduct[]
  orders: SAOrderWithCommission[]
  deliveryPartners: SADeliveryPartner[]
  commissions: SACommissionRecord[]
  settlements: SASettlement[]
  coupons: SACoupon[]
  auditLogs: SAAuditLog[]
}

export const MOCK_DB: MockDB = {
  sellers: [],
  customers: [],
  products: [],
  orders: [],
  deliveryPartners: [],
  commissions: [],
  settlements: [],
  coupons: [],
  auditLogs: [],
}

// Re-export types needed by consumers
export type { SAOrderWithCommission } from './orders.seed'
export type { SACommissionRecord } from './commissions.seed'
