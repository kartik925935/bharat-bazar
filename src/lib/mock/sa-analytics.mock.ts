// src/lib/mock/sa-analytics.mock.ts
// Cleared for Supabase migration — data will come from real backend

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

export const MOCK_REVENUE_SERIES: SARevenueDataPoint[] = []
export const MOCK_REVENUE_WEEKLY: SARevenueDataPoint[] = []
export const MOCK_REVENUE_MONTHLY: SARevenueDataPoint[] = []
export const MOCK_COHORT_DATA: SACohortRow[] = []
export const MOCK_GEOGRAPHIC_DATA: SAGeographicDataPoint[] = []
export const MOCK_FUNNEL_DATA: SAFunnelStep[] = []
export const MOCK_SELLER_GROWTH: SASellerGrowthPoint[] = []

export const MOCK_PRODUCT_HEALTH: SAProductHealthMetrics = {
  totalProducts: 0,
  approvalRate: 0,
  avgCompletenessScore: 0,
  avgTimeToApproval: 0,
  topCategories: [],
  zeroSaleProducts: 0,
}

export const MOCK_PLATFORM_HEALTH: SAPlatformHealthScore = {
  overall: 0,
  components: {
    orderFulfillmentRate: 0,
    sellerResponseRate: 0,
    paymentSuccessRate: 0,
    disputeResolutionRate: 0,
    reviewApprovalLag: 0,
  },
}
