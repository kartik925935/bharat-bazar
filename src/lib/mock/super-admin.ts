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
export const MOCK_GMV_TREND = ([] as any[]);

// ─── DASHBOARD: GMV WEEKLY TREND ─────────────────────────────────────────────
export const MOCK_WEEKLY_GMV = ([] as any[]);

// ─── DASHBOARD: ORDER DISTRIBUTION ───────────────────────────────────────────
export const MOCK_ORDER_DISTRIBUTION = ([] as any[]);

// ─── DASHBOARD: CATEGORY REVENUE BREAKDOWN ───────────────────────────────────
export const MOCK_CATEGORY_BREAKDOWN = ([] as any[]);

// ─── DASHBOARD: TOP SELLERS ───────────────────────────────────────────────────
export const MOCK_TOP_SELLERS_DASHBOARD = ([] as any[]);

// ─── DASHBOARD: PENDING APPROVAL QUEUE ───────────────────────────────────────
export const MOCK_PENDING_QUEUE = ([] as any[]);

// ─── DASHBOARD: RECENT ACTIVITY LOG ──────────────────────────────────────────
export const MOCK_RECENT_ACTIVITY = ([] as any[]);

// ─── DASHBOARD: SYSTEM HEALTH ─────────────────────────────────────────────────
export const MOCK_SYSTEM_HEALTH = ([] as any[]);

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
export const MOCK_ALERTS = ([] as any[]);

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

export const MOCK_ADMIN_ORDERS = ([] as any[]);

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

export const MOCK_ADMIN_PRODUCTS = ([] as any[]);

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

export const MOCK_KYC_REQUESTS = ([] as any[]);

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

export const MOCK_COMPLAINTS = ([] as any[]);

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

export const MOCK_SUPER_ADMIN_TRANSACTIONS = ([] as any[]);

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

export const MOCK_SETTLEMENTS = ([] as any[]);

// ─── COMMISSIONS PAGE ─────────────────────────────────────────────────────────
export const MOCK_COMMISSION_RATES = ([] as any[]);

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

export const MOCK_ADMINS = ([] as any[]);

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

export const MOCK_AUDIT_LOGS = ([] as any[]);

// ─── ANALYTICS: REVENUE ───────────────────────────────────────────────────────
export const MOCK_MONTHLY_REVENUE = ([] as any[]);

// ─── ANALYTICS: SELLER GROWTH ─────────────────────────────────────────────────
export const MOCK_SELLER_GROWTH = ([] as any[]);

// ─── ANALYTICS: CUSTOMER GROWTH ──────────────────────────────────────────────
export const MOCK_CUSTOMER_GROWTH = ([] as any[]);

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

export const MOCK_ADMIN_COUPONS = ([] as any[]);

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

export const MOCK_ADMIN_CATEGORIES = ([] as any[]);

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

export const MOCK_DELIVERY_PARTNERS = ([] as any[]);

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
export const MOCK_NOTIFICATION_TEMPLATES = ([] as any[]);

// ─── ROLES PAGE ───────────────────────────────────────────────────────────────
export const MOCK_ROLES = ([] as any[]);

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
