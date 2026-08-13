// ─── SUPER ADMIN MOCK DATA ───────────────────────────────────────────────────
// Realistic seed data for all super admin portal sections.

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// ─── DASHBOARD: LIVE METRICS TICKER ──────────────────────────────────────────
export const MOCK_LIVE_TICKER = {
  ordersPerHour: 47,
  gmvToday: 42384700,
  activeSessions: 12470,
  conversionRate: 3.2,
  avgOrderValue: 5147,
  newSellersToday: 8,
  pendingApprovals: 17,
};

// ─── DASHBOARD: KPI CARDS ────────────────────────────────────────────────────
export const MOCK_KPI_CARDS = {
  gmv: { value: 42384700, growth: 18.4, target: 50000000, targetLabel: '₹5Cr' },
  orders: { total: 8234, growth: 12.1, active: 892, completed: 7132, cancelled: 210 },
  activeUsers: { total: 12470, customers: 10890, sellers: 1580, peak: 23410 },
  newRegistrations: { total: 147, growth: 24.8, customers: 139, sellers: 8 },
  commissionRevenue: { value: 4238470, growth: 15.2, avgFeePercent: 10, monthTotal: 82429100 },
  pendingActions: { total: 35, kyc: 8, products: 12, complaints: 10, sellers: 5 },
};

// ─── DASHBOARD: GMV TREND CHART ──────────────────────────────────────────────
export const MOCK_GMV_TREND = [
  { month: 'Jan', gmv: 18500000, revenue: 1850000, orders: 5200 },
  { month: 'Feb', gmv: 21200000, revenue: 2120000, orders: 5800 },
  { month: 'Mar', gmv: 24800000, revenue: 2480000, orders: 6700 },
  { month: 'Apr', gmv: 22100000, revenue: 2210000, orders: 6100 },
  { month: 'May', gmv: 28900000, revenue: 2890000, orders: 7800 },
  { month: 'Jun', gmv: 31200000, revenue: 3120000, orders: 8500 },
  { month: 'Jul', gmv: 35600000, revenue: 3560000, orders: 9200 },
  { month: 'Aug', gmv: 42384700, revenue: 4238470, orders: 11400 },
];

export const MOCK_WEEKLY_GMV = [
  { month: 'May', gmv: 28900000, revenue: 2890000, orders: 7800 },
  { month: 'Jun', gmv: 31200000, revenue: 3120000, orders: 8500 },
  { month: 'Jul', gmv: 35600000, revenue: 3560000, orders: 9200 },
  { month: 'Aug', gmv: 42384700, revenue: 4238470, orders: 11400 },
];

export const MOCK_ORDER_DISTRIBUTION = [
  { name: 'Delivered', value: 7132, color: '#10B981' },
  { name: 'Processing', value: 612, color: '#3B82F6' },
  { name: 'In Transit', value: 280, color: '#8B5CF6' },
  { name: 'Cancelled', value: 210, color: '#EF4444' },
];

export const MOCK_CATEGORY_BREAKDOWN = [
  { name: 'Jewelry', revenue: 12400000, orders: 3200 },
  { name: 'Handlooms', revenue: 9800000, orders: 2800 },
  { name: 'Home Decor', revenue: 7600000, orders: 1900 },
  { name: 'Art', revenue: 5200000, orders: 1400 },
  { name: 'Pottery', revenue: 3100000, orders: 980 },
  { name: 'Organic', revenue: 2800000, orders: 870 },
  { name: 'Woodcraft', revenue: 1900000, orders: 560 },
];

export const MOCK_TOP_SELLERS_DASHBOARD = [
  { rank: 1, id: 's1', name: 'Priya Sharma', shop: 'Priya Art Studio', gmv: 1840000, orders: 892, rating: 4.9, tier: 'Platinum', growth: 24 },
  { rank: 2, id: 's2', name: 'Ramesh Gupta', shop: 'Rajasthani Weaves', gmv: 1420000, orders: 710, rating: 4.8, tier: 'Gold', growth: 18 },
  { rank: 3, id: 's3', name: 'Meena Devi', shop: 'Clay & Fire Studio', gmv: 980000, orders: 540, rating: 4.7, tier: 'Gold', growth: 12 },
  { rank: 4, id: 's4', name: 'Arjun Patel', shop: 'Tribal Gems', gmv: 840000, orders: 420, rating: 4.8, tier: 'Silver', growth: 9 },
  { rank: 5, id: 's5', name: 'Sita Kumari', shop: 'Thread & Needle', gmv: 620000, orders: 310, rating: 4.6, tier: 'Silver', growth: 7 },
];

