// ============================================================
// BHARAT BAZAAR — Customer Mock Data
// All data comes from here so pages are not hardcoded.
// To restore data: see git history (git log src/lib/mock/customer.ts)
// To disconnect from mock: the arrays below are already cleared.
// ============================================================

// ── Types ──────────────────────────────────────────────────────────────────

export interface MockTransaction {
  id: string;
  type: 'credit' | 'debit';
  title: string;
  amount: number;
  date: string;
  source: string;
}

export interface MockReturn {
  id: string;
  returnNumber: string;
  orderNumber: string;
  productName: string;
  productImage: string;
  reason: string;
  refundAmount: number;
  status: 'under_review' | 'approved' | 'pickup_scheduled' | 'received' | 'refunded';
  date: string;
  expectedRefundMethod: string;
}

export interface MockReview {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  sellerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: 'published' | 'pending';
  helpful: number;
}

export interface MockPendingReview {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  sellerName: string;
  deliveredDate: string;
}

export interface MockAddress {
  id: string;
  label?: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export interface MockNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface MockBlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface MockUserLoyalty {
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  walletBalance: number;
  referralCode: string;
  nextTierPoints: number;
  tierThresholds: { Bronze: number; Silver: number; Gold: number; Platinum: number };
}

export interface MockSettings {
  twoFactor: boolean;
  language: string;
  currency: string;
  emailNotifs: boolean;
  pushNotifs: boolean;
  smsNotifs: boolean;
  orderUpdates: boolean;
  offerAlerts: boolean;
  reviewReminders: boolean;
}

// ── Data (cleared — restore from git history when real API is ready) ────────

export const MOCK_USER_LOYALTY: MockUserLoyalty = {
  points: 0,
  tier: 'Bronze',
  walletBalance: 0,
  referralCode: '',
  nextTierPoints: 500,
  tierThresholds: { Bronze: 0, Silver: 500, Gold: 1000, Platinum: 2500 },
};

export const MOCK_SETTINGS: MockSettings = {
  twoFactor: false,
  language: 'English',
  currency: 'INR (₹)',
  emailNotifs: true,
  pushNotifs: true,
  smsNotifs: false,
  orderUpdates: true,
  offerAlerts: true,
  reviewReminders: true,
};

export const MOCK_TRANSACTIONS: MockTransaction[] = [];

export const MOCK_RETURNS: MockReturn[] = [];

export const MOCK_REVIEWS: MockReview[] = [];

export const PENDING_REVIEWS: MockPendingReview[] = [];

export const INITIAL_ADDRESSES: MockAddress[] = [];

export const MOCK_NOTIFICATIONS: MockNotification[] = [];

export const MOCK_BLOG_POSTS: MockBlogPost[] = [];

// ─── Legacy exports (kept for backward compat) ─────────────────────────────
export const PAST_REVIEWS = ([] as any[]);
export const COUPONS = ([] as any[]);
export const RETURNABLE_ITEMS = ([] as any[]);
export const RECENT_PRODUCTS = ([] as any[]);
export const PURCHASE_HISTORY = ([] as any[]);
export const FAV_SELLERS = ([] as any[]);
export const SESSIONS = ([] as any[]);
export const LOGIN_HISTORY = ([] as any[]);

export const CATEGORIES = [
  'All', 'Handloom & Textiles', 'Pottery & Ceramics', 'Paintings & Art',
  'Jewelry', 'Home Decor', 'Organic & Natural', 'Toys & Games',
] as const;

export const FAQS = [
  { id: 'faq-1', question: 'How do I track my order?', answer: 'You can track your order from the "My Orders" section in your dashboard.' },
  { id: 'faq-2', question: 'What is the return policy?', answer: 'We offer a 7-day no-questions-asked return policy for eligible items.' },
  { id: 'faq-3', question: 'How long do refunds take?', answer: 'Refunds are typically processed within 5-7 business days to the original payment method.' },
  { id: 'faq-4', question: 'Can I cancel my order?', answer: 'Orders can be cancelled before they are shipped.' },
] as const;

export const DASHBOARD_STATS = [
  { label: 'Total Orders', value: '12', link: '/orders' },
  { label: 'Active Returns', value: '1', link: '/returns' },
  { label: 'Wallet Balance', value: '₹500', link: '/wallet' },
] as const;

export const DASHBOARD_QUICK_ACTIONS = [
  { label: 'Track Order', icon: 'Package', link: '/orders' },
  { label: 'Customer Support', icon: 'HelpCircle', link: '/support' },
  { label: 'Saved Addresses', icon: 'MapPin', link: '/addresses' },
] as const;
