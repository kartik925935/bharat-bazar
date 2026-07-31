// ─── SUPER ADMIN MOCK DATA ───────────────────────────────────────────────────
// All data here is mock / seed data for development.
// Replace with real API calls before going to production.

// ─── DASHBOARD: LIVE METRICS TICKER ──────────────────────────────────────────
export const MOCK_LIVE_TICKER = {
  ordersPerHour: 47,
  gmvToday: 423847,
  activeSessions: 1247,
  conversionRate: 3.2,
  avgOrderValue: 1847,
  newSellersToday: 8,
  pendingApprovals: 17,
};

// ─── DASHBOARD: KPI CARDS ────────────────────────────────────────────────────
export const MOCK_KPI_CARDS = {
  gmv: {
    value: 423847,
    growth: 18.4,
    target: 500000,
    targetLabel: '₹5.0L',
  },
  orders: {
    total: 234,
    growth: 12.1,
    active: 89,
    completed: 132,
    cancelled: 13,
  },
  activeUsers: {
    total: 1247,
    customers: 1089,
    sellers: 158,
    peak: 2341,
  },
  newRegistrations: {
    total: 147,
    growth: 24.8,
    customers: 139,
    sellers: 8,
  },
  commissionRevenue: {
    value: 42384,
    growth: 15.2,
    avgFeePercent: 10,
    monthTotal: 824291,
  },
  pendingActions: {
    total: 35,
    kyc: 8,
    products: 12,
    complaints: 10,
    sellers: 5,
  },
};

// ─── DASHBOARD: GMV TREND CHART ──────────────────────────────────────────────
export const MOCK_GMV_TREND = [
  { time: '00:00', current: 12000, previous: 9000 },
  { time: '04:00', current: 18000, previous: 14000 },
  { time: '08:00', current: 45000, previous: 32000 },
  { time: '12:00', current: 110000, previous: 85000 },
  { time: '16:00', current: 195000, previous: 160000 },
  { time: '20:00', current: 340000, previous: 280000 },
  { time: '23:59', current: 423847, previous: 358234 },
];

// ─── DASHBOARD: GMV WEEKLY TREND ─────────────────────────────────────────────
export const MOCK_WEEKLY_GMV = [
  { day: 'Mon', gmv: 312000, orders: 178 },
  { day: 'Tue', gmv: 287000, orders: 162 },
  { day: 'Wed', gmv: 423847, orders: 234 },
  { day: 'Thu', gmv: 356000, orders: 198 },
  { day: 'Fri', gmv: 489000, orders: 267 },
  { day: 'Sat', gmv: 521000, orders: 290 },
  { day: 'Sun', gmv: 398000, orders: 218 },
];

// ─── DASHBOARD: ORDER DISTRIBUTION ───────────────────────────────────────────
export const MOCK_ORDER_DISTRIBUTION = [
  { name: 'Delivered', value: 132, color: '#22C55E' },
  { name: 'In Transit', value: 89, color: '#3B82F6' },
  { name: 'Processing', value: 18, color: '#F59E0B' },
  { name: 'Cancelled', value: 13, color: '#EF4444' },
];

// ─── DASHBOARD: CATEGORY REVENUE BREAKDOWN ───────────────────────────────────
export const MOCK_CATEGORY_BREAKDOWN = [
  { category: 'Paintings & Art', revenue: 120000, pct: 28 },
  { category: 'Handloom & Textiles', revenue: 89000, pct: 21 },
  { category: 'Jewelry', revenue: 76000, pct: 18 },
  { category: 'Pottery & Ceramics', revenue: 54000, pct: 13 },
  { category: 'Organic Food', revenue: 48000, pct: 11 },
  { category: 'Home Decor', revenue: 38000, pct: 9 },
];

// ─── DASHBOARD: TOP SELLERS ───────────────────────────────────────────────────
export const MOCK_TOP_SELLERS_DASHBOARD = [
  { rank: 1, name: 'Ravi Kumar Crafts', shop: 'Jaipur Handicrafts', tier: 'Plat', orders: 234, revenue: 423000, rating: 4.9, badge: '🥇' },
  { rank: 2, name: 'Meera Textiles', shop: 'Varanasi Silks', tier: 'Gold', orders: 198, revenue: 389000, rating: 4.8, badge: '🥈' },
  { rank: 3, name: 'Kashmir Arts', shop: 'Pashmina House', tier: 'Plat', orders: 187, revenue: 321000, rating: 4.9, badge: '🥉' },
  { rank: 4, name: 'Jaipur Pottery', shop: 'Blue Pottery Co.', tier: 'Gold', orders: 164, revenue: 287000, rating: 4.7, badge: '4' },
  { rank: 5, name: 'Bengal Weavers', shop: 'Tant Sarees', tier: 'Silv', orders: 143, revenue: 234000, rating: 4.6, badge: '5' },
];

// ─── DASHBOARD: PENDING APPROVAL QUEUE ───────────────────────────────────────
export const MOCK_PENDING_QUEUE = [
  { id: 'sel-1', name: 'Ali Handicrafts', type: 'Artisan', location: 'Jaipur', waitDays: 2, status: 'urgent' },
  { id: 'sel-2', name: 'South Weavers Co.', type: 'Cooperative', location: 'Kanchipuram', waitDays: 1, status: 'normal' },
  { id: 'sel-3', name: 'Organic Spices Hub', type: 'Farmer Self-Help', location: 'Kerala', waitDays: 3, status: 'urgent' },
];