export const MOCK_TOP_PRODUCTS_DASHBOARD = [
  { rank: 1, id: 'p1', name: 'Handwoven Banarasi Silk Saree', seller: 'Rajasthani Weaves', unitsSold: 1240, revenue: 9920000 },
  { rank: 2, id: 'p2', name: 'Jaipur Blue Pottery Vase Set', seller: 'Clay & Fire Studio', unitsSold: 890, revenue: 3115000 },
  { rank: 3, id: 'p3', name: 'Kundan Necklace Set', seller: 'Tribal Gems', unitsSold: 760, revenue: 4560000 },
  { rank: 4, id: 'p4', name: 'Madhubani Painting - Large', seller: 'Priya Art Studio', unitsSold: 620, revenue: 1860000 },
  { rank: 5, id: 'p5', name: 'Kashmiri Pashmina Shawl', seller: 'Thread & Needle', unitsSold: 580, revenue: 2900000 },
];

export const MOCK_PENDING_QUEUE = [
  { id: 'pq1', type: 'seller_kyc', name: 'Deepak Rao', detail: 'New seller KYC pending 7 days', time: daysAgo(7), urgency: 'high' },
  { id: 'pq2', type: 'product_review', name: 'Madhubani Painting', detail: 'Product awaiting review', time: daysAgo(1), urgency: 'normal' },
  { id: 'pq3', type: 'refund', name: 'Order #BB-09281', detail: 'Refund request ₹2,400 overdue', time: daysAgo(6), urgency: 'critical' },
  { id: 'pq4', type: 'complaint', name: 'Ticket #TCK-2891', detail: 'High priority complaint — damaged goods', time: daysAgo(3), urgency: 'critical' },
  { id: 'pq5', type: 'admin_request', name: 'Rohit Jain', detail: 'Requested full access to Settlements', time: daysAgo(1), urgency: 'high' },
  { id: 'pq6', type: 'settlement', name: 'Priya Art Studio', detail: 'Settlement ₹82,800 due today', time: daysAgo(0), urgency: 'high' },
];

export const MOCK_RECENT_ACTIVITY = [
  { id: 'a1', type: 'order', msg: 'New order #BB-09342 placed by Anita P.', actor: 'Customer', time: '2m ago', color: '#3B82F6', icon: 'ShoppingCart' },
  { id: 'a2', type: 'seller', msg: 'New seller "Artisan Weavers" registered', actor: 'System', time: '8m ago', color: '#8B5CF6', icon: 'Store' },
  { id: 'a3', type: 'payment', msg: 'Payment ₹8,400 received for #BB-09338', actor: 'Razorpay', time: '12m ago', color: '#F5C842', icon: 'CreditCard' },
  { id: 'a4', type: 'return', msg: 'Return requested for order #BB-09290', actor: 'Customer', time: '28m ago', color: '#F97316', icon: 'RotateCcw' },
  { id: 'a5', type: 'review', msg: 'New 5★ review on Kundan Necklace Set', actor: 'Customer', time: '35m ago', color: '#EAB308', icon: 'Star' },
  { id: 'a6', type: 'admin', msg: 'Admin Suresh approved Blue Pottery product', actor: 'Admin', time: '1h ago', color: '#6B7280', icon: 'Shield' },
  { id: 'a7', type: 'product', msg: 'Product Silk Saree - Premium approved', actor: 'Admin', time: '1h ago', color: '#10B981', icon: 'Package' },
  { id: 'a8', type: 'refund', msg: 'Refund ₹1,200 processed for #BB-09201', actor: 'Admin', time: '2h ago', color: '#14B8A6', icon: 'RefreshCw' },
];

export const MOCK_SYSTEM_HEALTH = [
  { service: 'API Gateway', status: 'operational', latency: 48, uptime: 99.98 },
  { service: 'Payment Service', status: 'operational', latency: 120, uptime: 99.95 },
  { service: 'Image CDN', status: 'operational', latency: 28, uptime: 100 },
  { service: 'Search Engine', status: 'degraded', latency: 840, uptime: 98.2 },
  { service: 'Notifications', status: 'operational', latency: 65, uptime: 99.90 },
];

// ─── DASHBOARD: QUICK STATS (below chart) ────────────────────────────────────
export const MOCK_CHART_QUICK_STATS = {
  totalVolume: '₹4.24Cr',
  totalOrders: 8234,
  avgOrderValue: '₹5,147',
  peakHourRate: '₹4.7L/hr',
};

export const MOCK_LAYOUT_LIVE_STATS = { ordersToday: 234, gmv: 42384700, activeUsers: 12470 };

