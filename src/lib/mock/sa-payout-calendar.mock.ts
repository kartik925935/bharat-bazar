// ─── Payout Calendar Mock Data ─────────────────────────────────────────────────
// Cleared for Supabase migration — data will come from real backend

export type PayoutStatus = 'upcoming' | 'processing' | 'paid' | 'failed' | 'on_hold'

export interface PayoutCalendarEvent {
  id: string
  sellerId: string
  sellerName: string
  sellerType: string
  shopName: string
  amount: number
  scheduledDate: string
  processedDate?: string
  status: PayoutStatus
  bankName?: string
  accountLast4?: string
  utrNumber?: string
  failureReason?: string
  cycle: 'weekly' | 'biweekly' | 'monthly'
  ordersIncluded: number
}

export interface PayoutSummary {
  totalScheduled: number
  totalPaid: number
  totalFailed: number
  totalOnHold: number
  upcomingCount: number
  processingCount: number
  paidCount: number
  failedCount: number
}

export const MOCK_PAYOUT_CALENDAR: PayoutCalendarEvent[] = []

export const MOCK_PAYOUT_SUMMARY: PayoutSummary = {
  totalScheduled: 0,
  totalPaid: 0,
  totalFailed: 0,
  totalOnHold: 0,
  upcomingCount: 0,
  processingCount: 0,
  paidCount: 0,
  failedCount: 0,
}
