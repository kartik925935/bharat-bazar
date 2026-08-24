import { format, subDays, startOfWeek, startOfMonth, endOfWeek, endOfMonth, isSameDay } from 'date-fns'
import type { SASettlement, SASeller, SAProduct, SACustomer, SAOrder } from '@/types/super-admin.types'
import type { SAOrderWithCommission } from '@/lib/mock/db/orders.seed'

export interface SARevenueDataPoint {
  date: string
  gmv: number
  platformRevenue: number
  commissions: number
  refunds: number
  netRevenue: number
}

// 1. Revenue Selector
export function getAnalyticsRevenue(
  state: { orders: SAOrderWithCommission[], settlements: SASettlement[] },
  granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
): SARevenueDataPoint[] {
  const { orders } = state
  let daysToLookBack = 30
  if (granularity === 'weekly') daysToLookBack = 90
  if (granularity === 'monthly') daysToLookBack = 365

  const points: SARevenueDataPoint[] = []

  if (granularity === 'daily') {
    for (let i = daysToLookBack - 1; i >= 0; i--) {
      const d = subDays(new Date(), i)
      const dateStr = format(d, 'yyyy-MM-dd')
      const dayOrders = orders.filter(o => isSameDay(new Date(o.createdAt), d))
      
      let gmv = 0
      let platformRevenue = 0
      let refunds = 0
      
      dayOrders.forEach(o => {
        if (o.status !== 'cancelled' && o.status !== 'refunded') {
          gmv += o.totalAmount
          platformRevenue += o.commissionAmount
        }
        if (o.status === 'refunded') {
          refunds += o.totalAmount
        }
      })
      
      points.push({
        date: dateStr,
        gmv,
        platformRevenue,
        commissions: platformRevenue, // same for now
        refunds,
        netRevenue: platformRevenue - (refunds * 0.05) // simulated net
      })
    }
  } else if (granularity === 'weekly') {
    // Basic week chunking
    for (let i = 12; i >= 0; i--) {
      const d = subDays(new Date(), i * 7)
      const dateStr = format(startOfWeek(d), 'yyyy-MM-dd')
      
      let gmv = 0, platformRevenue = 0, refunds = 0
      orders.forEach(o => {
        const od = new Date(o.createdAt)
        if (od >= startOfWeek(d) && od <= endOfWeek(d)) {
          if (o.status !== 'cancelled' && o.status !== 'refunded') {
            gmv += o.totalAmount
            platformRevenue += o.commissionAmount
          }
          if (o.status === 'refunded') {
            refunds += o.totalAmount
          }
        }
      })
      
      points.push({ date: dateStr, gmv, platformRevenue, commissions: platformRevenue, refunds, netRevenue: platformRevenue })
    }
  } else {
    // Monthly
    for (let i = 11; i >= 0; i--) {
      const d = subDays(new Date(), i * 30)
      const dateStr = format(startOfMonth(d), 'yyyy-MM')
      
      let gmv = 0, platformRevenue = 0, refunds = 0
      orders.forEach(o => {
        const od = new Date(o.createdAt)
        if (od >= startOfMonth(d) && od <= endOfMonth(d)) {
          if (o.status !== 'cancelled' && o.status !== 'refunded') {
            gmv += o.totalAmount
            platformRevenue += o.commissionAmount
          }
          if (o.status === 'refunded') {
            refunds += o.totalAmount
          }
        }
      })
      
      points.push({ date: dateStr, gmv, platformRevenue, commissions: platformRevenue, refunds, netRevenue: platformRevenue })
    }
  }
  
  return points
}

// 2. Geographic Breakdown
export interface SAGeographicDataPoint {
  state: string
  stateCode: string
  orders: number
  gmv: number
  activeSellers: number
  activeCustomers: number
  avgOrderValue: number
}

