// ============================================
// AUTHENTICATION TYPES
// ============================================
export type SAAuthStage = 'credentials' | 'totp' | 'device-verify' | 'authenticated'

export interface SASuperAdmin {
  id: string
  email: string
  name: string
  avatar?: string
  role: SAAdminRole
  createdAt: string
  lastLogin: string
  twoFactorEnabled: boolean
  trustedDevices: string[]
  permissions?: SAPanelAccessGrant[]
}

export interface SASession {
  superAdmin: SASuperAdmin
  token: string
  expiresAt: string
  deviceId: string
  ipAddress: string
  loginAt: string
}

// ============================================
// ADMIN PANEL PERMISSION TYPES
// ============================================
export type PanelKey =
  | 'dashboard' | 'analytics'
  | 'finance' | 'finance.commissions' | 'finance.settlements'
  | 'kyc-verification' | 'products' | 'reviews'
  | 'sellers' | 'customers' | 'orders' | 'returns'
  | 'delivery' | 'coupons' | 'offers'
  | 'panel-requests' | 'settings' | 'storefront' | 'audit-logs' | 'notifications' | 'support' | 'admin-control'

export type AccessLevel = 'none' | 'view' | 'edit' | 'full'

export interface SAPanelAccessGrant {
  id?: string
  adminId?: string
  panel: PanelKey
  level: AccessLevel
  source: 'default' | 'granted' | 'blocked'
  grantedBy?: string
  grantedByAdminId?: string
  grantedByName?: string
  grantedAt?: string
  note?: string
}

export type SAAdminRole =
  | 'SUPER_ADMIN'
  | 'SENIOR_ADMIN'
  | 'FINANCE_ADMIN'
  | 'OPERATIONS_ADMIN'
  | 'SUPPORT_ADMIN'
  | 'CONTENT_ADMIN'
  | 'DELIVERY_ADMIN'
  | 'CUSTOM_ADMIN'

export type AdminStatus = 'active' | 'inactive' | 'suspended' | 'pending'

export interface SAAdmin {
  id: string
  name: string
  email: string
  avatar?: string
  role: SAAdminRole
  status: AdminStatus
  permissions: SAPanelAccessGrant[]
  createdAt: string
  lastActive: string
  createdBy: string
  department: string
}

// ============================================
// PANEL REQUEST TYPES
// ============================================
export type SAPanelRequestStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn'

// ── Backward-compat aliases (do not use in new code) ──────────────────────
/** @deprecated Use PanelKey */
export type SAPanel = PanelKey
/** @deprecated Use AccessLevel */
export type SAPermissionLevel = AccessLevel
/** @deprecated Use SAAdminRole */
export type AdminRole = SAAdminRole
/** @deprecated Use SAPanelRequestStatus */
export type PanelRequestStatus = SAPanelRequestStatus
/** @deprecated Use SAPanelAccessGrant[] */
export type SAAdminPermissions = SAPanelAccessGrant[]


export interface SAPanelRequest {
  id: string
  adminId: string
  adminName: string
  adminEmail: string
  adminRole: SAAdminRole
  requestedPanel: PanelKey
  requestedLevel: AccessLevel
  reason: string
  status: SAPanelRequestStatus
  requestedAt: string
  reviewedAt?: string
  reviewedBy?: string
  reviewedByAdminId?: string
  reviewedByName?: string
  reviewNote?: string
}

// ============================================
// CUSTOMER TYPES
// ============================================
export type CustomerStatus = 'active' | 'blocked' | 'pending' | 'suspended'
export type CustomerTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface SACustomer {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  status: CustomerStatus
  tier: CustomerTier
  totalOrders: number
  totalSpent: number
  joinedAt: string
  lastActive: string
  address?: string
  city?: string
  state?: string
  isVerified: boolean
}

// ============================================
// SELLER TYPES
// ============================================
export type SellerStatus = 'active' | 'pending' | 'suspended' | 'rejected' | 'under_review'
export type SellerTier = 'bronze' | 'silver' | 'gold' | 'platinum'
export type SellerType = 'ngo' | 'village_producer' | 'artisan' | 'shop_owner' | 'shg_group' | 'professional'

export interface SASeller {
  id: string
  sellerId: string
  legalName: string
  displayName: string
  username: string
  email: string
  phone: string
  avatar?: string
  shopName: string
  shopBanner?: string
  sellerType: SellerType
  status: SellerStatus
  tier: SellerTier
  totalProducts: number
  totalSales: number
  totalOrders: number
  rating: number
  joinedAt: string
  lastActive: string
  village?: string
  district?: string
  state: string
  kycStatus: 'pending' | 'verified' | 'rejected'
  panVerified: boolean
  gstVerified: boolean
  bankVerified: boolean
  commissionRate: number

