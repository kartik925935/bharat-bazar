/**
 * Finance Selectors — SINGLE SOURCE OF TRUTH for all financial computations.
 *
 * ⚠️  CRITICAL RULE: Finance Overview and Commissions page MUST use the
 * exact same selector functions. Never re-implement locally on any page.
 */

import type { SAOrderWithCommission } from '@/lib/mock/db/orders.seed'
import type { SASettlement, SASeller } from '@/types/super-admin.types'

export interface FinanceState {
  orders: SAOrderWithCommission[]
  settlements: SASettlement[]
  sellers?: SASeller[]
}

/** Total Gross Merchandise Value across ALL orders (including cancelled) */
export const getTotalGMV = (state: FinanceState): number =>
  state.orders.reduce((sum, o) => sum + o.totalAmount, 0)

/** Total commission earned — used by BOTH Finance Overview AND Commissions page */
export const getTotalCommission = (state: FinanceState): number =>
  state.orders.reduce((sum, o) => sum + (o.commissionAmount ?? 0), 0)

/** Total amount in pending/processing settlements */
export const getPendingSettlementsTotal = (state: FinanceState): number =>
  state.settlements
    .filter(s => s.status === 'pending' || s.status === 'processing')
    .reduce((sum, s) => sum + s.netAmount, 0)

/** Total refunds issued */
export const getTotalRefunds = (state: FinanceState): number =>
  state.orders
    .filter(o => o.status === 'cancelled' || o.paymentStatus === 'refunded')
    .reduce((sum, o) => sum + o.totalAmount, 0)

/** Period GMV: orders within the last N days */
export const getPeriodGMV = (state: FinanceState, days: number): number => {
  const cutoff = Date.now() - days * 86400000
  return state.orders
    .filter(o => new Date(o.createdAt).getTime() >= cutoff)
    .reduce((sum, o) => sum + o.totalAmount, 0)
}

/** Settlement stats computed from the settlements array */
export const getSettlementStats = (state: FinanceState) => ({
  pending: state.settlements.filter(s => s.status === 'pending').length,
  processing: state.settlements.filter(s => s.status === 'processing').length,
  completed: state.settlements.filter(s => s.status === 'completed').length,
  failed: state.settlements.filter(s => s.status === 'failed').length,
  total: state.settlements.length,
  totalPendingAmount: getPendingSettlementsTotal(state),
})

/** Revenue trend bucketed by day for Recharts — key names must match <Area dataKey="..."> */
export interface RevenueTrendPoint {
  date: string      // "Aug 1" format
  gmv: number
  commission: number
  refunds: number
  orders: number
}

export const getRevenueTrend = (state: FinanceState, days: number): RevenueTrendPoint[] => {
  const now = Date.now()
  const buckets: Map<string, RevenueTrendPoint> = new Map()

  // Initialize all days as zero so chart has continuous line even on slow days
  for (let d = days - 1; d >= 0; d--) {
    const date = new Date(now - d * 86400000)
    const key = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    buckets.set(key, { date: key, gmv: 0, commission: 0, refunds: 0, orders: 0 })
  }

  state.orders.forEach(o => {
    const orderDate = new Date(o.createdAt)
    const ageDays = (now - orderDate.getTime()) / 86400000
    if (ageDays > days) return
    const key = orderDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    if (!buckets.has(key)) return
    const bucket = buckets.get(key)!
    bucket.gmv += o.totalAmount
    bucket.commission += o.commissionAmount ?? 0
    bucket.orders += 1
    if (o.paymentStatus === 'refunded') bucket.refunds += o.totalAmount
  })

  const result = Array.from(buckets.values())

  if (process.env.NODE_ENV === 'development' && result.length === 0) {
    console.warn('⚠️ getRevenueTrend returned empty array — no orders found in the last', days, 'days')
  }
  if (process.env.NODE_ENV === 'development' && result.length > 0) {
    const hasKeys = result.every(d => 'date' in d && 'gmv' in d)
    if (!hasKeys) console.error('RevenueChart data malformed:', result[0])
  }

  return result
}

export const getCommissionRecords = (state: FinanceState) => {
  return state.orders.map(o => {
    let status: 'collected' | 'pending' | 'disputed' | 'waived' = 'pending'
    if (o.status === 'delivered') status = 'collected'
    if (o.status === 'cancelled' || o.status === 'returned') status = 'waived'
    if (o.status === 'return_requested') status = 'disputed'
    
    return {
      id: `com-${o.id}`,
      sellerId: o.sellerId,
      sellerName: o.sellerName,
      orderId: o.orderId,
      orderAmount: o.totalAmount,
      commissionRate: o.commissionRate ?? 0,
      commissionAmount: o.commissionAmount ?? 0,
      category: o.items?.[0]?.category ?? '',
      status,
      createdAt: o.createdAt
    }
  })
}

export const getPayoutCalendarEvents = (state: FinanceState) => {
  return state.settlements.map(s => {
    const seller = state.sellers?.find(sl => sl.id === s.sellerId)
    const scheduledDate = new Date(new Date(s.periodEnd).getTime() + 86400000 * 2).toISOString()
    let status: 'upcoming' | 'processing' | 'paid' | 'failed' | 'on_hold' = 'upcoming'
    if (s.status === 'processing') status = 'processing'
    if (s.status === 'completed') status = 'paid'
    if (s.status === 'failed') status = 'failed'
    if (s.status === 'pending') status = 'upcoming'

    return {
      id: `pc-${s.id}`,
      sellerId: s.sellerId,
      sellerName: seller?.displayName ?? s.sellerName,
      sellerType: seller?.sellerType ?? 'artisan',
      shopName: seller?.shopName ?? s.sellerName,
      amount: s.netAmount,
      scheduledDate,
      processedDate: s.paidAt,
      status,
      bankName: (seller as any)?.bankDetails?.bankName ?? '',
      accountLast4: (seller as any)?.bankDetails?.accountNumber?.slice(-4) ?? '',
      utrNumber: status === 'paid' ? `UTR-${s.id}` : undefined,
      cycle: 'weekly' as const,
      ordersIncluded: s.ordersCount,
    }
  })
}