export function getGeographicData(
  state: { orders: SAOrderWithCommission[], sellers: SASeller[], customers: SACustomer[] }
): SAGeographicDataPoint[] {
  const { orders, sellers, customers } = state
  const stateMap = new Map<string, SAGeographicDataPoint>()
  
  // Aggregate sellers
  sellers.forEach(s => {
    const st = s.state || 'Unknown'
    if (!stateMap.has(st)) {
      stateMap.set(st, { state: st, stateCode: st.substring(0,2).toUpperCase(), orders: 0, gmv: 0, activeSellers: 0, activeCustomers: 0, avgOrderValue: 0 })
    }
    if (s.status === 'active') {
      stateMap.get(st)!.activeSellers++
    }
  })
  
  // Aggregate customers
  customers.forEach(c => {
    // Mock customer state - let's assume random distribution or just use the first few
    const st = 'Maharashtra' // hardcoded fallback for mock since customer state might not exist
    if (!stateMap.has(st)) {
      stateMap.set(st, { state: st, stateCode: st.substring(0,2).toUpperCase(), orders: 0, gmv: 0, activeSellers: 0, activeCustomers: 0, avgOrderValue: 0 })
    }
    if (c.status === 'active') {
      stateMap.get(st)!.activeCustomers++
    }
  })
  
  // Aggregate orders
  orders.forEach(o => {
    // Find seller state
    const seller = sellers.find(s => s.id === o.sellerId)
    const st = seller?.state || 'Unknown'
    if (!stateMap.has(st)) {
      stateMap.set(st, { state: st, stateCode: st.substring(0,2).toUpperCase(), orders: 0, gmv: 0, activeSellers: 0, activeCustomers: 0, avgOrderValue: 0 })
    }
    const data = stateMap.get(st)!
    if (o.status !== 'cancelled') {
      data.orders++
      data.gmv += o.totalAmount
    }
  })
  
  // Calc AOV
  return Array.from(stateMap.values()).map(d => ({
    ...d,
    avgOrderValue: d.orders > 0 ? Math.round(d.gmv / d.orders) : 0
  })).sort((a,b) => b.gmv - a.gmv).slice(0, 10)
}

// 3. Conversion Funnel
export interface SAFunnelStep {
  step: string
  count: number
  dropOffRate: number
}
export function getFunnelData(state: { customers: SACustomer[], orders: SAOrderWithCommission[] }): SAFunnelStep[] {
  const visitors = state.customers.length * 5
  const activeCustomers = state.customers.filter(c => c.status === 'active').length
  const withOrders = new Set(state.orders.map(o => o.customerId)).size

  const addedToCart = Math.round(activeCustomers * 0.4)
  const reachedCheckout = Math.round(activeCustomers * 0.2)

  return [
    { step: 'Site Visitors', count: visitors, dropOffRate: 0 },
    { step: 'Registered Users', count: activeCustomers, dropOffRate: visitors ? Math.round(((visitors - activeCustomers) / visitors) * 100) : 0 },
    { step: 'Added to Cart', count: addedToCart, dropOffRate: activeCustomers ? Math.round(((activeCustomers - addedToCart) / activeCustomers) * 100) : 0 },
    { step: 'Reached Checkout', count: reachedCheckout, dropOffRate: addedToCart ? Math.round(((addedToCart - reachedCheckout) / addedToCart) * 100) : 0 },
    { step: 'Completed Purchase', count: withOrders, dropOffRate: reachedCheckout ? Math.round(((reachedCheckout - withOrders) / reachedCheckout) * 100) : 0 }
  ]
}

// 4. Cohort Retention (Mocked for now since DB is small)
export interface SACohortRow {
  cohortMonth: string
  totalCustomers: number
  retention: { month0: number, month1: number, month2: number | null, month3: number | null, month4: number | null, month5: number | null }
}
export function getCohortData(state: { customers: SACustomer[] }): SACohortRow[] {
  return []
}

// 5. Seller Growth
export interface SASellerGrowthPoint {
  month: string
  newSellers: number
  approvedSellers: number
  suspendedSellers: number
  cumulativeActive: number
}
export function getSellerGrowth(state: { sellers: SASeller[] }): SASellerGrowthPoint[] {
  return []
}

// 6. Product Health
export interface SAProductHealthMetrics {
  totalProducts: number
  approvalRate: number
  avgCompletenessScore: number
  avgTimeToApproval: number
  topCategories: { category: string; count: number; gmvShare: number }[]
  zeroSaleProducts: number
}
export function getProductHealth(state: { products: SAProduct[] }): SAProductHealthMetrics {
  const publishedCount = state.products.filter(p => p.status === 'published').length
  const total = state.products.length || 1

  return {
    totalProducts: state.products.length,
    approvalRate: Math.round((publishedCount / total) * 100),
    avgCompletenessScore: 0,
    avgTimeToApproval: 0,
    topCategories: [],
    zeroSaleProducts: 0
  }
}

// 7. Platform Health
export interface SAPlatformHealthScore {
  overall: number
  components: {
    orderFulfillmentRate: number
    sellerResponseRate: number
    paymentSuccessRate: number
    disputeResolutionRate: number
    reviewApprovalLag: number
  }
}
export function getPlatformHealth(): SAPlatformHealthScore {
  return {
    overall: 0,
    components: {
      orderFulfillmentRate: 0,
      sellerResponseRate: 0,
      paymentSuccessRate: 0,
      disputeResolutionRate: 0,
      reviewApprovalLag: 0
    }
  }
}