// ─── DASHBOARD: RECENT ACTIVITY LOG ──────────────────────────────────────────
export const MOCK_RECENT_ACTIVITY = [
  { id: 1, time: '2 min ago', actor: 'Admin Raj', action: 'Approved', target: 'Seller "Meera Crafts"', color: '#22C55E' },
  { id: 2, time: '5 min ago', actor: 'System', action: 'Flagged', target: 'Product "Pottery Set" (duplicate)', color: '#F59E0B' },
  { id: 3, time: '8 min ago', actor: 'Admin Priya', action: 'Rejected', target: 'KYC for "Fast Handmade"', color: '#EF4444' },
  { id: 4, time: '15 min ago', actor: 'Customer', action: 'Complaint', target: 'Order #BB-2025-78234', color: '#EF4444' },
  { id: 5, time: '22 min ago', actor: 'Payment', action: 'Completed', target: 'Settlement ₹1,84,000', color: '#3B82F6' },
];

// ─── DASHBOARD: SYSTEM HEALTH ─────────────────────────────────────────────────
export const MOCK_SYSTEM_HEALTH = [
  { name: 'API Server', metric: '124ms', status: '99.97% Uptime', ok: true },
  { name: 'Database', metric: '1,247 q/s', status: '8ms Latency', ok: true },
  { name: 'Payment Gateway', metric: '98.4%', status: 'Success Rate', ok: true },
  { name: 'Email Delivery', metric: '2,341/day', status: '0.5% Bounce', ok: true },
  { name: 'Cloud Storage', metric: '234GB', status: '23% Used', ok: true },
  { name: 'CDN Edge', metric: '94.2%', status: 'Cache Hit Rate', ok: true },
];

// ─── DASHBOARD: QUICK STATS (below chart) ────────────────────────────────────
export const MOCK_CHART_QUICK_STATS = {
  totalVolume: '₹42.3L',
  totalOrders: 234,
  avgOrderValue: '₹1,847',
  peakHourRate: '₹47K/hr',
};

// ─── LAYOUT: LIVE HEADER STATS (starting values for real-time simulation) ────
export const MOCK_LAYOUT_LIVE_STATS = {
  ordersToday: 234,
  gmv: 423847,
  activeUsers: 1247,
};

// ─── LAYOUT: CRITICAL ALERTS ─────────────────────────────────────────────────
export const MOCK_ALERTS = [
  { id: 1, type: 'critical', title: 'Payment gateway timeout spike', time: '2 min ago', desc: 'Razorpay gateway latency elevated to >450ms. 3 retries triggered.' },
  { id: 2, type: 'warning', title: 'Seller "Ali Crafts" flagged', time: '5 min ago', desc: 'Multiple customer reports received regarding counterfeit claims.' },
  { id: 3, type: 'warning', title: '5 products pending >48h review', time: '1 hr ago', desc: 'Review queue bottleneck in Handicraft category.' },
  { id: 4, type: 'info', title: 'Daily settlement processed ₹2.4L', time: '2 hr ago', desc: 'Automated batch payout completed for 34 verified sellers.' },
  { id: 5, type: 'success', title: '24 new seller approvals today', time: '3 hr ago', desc: 'Record high seller onboarding for Rajasthan regional cluster.' },
];

// ─── SELLERS PAGE ─────────────────────────────────────────────────────────────
export interface MockSeller {
  id: string;
  name: string;
  shop: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  totalOrders: number;
  gmv: number;
  rating: number;
  joinedDate: string;
  kycStatus: 'verified' | 'pending' | 'rejected';
  products: number;
}

export const MOCK_SELLERS = [
  { id: 'sel-001', name: 'Ravi Kumar', shop: 'Jaipur Handicrafts', email: 'ravi@jaipurcraft.com', phone: '+91 98765 43210', location: 'Jaipur, Rajasthan', category: 'Handicrafts', status: 'active', tier: 'Platinum', totalOrders: 2340, gmv: 4230000, rating: 4.9, joinedDate: '2023-03-15', kycStatus: 'verified', products: 89 },
  { id: 'sel-002', name: 'Meera Sharma', shop: 'Varanasi Silks', email: 'meera@varanasisilks.in', phone: '+91 91234 56789', location: 'Varanasi, UP', category: 'Textiles', status: 'active', tier: 'Gold', totalOrders: 1980, gmv: 3890000, rating: 4.8, joinedDate: '2023-05-20', kycStatus: 'verified', products: 67 },
  { id: 'sel-003', name: 'Abdul Rahman', shop: 'Kashmir Arts', email: 'ali@kashmirarts.com', phone: '+91 94567 89012', location: 'Srinagar, J&K', category: 'Pashmina', status: 'pending', tier: 'Gold', totalOrders: 890, gmv: 1240000, rating: 4.7, joinedDate: '2024-01-10', kycStatus: 'pending', products: 34 },
  { id: 'sel-004', name: 'Sunita Devi', shop: 'Blue Pottery Co.', email: 'sunita@bluepottery.in', phone: '+91 87654 32109', location: 'Jaipur, Rajasthan', category: 'Pottery', status: 'active', tier: 'Silver', totalOrders: 645, gmv: 720000, rating: 4.6, joinedDate: '2023-09-01', kycStatus: 'verified', products: 28 },
  { id: 'sel-005', name: 'Priya Banerjee', shop: 'Tant Sarees', email: 'priya@tantsaree.com', phone: '+91 99887 76655', location: 'Kolkata, WB', category: 'Textiles', status: 'active', tier: 'Silver', totalOrders: 432, gmv: 560000, rating: 4.5, joinedDate: '2024-02-28', kycStatus: 'verified', products: 52 },
  { id: 'sel-006', name: 'Govind Patel', shop: 'Organic Spices Hub', email: 'govind@organicspices.com', phone: '+91 78900 11223', location: 'Kochi, Kerala', category: 'Organic Food', status: 'pending', tier: 'Bronze', totalOrders: 0, gmv: 0, rating: 0, joinedDate: '2025-01-15', kycStatus: 'pending', products: 12 },
  { id: 'sel-007', name: 'Fatima Noor', shop: 'Lucknow Chikan', email: 'fatima@lucknowchikan.com', phone: '+91 96543 21098', location: 'Lucknow, UP', category: 'Textiles', status: 'suspended', tier: 'Silver', totalOrders: 234, gmv: 312000, rating: 3.9, joinedDate: '2023-07-11', kycStatus: 'verified', products: 19 },
  { id: 'sel-008', name: 'Arjun Nair', shop: 'Kerala Bamboo Craft', email: 'arjun@keralabamboo.in', phone: '+91 80012 34567', location: 'Thrissur, Kerala', category: 'Handicrafts', status: 'active', tier: 'Bronze', totalOrders: 187, gmv: 145000, rating: 4.4, joinedDate: '2024-04-05', kycStatus: 'verified', products: 15 },
];

