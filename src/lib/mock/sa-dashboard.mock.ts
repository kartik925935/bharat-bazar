import type { SAAnalyticsMetric, SAChartData } from '@/types/super-admin.types'

// ============================================
// TOP METRIC CARDS
// ============================================
export const MOCK_DASHBOARD_METRICS: SAAnalyticsMetric[] = [
  { label: 'Total GMV', value: 4285600, change: 12.4, changeType: 'increase', period: 'vs last month' },
  { label: 'Total Orders', value: 8942, change: 8.1, changeType: 'increase', period: 'vs last month' },
  { label: 'Active Sellers', value: 342, change: 5.6, changeType: 'increase', period: 'vs last month' },
  { label: 'Active Customers', value: 15680, change: -2.3, changeType: 'decrease', period: 'vs last month' },
  { label: 'Pending Approvals', value: 27, change: 0, changeType: 'neutral', period: 'requires action' },
  { label: 'Platform Revenue', value: 428560, change: 15.2, changeType: 'increase', period: 'vs last month' },
]

// ============================================
// 30-DAY CHART DATA (generate programmatically)
// ============================================
export const MOCK_CHART_DATA: SAChartData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toISOString().split('T')[0],
    revenue: Math.floor(80000 + Math.random() * 60000 + i * 1500),
    orders: Math.floor(180 + Math.random() * 120 + i * 3),
    newCustomers: Math.floor(20 + Math.random() * 40),
    newSellers: Math.floor(1 + Math.random() * 8),
  }
})

// ============================================
// CATEGORY BREAKDOWN
// ============================================
export const MOCK_CATEGORY_BREAKDOWN = [
  { category: 'Textiles & Fabrics', value: 1250000, percentage: 29, color: '#FF7A00' },
  { category: 'Pottery & Ceramics', value: 890000, percentage: 21, color: '#F5C842' },
  { category: 'Jewelry', value: 780000, percentage: 18, color: '#22C55E' },
  { category: 'Handicrafts', value: 650000, percentage: 15, color: '#3B82F6' },
  { category: 'Home Decor', value: 420000, percentage: 10, color: '#A855F7' },
  { category: 'Others', value: 295600, percentage: 7, color: '#6B7280' },
]

// ============================================
// TOP SELLERS (for dashboard widget)
// ============================================
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

export const MOCK_TOP_SELLERS_DASHBOARD: DashboardTopSeller[] = [
  { id: 's1', name: 'Mohammad Ali', shopName: 'Ali Handicrafts', sales: 285000, orders: 342, rating: 4.8, tier: 'platinum', trend: 'up' },
  { id: 's2', name: 'Priya Devi', shopName: 'Rajasthani Threads', sales: 245000, orders: 298, rating: 4.7, tier: 'platinum', trend: 'up' },
  { id: 's3', name: 'Karan Weavers SHG', shopName: 'Karan Weavers', sales: 198000, orders: 256, rating: 4.6, tier: 'gold', trend: 'stable' },
  { id: 's4', name: 'Lakshmi Pottery NGO', shopName: 'Lakshmi Clayworks', sales: 176000, orders: 201, rating: 4.5, tier: 'gold', trend: 'up' },
  { id: 's5', name: 'Suresh Kumar', shopName: 'Kumar Brass Works', sales: 152000, orders: 187, rating: 4.4, tier: 'gold', trend: 'down' },
  { id: 's6', name: 'Meena Textiles', shopName: 'Meena Handloom', sales: 134000, orders: 165, rating: 4.6, tier: 'silver', trend: 'up' },
  { id: 's7', name: 'Village Craft Collective', shopName: 'VCC Artisans', sales: 118000, orders: 143, rating: 4.3, tier: 'silver', trend: 'stable' },
]

// ============================================
// LIVE ACTIVITY FEED
// ============================================
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

export const MOCK_RECENT_ACTIVITY: DashboardActivity[] = [
  { id: 'a1', type: 'new_order', message: 'placed a new order worth ₹2,450', actorName: 'Anjali Sharma', timestamp: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: 'a2', type: 'seller_approved', message: 'was approved as a new seller', actorName: 'Ramesh Pottery', timestamp: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: 'a3', type: 'kyc_submitted', message: 'submitted KYC documents for review', actorName: 'Village Craft Collective', timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 'a4', type: 'panel_request', message: 'requested access to Finance panel', actorName: 'Admin: Vikram Singh', timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: 'a5', type: 'return_requested', message: 'requested a return for Order #ORD-8821', actorName: 'Rohit Gupta', timestamp: new Date(Date.now() - 40 * 60000).toISOString() },
  { id: 'a6', type: 'product_submitted', message: 'submitted 3 new products for approval', actorName: 'Meena Handloom', timestamp: new Date(Date.now() - 55 * 60000).toISOString() },
  { id: 'a7', type: 'settlement_processed', message: 'settlement of ₹18,400 was processed', actorName: 'System', timestamp: new Date(Date.now() - 70 * 60000).toISOString() },
  { id: 'a8', type: 'customer_registered', message: 'joined the platform', actorName: 'Sunita Patel', timestamp: new Date(Date.now() - 90 * 60000).toISOString() },
]

// ============================================
// SYSTEM HEALTH SNAPSHOT
// ============================================
export const MOCK_SYSTEM_HEALTH = {
  apiStatus: 'operational' as const,
  dbStatus: 'operational' as const,
  paymentGatewayStatus: 'operational' as const,
  storageStatus: 'operational' as const,
  avgResponseTime: 142,
  uptimePercentage: 99.98,
}
