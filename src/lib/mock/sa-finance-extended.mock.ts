// ─── Commission Record ──────────────────────────────────────────────────────
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
export const MOCK_SA_COMMISSIONS: SACommissionRecord[] = [
  { id: 'com-001', sellerId: 'sel-001', sellerName: 'Priya Art Studio', orderId: 'BB-09342', orderAmount: 18500, commissionRate: 8, commissionAmount: 1480, category: 'Paintings', status: 'collected', createdAt: '2024-07-01T10:00:00Z' },
  { id: 'com-002', sellerId: 'sel-010', sellerName: 'Kashmir Pashmina Co.', orderId: 'BB-09341', orderAmount: 24800, commissionRate: 10, commissionAmount: 2480, category: 'Textiles', status: 'collected', createdAt: '2024-07-08T09:30:00Z' },
  { id: 'com-003', sellerId: 'sel-002', sellerName: 'Rajasthani Weaves', orderId: 'BB-09340', orderAmount: 4200, commissionRate: 10, commissionAmount: 420, category: 'Textiles', status: 'pending', createdAt: '2024-07-09T14:00:00Z' },
  { id: 'com-004', sellerId: 'sel-006', sellerName: 'Madhubani Masters', orderId: 'BB-09339', orderAmount: 8800, commissionRate: 8, commissionAmount: 704, category: 'Paintings', status: 'pending', createdAt: '2024-07-10T08:00:00Z' },
  { id: 'com-005', sellerId: 'sel-003', sellerName: 'Clay & Fire Studio', orderId: 'BB-09338', orderAmount: 3600, commissionRate: 12, commissionAmount: 432, category: 'Pottery', status: 'disputed', createdAt: '2024-07-02T11:00:00Z' },
  { id: 'com-006', sellerId: 'sel-005', sellerName: 'Thread & Needle', orderId: 'BB-09337', orderAmount: 12400, commissionRate: 10, commissionAmount: 1240, category: 'Textiles', status: 'collected', createdAt: '2024-06-28T13:00:00Z' },
  { id: 'com-007', sellerId: 'sel-004', sellerName: 'Tribal Gems', orderId: 'BB-09336', orderAmount: 5800, commissionRate: 12, commissionAmount: 696, category: 'Jewellery', status: 'pending', createdAt: '2024-07-11T09:00:00Z' },
  { id: 'com-008', sellerId: 'sel-008', sellerName: 'Bandhej Kendra', orderId: 'BB-09335', orderAmount: 2200, commissionRate: 10, commissionAmount: 220, category: 'Textiles', status: 'waived', createdAt: '2024-07-05T15:00:00Z' },
  { id: 'com-009', sellerId: 'sel-001', sellerName: 'Priya Art Studio', orderId: 'BB-09320', orderAmount: 9500, commissionRate: 8, commissionAmount: 760, category: 'Paintings', status: 'collected', createdAt: '2024-07-03T11:00:00Z' },
  { id: 'com-010', sellerId: 'sel-007', sellerName: 'Kondapalli Crafts', orderId: 'BB-09315', orderAmount: 6400, commissionRate: 12, commissionAmount: 768, category: 'Wooden Crafts', status: 'collected', createdAt: '2024-07-04T10:00:00Z' },
  { id: 'com-011', sellerId: 'sel-009', sellerName: 'Blue Pottery House', orderId: 'BB-09310', orderAmount: 3800, commissionRate: 12, commissionAmount: 456, category: 'Pottery', status: 'collected', createdAt: '2024-07-05T09:00:00Z' },
  { id: 'com-012', sellerId: 'sel-002', sellerName: 'Rajasthani Weaves', orderId: 'BB-09305', orderAmount: 7200, commissionRate: 10, commissionAmount: 720, category: 'Textiles', status: 'disputed', createdAt: '2024-07-06T14:00:00Z' },
]

export const MOCK_FINANCE_CHART: SAFinanceChartPoint[] = [
  { date: 'Jul 1', gmv: 3200000, commission: 320000, refunds: 48000, netRevenue: 272000 },
  { date: 'Jul 2', gmv: 4100000, commission: 410000, refunds: 62000, netRevenue: 348000 },
  { date: 'Jul 3', gmv: 3800000, commission: 380000, refunds: 55000, netRevenue: 325000 },
  { date: 'Jul 4', gmv: 5200000, commission: 520000, refunds: 74000, netRevenue: 446000 },
  { date: 'Jul 5', gmv: 6800000, commission: 680000, refunds: 92000, netRevenue: 588000 },
  { date: 'Jul 6', gmv: 7400000, commission: 740000, refunds: 108000, netRevenue: 632000 },
  { date: 'Jul 7', gmv: 8100000, commission: 810000, refunds: 115000, netRevenue: 695000 },
  { date: 'Jul 8', gmv: 6200000, commission: 620000, refunds: 88000, netRevenue: 532000 },
  { date: 'Jul 9', gmv: 5400000, commission: 540000, refunds: 78000, netRevenue: 462000 },
  { date: 'Jul 10', gmv: 4800000, commission: 480000, refunds: 69000, netRevenue: 411000 },
  { date: 'Jul 11', gmv: 7200000, commission: 720000, refunds: 98000, netRevenue: 622000 },
]

export const MOCK_PAYOUT_EVENTS: SAPayoutEvent[] = [
  { id: 'pay-001', sellerId: 'sel-001', sellerName: 'Priya Art Studio', amount: 169280, scheduledDate: new Date(Date.now() + 86400000).toISOString(), status: 'upcoming' },
  { id: 'pay-002', sellerId: 'sel-010', sellerName: 'Kashmir Pashmina Co.', amount: 402320, scheduledDate: new Date(Date.now() + 86400000).toISOString(), status: 'processing' },
  { id: 'pay-003', sellerId: 'sel-006', sellerName: 'Madhubani Masters', amount: 304000, scheduledDate: new Date(Date.now() - 86400000).toISOString(), status: 'paid' },
  { id: 'pay-004', sellerId: 'sel-002', sellerName: 'Rajasthani Weaves', amount: 196200, scheduledDate: new Date(Date.now() - 86400000).toISOString(), status: 'paid' },
  { id: 'pay-005', sellerId: 'sel-003', sellerName: 'Clay & Fire Studio', amount: 88200, scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString(), status: 'failed' },
  { id: 'pay-006', sellerId: 'sel-004', sellerName: 'Tribal Gems', amount: 132060, scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString(), status: 'upcoming' },
  { id: 'pay-007', sellerId: 'sel-005', sellerName: 'Thread & Needle', amount: 218400, scheduledDate: new Date(Date.now() + 86400000 * 5).toISOString(), status: 'upcoming' },
  { id: 'pay-008', sellerId: 'sel-007', sellerName: 'Kondapalli Crafts', amount: 94500, scheduledDate: new Date(Date.now() + 86400000 * 5).toISOString(), status: 'upcoming' },
]

export const MOCK_COMMISSION_RATES: { category: string; rate: number; sellerCount: number }[] = [
  { category: 'Paintings', rate: 8, sellerCount: 42 },
  { category: 'Textiles & Sarees', rate: 10, sellerCount: 118 },
  { category: 'Pottery & Ceramics', rate: 12, sellerCount: 34 },
  { category: 'Jewellery', rate: 12, sellerCount: 67 },
  { category: 'Wooden Crafts', rate: 12, sellerCount: 28 },
  { category: 'Leather Goods', rate: 10, sellerCount: 19 },
  { category: 'Stone Art', rate: 8, sellerCount: 12 },
  { category: 'Metal Craft', rate: 10, sellerCount: 23 },
]