// ─── CUSTOMERS PAGE ───────────────────────────────────────────────────────────
export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'suspended' | 'blocked';
  totalOrders: number;
  totalSpent: number;
  tier: 'Gold' | 'Silver' | 'Bronze' | 'New';
  joinedDate: string;
  lastActive: string;
}

export const MOCK_CUSTOMERS = [
  { id: 'cust-001', name: 'Anjali Singh', email: 'anjali@gmail.com', phone: '+91 98765 11111', location: 'Mumbai, MH', status: 'active', totalOrders: 47, totalSpent: 128000, tier: 'Gold', joinedDate: '2022-11-10', lastActive: '2025-01-14' },
  { id: 'cust-002', name: 'Rahul Mehta', email: 'rahul.m@yahoo.com', phone: '+91 87654 22222', location: 'Delhi, DL', status: 'active', totalOrders: 32, totalSpent: 87000, tier: 'Gold', joinedDate: '2023-01-25', lastActive: '2025-01-15' },
  { id: 'cust-003', name: 'Sonal Joshi', email: 'sonal.j@hotmail.com', phone: '+91 76543 33333', location: 'Pune, MH', status: 'active', totalOrders: 18, totalSpent: 34000, tier: 'Silver', joinedDate: '2023-06-12', lastActive: '2025-01-10' },
  { id: 'cust-004', name: 'Karan Malhotra', email: 'karan.m@gmail.com', phone: '+91 65432 44444', location: 'Bengaluru, KA', status: 'suspended', totalOrders: 5, totalSpent: 8900, tier: 'Bronze', joinedDate: '2024-03-18', lastActive: '2024-12-01' },
  { id: 'cust-005', name: 'Nisha Patel', email: 'nisha.p@email.com', phone: '+91 54321 55555', location: 'Ahmedabad, GJ', status: 'active', totalOrders: 89, totalSpent: 245000, tier: 'Gold', joinedDate: '2022-05-30', lastActive: '2025-01-15' },
  { id: 'cust-006', name: 'Vikram Reddy', email: 'vikram.r@gmail.com', phone: '+91 43210 66666', location: 'Hyderabad, TS', status: 'active', totalOrders: 12, totalSpent: 18500, tier: 'Silver', joinedDate: '2024-08-22', lastActive: '2025-01-13' },
  { id: 'cust-007', name: 'Pooja Iyer', email: 'pooja.i@gmail.com', phone: '+91 32109 77777', location: 'Chennai, TN', status: 'blocked', totalOrders: 2, totalSpent: 2100, tier: 'New', joinedDate: '2024-11-05', lastActive: '2024-11-20' },
  { id: 'cust-008', name: 'Amit Sharma', email: 'amit.sharma@gmail.com', phone: '+91 21098 88888', location: 'Jaipur, RJ', status: 'active', totalOrders: 63, totalSpent: 167000, tier: 'Gold', joinedDate: '2023-02-14', lastActive: '2025-01-14' },
];

// ─── ORDERS PAGE ──────────────────────────────────────────────────────────────
export interface MockAdminOrder {
  id: string;
  orderNo: string;
  customer: string;
  seller: string;
  amount: number;
  commission: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  date: string;
  items: number;
  category: string;
}

