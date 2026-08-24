import type { SAAnalyticsMetric, SAChartData } from '@/types/super-admin.types'

// Cleared for Supabase migration — data will come from real backend

export const MOCK_DASHBOARD_METRICS: SAAnalyticsMetric[] = []
export const MOCK_CHART_DATA: SAChartData[] = []
export const MOCK_CATEGORY_BREAKDOWN: { category: string; value: number; percentage: number; color: string }[] = []

export interface DashboardTopSeller {
  id: string
  name: string
  shopName: string
  avatar?: string
  sales: number
  orders: number
  rating: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  trend: 'up' | 'down' | 'stable'
}

export const MOCK_TOP_SELLERS_DASHBOARD: DashboardTopSeller[] = []

export type ActivityType =
  | 'new_order' | 'new_seller' | 'seller_approved' | 'product_submitted'
  | 'kyc_submitted' | 'return_requested' | 'payment_completed' | 'customer_registered'
  | 'panel_request' | 'settlement_processed'

export interface DashboardActivity {
  id: string
  type: ActivityType
  message: string
  actorName: string
  timestamp: string
  metadata?: Record<string, string>
}

export const MOCK_RECENT_ACTIVITY: DashboardActivity[] = []

export const MOCK_SYSTEM_HEALTH = {
  apiStatus: 'operational' as const,
  dbStatus: 'operational' as const,
  paymentGatewayStatus: 'operational' as const,
  storageStatus: 'operational' as const,
  avgResponseTime: 0,
  uptimePercentage: 100,
}
