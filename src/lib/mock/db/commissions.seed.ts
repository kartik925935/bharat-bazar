import { randomInt, pick } from './seed'
import type { SASettlement } from '@/types/super-admin.types'
import type { SAOrderWithCommission } from './orders.seed'

export interface SACommissionRecord {
  id: string
  orderId: string
  sellerId: string
  sellerName: string
  orderAmount: number
  commissionRate: number
  earned: number
  status: 'pending' | 'paid' | 'disputed'
  createdAt: string
  category: string
}

/** Derived from orders — never hand-typed. This is the single source of truth for commission data. */
export function generateCommissions(orders: SAOrderWithCommission[]): SACommissionRecord[] {
  return orders
    .filter(o => ['delivered', 'in_transit', 'out_for_delivery', 'processing', 'confirmed'].includes(o.status))
    .map((o, i) => ({
      id: `comm-${String(i + 1).padStart(4, '0')}`,
      orderId: o.id,
      sellerId: o.sellerId,
      sellerName: o.sellerName,
      orderAmount: o.totalAmount,
      commissionRate: o.commissionRate,
      earned: o.commissionAmount,
      status: o.paymentStatus === 'paid' ? (i % 10 === 0 ? 'disputed' : 'paid') : 'pending',
      createdAt: o.createdAt,
      category: o.items?.[0]?.category ?? 'Uncategorized',
    }))
}

/** Derived by grouping commissions by seller + period */
export function generateSettlements(commissions: SACommissionRecord[]): SASettlement[] {
  // Group by sellerId
  const bySellerMap = new Map<string, SACommissionRecord[]>()
  commissions.forEach(c => {
    if (!bySellerMap.has(c.sellerId)) bySellerMap.set(c.sellerId, [])
    bySellerMap.get(c.sellerId)!.push(c)
  })

  let idx = 0
  const settlements: SASettlement[] = []

  bySellerMap.forEach((comms, sellerId) => {
    const sellerName = comms[0].sellerName
    const totalCommission = comms.reduce((sum, c) => sum + c.earned, 0)
    const grossAmount = comms.reduce((sum, c) => sum + c.orderAmount, 0)
    const netAmount = grossAmount - totalCommission
    const status = idx % 5 === 0 ? 'pending' : idx % 5 === 1 ? 'processing' : idx % 5 === 2 ? 'failed' : 'completed'
    const periodStart = new Date(Date.now() - 30 * 86400000).toISOString()
    const periodEnd = new Date().toISOString()

    settlements.push({
      id: `settle-${String(++idx).padStart(3, '0')}`,
      sellerId,
      sellerName,
      amount: grossAmount,
      commission: totalCommission,
      netAmount,
      status,
      ordersCount: comms.length,
      periodStart,
      periodEnd,
      createdAt: periodEnd,
      paidAt: status === 'completed' ? new Date(Date.now() - randomInt(1, 10) * 86400000).toISOString() : undefined,
    })
  })

  return settlements
}