export const MOCK_ADMIN_ORDERS = [
  { id: 'ord-001', orderNo: 'BB-2025-78234', customer: 'Anjali Singh', seller: 'Jaipur Handicrafts', amount: 4500, commission: 450, status: 'delivered', paymentStatus: 'paid', date: '2025-01-14', items: 3, category: 'Handicrafts' },
  { id: 'ord-002', orderNo: 'BB-2025-78235', customer: 'Rahul Mehta', seller: 'Varanasi Silks', amount: 8900, commission: 890, status: 'shipped', paymentStatus: 'paid', date: '2025-01-15', items: 1, category: 'Textiles' },
  { id: 'ord-003', orderNo: 'BB-2025-78236', customer: 'Sonal Joshi', seller: 'Blue Pottery Co.', amount: 2300, commission: 230, status: 'processing', paymentStatus: 'paid', date: '2025-01-15', items: 2, category: 'Pottery' },
  { id: 'ord-004', orderNo: 'BB-2025-78237', customer: 'Karan Malhotra', seller: 'Tant Sarees', amount: 5600, commission: 560, status: 'cancelled', paymentStatus: 'refunded', date: '2025-01-13', items: 1, category: 'Textiles' },
  { id: 'ord-005', orderNo: 'BB-2025-78238', customer: 'Nisha Patel', seller: 'Jaipur Handicrafts', amount: 12400, commission: 1240, status: 'delivered', paymentStatus: 'paid', date: '2025-01-12', items: 5, category: 'Handicrafts' },
  { id: 'ord-006', orderNo: 'BB-2025-78239', customer: 'Vikram Reddy', seller: 'Kashmir Arts', amount: 18900, commission: 1890, status: 'pending', paymentStatus: 'pending', date: '2025-01-15', items: 2, category: 'Pashmina' },
  { id: 'ord-007', orderNo: 'BB-2025-78240', customer: 'Amit Sharma', seller: 'Kerala Bamboo Craft', amount: 1800, commission: 180, status: 'delivered', paymentStatus: 'paid', date: '2025-01-11', items: 4, category: 'Handicrafts' },
];

// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────
export interface MockAdminProduct {
  id: string;
  name: string;
  seller: string;
  category: string;
  price: number;
  stock: number;
  status: 'approved' | 'pending' | 'flagged' | 'rejected';
  submittedDate: string;
  sales: number;
  rating: number;
  flagReason?: string;
}

export const MOCK_ADMIN_PRODUCTS = [
  { id: 'prod-001', name: 'Rajasthani Blue Pottery Vase', seller: 'Blue Pottery Co.', category: 'Pottery', price: 2300, stock: 15, status: 'approved', submittedDate: '2025-01-10', sales: 89, rating: 4.7 },
  { id: 'prod-002', name: 'Pashmina Kashmir Shawl', seller: 'Kashmir Arts', category: 'Pashmina', price: 12000, stock: 8, status: 'pending', submittedDate: '2025-01-14', sales: 0, rating: 0 },
  { id: 'prod-003', name: 'Varanasi Silk Saree', seller: 'Varanasi Silks', category: 'Textiles', price: 8900, stock: 23, status: 'flagged', submittedDate: '2025-01-12', sales: 12, rating: 4.2, flagReason: 'Duplicate listing detected by system' },
  { id: 'prod-004', name: 'Madhubani Painting Set', seller: 'Jaipur Handicrafts', category: 'Art', price: 4500, stock: 5, status: 'approved', submittedDate: '2025-01-08', sales: 234, rating: 4.9 },
  { id: 'prod-005', name: 'Organic Kerala Spice Kit', seller: 'Organic Spices Hub', category: 'Food', price: 850, stock: 200, status: 'pending', submittedDate: '2025-01-15', sales: 0, rating: 0 },
  { id: 'prod-006', name: 'Bamboo Lamp Shade', seller: 'Kerala Bamboo Craft', category: 'Home Decor', price: 1800, stock: 31, status: 'approved', submittedDate: '2025-01-07', sales: 45, rating: 4.5 },
  { id: 'prod-007', name: 'Chikankari Kurta Set', seller: 'Lucknow Chikan', category: 'Textiles', price: 3200, stock: 0, status: 'rejected', submittedDate: '2025-01-09', sales: 0, rating: 0, flagReason: 'KYC not verified for seller' },
];

// ─── KYC PAGE ─────────────────────────────────────────────────────────────────
export interface MockKycRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  shop: string;
  submittedDate: string;
  documentType: 'Aadhaar + PAN' | 'GST + PAN' | 'Passport + PAN';
  status: 'pending' | 'approved' | 'rejected';
  waitDays: number;
  panNumber: string;
  gstNumber?: string;
  bankAccount: string;
}

export const MOCK_KYC_REQUESTS = [
  { id: 'kyc-001', sellerId: 'sel-003', sellerName: 'Abdul Rahman', shop: 'Kashmir Arts', submittedDate: '2025-01-13', documentType: 'Aadhaar + PAN', status: 'pending', waitDays: 2, panNumber: 'ABRXX1234X', gstNumber: '01ABRXX1234X1Z5', bankAccount: '****4521' },
  { id: 'kyc-002', sellerId: 'sel-006', sellerName: 'Govind Patel', shop: 'Organic Spices Hub', submittedDate: '2025-01-12', documentType: 'GST + PAN', status: 'pending', waitDays: 3, panNumber: 'GPXXG5678Y', gstNumber: '32GPXXG5678Y1Z8', bankAccount: '****8832' },
  { id: 'kyc-003', sellerId: 'sel-009', sellerName: 'Deepa Nair', shop: 'Coconut Crafts', submittedDate: '2025-01-11', documentType: 'Aadhaar + PAN', status: 'pending', waitDays: 4, panNumber: 'DNXXX9012Z', bankAccount: '****2201' },
  { id: 'kyc-004', sellerId: 'sel-001', sellerName: 'Ravi Kumar', shop: 'Jaipur Handicrafts', submittedDate: '2024-12-01', documentType: 'GST + PAN', status: 'approved', waitDays: 0, panNumber: 'RKUXX3456A', gstNumber: '08RKUXX3456A1Z2', bankAccount: '****6611' },
];