  // New onboarding fields for KYC details
  alternatePhone?: string
  dateOfBirth?: string
  shopCategory?: string
  shopSubcategory?: string
  shopTagline?: string
  shopDescription?: string
  address?: string
  city?: string
  pincode?: string
  bankAccountName?: string
  bankName?: string
  branchName?: string
  ifscCode?: string
  accountNumber?: string
  accountType?: string
  upiId?: string

  // KYC Documents
  panNumber?: string
  aadhaarNumber?: string
  gstNumber?: string
}

// ============================================
// PRODUCT TYPES
// ============================================
export type ProductStatus = 'pending_review' | 'published' | 'rejected' | 'draft' | 'suspended'

export interface SAProduct {
  id: string
  name: string
  sellerId: string
  sellerName: string
  category: string
  subcategory?: string
  price: number
  mrp: number
  stock: number
  status: ProductStatus
  images: string[]
  rating: number
  totalReviews: number
  totalSales: number
  createdAt: string
  updatedAt: string
}

// ============================================
// ORDER TYPES
// ============================================
export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'confirmed'
  | 'processing'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded'

export interface SAOrder {
  id: string
  orderId: string
  customerId: string
  customerName: string
  sellerId: string
  sellerName: string
  products: string[]
  totalAmount: number
  status: OrderStatus
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  deliveryPartnerId?: string
  deliveryPartnerName?: string
  createdAt: string
  updatedAt: string
  deliveredAt?: string
  address: string
  city: string
  state: string
}

// ============================================
// DELIVERY TYPES
// ============================================
export type DeliveryPartnerStatus = 'active' | 'inactive' | 'on_delivery' | 'suspended'

export interface SADeliveryPartner {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  status: DeliveryPartnerStatus
  totalDeliveries: number
  successRate: number
  activeOrders: number
  rating: number
  city: string
  state: string
  joinedAt: string
  vehicleType: 'bike' | 'scooter' | 'cycle' | 'van'
}

// ============================================
// FINANCE TYPES
// ============================================
export interface SAFinanceSummary {
  totalGMV: number
  totalRevenue: number
  totalCommission: number
  pendingSettlements: number
  completedSettlements: number
  totalRefunds: number
  periodGMV: number
  periodRevenue: number
}

export interface SASettlement {
  id: string
  sellerId: string
  sellerName: string
  amount: number
  commission: number
  netAmount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  ordersCount: number
  periodStart: string
  periodEnd: string
  createdAt: string
  paidAt?: string
}

// ============================================
// ANALYTICS TYPES
// ============================================
export interface SAAnalyticsMetric {
  label: string
  value: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  period: string
}

export interface SAChartData {
  date: string
  revenue: number
  orders: number
  newCustomers: number
  newSellers: number
}

// ============================================
// AUDIT LOG TYPES
// ============================================
export type AuditAction = 'login_success' | 'login_failed' | 'admin_created' | 'admin_suspended' | 'admin_deleted' |
  'permission_granted' | 'permission_revoked' | 'seller_approved' | 'seller_suspended' |
  'customer_blocked' | 'product_approved' | 'product_rejected' | 'order_cancelled' |
  'refund_initiated' | 'settlement_processed' | 'settings_changed'
  | 'login_success'
  | 'login_failed'

export type AuditActionCategory =
  | 'authentication'
  | 'admin_management'
  | 'seller_management'
  | 'product_management'
  | 'order_management'
  | 'finance'
  | 'customer_management'
  | 'platform_settings'
  | 'review_management'
  | 'support'
  | 'coupon_management'

export type AuditSeverity = 'info' | 'warning' | 'critical'