export const MOCK_ALERTS = [
  { id: 'al1', severity: 'critical', msg: '3 refunds are overdue (>5 days). Total: ₹14,200', link: '/super-admin/settlements', cta: 'Process Now' },
  { id: 'al2', severity: 'warning', msg: '8 sellers pending KYC for 7+ days', link: '/super-admin/kyc', cta: 'Review Now' },
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

export const MOCK_SELLERS = ([] as any[]);

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

export const MOCK_CUSTOMERS = ([] as any[]);

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

export const MOCK_ADMIN_ORDERS: MockAdminOrder[] = [
  { id: 'o1', orderNo: 'BB-09342', customer: 'Anita Patel', seller: 'Priya Art Studio', amount: 8400, commission: 840, status: 'processing', paymentStatus: 'paid', date: daysAgo(0), items: 2, category: 'Art & Paintings' },
  { id: 'o2', orderNo: 'BB-09341', customer: 'Vikram Singh', seller: 'Rajasthani Weaves', amount: 14200, commission: 1420, status: 'shipped', paymentStatus: 'paid', date: daysAgo(1), items: 1, category: 'Handlooms' },
  { id: 'o3', orderNo: 'BB-09338', customer: 'Sunita Agarwal', seller: 'Tribal Gems', amount: 28000, commission: 2800, status: 'delivered', paymentStatus: 'paid', date: daysAgo(2), items: 3, category: 'Jewelry' },
  { id: 'o4', orderNo: 'BB-09290', customer: 'Rahul Khanna', seller: 'Clay & Fire Studio', amount: 4800, commission: 480, status: 'refunded', paymentStatus: 'refunded', date: daysAgo(5), items: 1, category: 'Pottery' },
  { id: 'o5', orderNo: 'BB-09281', customer: 'Pooja Mehta', seller: 'Thread & Needle', amount: 2400, commission: 240, status: 'cancelled', paymentStatus: 'refunded', date: daysAgo(6), items: 1, category: 'Embroidery' },
  { id: 'o6', orderNo: 'BB-09270', customer: 'Geeta Sharma', seller: 'Block Print Bazaar', amount: 1800, commission: 180, status: 'delivered', paymentStatus: 'paid', date: daysAgo(8), items: 2, category: 'Block Printing' },
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

export const MOCK_ADMIN_PRODUCTS: MockAdminProduct[] = [
  { id: 'pr1', name: 'Handwoven Banarasi Silk Saree - Royal Blue', seller: 'Rajasthani Weaves', category: 'Handlooms', price: 8000, stock: 45, status: 'approved', submittedDate: daysAgo(60), sales: 1240, rating: 4.8 },
  { id: 'pr2', name: 'Jaipur Blue Pottery Vase Set (3 pieces)', seller: 'Clay & Fire Studio', category: 'Pottery', price: 3500, stock: 28, status: 'approved', submittedDate: daysAgo(45), sales: 890, rating: 4.7 },
  { id: 'pr3', name: 'Madhubani Painting - Village Life', seller: 'Priya Art Studio', category: 'Art', price: 3000, stock: 0, status: 'pending', submittedDate: daysAgo(2), sales: 0, rating: 0 },
  { id: 'pr4', name: 'Lucknow Chikankari Kurti - White', seller: 'Thread & Needle', category: 'Embroidery', price: 1200, stock: 80, status: 'pending', submittedDate: daysAgo(1), sales: 0, rating: 0 },
  { id: 'pr5', name: 'Brass Handmade Figurines Set', seller: 'Brass Works', category: 'Metalcraft', price: 2800, stock: 12, status: 'flagged', submittedDate: daysAgo(10), sales: 34, rating: 3.1, flagReason: 'Possible copyright infringement on design' },
  { id: 'pr6', name: 'Organic Kashmiri Saffron 10g', seller: 'Himalayan Crafts', category: 'Natural', price: 850, stock: 200, status: 'approved', submittedDate: daysAgo(30), sales: 560, rating: 4.9 },
  { id: 'pr7', name: 'Sandalwood Carved Elephant - Medium', seller: 'Kerala Crafts', category: 'Woodcraft', price: 4500, stock: 8, status: 'rejected', submittedDate: daysAgo(15), sales: 0, rating: 0 },
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

export const MOCK_KYC_REQUESTS: MockKycRequest[] = [
  { id: 'k1', sellerId: 's6', sellerName: 'Deepak Rao', shop: 'Artisan Weavers', submittedDate: daysAgo(7), documentType: 'Aadhaar + PAN', status: 'pending', waitDays: 7, panNumber: 'FGHUC6789Q', bankAccount: '****1234' },
  { id: 'k2', sellerId: 's7', sellerName: 'Kavya Nair', shop: 'Kerala Crafts', submittedDate: daysAgo(5), documentType: 'GST + PAN', status: 'pending', waitDays: 5, panNumber: 'GHIVD7890R', gstNumber: '32GHIVD7890R1Z2', bankAccount: '****5678' },
  { id: 'k3', sellerId: 's9', sellerName: 'Rekha Joshi', shop: 'Himalayan Crafts', submittedDate: daysAgo(12), documentType: 'Aadhaar + PAN', status: 'approved', waitDays: 3, panNumber: 'IJKXF9012T', bankAccount: '****7890' },
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

export const MOCK_COMPLAINTS: MockComplaint[] = [
  { id: 'cp1', ticketNo: 'TCK-2891', customer: 'Anita Patel', seller: 'Brass Works', orderNo: 'BB-09100', subject: 'Received damaged goods, seller unresponsive', description: 'The brass figurine set was broken on arrival. Packaging was poor. I have contacted the seller 4 times with no response.', status: 'escalated', priority: 'urgent', createdDate: daysAgo(3), amount: 2800 },
  { id: 'cp2', ticketNo: 'TCK-2875', customer: 'Rahul Khanna', seller: 'Clay & Fire Studio', orderNo: 'BB-09290', subject: 'Refund not processed after 10 days', description: 'I returned the pottery set 10 days ago. Seller confirmed receipt but no refund.', status: 'in_review', priority: 'high', createdDate: daysAgo(5), amount: 4800 },
  { id: 'cp3', ticketNo: 'TCK-2862', customer: 'Sunita Agarwal', seller: 'Thread & Needle', orderNo: 'BB-09201', subject: 'Wrong size delivered', description: 'Ordered L size kurti but received M. Seller said they cannot exchange.', status: 'open', priority: 'medium', createdDate: daysAgo(7), amount: 1200 },
  { id: 'cp4', ticketNo: 'TCK-2840', customer: 'Vikram Singh', seller: 'Block Print Bazaar', orderNo: 'BB-09150', subject: 'Colors faded after first wash', description: 'Block print fabric colors not colorfast as advertised.', status: 'resolved', priority: 'low', createdDate: daysAgo(14), amount: 1800 },
];

// ─── PAYMENTS / TRANSACTIONS PAGE ────────────────────────────────────────────
export interface MockAdminTransaction {
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

export const MOCK_SUPER_ADMIN_TRANSACTIONS: MockAdminTransaction[] = [
  { id: 't1', transactionId: 'pay_RZ9283ABCDE', orderId: 'BB-09342', customer: 'Anita Patel', amount: 8400, commission: 840, sellerPayout: 7560, gateway: 'Razorpay', status: 'success', date: daysAgo(0) },
  { id: 't2', transactionId: 'pay_RZ9271FGHIJ', orderId: 'BB-09341', customer: 'Vikram Singh', amount: 14200, commission: 1420, sellerPayout: 12780, gateway: 'UPI', status: 'success', date: daysAgo(1) },
  { id: 't3', transactionId: 'pay_RZ9253KLMNO', orderId: 'BB-09338', customer: 'Sunita Agarwal', amount: 28000, commission: 2800, sellerPayout: 25200, gateway: 'Net Banking', status: 'success', date: daysAgo(2) },
  { id: 't4', transactionId: 'pay_RZ9210PQRST', orderId: 'BB-09290', customer: 'Rahul Khanna', amount: 4800, commission: 480, sellerPayout: 4320, gateway: 'Razorpay', status: 'refunded', date: daysAgo(5) },
  { id: 't5', transactionId: 'pay_RZ9180UVWXY', orderId: 'BB-09281', customer: 'Pooja Mehta', amount: 2400, commission: 0, sellerPayout: 0, gateway: 'COD', status: 'failed', date: daysAgo(6) },
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

export const MOCK_SETTLEMENTS: MockSettlement[] = [
  { id: 'st1', settlementId: 'SET-4821', seller: 'Priya Sharma', shop: 'Priya Art Studio', amount: 92000, orders: 48, commission: 9200, netPayout: 82800, status: 'pending', dueDate: daysAgo(-1), bankAccount: '****4521' },
  { id: 'st2', settlementId: 'SET-4820', seller: 'Ramesh Gupta', shop: 'Rajasthani Weaves', amount: 71000, orders: 36, commission: 7100, netPayout: 63900, status: 'processing', dueDate: daysAgo(0), bankAccount: '****7832' },
  { id: 'st3', settlementId: 'SET-4818', seller: 'Meena Devi', shop: 'Clay & Fire Studio', amount: 48000, orders: 24, commission: 4800, netPayout: 43200, status: 'completed', dueDate: daysAgo(5), paidDate: daysAgo(4), bankAccount: '****2341' },
  { id: 'st4', settlementId: 'SET-4815', seller: 'Arjun Patel', shop: 'Tribal Gems', amount: 140000, orders: 18, commission: 14000, netPayout: 126000, status: 'completed', dueDate: daysAgo(10), paidDate: daysAgo(9), bankAccount: '****6712' },
  { id: 'st5', settlementId: 'SET-4812', seller: 'Rekha Joshi', shop: 'Himalayan Crafts', amount: 24000, orders: 14, commission: 2400, netPayout: 21600, status: 'failed', dueDate: daysAgo(8), bankAccount: '****7890' },
];

// ─── COMMISSIONS PAGE ─────────────────────────────────────────────────────────
export const MOCK_COMMISSION_RATES = [
  { id: 'cr1', category: 'Jewelry & Accessories', rate: 12, minAmount: 0, maxAmount: null, flatFee: 0 },
  { id: 'cr2', category: 'Handlooms & Textiles', rate: 10, minAmount: 0, maxAmount: null, flatFee: 0 },
  { id: 'cr3', category: 'Art & Paintings', rate: 15, minAmount: 0, maxAmount: null, flatFee: 0 },
  { id: 'cr4', category: 'Pottery & Ceramics', rate: 10, minAmount: 0, maxAmount: null, flatFee: 0 },
  { id: 'cr5', category: 'Natural & Organic', rate: 8, minAmount: 0, maxAmount: null, flatFee: 0 },
  { id: 'cr6', category: 'Woodcraft', rate: 10, minAmount: 0, maxAmount: null, flatFee: 0 },
  { id: 'cr7', category: 'Metalcraft', rate: 10, minAmount: 0, maxAmount: null, flatFee: 0 },
  { id: 'cr8', category: 'Embroidery', rate: 10, minAmount: 0, maxAmount: null, flatFee: 0 },
  { id: 'cr9', category: 'Block Printing', rate: 10, minAmount: 0, maxAmount: null, flatFee: 0 },
  { id: 'cr10', category: 'Other', rate: 10, minAmount: 0, maxAmount: null, flatFee: 0 },
];

export const MOCK_COMMISSION_STATS = {
  totalCollected: 82429100,
  mtdGrowth: 18.4,
  avgRate: 10.4,
  topCategory: 'Jewelry & Accessories',
  pendingPayouts: 14200000,
  platformCut: 15,
};

// ─── ADMINS PAGE ──────────────────────────────────────────────────────────────
export interface MockAdmin {
  id: string;
  name: string;
  email: string;
  role: 'platform_admin' | 'support_agent' | 'finance_admin' | 'content_moderator' | 'logistics_admin';
  department: 'seller_operations' | 'customer_support' | 'product_quality' | 'finance' | 'logistics' | 'content_moderation' | 'technical';
  jobTitle: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdDate: string;
  twoFaEnabled: boolean;
  avatar: string;
  permissions: string[];
}

export const MOCK_ADMINS: MockAdmin[] = [
  { id: 'adm1', name: 'Suresh Kumar', email: 'suresh@bharatbazaar.com', role: 'platform_admin', department: 'seller_operations', jobTitle: 'Senior Platform Admin', status: 'active', lastLogin: daysAgo(0), createdDate: daysAgo(280), twoFaEnabled: true, avatar: 'SK', permissions: ['sellers', 'products', 'orders', 'customers'] },
  { id: 'adm2', name: 'Nisha Verma', email: 'nisha@bharatbazaar.com', role: 'support_agent', department: 'customer_support', jobTitle: 'Customer Support Lead', status: 'active', lastLogin: daysAgo(1), createdDate: daysAgo(220), twoFaEnabled: true, avatar: 'NV', permissions: ['customers', 'complaints', 'returns', 'orders'] },
  { id: 'adm3', name: 'Rohit Jain', email: 'rohit@bharatbazaar.com', role: 'finance_admin', department: 'finance', jobTitle: 'Finance Manager', status: 'active', lastLogin: daysAgo(2), createdDate: daysAgo(180), twoFaEnabled: true, avatar: 'RJ', permissions: ['payments', 'refunds', 'settlements', 'commission'] },
  { id: 'adm4', name: 'Preethi Sinha', email: 'preethi@bharatbazaar.com', role: 'content_moderator', department: 'product_quality', jobTitle: 'Product Quality Analyst', status: 'active', lastLogin: daysAgo(0), createdDate: daysAgo(150), twoFaEnabled: false, avatar: 'PS', permissions: ['products', 'reviews', 'categories'] },
  { id: 'adm5', name: 'Ajay Mishra', email: 'ajay@bharatbazaar.com', role: 'logistics_admin', department: 'logistics', jobTitle: 'Delivery Fleet Manager', status: 'inactive', lastLogin: daysAgo(14), createdDate: daysAgo(90), twoFaEnabled: true, avatar: 'AM', permissions: ['orders', 'delivery', 'returns'] },
  { id: 'adm6', name: 'Tanuja Rao', email: 'tanuja@bharatbazaar.com', role: 'support_agent', department: 'customer_support', jobTitle: 'Support Executive', status: 'suspended', lastLogin: daysAgo(21), createdDate: daysAgo(60), twoFaEnabled: false, avatar: 'TR', permissions: [] },
];

// ─── ADMIN PANEL ACCESS ────────────────────────────────────────────────────────
export interface AdminPanelAccess {
  id: string;
  adminId: string;
  panelKey: string;
  accessLevel: 'view' | 'manage' | 'full';
  grantedAt: string;
  expiresAt?: string;
  notes?: string;
}

export const MOCK_PANEL_ACCESS: AdminPanelAccess[] = [
  { id: 'pa1', adminId: 'adm1', panelKey: 'sellers', accessLevel: 'full', grantedAt: daysAgo(280) },
  { id: 'pa2', adminId: 'adm1', panelKey: 'products', accessLevel: 'manage', grantedAt: daysAgo(280) },
  { id: 'pa3', adminId: 'adm1', panelKey: 'orders', accessLevel: 'view', grantedAt: daysAgo(280) },
  { id: 'pa4', adminId: 'adm1', panelKey: 'customers', accessLevel: 'view', grantedAt: daysAgo(280) },
  { id: 'pa5', adminId: 'adm2', panelKey: 'customers', accessLevel: 'manage', grantedAt: daysAgo(220) },
  { id: 'pa6', adminId: 'adm2', panelKey: 'complaints', accessLevel: 'full', grantedAt: daysAgo(220) },
  { id: 'pa7', adminId: 'adm2', panelKey: 'returns', accessLevel: 'manage', grantedAt: daysAgo(220) },
  { id: 'pa8', adminId: 'adm2', panelKey: 'orders', accessLevel: 'view', grantedAt: daysAgo(220) },
  { id: 'pa9', adminId: 'adm3', panelKey: 'payments', accessLevel: 'full', grantedAt: daysAgo(180) },
  { id: 'pa10', adminId: 'adm3', panelKey: 'refunds', accessLevel: 'full', grantedAt: daysAgo(180) },
  { id: 'pa11', adminId: 'adm3', panelKey: 'settlements', accessLevel: 'manage', grantedAt: daysAgo(180) },
  { id: 'pa12', adminId: 'adm3', panelKey: 'commission', accessLevel: 'view', grantedAt: daysAgo(180) },
  { id: 'pa13', adminId: 'adm4', panelKey: 'products', accessLevel: 'full', grantedAt: daysAgo(150) },
  { id: 'pa14', adminId: 'adm4', panelKey: 'reviews', accessLevel: 'full', grantedAt: daysAgo(150) },
  { id: 'pa15', adminId: 'adm4', panelKey: 'categories', accessLevel: 'manage', grantedAt: daysAgo(150) },
  { id: 'pa16', adminId: 'adm5', panelKey: 'orders', accessLevel: 'view', grantedAt: daysAgo(90) },
  { id: 'pa17', adminId: 'adm5', panelKey: 'delivery', accessLevel: 'full', grantedAt: daysAgo(90) },
];

// ─── ADMIN PANEL REQUESTS ─────────────────────────────────────────────────────
export interface AdminPanelRequest {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  panelKey: string;
  requestedLevel: 'view' | 'manage' | 'full';
  reason: string;
  urgency: 'low' | 'normal' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
  reviewNote?: string;
}

export const MOCK_PANEL_REQUESTS: AdminPanelRequest[] = [
  { id: 'pr1', adminId: 'adm3', adminName: 'Rohit Jain', adminEmail: 'rohit@bharatbazaar.com', panelKey: 'settlements', requestedLevel: 'full', reason: 'Need full access to settlements panel to process overdue vendor payouts independently without waiting for SA approval each time. Several settlements are overdue right now.', urgency: 'high', status: 'pending', createdAt: daysAgo(1) },
  { id: 'pr2', adminId: 'adm2', adminName: 'Nisha Verma', adminEmail: 'nisha@bharatbazaar.com', panelKey: 'refunds', requestedLevel: 'manage', reason: 'Customer support team needs to be able to initiate refunds directly when sellers fail to respond within 48 hours, rather than escalating every refund to finance team.', urgency: 'normal', status: 'pending', createdAt: daysAgo(2) },
  { id: 'pr3', adminId: 'adm4', adminName: 'Preethi Sinha', adminEmail: 'preethi@bharatbazaar.com', panelKey: 'sellers', requestedLevel: 'view', reason: 'When reviewing flagged products, I need to view the seller profile to assess history and decide on action. Currently I have to request this info separately.', urgency: 'low', status: 'pending', createdAt: daysAgo(3) },
  { id: 'pr4', adminId: 'adm1', adminName: 'Suresh Kumar', adminEmail: 'suresh@bharatbazaar.com', panelKey: 'analytics', requestedLevel: 'view', reason: 'Need access to analytics to track seller performance trends and identify underperforming sellers for outreach.', urgency: 'normal', status: 'approved', createdAt: daysAgo(10), reviewNote: 'Approved. View-only analytics is appropriate for your role.' },
];

// ─── AUDIT LOGS PAGE ──────────────────────────────────────────────────────────
export interface MockAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  severity: 'critical' | 'warning' | 'info';
  result: 'success' | 'failed';
}

export const MOCK_AUDIT_LOGS: MockAuditLog[] = [
  { id: 'log1', timestamp: daysAgo(0), actor: 'Super Admin', actorRole: 'super_admin', action: 'APPROVE_SELLER', resource: 'Seller', resourceId: 's3', ipAddress: '122.172.45.8', severity: 'info', result: 'success' },
  { id: 'log2', timestamp: daysAgo(0), actor: 'Suresh Kumar', actorRole: 'platform_admin', action: 'APPROVE_PRODUCT', resource: 'Product', resourceId: 'pr1', ipAddress: '122.172.45.9', severity: 'info', result: 'success' },
  { id: 'log3', timestamp: daysAgo(0), actor: 'Nisha Verma', actorRole: 'support_agent', action: 'RESOLVE_COMPLAINT', resource: 'Complaint', resourceId: 'cp4', ipAddress: '103.21.58.12', severity: 'info', result: 'success' },
  { id: 'log4', timestamp: daysAgo(1), actor: 'Super Admin', actorRole: 'super_admin', action: 'SUSPEND_SELLER', resource: 'Seller', resourceId: 's8', ipAddress: '122.172.45.8', severity: 'warning', result: 'success' },
  { id: 'log5', timestamp: daysAgo(1), actor: 'Rohit Jain', actorRole: 'finance_admin', action: 'PROCESS_SETTLEMENT', resource: 'Settlement', resourceId: 'st3', ipAddress: '115.99.22.45', severity: 'info', result: 'success' },
  { id: 'log6', timestamp: daysAgo(1), actor: 'Super Admin', actorRole: 'super_admin', action: 'GRANT_PANEL_ACCESS', resource: 'AdminPanelAccess', resourceId: 'adm1', ipAddress: '122.172.45.8', severity: 'warning', result: 'success' },
  { id: 'log7', timestamp: daysAgo(2), actor: 'Unknown', actorRole: 'unknown', action: 'LOGIN_FAILED', resource: 'Auth', resourceId: '-', ipAddress: '45.22.189.12', severity: 'critical', result: 'failed' },
  { id: 'log8', timestamp: daysAgo(2), actor: 'Preethi Sinha', actorRole: 'content_moderator', action: 'REJECT_PRODUCT', resource: 'Product', resourceId: 'pr7', ipAddress: '103.21.58.45', severity: 'info', result: 'success' },
];

// ─── ANALYTICS: REVENUE ───────────────────────────────────────────────────────
export const MOCK_MONTHLY_REVENUE = MOCK_GMV_TREND;

// ─── ANALYTICS: SELLER GROWTH ─────────────────────────────────────────────────
export const MOCK_SELLER_GROWTH = [
  { month: 'Jan', total: 480, new: 28, churned: 4 },
  { month: 'Feb', total: 510, new: 35, churned: 5 },
  { month: 'Mar', total: 548, new: 42, churned: 4 },
  { month: 'Apr', total: 580, new: 38, churned: 6 },
  { month: 'May', total: 620, new: 45, churned: 5 },
  { month: 'Jun', total: 668, new: 52, churned: 4 },
  { month: 'Jul', total: 718, new: 54, churned: 4 },
  { month: 'Aug', total: 768, new: 58, churned: 8 },
];

// ─── ANALYTICS: CUSTOMER GROWTH ──────────────────────────────────────────────
export const MOCK_CUSTOMER_GROWTH = [
  { month: 'Jan', total: 4200, new: 380, active: 2100 },
  { month: 'Feb', total: 5100, new: 920, active: 2800 },
  { month: 'Mar', total: 6400, new: 1320, active: 3500 },
  { month: 'Apr', total: 7500, new: 1120, active: 4200 },
  { month: 'May', total: 8900, new: 1420, active: 5100 },
  { month: 'Jun', total: 10400, new: 1520, active: 6200 },
  { month: 'Jul', total: 11800, new: 1420, active: 7400 },
  { month: 'Aug', total: 12470, new: 678, active: 8100 },
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

export const MOCK_ADMIN_COUPONS: MockCouponAdmin[] = [
  { id: 'coup1', code: 'MONSOON30', type: 'percentage', value: 30, minOrder: 999, maxUses: 5000, usedCount: 2840, scope: 'platform', status: 'active', validFrom: daysAgo(10), validTo: daysAgo(-20), totalDiscount: 2840000 },
  { id: 'coup2', code: 'NEWARTISAN', type: 'flat', value: 200, minOrder: 500, maxUses: 1000, usedCount: 1000, scope: 'platform', status: 'expired', validFrom: daysAgo(60), validTo: daysAgo(5), totalDiscount: 200000 },
  { id: 'coup3', code: 'HANDCRAFT15', type: 'percentage', value: 15, minOrder: 1500, maxUses: 2000, usedCount: 840, scope: 'category', status: 'active', validFrom: daysAgo(5), validTo: daysAgo(-25), totalDiscount: 940000 },
  { id: 'coup4', code: 'FESTIVE50', type: 'flat', value: 500, minOrder: 2000, maxUses: 500, usedCount: 0, scope: 'platform', status: 'disabled', validFrom: daysAgo(-5), validTo: daysAgo(-25), totalDiscount: 0 },
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

export const MOCK_ADMIN_CATEGORIES: MockCategory[] = [
  { id: 'cat1', name: 'Handlooms & Textiles', slug: 'handlooms-textiles', products: 840, sellers: 320, commission: 10, status: 'active', gmv: 9800000 },
  { id: 'cat2', name: 'Jewelry & Accessories', slug: 'jewelry-accessories', products: 620, sellers: 280, commission: 12, status: 'active', gmv: 12400000 },
  { id: 'cat3', name: 'Home Décor', slug: 'home-decor', products: 450, sellers: 190, commission: 10, status: 'active', gmv: 7600000 },
  { id: 'cat4', name: 'Art & Paintings', slug: 'art-paintings', products: 280, sellers: 120, commission: 15, status: 'active', gmv: 5200000 },
  { id: 'cat5', name: 'Pottery & Ceramics', slug: 'pottery-ceramics', products: 190, sellers: 90, commission: 10, status: 'active', gmv: 3100000 },
  { id: 'cat6', name: 'Natural & Organic', slug: 'natural-organic', products: 160, sellers: 75, commission: 8, status: 'active', gmv: 2800000 },
  { id: 'cat7', name: 'Woodcraft', slug: 'woodcraft', products: 120, sellers: 55, commission: 10, status: 'active', gmv: 1900000 },
  { id: 'cat8', name: 'Metalcraft', slug: 'metalcraft', products: 90, sellers: 40, commission: 10, status: 'inactive', gmv: 980000 },
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

export const MOCK_DELIVERY_PARTNERS: MockDeliveryPartner[] = [
  { id: 'dp1', name: 'Delhivery', type: 'National', apiStatus: 'connected', coverage: 'PAN India (19,000+ pincodes)', activeShipments: 2840, avgDeliveryDays: 3.2, successRate: 96.8, costPerKg: 45, codAvailable: true },
  { id: 'dp2', name: 'Shiprocket', type: 'National', apiStatus: 'connected', coverage: 'PAN India (18,500+ pincodes)', activeShipments: 1920, avgDeliveryDays: 4.1, successRate: 94.2, costPerKg: 38, codAvailable: true },
  { id: 'dp3', name: 'XpressBees', type: 'Regional', apiStatus: 'degraded', coverage: 'North + West India', activeShipments: 580, avgDeliveryDays: 3.8, successRate: 91.5, costPerKg: 42, codAvailable: true },
  { id: 'dp4', name: 'Shadowfax', type: 'Hyperlocal', apiStatus: 'connected', coverage: '150+ cities, same-day delivery', activeShipments: 340, avgDeliveryDays: 0.8, successRate: 98.2, costPerKg: 65, codAvailable: false },
];

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
export const MOCK_NOTIFICATION_TEMPLATES = [
  { id: 'nt1', name: 'New Order Confirmation', type: 'transactional', channel: ['email', 'push'], status: 'active', sentCount: 8234, lastUsed: daysAgo(0) },
  { id: 'nt2', name: 'Seller KYC Approved', type: 'transactional', channel: ['email', 'sms'], status: 'active', sentCount: 342, lastUsed: daysAgo(2) },
  { id: 'nt3', name: 'Flash Sale Alert', type: 'promotional', channel: ['push', 'email'], status: 'active', sentCount: 12470, lastUsed: daysAgo(7) },
  { id: 'nt4', name: 'Abandoned Cart Reminder', type: 'promotional', channel: ['email', 'push'], status: 'active', sentCount: 4280, lastUsed: daysAgo(1) },
  { id: 'nt5', name: 'Platform Maintenance Alert', type: 'system', channel: ['email', 'push', 'sms'], status: 'draft', sentCount: 0, lastUsed: null },
];

// ─── ROLES PAGE ───────────────────────────────────────────────────────────────
export const MOCK_ROLES = [
  { id: 'role1', name: 'Platform Admin', key: 'platform_admin', description: 'Broad access to manage sellers, products and orders', adminCount: 1, permissions: ['sellers', 'products', 'orders', 'customers'], color: '#8B5CF6' },
  { id: 'role2', name: 'Support Agent', key: 'support_agent', description: 'Customer-facing support, complaint resolution', adminCount: 2, permissions: ['customers', 'complaints', 'returns', 'orders'], color: '#3B82F6' },
  { id: 'role3', name: 'Finance Admin', key: 'finance_admin', description: 'Financial operations — payments, refunds, settlements', adminCount: 1, permissions: ['payments', 'refunds', 'settlements', 'commission'], color: '#10B981' },
  { id: 'role4', name: 'Content Moderator', key: 'content_moderator', description: 'Product quality review and content moderation', adminCount: 1, permissions: ['products', 'reviews', 'categories'], color: '#F59E0B' },
  { id: 'role5', name: 'Logistics Admin', key: 'logistics_admin', description: 'Delivery fleet and return management', adminCount: 1, permissions: ['orders', 'delivery', 'returns'], color: '#F97316' },
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

export const SA_MOCK_DATA = {
  customers: MOCK_CUSTOMERS,
  kyc: MOCK_KYC_REQUESTS,
  products: MOCK_ADMIN_PRODUCTS,
  complaints: MOCK_COMPLAINTS,
};

export const SA_ADMIN_PROFILES = MOCK_ADMINS;