// ─── COMPLAINTS PAGE ──────────────────────────────────────────────────────────
export interface MockComplaint {
  id: string;
  ticketNo: string;
  customer: string;
  seller: string;
  orderNo: string;
  subject: string;
  description: string;
  status: 'open' | 'in_review' | 'resolved' | 'escalated';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  createdDate: string;
  amount: number;
}

export const MOCK_COMPLAINTS = [
  { id: 'cmp-001', ticketNo: 'TKT-2025-0892', customer: 'Anjali Singh', seller: 'Varanasi Silks', orderNo: 'BB-2025-78200', subject: 'Product quality mismatch', description: 'Received product does not match photos. Fabric quality is poor.', status: 'open', priority: 'urgent', createdDate: '2025-01-14', amount: 8900 },
  { id: 'cmp-002', ticketNo: 'TKT-2025-0893', customer: 'Rahul Mehta', seller: 'Kashmir Arts', orderNo: 'BB-2025-78189', subject: 'Item not delivered after 14 days', description: 'Tracking shows no movement for 7 days.', status: 'in_review', priority: 'high', createdDate: '2025-01-13', amount: 12000 },
  { id: 'cmp-003', ticketNo: 'TKT-2025-0888', customer: 'Nisha Patel', seller: 'Jaipur Handicrafts', orderNo: 'BB-2025-78150', subject: 'Wrong item received', description: 'Ordered blue pottery vase but received a different pattern.', status: 'resolved', priority: 'medium', createdDate: '2025-01-10', amount: 2300 },
  { id: 'cmp-004', ticketNo: 'TKT-2025-0890', customer: 'Sonal Joshi', seller: 'Tant Sarees', orderNo: 'BB-2025-78201', subject: 'Refund not processed after 10 days', description: 'Cancelled order but refund not received.', status: 'escalated', priority: 'urgent', createdDate: '2025-01-12', amount: 5600 },
  { id: 'cmp-005', ticketNo: 'TKT-2025-0891', customer: 'Vikram Reddy', seller: 'Kerala Bamboo Craft', orderNo: 'BB-2025-78210', subject: 'Damaged product received', description: 'Lamp shade arrived broken. Photos attached.', status: 'open', priority: 'medium', createdDate: '2025-01-15', amount: 1800 },
];

// ─── PAYMENTS / TRANSACTIONS PAGE ────────────────────────────────────────────
export interface MockTransaction {
  id: string;
  transactionId: string;
  orderId: string;
  customer: string;
  amount: number;
  commission: number;
  sellerPayout: number;
  gateway: 'Razorpay' | 'Paytm' | 'UPI' | 'Net Banking' | 'COD';
  status: 'success' | 'pending' | 'failed' | 'refunded';
  date: string;
}

export const MOCK_SUPER_ADMIN_TRANSACTIONS = [
  { id: 'txn-001', transactionId: 'pay_RZP892734', orderId: 'BB-2025-78234', customer: 'Anjali Singh', amount: 4500, commission: 450, sellerPayout: 4050, gateway: 'Razorpay', status: 'success', date: '2025-01-14' },
  { id: 'txn-002', transactionId: 'pay_RZP892891', orderId: 'BB-2025-78235', customer: 'Rahul Mehta', amount: 8900, commission: 890, sellerPayout: 8010, gateway: 'UPI', status: 'success', date: '2025-01-15' },
  { id: 'txn-003', transactionId: 'pay_PTM123456', orderId: 'BB-2025-78237', customer: 'Karan Malhotra', amount: 5600, commission: 0, sellerPayout: 0, gateway: 'Paytm', status: 'refunded', date: '2025-01-13' },
  { id: 'txn-004', transactionId: 'pay_NB009912', orderId: 'BB-2025-78238', customer: 'Nisha Patel', amount: 12400, commission: 1240, sellerPayout: 11160, gateway: 'Net Banking', status: 'success', date: '2025-01-12' },
  { id: 'txn-005', transactionId: 'pay_RZP009001', orderId: 'BB-2025-78239', customer: 'Vikram Reddy', amount: 18900, commission: 0, sellerPayout: 0, gateway: 'Razorpay', status: 'pending', date: '2025-01-15' },
  { id: 'txn-006', transactionId: 'pay_UPI441290', orderId: 'BB-2025-78240', customer: 'Amit Sharma', amount: 1800, commission: 180, sellerPayout: 1620, gateway: 'UPI', status: 'success', date: '2025-01-11' },
  { id: 'txn-007', transactionId: 'pay_RZP882100', orderId: 'BB-2025-78201', customer: 'Karan Malhotra', amount: 3200, commission: 0, sellerPayout: 0, gateway: 'Razorpay', status: 'failed', date: '2025-01-09' },
];

// ─── SETTLEMENTS PAGE ─────────────────────────────────────────────────────────
export interface MockSettlement {
  id: string;
  settlementId: string;
  seller: string;
  shop: string;
  amount: number;
  orders: number;
  commission: number;
  netPayout: number;
  status: 'completed' | 'pending' | 'processing' | 'failed';
  dueDate: string;
  paidDate?: string;
  bankAccount: string;
}