export interface SAAuditLog {
  id: string
  timestamp: string
  actorId: string
  actorName: string
  actorRole: 'super_admin' | 'admin'
  action: string
  actionCode: string
  category: AuditActionCategory
  severity: AuditSeverity
  targetEntityType?: string
  targetEntityId?: string
  targetEntityLabel?: string
  ipAddress: string
  userAgent: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

// ============================================
// PHASE 10: REVIEWS, NOTIFICATIONS, SUPPORT
// ============================================

export type ReviewStatus = 'pending_approval' | 'approved' | 'rejected' | 'flagged'
export type ReviewFlagReason = 'spam' | 'offensive_language' | 'competitor_mention' | 'fake_review_suspected' | 'irrelevant_content'

export interface SAReview {
  id: string
  productId: string
  productName: string
  productImage: string
  customerId: string
  customerName: string
  customerTier: 'bronze' | 'silver' | 'gold' | 'platinum'
  sellerId: string
  sellerName: string
  rating: number                        // 1-5
  title: string
  body: string
  images: string[]                      // customer-uploaded review photos
  verifiedPurchase: boolean
  status: ReviewStatus
  flagReason?: ReviewFlagReason
  flaggedBy: 'system' | 'seller' | 'customer' | null
  sellerReplyText?: string              // seller's public reply if any
  sellerReplyAt?: string
  adminNote?: string                    // internal note, not visible to public
  helpfulVotes: number
  createdAt: string
  updatedAt: string
  // Sentiment analysis
  sentimentScore: number                // -1.0 to 1.0
  sentimentLabel: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative'
  // Authenticity signals
  reviewVelocityFlag: boolean           // customer posted 5+ reviews in 24h
  sameDeviceFlag: boolean               // multiple reviews from same device fingerprint
  purchaseToReviewDays: number          // how many days after delivery was review posted
}

export type NotificationType =
  | 'new_seller_application'
  | 'kyc_submitted'
  | 'product_submitted'
  | 'order_sla_breach'
  | 'dispute_opened'
  | 'dispute_escalated'
  | 'payment_failed'
  | 'reconciliation_mismatch'
  | 'coupon_abuse_detected'
  | 'review_flagged'
  | 'system_alert'
  | 'settlement_processed'
  | 'admin_action'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical'

export interface SANotification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  body: string
  isRead: boolean
  isDismissed: boolean
  relatedEntityType?: 'order' | 'seller' | 'customer' | 'product' | 'review' | 'coupon' | 'settlement'
  relatedEntityId?: string
  actionLabel?: string              // e.g., "Review Now", "View Order"
  actionRoute?: string              // deep link route within the portal
  createdAt: string
  readAt?: string
}

export type TicketStatus = 'open' | 'in_progress' | 'waiting_for_user' | 'resolved' | 'closed'
export type TicketCategory =
  | 'order_issue'
  | 'payment_issue'
  | 'kyc_rejection_appeal'
  | 'product_rejection_appeal'
  | 'account_suspension_appeal'
  | 'delivery_issue'
  | 'refund_issue'
  | 'technical_bug'
  | 'general_inquiry'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketSubmitterRole = 'customer' | 'seller'

export interface SATicketMessage {
  id: string
  ticketId: string
  senderId: string
  senderName: string
  senderRole: 'customer' | 'seller' | 'admin' | 'super_admin'
  message: string
  attachments: string[]
  createdAt: string
  isInternal: boolean           // true = internal admin note, not visible to submitter
}

export interface SATicket {
  id: string
  ticketNumber: string          // e.g., TKT-2025-00142
  submitterId: string
  submitterName: string
  submitterRole: TicketSubmitterRole
  submitterEmail: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  subject: string
  assignedAdminId?: string
  assignedAdminName?: string
  relatedOrderId?: string
  relatedProductId?: string
  relatedSellerId?: string
  messages: SATicketMessage[]
  tags: string[]
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  firstResponseAt?: string      // SLA tracking: time to first admin response
  slaBreached: boolean          // if first response > 24h or resolution > 72h
  satisfactionRating?: 1 | 2 | 3 | 4 | 5   // post-resolution CSAT score
}

// ============================================
// COUPON TYPES
// ============================================
export type CouponType = 'percentage' | 'fixed' | 'buy_x_get_y'
export type CouponStatus = 'active' | 'inactive' | 'expired'

export interface SACoupon {
  id: string
  code: string
  type: CouponType
  value: number
  minOrder: number
  maxDiscount?: number
  usageLimit: number
  usageCount: number
  userLimit: number
  status: CouponStatus
  startDate: string
  endDate: string
  createdBy: string
  createdAt: string
  appliesTo: 'all' | 'category' | 'seller' | 'product'
}

// ============================================
// PLATFORM SETTINGS TYPES
// ============================================
export interface SAPlatformSettings {
  siteName: string
  siteTagline: string
  maintenanceMode: boolean
  allowNewSellers: boolean
  allowNewCustomers: boolean
  defaultCommissionRate: number
  sellerRegistrationFee: number
  minWithdrawalAmount: number
  returnWindowDays: number
  maxImagesPerProduct: number
  featuredProductsCount: number
  supportEmail: string
  supportPhone: string
}

// ============================================
// INTERNAL NOTES (Step 0A)
// ============================================
export interface SANote {
  id: string
  entityType: 'customer' | 'seller' | 'order' | 'admin' | 'settlement'
  entityId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
  isPinned: boolean
}

