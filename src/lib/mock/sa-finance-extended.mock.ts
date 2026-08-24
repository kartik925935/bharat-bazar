// ─── Commission Record ──────────────────────────────────────────────────────
// Cleared for Supabase migration — data will come from real backend

export interface SACommissionRecord {
  id: string
  sellerId: string
  sellerName: string
  orderId: string
  orderAmount: number
  commissionRate: number   // e.g. 8 = 8%
  commissionAmount: number
  category: string
  status: 'collected' | 'pending' | 'disputed' | 'waived'
  createdAt: string
}

// ─── Finance Revenue Point (for chart) ─────────────────────────────────────
export interface SAFinanceChartPoint {
  date: string
  gmv: number
  commission: number
  refunds: number
  netRevenue: number
}

// ─── Payout Calendar Event ──────────────────────────────────────────────────
export interface SAPayoutEvent {
  id: string
  sellerId: string
  sellerName: string
  amount: number
  scheduledDate: string
  status: 'upcoming' | 'processing' | 'paid' | 'failed'
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
export const MOCK_SA_COMMISSIONS: SACommissionRecord[] = []
export const MOCK_SA_FINANCE_CHART: SAFinanceChartPoint[] = []
export const MOCK_SA_PAYOUT_EVENTS: SAPayoutEvent[] = []