export const MOCK_SETTLEMENTS = [
  { id: 'stl-001', settlementId: 'STL-2025-0089', seller: 'Ravi Kumar', shop: 'Jaipur Handicrafts', amount: 182000, orders: 45, commission: 18200, netPayout: 163800, status: 'completed', dueDate: '2025-01-14', paidDate: '2025-01-14', bankAccount: '****6611' },
  { id: 'stl-002', settlementId: 'STL-2025-0090', seller: 'Meera Sharma', shop: 'Varanasi Silks', amount: 145000, orders: 38, commission: 14500, netPayout: 130500, status: 'completed', dueDate: '2025-01-14', paidDate: '2025-01-14', bankAccount: '****8823' },
  { id: 'stl-003', settlementId: 'STL-2025-0091', seller: 'Sunita Devi', shop: 'Blue Pottery Co.', amount: 67000, orders: 21, commission: 6700, netPayout: 60300, status: 'pending', dueDate: '2025-01-16', bankAccount: '****4521' },
  { id: 'stl-004', settlementId: 'STL-2025-0092', seller: 'Priya Banerjee', shop: 'Tant Sarees', amount: 43000, orders: 14, commission: 4300, netPayout: 38700, status: 'processing', dueDate: '2025-01-16', bankAccount: '****7732' },
  { id: 'stl-005', settlementId: 'STL-2025-0088', seller: 'Arjun Nair', shop: 'Kerala Bamboo Craft', amount: 21000, orders: 9, commission: 2100, netPayout: 18900, status: 'failed', dueDate: '2025-01-13', bankAccount: '****1199' },
];

// ─── COMMISSIONS PAGE ─────────────────────────────────────────────────────────
export const MOCK_COMMISSION_RATES = [
  { category: 'Handicrafts & Art', rate: 10, minFee: 20, maxFee: 2000, description: 'All handcrafted items, paintings, sculptures' },
  { category: 'Textiles & Apparel', rate: 8, minFee: 15, maxFee: 1500, description: 'Sarees, kurtas, fabrics, handloom products' },
  { category: 'Jewelry & Accessories', rate: 12, minFee: 30, maxFee: 3000, description: 'Gold, silver, artificial, handmade jewelry' },
  { category: 'Organic Food & Spices', rate: 6, minFee: 10, maxFee: 500, description: 'Organic produce, spices, dry fruits' },
  { category: 'Home Decor & Furniture', rate: 9, minFee: 25, maxFee: 2500, description: 'Furniture, décor, lamps, rugs' },
  { category: 'Pottery & Ceramics', rate: 10, minFee: 20, maxFee: 1000, description: 'All clay and ceramic products' },
];

export const MOCK_COMMISSION_STATS = {
  totalCollected: 824291,
  mtdGrowth: 18.4,
  avgRate: 9.6,
  topCategory: 'Jewelry & Accessories',
  pendingPayouts: 142000,
  platformCut: 15,
};

// ─── ADMINS PAGE ──────────────────────────────────────────────────────────────
export interface MockAdmin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'platform_admin' | 'support_agent' | 'finance_admin' | 'content_moderator';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
  createdDate: string;
  twoFaEnabled: boolean;
}

export const MOCK_ADMINS = [
  { id: 'adm-001', name: 'Platform Root', email: 'admin@bharatbazaar.com', role: 'super_admin', status: 'active', lastLogin: '2025-01-15 22:10', permissions: ['all'], createdDate: '2022-01-01', twoFaEnabled: true },
  { id: 'adm-002', name: 'Rajesh Verma', email: 'rajesh.v@bharatbazaar.com', role: 'platform_admin', status: 'active', lastLogin: '2025-01-15 18:45', permissions: ['sellers', 'products', 'kyc', 'orders'], createdDate: '2023-03-15', twoFaEnabled: true },
  { id: 'adm-003', name: 'Priya Kapoor', email: 'priya.k@bharatbazaar.com', role: 'support_agent', status: 'active', lastLogin: '2025-01-15 16:30', permissions: ['complaints', 'orders', 'customers'], createdDate: '2023-07-01', twoFaEnabled: false },
  { id: 'adm-004', name: 'Sanjay Gupta', email: 'sanjay.g@bharatbazaar.com', role: 'finance_admin', status: 'active', lastLogin: '2025-01-14 09:15', permissions: ['payments', 'settlements', 'commissions', 'reports'], createdDate: '2023-09-20', twoFaEnabled: true },
  { id: 'adm-005', name: 'Neha Tiwari', email: 'neha.t@bharatbazaar.com', role: 'content_moderator', status: 'inactive', lastLogin: '2025-01-10 11:00', permissions: ['products', 'categories'], createdDate: '2024-01-10', twoFaEnabled: false },
];

// ─── AUDIT LOGS PAGE ──────────────────────────────────────────────────────────
export interface MockAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  severity: 'critical' | 'warning' | 'info';
}

