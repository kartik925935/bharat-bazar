// src/lib/mock/sa-analytics.mock.ts

export interface SARevenueDataPoint {
  date: string
  gmv: number
  platformRevenue: number
  commissions: number
  refunds: number
  netRevenue: number
}

export interface SACohortRow {
  cohortMonth: string
  totalCustomers: number
  retention: {
    month0: number
    month1: number
    month2: number | null
    month3: number | null
    month4: number | null
    month5: number | null
  }
}

export interface SAGeographicDataPoint {
  state: string
  stateCode: string
  orders: number
  gmv: number
  activeSellers: number
  activeCustomers: number
  avgOrderValue: number
}

export interface SAFunnelStep {
  step: string
  count: number
  dropOffRate: number
}

export interface SASellerGrowthPoint {
  month: string
  newSellers: number
  approvedSellers: number
  suspendedSellers: number
  cumulativeActive: number
}

export interface SAProductHealthMetrics {
  totalProducts: number
  approvalRate: number
  avgCompletenessScore: number
  avgTimeToApproval: number
  topCategories: { category: string; count: number; gmvShare: number }[]
  zeroSaleProducts: number
}

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

// Revenue time series — daily for last 90 days
export const MOCK_REVENUE_SERIES: SARevenueDataPoint[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(Date.now() - (89 - i) * 86400000)
  const baseGmv = 120000 + Math.sin(i / 7) * 30000 + i * 800
  const gmv = Math.round(baseGmv + (Math.random() - 0.5) * 20000)
  const commissions = Math.round(gmv * 0.1)
  const refunds = Math.round(gmv * 0.03)
  const platformRevenue = commissions - refunds
  return {
    date: date.toISOString().split('T')[0],
    gmv,
    platformRevenue,
    commissions,
    refunds,
    netRevenue: platformRevenue - Math.round(gmv * 0.005),
  }
})

export const MOCK_REVENUE_WEEKLY: SARevenueDataPoint[] = Array.from({ length: 12 }, (_, i) => {
  const weekStart = new Date(Date.now() - (11 - i) * 7 * 86400000)
  const gmv = Math.round(800000 + i * 15000 + (Math.random() - 0.5) * 80000)
  const commissions = Math.round(gmv * 0.1)
  const refunds = Math.round(gmv * 0.03)
  return {
    date: weekStart.toISOString().split('T')[0],
    gmv,
    platformRevenue: commissions - refunds,
    commissions,
    refunds,
    netRevenue: (commissions - refunds) - Math.round(gmv * 0.005),
  }
})

export const MOCK_REVENUE_MONTHLY: SARevenueDataPoint[] = Array.from({ length: 12 }, (_, i) => {
  const month = new Date(2024, i, 1)
  const gmv = Math.round(3000000 + i * 200000 + (Math.random() - 0.5) * 300000)
  const commissions = Math.round(gmv * 0.1)
  const refunds = Math.round(gmv * 0.03)
  return {
    date: month.toISOString().split('T')[0],
    gmv,
    platformRevenue: commissions - refunds,
    commissions,
    refunds,
    netRevenue: (commissions - refunds) - Math.round(gmv * 0.005),
  }
})

export const MOCK_COHORT_DATA: SACohortRow[] = [
  {
    cohortMonth: 'Aug 2024', totalCustomers: 312,
    retention: { month0: 100, month1: 68, month2: 51, month3: 41, month4: 35, month5: 31 },
  },
  {
    cohortMonth: 'Sep 2024', totalCustomers: 389,
    retention: { month0: 100, month1: 71, month2: 54, month3: 44, month4: 38, month5: 33 },
  },
  {
    cohortMonth: 'Oct 2024', totalCustomers: 445,
    retention: { month0: 100, month1: 74, month2: 58, month3: 47, month4: 41, month5: null },
  },
  {
    cohortMonth: 'Nov 2024', totalCustomers: 521,
    retention: { month0: 100, month1: 76, month2: 61, month3: 50, month4: null, month5: null },
  },
  {
    cohortMonth: 'Dec 2024', totalCustomers: 698,
    retention: { month0: 100, month1: 79, month2: 63, month3: null, month4: null, month5: null },
  },
  {
    cohortMonth: 'Jan 2025', totalCustomers: 534,
    retention: { month0: 100, month1: 72, month2: null, month3: null, month4: null, month5: null },
  },
]

