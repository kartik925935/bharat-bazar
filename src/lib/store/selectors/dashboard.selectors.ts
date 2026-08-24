import type { SASeller, SAOrder, SAAuditLog, SAProduct } from '@/types/super-admin.types'
import type { SAOrderWithCommission } from '@/lib/mock/db/orders.seed'

export interface DashboardState {
  sellers: SASeller[]
  orders: SAOrderWithCommission[]
  auditLogs: SAAuditLog[]
  products: SAProduct[]
  customers: { id: string }[]
}

/** Top performing sellers sorted by totalSales descending */
export const getTopPerformingSellers = (state: { sellers: SASeller[] }, limit = 7): SASeller[] =>
  [...state.sellers]
    .filter(s => s.status === 'active')
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, limit)

/**
 * Live activity feed sourced from auditLogs — one dataset, two views.
 * Already sorted descending by audit-logs.seed.ts but we enforce here too.
 */
export const getLiveActivityFeed = (state: { auditLogs: SAAuditLog[] }, limit = 8): SAAuditLog[] =>
  [...state.auditLogs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)

export interface CategorySalesPoint {
  category: string
  total: number
  percentage: number
}

/** Sales by category computed from real order items */
export const getSalesByCategory = (state: { orders: SAOrderWithCommission[] | SAOrder[] }): CategorySalesPoint[] => {
  const map = new Map<string, number>()
  state.orders.forEach((o: any) => {
    o.items?.forEach((item: any) => {
      const existing = map.get(item.category) ?? 0
      map.set(item.category, existing + item.price * item.quantity)
    })
  })

  const total = Array.from(map.values()).reduce((sum, v) => sum + v, 0)
  if (total === 0) return []

  return Array.from(map.entries())
    .map(([category, cat_total]) => ({
      category,
      total: cat_total,
      percentage: Math.round((cat_total / total) * 100),
    }))
    .sort((a, b) => b.total - a.total)
}

export interface SystemHealthMetrics {
  responseMs: number
  uptimePercent: number
  status: 'operational' | 'degraded' | 'down'
}

/**
 * Plausible system health metrics — simulated but realistic.
 * Rolls fresh values on each call; wire to a 30s interval for "live" feel.
 */
export const getSystemHealthMetrics = (): SystemHealthMetrics => ({
  responseMs: Math.floor(80 + Math.random() * 140),   // 80–220ms
  uptimePercent: +(99.7 + Math.random() * 0.29).toFixed(2),  // 99.70–99.99%
  status: 'operational',
})

/** Order status counts for dashboard stats */
export const getOrderStats = (state: { orders: SAOrder[] }) => ({
  total: state.orders.length,
  delivered: state.orders.filter(o => o.status === 'delivered').length,
  inTransit: state.orders.filter(o => ['in_transit', 'out_for_delivery', 'picked_up'].includes(o.status)).length,
  pending: state.orders.filter(o => ['pending_payment', 'confirmed', 'processing'].includes(o.status)).length,
  cancelled: state.orders.filter(o => o.status === 'cancelled').length,
  returns: state.orders.filter(o => ['return_requested', 'returned', 'refunded'].includes(o.status)).length,
})