export const MOCK_AUDIT_LOGS = [
  { id: 'log-001', timestamp: '2025-01-15 22:08:34', actor: 'admin@bharatbazaar.com', role: 'super_admin', action: 'UPDATE', resource: 'Platform Settings', resourceId: 'settings-global', ipAddress: '192.168.1.1', severity: 'warning' },
  { id: 'log-002', timestamp: '2025-01-15 18:45:12', actor: 'rajesh.v@bharatbazaar.com', role: 'platform_admin', action: 'APPROVE', resource: 'Seller KYC', resourceId: 'kyc-004', ipAddress: '103.45.67.89', severity: 'info' },
  { id: 'log-003', timestamp: '2025-01-15 16:30:05', actor: 'priya.k@bharatbazaar.com', role: 'support_agent', action: 'RESOLVE', resource: 'Complaint', resourceId: 'cmp-003', ipAddress: '202.134.56.78', severity: 'info' },
  { id: 'log-004', timestamp: '2025-01-15 14:22:59', actor: 'sanjay.g@bharatbazaar.com', role: 'finance_admin', action: 'PROCESS', resource: 'Settlement', resourceId: 'stl-002', ipAddress: '117.220.45.12', severity: 'info' },
  { id: 'log-005', timestamp: '2025-01-15 11:10:41', actor: 'rajesh.v@bharatbazaar.com', role: 'platform_admin', action: 'SUSPEND', resource: 'Seller', resourceId: 'sel-007', ipAddress: '103.45.67.89', severity: 'critical' },
  { id: 'log-006', timestamp: '2025-01-15 09:05:18', actor: 'admin@bharatbazaar.com', role: 'super_admin', action: 'CREATE', resource: 'Admin User', resourceId: 'adm-005', ipAddress: '192.168.1.1', severity: 'warning' },
  { id: 'log-007', timestamp: '2025-01-14 20:55:03', actor: 'priya.k@bharatbazaar.com', role: 'support_agent', action: 'ESCALATE', resource: 'Complaint', resourceId: 'cmp-004', ipAddress: '202.134.56.78', severity: 'critical' },
];

// ─── ANALYTICS: REVENUE ───────────────────────────────────────────────────────
export const MOCK_MONTHLY_REVENUE = [
  { month: 'Aug', gmv: 2100000, commission: 189000 },
  { month: 'Sep', gmv: 2450000, commission: 220500 },
  { month: 'Oct', gmv: 3100000, commission: 279000 },
  { month: 'Nov', gmv: 4200000, commission: 378000 },
  { month: 'Dec', gmv: 5800000, commission: 522000 },
  { month: 'Jan', gmv: 2400000, commission: 216000 },
];

// ─── ANALYTICS: SELLER GROWTH ─────────────────────────────────────────────────
export const MOCK_SELLER_GROWTH = [
  { month: 'Aug', active: 3200, new: 180, churned: 45 },
  { month: 'Sep', active: 3340, new: 195, churned: 55 },
  { month: 'Oct', active: 3490, new: 210, churned: 60 },
  { month: 'Nov', active: 3660, new: 230, churned: 60 },
  { month: 'Dec', active: 3820, new: 220, churned: 60 },
  { month: 'Jan', active: 3980, new: 210, churned: 50 },
];

// ─── ANALYTICS: CUSTOMER GROWTH ──────────────────────────────────────────────
export const MOCK_CUSTOMER_GROWTH = [
  { month: 'Aug', total: 45000, new: 3200, returning: 41800 },
  { month: 'Sep', total: 48500, new: 3700, returning: 44800 },
  { month: 'Oct', total: 54000, new: 5800, returning: 48200 },
  { month: 'Nov', total: 61000, new: 7500, returning: 53500 },
  { month: 'Dec', total: 72000, new: 11800, returning: 60200 },
  { month: 'Jan', total: 78500, new: 7000, returning: 71500 },
];

// ─── COUPONS PAGE ─────────────────────────────────────────────────────────────
export interface MockCouponAdmin {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  scope: 'platform' | 'category' | 'seller';
  status: 'active' | 'expired' | 'disabled';
  validFrom: string;
  validTo: string;
  totalDiscount: number;
}

export const MOCK_ADMIN_COUPONS = [
  { id: 'cp-001', code: 'BHARAT20', type: 'percentage', value: 20, minOrder: 500, maxUses: 1000, usedCount: 782, scope: 'platform', status: 'active', validFrom: '2025-01-01', validTo: '2025-01-31', totalDiscount: 312000 },
  { id: 'cp-002', code: 'CRAFT500', type: 'flat', value: 500, minOrder: 2000, maxUses: 500, usedCount: 234, scope: 'category', status: 'active', validFrom: '2025-01-10', validTo: '2025-01-20', totalDiscount: 117000 },
  { id: 'cp-003', code: 'NEWUSER15', type: 'percentage', value: 15, minOrder: 300, maxUses: 2000, usedCount: 2000, scope: 'platform', status: 'expired', validFrom: '2024-12-01', validTo: '2024-12-31', totalDiscount: 450000 },
  { id: 'cp-004', code: 'DIWALI25', type: 'percentage', value: 25, minOrder: 1000, maxUses: 5000, usedCount: 5000, scope: 'platform', status: 'expired', validFrom: '2024-11-01', validTo: '2024-11-15', totalDiscount: 1250000 },
];

// ─── CATEGORIES PAGE ──────────────────────────────────────────────────────────
export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  parent?: string;
  products: number;
  sellers: number;
  commission: number;
  status: 'active' | 'inactive';
  gmv: number;
}