// ============================================
// EXTENDED CUSTOMER (Step 6 — Trust Intelligence)
// ============================================
export interface SACustomerExtended extends SACustomer {
  riskScore: number
  returnRate: number
  fraudFlags: string[]
  avgOrderValue: number
  loginHistory: { device: string; location: string; timestamp: string }[]
  wishlistCount: number
  cartAbandonCount: number
}

export interface CustomerOrderSnippet {
  orderId: string
  date: string
  amount: number
  status: OrderStatus
  items: number
}

// ============================================
// EXTENDED SELLER (Step 6 — Onboarding Funnel)
// ============================================
export interface SASellerOnboardingStep {
  step: 'account_created' | 'email_verified' | 'business_details' | 'kyc_submitted' | 'kyc_verified' | 'bank_added' | 'first_product' | 'admin_approved' | 'first_sale'
  completedAt: string | null
}

export interface SASellerPerformanceMonth {
  month: string
  sales: number
  orders: number
  returnRate: number
}

export interface SASellerWarningRecord {
  id: string
  category: 'product_quality' | 'late_dispatch' | 'customer_complaints' | 'policy_violation' | 'other'
  description: string
  severity: 'low' | 'medium' | 'high'
  issuedAt: string
  issuedBy: string
}

export interface SASellerExtended extends SASeller {
  onboardingSteps: SASellerOnboardingStep[]
  performanceHistory: SASellerPerformanceMonth[]
  warningsIssued: number
  warningRecords: SASellerWarningRecord[]
  documentsExpiringSoon: string[]
}

// ============================================
// EXTENDED PRODUCT (Step 7 — Quality Intelligence)
// ============================================
export interface SAProductDetail extends SAProduct {
  description: string
  shortDescription?: string
  productBadges?: string[]
  gstSlab?: string
  processingTime?: string
  specifications: Record<string, string>
  discount: number
  sku: string
  weight: string
  completenessScore: number
  qualityFlags: string[]
  rejectionHistory?: { reason: string; rejectedAt: string; rejectedBy: string }[]
  priceAnomalyFlag: boolean
  categoryAvgPrice: number
  duplicateOfProductId?: string
  viewCount: number
  conversionRate: number
  lastEditedAt: string
  editHistory: { field: string; oldValue: string; newValue: string; editedAt: string }[]
}

export interface SABulkImportRow {
  rowNumber: number
  name: string
  category: string
  price: number
  stock: number
  errors: string[]
  status: 'valid' | 'warning' | 'error'
}

// ============================================
// EXTENDED ORDER (Step 8 — SLA + Disputes)
// ============================================
export interface SAOrderItem {
  productId: string
  productName: string
  image: string
  quantity: number
  price: number
}

export interface SAOrderDetail extends SAOrder {
  items: SAOrderItem[]
  subtotal: number
  discount: number
  deliveryFee: number
  statusHistory: { status: OrderStatus; timestamp: string; note?: string }[]
  slaDeadline: string
  isSlaBreached: boolean
  isVip: boolean
  priorityLevel: 'normal' | 'high' | 'urgent'
  disputeStatus: 'none' | 'open' | 'escalated' | 'resolved'
  disputeReason?: string
  disputeResolvedAt?: string
  disputeResolvedBy?: string
  disputeResolution?: string
  codRiskScore?: number
}

// ============================================
// FINANCE EXTENDED (Step 9)
// ============================================
export interface SAReconciliationRecord {
  id: string
  orderId: string
  gatewayTransactionId: string
  orderAmount: number
  gatewayAmount: number
  status: 'matched' | 'mismatch' | 'missing_gateway' | 'missing_order'
  date: string
  resolvedAt?: string
  resolvedBy?: string
  resolvedNote?: string
}

export interface SACouponAbuseFlag {
  couponId: string
  couponCode: string
  customerId: string
  customerName: string
  usageCount: number
  flagReason: string
}

export interface SAOfferExtended {
  id: string
  name: string
  type: 'percentage' | 'fixed' | 'buy_x_get_y'
  value: number
  startDate: string
  endDate: string
  status: 'scheduled' | 'active' | 'ended'
  bannerImage: string
  appliesTo: 'all' | 'category'
  productsCount: number
  revenueGenerated: number
  ordersGenerated: number
  discountCost: number
  roi: number
}

// ============================================
// INPUT TYPES
// ============================================
export interface SANotificationPreferencesInput {
  emailOnCritical: boolean
  emailOnHigh: boolean
  browserPushEnabled: boolean
  mutedTypes: NotificationType[]
}

export interface SATicketReplyInput {
  message: string
  attachments?: string[]
  isInternal?: boolean
}

export interface SATicketUpdateInput extends Partial<SATicket> {
  status?: SATicket['status']
  priority?: SATicket['priority']
  assignedAdminId?: string
  assignedAdminName?: string
}