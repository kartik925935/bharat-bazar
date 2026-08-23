// ─── Payout Calendar Mock Data ─────────────────────────────────────────────────
// All data sourced from this file — no hardcoding in the page

export type PayoutStatus = 'upcoming' | 'processing' | 'paid' | 'failed' | 'on_hold'

export interface PayoutCalendarEvent {
  id: string
  sellerId: string
  sellerName: string
  sellerType: string
  shopName: string
  amount: number
  scheduledDate: string
  processedDate?: string
  status: PayoutStatus
  bankName?: string
  accountLast4?: string
  utrNumber?: string
  failureReason?: string
  cycle: 'weekly' | 'biweekly' | 'monthly'
  ordersIncluded: number
}

export interface PayoutSummary {
  totalScheduled: number
  totalPaid: number
  totalFailed: number
  totalOnHold: number
  upcomingCount: number
  processingCount: number
  paidCount: number
  failedCount: number
}

const today = new Date()
const d = (offset: number, h = 10, m = 0) => {
  const dt = new Date(today)
  dt.setDate(dt.getDate() + offset)
  dt.setHours(h, m, 0, 0)
  return dt.toISOString()
}

export const MOCK_PAYOUT_CALENDAR: PayoutCalendarEvent[] = [
  { id: 'pc-001', sellerId: 'sel-001', sellerName: 'Priya Sharma', shopName: 'Priya Art Studio', sellerType: 'artisan', amount: 169280, scheduledDate: d(0, 10), processedDate: d(0, 10, 30), status: 'paid', bankName: 'SBI', accountLast4: '4821', utrNumber: 'UTR826341092', cycle: 'weekly', ordersIncluded: 12 },
  { id: 'pc-002', sellerId: 'sel-010', sellerName: 'Mohammed Rafiq', shopName: 'Kashmir Pashmina Co.', sellerType: 'village_producer', amount: 402320, scheduledDate: d(0, 11), status: 'processing', bankName: 'HDFC', accountLast4: '2209', cycle: 'biweekly', ordersIncluded: 28 },
  { id: 'pc-003', sellerId: 'sel-006', sellerName: 'Lakshmi Devi', shopName: 'Madhubani Masters', sellerType: 'ngo', amount: 304000, scheduledDate: d(-1, 14), processedDate: d(-1, 14, 22), status: 'paid', bankName: 'Canara', accountLast4: '7734', utrNumber: 'UTR826341088', cycle: 'monthly', ordersIncluded: 19 },
  { id: 'pc-004', sellerId: 'sel-002', sellerName: 'Rajesh Kumar', shopName: 'Rajasthani Weaves', sellerType: 'village_producer', amount: 196200, scheduledDate: d(-1, 9), processedDate: d(-1, 9, 45), status: 'paid', bankName: 'PNB', accountLast4: '3312', utrNumber: 'UTR826341080', cycle: 'weekly', ordersIncluded: 9 },
  { id: 'pc-005', sellerId: 'sel-003', sellerName: 'Sunita Patel', shopName: 'Clay & Fire Studio', sellerType: 'artisan', amount: 88200, scheduledDate: d(-2, 13), status: 'failed', bankName: 'Axis', accountLast4: '5567', failureReason: 'Account frozen by bank', cycle: 'weekly', ordersIncluded: 6 },
  { id: 'pc-006', sellerId: 'sel-004', sellerName: 'Arjun Nair', shopName: 'Tribal Gems', sellerType: 'artisan', amount: 132060, scheduledDate: d(1, 10), status: 'upcoming', bankName: 'ICICI', accountLast4: '9901', cycle: 'weekly', ordersIncluded: 7 },
  { id: 'pc-007', sellerId: 'sel-011', sellerName: 'Fatima Bibi', shopName: 'Chikankari Collective', sellerType: 'shg_group', amount: 264800, scheduledDate: d(1, 14), status: 'upcoming', bankName: 'SBI', accountLast4: '1188', cycle: 'biweekly', ordersIncluded: 21 },
  { id: 'pc-008', sellerId: 'sel-005', sellerName: 'Rekha Joshi', shopName: 'Thread & Needle', sellerType: 'artisan', amount: 218400, scheduledDate: d(2, 10), status: 'upcoming', bankName: 'Union Bank', accountLast4: '4455', cycle: 'weekly', ordersIncluded: 14 },
  { id: 'pc-009', sellerId: 'sel-012', sellerName: 'Dinesh Varma', shopName: 'Warli Wonders', sellerType: 'village_producer', amount: 56700, scheduledDate: d(2, 11), status: 'on_hold', bankName: 'BOI', accountLast4: '8823', failureReason: 'KYC re-verification pending', cycle: 'weekly', ordersIncluded: 4 },
  { id: 'pc-010', sellerId: 'sel-007', sellerName: 'Geeta Singh', shopName: 'Kondapalli Crafts', sellerType: 'artisan', amount: 94500, scheduledDate: d(3, 10), status: 'upcoming', bankName: 'HDFC', accountLast4: '6612', cycle: 'weekly', ordersIncluded: 5 },
  { id: 'pc-011', sellerId: 'sel-013', sellerName: 'Balu Reddy', shopName: 'Etikoppaka Toys', sellerType: 'village_producer', amount: 43200, scheduledDate: d(3, 15), status: 'upcoming', bankName: 'SBI', accountLast4: '3347', cycle: 'monthly', ordersIncluded: 3 },
  { id: 'pc-012', sellerId: 'sel-008', sellerName: 'Anjali Mehta', shopName: 'Bandhej Kendra', sellerType: 'artisan', amount: 178900, scheduledDate: d(5, 10), status: 'upcoming', bankName: 'Kotak', accountLast4: '2278', cycle: 'biweekly', ordersIncluded: 11 },
  { id: 'pc-013', sellerId: 'sel-009', sellerName: 'Suresh Nayak', shopName: 'Blue Pottery House', sellerType: 'artisan', amount: 92100, scheduledDate: d(5, 14), status: 'upcoming', bankName: 'SBI', accountLast4: '9901', cycle: 'weekly', ordersIncluded: 7 },
  { id: 'pc-014', sellerId: 'sel-014', sellerName: 'Hema Rani', shopName: 'Phulkari Art House', sellerType: 'ngo', amount: 345600, scheduledDate: d(7, 10), status: 'upcoming', bankName: 'Punjab Sind', accountLast4: '4491', cycle: 'monthly', ordersIncluded: 24 },
  { id: 'pc-015', sellerId: 'sel-015', sellerName: 'Ravi Shankar', shopName: 'Mysore Silk Palace', sellerType: 'shop_owner', amount: 512000, scheduledDate: d(7, 14), status: 'upcoming', bankName: 'Canara', accountLast4: '6634', cycle: 'monthly', ordersIncluded: 31 },
]

export const MOCK_PAYOUT_SUMMARY: PayoutSummary = {
  totalScheduled: MOCK_PAYOUT_CALENDAR.filter(e => e.status === 'upcoming').reduce((s, e) => s + e.amount, 0),
  totalPaid: MOCK_PAYOUT_CALENDAR.filter(e => e.status === 'paid').reduce((s, e) => s + e.amount, 0),
  totalFailed: MOCK_PAYOUT_CALENDAR.filter(e => e.status === 'failed').reduce((s, e) => s + e.amount, 0),
  totalOnHold: MOCK_PAYOUT_CALENDAR.filter(e => e.status === 'on_hold').reduce((s, e) => s + e.amount, 0),
  upcomingCount: MOCK_PAYOUT_CALENDAR.filter(e => e.status === 'upcoming').length,
  processingCount: MOCK_PAYOUT_CALENDAR.filter(e => e.status === 'processing').length,
  paidCount: MOCK_PAYOUT_CALENDAR.filter(e => e.status === 'paid').length,
  failedCount: MOCK_PAYOUT_CALENDAR.filter(e => e.status === 'failed' || e.status === 'on_hold').length,
}
