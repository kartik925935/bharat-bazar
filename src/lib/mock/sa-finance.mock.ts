import type { SAFinanceSummary, SASettlement, SACoupon } from '@/types/super-admin.types'

export const MOCK_SA_FINANCE_SUMMARY: SAFinanceSummary = {
  totalGMV: 428000000,
  totalRevenue: 38520000,
  totalCommission: 34120000,
  pendingSettlements: 12800000,
  completedSettlements: 312000000,
  totalRefunds: 4200000,
  periodGMV: 42800000,
  periodRevenue: 3852000,
}

export const MOCK_SA_SETTLEMENTS: SASettlement[] = [
  { id: 'set-001', sellerId: 'sel-001', sellerName: 'Priya Art Studio', amount: 184000, commission: 14720, netAmount: 169280, status: 'pending', ordersCount: 42, periodStart: '2024-07-01T00:00:00Z', periodEnd: '2024-07-07T23:59:59Z', createdAt: '2024-07-08T00:00:00Z' },
  { id: 'set-002', sellerId: 'sel-010', sellerName: 'Kashmir Pashmina Co.', amount: 428000, commission: 25680, netAmount: 402320, status: 'processing', ordersCount: 96, periodStart: '2024-07-01T00:00:00Z', periodEnd: '2024-07-07T23:59:59Z', createdAt: '2024-07-08T00:00:00Z' },
  { id: 'set-003', sellerId: 'sel-006', sellerName: 'Madhubani Masters', amount: 320000, commission: 16000, netAmount: 304000, status: 'completed', ordersCount: 78, periodStart: '2024-06-24T00:00:00Z', periodEnd: '2024-06-30T23:59:59Z', createdAt: '2024-07-01T00:00:00Z', paidAt: '2024-07-02T11:00:00Z' },
  { id: 'set-004', sellerId: 'sel-002', sellerName: 'Rajasthani Weaves', amount: 218000, commission: 21800, netAmount: 196200, status: 'completed', ordersCount: 54, periodStart: '2024-06-24T00:00:00Z', periodEnd: '2024-06-30T23:59:59Z', createdAt: '2024-07-01T00:00:00Z', paidAt: '2024-07-02T14:00:00Z' },
  { id: 'set-005', sellerId: 'sel-003', sellerName: 'Clay & Fire Studio', amount: 98000, commission: 9800, netAmount: 88200, status: 'failed', ordersCount: 28, periodStart: '2024-07-01T00:00:00Z', periodEnd: '2024-07-07T23:59:59Z', createdAt: '2024-07-08T00:00:00Z' },
  { id: 'set-006', sellerId: 'sel-004', sellerName: 'Tribal Gems', amount: 142000, commission: 9940, netAmount: 132060, status: 'pending', ordersCount: 36, periodStart: '2024-07-01T00:00:00Z', periodEnd: '2024-07-07T23:59:59Z', createdAt: '2024-07-08T00:00:00Z' },
]

export const MOCK_SA_COUPONS: SACoupon[] = [
  { id: 'coup-001', code: 'BHARAT20', type: 'percentage', value: 20, minOrder: 500, maxDiscount: 500, usageLimit: 10000, usageCount: 4820, userLimit: 2, status: 'active', startDate: '2024-07-01T00:00:00Z', endDate: '2024-07-31T23:59:59Z', createdBy: 'sa-001', createdAt: '2024-06-28T10:00:00Z', appliesTo: 'all' },
  { id: 'coup-002', code: 'ARTISAN50', type: 'fixed', value: 50, minOrder: 300, usageLimit: 5000, usageCount: 2100, userLimit: 1, status: 'active', startDate: '2024-07-01T00:00:00Z', endDate: '2024-08-31T23:59:59Z', createdBy: 'sa-001', createdAt: '2024-06-30T10:00:00Z', appliesTo: 'category' },
  { id: 'coup-003', code: 'INDEPENDENCE77', type: 'percentage', value: 15, minOrder: 1000, maxDiscount: 1000, usageLimit: 50000, usageCount: 0, userLimit: 3, status: 'inactive', startDate: '2024-08-10T00:00:00Z', endDate: '2024-08-18T23:59:59Z', createdBy: 'adm-002', createdAt: '2024-07-10T10:00:00Z', appliesTo: 'all' },
  { id: 'coup-004', code: 'WELCOME100', type: 'fixed', value: 100, minOrder: 499, usageLimit: 100000, usageCount: 18240, userLimit: 1, status: 'active', startDate: '2024-01-01T00:00:00Z', endDate: '2024-12-31T23:59:59Z', createdBy: 'sa-001', createdAt: '2023-12-28T10:00:00Z', appliesTo: 'all' },
  { id: 'coup-005', code: 'HOLI30', type: 'percentage', value: 30, minOrder: 800, maxDiscount: 300, usageLimit: 20000, usageCount: 19890, userLimit: 2, status: 'expired', startDate: '2024-03-20T00:00:00Z', endDate: '2024-03-26T23:59:59Z', createdBy: 'sa-001', createdAt: '2024-03-15T10:00:00Z', appliesTo: 'all' },
]