export const MOCK_ADMIN_CATEGORIES = [
  { id: 'cat-001', name: 'Handicrafts & Art', slug: 'handicrafts-art', products: 4521, sellers: 1245, commission: 10, status: 'active', gmv: 4200000 },
  { id: 'cat-002', name: 'Textiles & Apparel', slug: 'textiles-apparel', products: 3210, sellers: 987, commission: 8, status: 'active', gmv: 3800000 },
  { id: 'cat-003', name: 'Jewelry', slug: 'jewelry', products: 2100, sellers: 654, commission: 12, status: 'active', gmv: 3100000 },
  { id: 'cat-004', name: 'Pottery & Ceramics', slug: 'pottery-ceramics', products: 890, sellers: 230, commission: 10, status: 'active', gmv: 890000 },
  { id: 'cat-005', name: 'Organic Food & Spices', slug: 'organic-food', products: 1340, sellers: 420, commission: 6, status: 'active', gmv: 780000 },
  { id: 'cat-006', name: 'Home Decor', slug: 'home-decor', products: 1780, sellers: 340, commission: 9, status: 'active', gmv: 1200000 },
  { id: 'cat-007', name: 'Paintings', slug: 'paintings', parent: 'Handicrafts & Art', products: 2100, sellers: 450, commission: 10, status: 'active', gmv: 2100000 },
];

// ─── DELIVERY / PARTNERS PAGE ─────────────────────────────────────────────────
export interface MockDeliveryPartner {
  id: string;
  name: string;
  type: 'National' | 'Regional' | 'Hyperlocal';
  apiStatus: 'connected' | 'degraded' | 'disconnected';
  coverage: string;
  activeShipments: number;
  avgDeliveryDays: number;
  successRate: number;
  costPerKg: number;
  codAvailable: boolean;
}

export const MOCK_DELIVERY_PARTNERS = [
  { id: 'del-001', name: 'Delhivery', type: 'National', apiStatus: 'connected', coverage: 'Pan India (19,000+ pincodes)', activeShipments: 4521, avgDeliveryDays: 3.2, successRate: 97.8, costPerKg: 35, codAvailable: true },
  { id: 'del-002', name: 'BlueDart', type: 'National', apiStatus: 'connected', coverage: 'Pan India (35,000+ pincodes)', activeShipments: 2103, avgDeliveryDays: 2.1, successRate: 99.1, costPerKg: 65, codAvailable: false },
  { id: 'del-003', name: 'DTDC', type: 'National', apiStatus: 'degraded', coverage: 'Pan India (17,000+ pincodes)', activeShipments: 1876, avgDeliveryDays: 4.5, successRate: 93.2, costPerKg: 28, codAvailable: true },
  { id: 'del-004', name: 'Shiprocket', type: 'National', apiStatus: 'connected', coverage: 'Pan India (26,000+ pincodes)', activeShipments: 3210, avgDeliveryDays: 3.8, successRate: 95.4, costPerKg: 30, codAvailable: true },
  { id: 'del-005', name: 'Dunzo Business', type: 'Hyperlocal', apiStatus: 'connected', coverage: 'Top 20 cities', activeShipments: 432, avgDeliveryDays: 0.2, successRate: 98.9, costPerKg: 90, codAvailable: false },
];

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
export const MOCK_NOTIFICATION_TEMPLATES = [
  { id: 'tpl-001', title: 'Flash Sale Starting', body: 'Our biggest flash sale starts now! Get up to {{discount}}% off on handcrafted products.', type: 'promotional' },
  { id: 'tpl-002', title: 'KYC Approval Reminder', body: 'Dear {{sellerName}}, your KYC documents are pending review. Submit to start selling.', type: 'seller' },
  { id: 'tpl-003', title: 'Order Status Update', body: 'Your order #{{orderId}} has been shipped and will arrive by {{date}}.', type: 'transactional' },
  { id: 'tpl-004', title: 'Platform Maintenance', body: 'Bharat Bazaar will undergo scheduled maintenance on {{date}} from 2 AM to 4 AM IST.', type: 'system' },
];

// ─── ROLES PAGE ───────────────────────────────────────────────────────────────
export const MOCK_ROLES = [
  { id: 'role-001', name: 'Super Admin', description: 'Full platform access with no restrictions', userCount: 1, permissions: ['all'] },
  { id: 'role-002', name: 'Platform Admin', description: 'Manage sellers, products, KYC, and orders', userCount: 3, permissions: ['sellers', 'products', 'kyc', 'orders', 'customers', 'categories'] },
  { id: 'role-003', name: 'Finance Admin', description: 'Manage payments, settlements, and reports', userCount: 2, permissions: ['payments', 'settlements', 'commissions', 'reports'] },
  { id: 'role-004', name: 'Support Agent', description: 'Handle customer complaints and support tickets', userCount: 8, permissions: ['complaints', 'orders', 'customers'] },
  { id: 'role-005', name: 'Content Moderator', description: 'Review and approve product listings', userCount: 4, permissions: ['products', 'categories', 'offers'] },
];

// ─── PLATFORM SETTINGS PAGE ───────────────────────────────────────────────────
export const MOCK_PLATFORM_SETTINGS = {
  siteName: 'Bharat Bazaar',
  siteTagline: 'From Village Hands to Your Home',
  supportEmail: 'support@bharatbazaar.com',
  financeEmail: 'finance@bharatbazaar.com',
  maintenanceMode: false,
  autoApproveProducts: false,
  autoApproveSellers: false,
  maxProductsPerSeller: 500,
  defaultCommissionRate: 10,
  settlementCycleDays: 7,
  minWithdrawalAmount: 500,
  razorpayEnabled: true,
  upiEnabled: true,
  codEnabled: true,
  netBankingEnabled: true,
};