export const MOCK_GEOGRAPHIC_DATA: SAGeographicDataPoint[] = [
  { state: 'Maharashtra', stateCode: 'MH', orders: 2341, gmv: 8420000, activeSellers: 58, activeCustomers: 3210, avgOrderValue: 3597 },
  { state: 'Delhi', stateCode: 'DL', orders: 1987, gmv: 7150000, activeSellers: 41, activeCustomers: 2780, avgOrderValue: 3600 },
  { state: 'Karnataka', stateCode: 'KA', orders: 1654, gmv: 5980000, activeSellers: 35, activeCustomers: 2341, avgOrderValue: 3616 },
  { state: 'Tamil Nadu', stateCode: 'TN', orders: 1432, gmv: 4870000, activeSellers: 29, activeCustomers: 1987, avgOrderValue: 3401 },
  { state: 'Uttar Pradesh', stateCode: 'UP', orders: 1289, gmv: 3920000, activeSellers: 67, activeCustomers: 1654, avgOrderValue: 3042 },
  { state: 'West Bengal', stateCode: 'WB', orders: 1102, gmv: 3540000, activeSellers: 44, activeCustomers: 1432, avgOrderValue: 3212 },
  { state: 'Rajasthan', stateCode: 'RJ', orders: 987, gmv: 3210000, activeSellers: 52, activeCustomers: 1102, avgOrderValue: 3253 },
  { state: 'Gujarat', stateCode: 'GJ', orders: 876, gmv: 2980000, activeSellers: 38, activeCustomers: 987, avgOrderValue: 3402 },
  { state: 'Madhya Pradesh', stateCode: 'MP', orders: 754, gmv: 2340000, activeSellers: 31, activeCustomers: 876, avgOrderValue: 3104 },
  { state: 'Kerala', stateCode: 'KL', orders: 698, gmv: 2180000, activeSellers: 22, activeCustomers: 754, avgOrderValue: 3124 },
  { state: 'Bihar', stateCode: 'BR', orders: 612, gmv: 1870000, activeSellers: 28, activeCustomers: 698, avgOrderValue: 3056 },
  { state: 'Odisha', stateCode: 'OD', orders: 534, gmv: 1640000, activeSellers: 19, activeCustomers: 612, avgOrderValue: 3071 },
  { state: 'Himachal Pradesh', stateCode: 'HP', orders: 312, gmv: 1120000, activeSellers: 14, activeCustomers: 412, avgOrderValue: 3590 },
  { state: 'Jharkhand', stateCode: 'JH', orders: 289, gmv: 890000, activeSellers: 16, activeCustomers: 356, avgOrderValue: 3080 },
  { state: 'Assam', stateCode: 'AS', orders: 234, gmv: 720000, activeSellers: 11, activeCustomers: 289, avgOrderValue: 3077 },
]

export const MOCK_FUNNEL_DATA: SAFunnelStep[] = [
  { step: 'Homepage Visit', count: 48920, dropOffRate: 0 },
  { step: 'Product Page View', count: 31400, dropOffRate: 35.8 },
  { step: 'Add to Cart', count: 12560, dropOffRate: 60.0 },
  { step: 'Checkout Started', count: 8940, dropOffRate: 28.8 },
  { step: 'Payment Initiated', count: 7230, dropOffRate: 19.1 },
  { step: 'Order Confirmed', count: 6890, dropOffRate: 4.7 },
]

export const MOCK_SELLER_GROWTH: SASellerGrowthPoint[] = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2024, i, 1).toLocaleString('default', { month: 'short', year: '2-digit' }),
  newSellers: Math.round(18 + i * 2.5 + (Math.random() - 0.5) * 8),
  approvedSellers: Math.round(14 + i * 2 + (Math.random() - 0.5) * 6),
  suspendedSellers: Math.round(1 + (Math.random() - 0.5) * 2),
  cumulativeActive: Math.round(120 + i * 18 + (Math.random() - 0.5) * 10),
}))

export const MOCK_PRODUCT_HEALTH: SAProductHealthMetrics = {
  totalProducts: 1847,
  approvalRate: 78.4,
  avgCompletenessScore: 81.2,
  avgTimeToApproval: 14.3,
  topCategories: [
    { category: 'Handicrafts', count: 412, gmvShare: 28.4 },
    { category: 'Textiles & Fabrics', count: 334, gmvShare: 22.1 },
    { category: 'Jewelry', count: 289, gmvShare: 18.9 },
    { category: 'Home Decor', count: 234, gmvShare: 15.2 },
    { category: 'Pottery & Ceramics', count: 187, gmvShare: 11.4 },
  ],
  zeroSaleProducts: 234,
}

export const MOCK_PLATFORM_HEALTH: SAPlatformHealthScore = {
  overall: 87,
  components: {
    orderFulfillmentRate: 94.2,
    sellerResponseRate: 88.7,
    paymentSuccessRate: 97.1,
    disputeResolutionRate: 82.4,
    reviewApprovalLag: 6.8,
  },
}
