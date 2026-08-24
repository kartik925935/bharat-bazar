'use client'
import { create } from 'zustand'
// ── Canonical Mock DB (Single Source of Truth)
import { MOCK_DB } from '@/lib/mock/db'
import { assertMinimumVolumes, validateMockDataIntegrity } from '@/lib/mock/db/validate'
// ── Legacy mocks still used for reviews, tickets, notifications (not yet migrated)
import { MOCK_SA_ADMINS, MOCK_PANEL_REQUESTS } from '@/lib/mock/sa-admins.mock'
import { MOCK_SA_NOTIFICATIONS, MOCK_SA_ANALYTICS_METRICS } from '@/lib/mock/sa-notifications.mock'
import { MOCK_REVIEWS } from '@/lib/mock/sa-reviews.mock'
import { MOCK_TICKETS } from '@/lib/mock/sa-support.mock'
import * as dashboardMock from '@/lib/mock/sa-dashboard.mock'
import { getTotalGMV, getTotalCommission, getPendingSettlementsTotal, getTotalRefunds } from '@/lib/store/selectors/finance.selectors'
import type {
  SAAdmin, SAPanelRequest, SACustomer, SASeller, SAProduct,
  SAOrder, SADeliveryPartner, SASettlement, SACoupon, SAAuditLog,
  SANotification, SAChartData, SAAnalyticsMetric, SAFinanceSummary,
  AdminStatus, SellerStatus, ProductStatus, SAPanelRequestStatus,
  PanelKey, SAPanelAccessGrant, SANote,
  SAReview, SATicket, SATicketMessage, ReviewFlagReason, NotificationType,
  SATicketReplyInput, SATicketUpdateInput, SANotificationPreferencesInput
} from '@/types/super-admin.types'
import type { SAAuditFilterInput } from '@/lib/validators/sa-audit.validators'
import { toast } from 'sonner'

interface SuperAdminState {
  // Admins
  admins: SAAdmin[]
  panelRequests: SAPanelRequest[]
  // Users
  customers: SACustomer[]
  sellers: SASeller[]
  // Catalogue
  products: SAProduct[]
  // Operations
  orders: SAOrder[]
  deliveryPartners: SADeliveryPartner[]
  // Finance
  financeSummary: SAFinanceSummary
  settlements: SASettlement[]
  coupons: SACoupon[]
  // Audit & Notifications
  auditLogs: SAAuditLog[]
  auditFilter: SAAuditFilterInput
  selectedAuditLogId: string | null
  notifications: SANotification[]
  notificationPreferences: SANotificationPreferencesInput
  // Support & Reviews (Phase 10)
  reviews: SAReview[]
  tickets: SATicket[]
  // Analytics
  chartData: typeof dashboardMock.MOCK_CHART_DATA
  analyticsMetrics: SAAnalyticsMetric[]
  // Dashboard specifics
  dashboardMetrics: typeof dashboardMock.MOCK_DASHBOARD_METRICS
  categoryBreakdown: typeof dashboardMock.MOCK_CATEGORY_BREAKDOWN
  topSellers: typeof dashboardMock.MOCK_TOP_SELLERS_DASHBOARD
  recentActivity: typeof dashboardMock.MOCK_RECENT_ACTIVITY
  systemHealth: typeof dashboardMock.MOCK_SYSTEM_HEALTH
  dashboardDateRange: '7d' | '30d' | '90d' | 'custom'
  // Notes
  notes: SANote[]
  
  // Data loading state
  isInitialized: boolean
}

interface SuperAdminActions {
  // Initialization & Data Loading
  initStore: () => Promise<void>
  setAdmins: (admins: SAAdmin[]) => void
  setCustomers: (customers: SACustomer[]) => void
  setSellers: (sellers: SASeller[]) => void
  setProducts: (products: SAProduct[]) => void
  setOrders: (orders: SAOrder[]) => void
  setDeliveryPartners: (partners: SADeliveryPartner[]) => void
  setCoupons: (coupons: SACoupon[]) => void
  
  // Admin actions
  updateAdminStatus: (adminId: string, status: AdminStatus) => void
  updateAdminPermissions: (adminId: string, permissions: SAPanelAccessGrant[]) => void
  deleteAdmin: (adminId: string) => void
  // Panel request actions
  approvePanelRequest: (requestId: string, reviewNote?: string) => void
  rejectPanelRequest: (requestId: string, reviewNote: string) => void
  requestPanelAccess: (panel: PanelKey) => Promise<{ success: boolean }>
  // Customer actions
  blockCustomer: (customerId: string) => void
  unblockCustomer: (customerId: string) => void
  
  // Seller actions
  updateSellerStatus: (sellerId: string, status: SellerStatus) => void
  updateSellerKYCStatus: (sellerId: string, kycStatus: 'pending' | 'verified' | 'rejected') => void
  updateSellerDocStatus: (sellerId: string, docType: 'pan' | 'gst' | 'bank', isVerified: boolean) => void
  
  // Product actions
  updateProductStatus: (productId: string, status: ProductStatus) => void
  // Reviews actions (Phase 10)
  approveReview: (id: string, note?: string) => Promise<{ success: boolean }>
  rejectReview: (id: string, note: string) => Promise<{ success: boolean }>
  bulkApproveReviews: (ids: string[]) => Promise<{ success: boolean }>
  bulkRejectReviews: (ids: string[]) => Promise<{ success: boolean }>
  flagReview: (id: string, reason: ReviewFlagReason) => Promise<{ success: boolean }>
  deleteReview: (id: string) => Promise<{ success: boolean }>
  getPendingReviewsCount: () => number
  getFlaggedReviewsCount: () => number
  getSentimentBreakdown: () => Record<SAReview['sentimentLabel'], number>
  
  // Notification actions (Phase 10)
  markNotificationRead: (notifId: string) => void
  markAllNotificationsRead: () => void
  dismissNotification: (id: string) => void
  dismissAllNotifications: () => void
  updateNotificationPreferences: (prefs: SANotificationPreferencesInput) => Promise<{ success: boolean }>
  getUnreadNotificationCount: () => number
  getCriticalNotificationCount: () => number
  getNotificationsGroupedByType: () => Record<NotificationType, SANotification[]>
  
  // Support Ticket actions (Phase 10)
  replyToTicket: (ticketId: string, input: SATicketReplyInput) => Promise<{ success: boolean }>
  updateTicket: (ticketId: string, input: SATicketUpdateInput) => Promise<{ success: boolean }>
  assignTicket: (ticketId: string, adminId: string) => Promise<{ success: boolean }>
  closeTicket: (ticketId: string) => Promise<{ success: boolean }>
  reopenTicket: (ticketId: string) => Promise<{ success: boolean }>
  addTicketInternalNote: (ticketId: string, note: string) => Promise<{ success: boolean }>
  getOpenTicketsCount: () => number
  getSlaBreachedTicketsCount: () => number
  getAvgFirstResponseTime: () => string
  getCSATScore: () => number
  
  // Restored Getters & Dashboard & Notes
  getPendingRequestCount: () => number
  setDashboardDateRange: (range: '7d' | '30d' | '90d' | 'custom') => void
  refreshDashboard: () => Promise<void>
  addActivityEvent: (activity: dashboardMock.DashboardActivity) => void
  getNotesForEntity: (entityType: SANote['entityType'], entityId: string) => SANote[]
  addNote: (entityType: SANote['entityType'], entityId: string, content: string) => Promise<void>
  togglePinNote: (noteId: string) => Promise<void>
  deleteNote: (noteId: string) => Promise<void>

  // Audit Log actions
  setAuditFilter: (filter: Partial<SAAuditFilterInput>) => void
  clearAuditFilter: () => void
  setSelectedAuditLogId: (id: string | null) => void
  getFilteredLogs: () => SAAuditLog[]
  exportAuditLog: () => Promise<void>
  getCriticalActionsToday: () => SAAuditLog[]
  getLogsByActor: (actorId: string) => SAAuditLog[]
  appendAuditLog: (log: Omit<SAAuditLog, 'id' | 'timestamp'>) => void
}

export const useSAStore = create<SuperAdminState & SuperAdminActions>((set, get) => ({
  // Empty initial state
  isInitialized: false,
  admins: [],
  panelRequests: [],
  customers: [],
  sellers: [],
  products: [],
  orders: [],
  deliveryPartners: [],
  financeSummary: { 
    totalGMV: 0, 
    totalRevenue: 0, 
    totalCommission: 0, 
    pendingSettlements: 0, 
    completedSettlements: 0, 
    totalRefunds: 0, 
    periodGMV: 0, 
    periodRevenue: 0 
  },
  settlements: [],
  coupons: [],
  auditLogs: [],
  auditFilter: {},
  selectedAuditLogId: null,
  notifications: [],
  notificationPreferences: {
    emailOnCritical: true,
    emailOnHigh: true,
    browserPushEnabled: false,
    mutedTypes: [],
  },
  reviews: [],
  tickets: [],
  chartData: [],
  analyticsMetrics: [],
  notes: [],
  
  // Dashboard specifics
  dashboardMetrics: [],
  categoryBreakdown: [],
  topSellers: [],
  recentActivity: [],
  systemHealth: { apiStatus: 'operational', dbStatus: 'operational', paymentGatewayStatus: 'operational', storageStatus: 'operational', avgResponseTime: 0, uptimePercentage: 100 },
  dashboardDateRange: '30d',

  // Initialization & Setters
  initStore: async () => {
    // ── Load from canonical MOCK_DB (deterministic, single source of truth)
    assertMinimumVolumes(MOCK_DB)
    const integrityErrors = validateMockDataIntegrity(MOCK_DB)
    if (integrityErrors.length === 0 && process.env.NODE_ENV === 'development') {
      console.info('✅ Mock DB integrity check passed.')
    }

    // Derive financeSummary from orders (computed, never hardcoded)
    const financeState = { orders: MOCK_DB.orders, settlements: MOCK_DB.settlements }
    const financeSummary = {
      totalGMV: getTotalGMV(financeState),
      totalRevenue: getTotalGMV(financeState),
      totalCommission: getTotalCommission(financeState),
      pendingSettlements: getPendingSettlementsTotal(financeState),
      completedSettlements: MOCK_DB.settlements.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.netAmount, 0),
      totalRefunds: getTotalRefunds(financeState),
      periodGMV: getTotalGMV(financeState),
      periodRevenue: getTotalGMV(financeState),
    }

    set({
      isInitialized: true,
      admins: MOCK_SA_ADMINS,
      panelRequests: MOCK_PANEL_REQUESTS,
      sellers: MOCK_DB.sellers,
      customers: MOCK_DB.customers,
      products: MOCK_DB.products,
      orders: MOCK_DB.orders,
      deliveryPartners: MOCK_DB.deliveryPartners,
      settlements: MOCK_DB.settlements,
      coupons: MOCK_DB.coupons,
      auditLogs: MOCK_DB.auditLogs,
      financeSummary,
      notifications: MOCK_SA_NOTIFICATIONS,
      analyticsMetrics: MOCK_SA_ANALYTICS_METRICS,
      reviews: MOCK_REVIEWS,
      tickets: MOCK_TICKETS,
    })
  },
  setAdmins: (admins) => set({ admins }),
  setCustomers: (customers) => set({ customers }),
  setSellers: (sellers) => set({ sellers }),
  setProducts: (products) => set({ products }),
  setOrders: (orders) => set({ orders }),
  setDeliveryPartners: (deliveryPartners) => set({ deliveryPartners }),
  setCoupons: (coupons) => set({ coupons }),

  // Admin actions
  updateAdminStatus: (adminId, status) =>
    set((state) => ({
      admins: state.admins.map((a) => a.id === adminId ? { ...a, status } : a),
    })),

  updateAdminPermissions: (adminId, permissions) =>
    set((state) => ({
      admins: state.admins.map((a) => a.id === adminId ? { ...a, permissions } : a),
    })),

  deleteAdmin: (adminId) =>
    set((state) => ({
      admins: state.admins.filter((a) => a.id !== adminId),
    })),

  // Panel request actions
  approvePanelRequest: (id, note) => set(state => ({
    panelRequests: state.panelRequests.map(r => 
      r.id === id ? { ...r, status: 'approved', reviewNote: note, reviewedAt: new Date().toISOString() } : r
    )
  })),
  rejectPanelRequest: (id, note) => set(state => ({
    panelRequests: state.panelRequests.map(r => 
      r.id === id ? { ...r, status: 'rejected', reviewNote: note, reviewedAt: new Date().toISOString() } : r
    )
  })),
  requestPanelAccess: async (panel) => {
    await new Promise(r => setTimeout(r, 500))
    set(state => ({
      panelRequests: [
        {
          id: `req-${Date.now()}`,
          adminId: 'sa-001', // Mocking current admin
          adminName: 'Kartik Kumar',
          adminEmail: 'kartik@bharatbazaar.in',
          adminRole: 'SUPER_ADMIN',
          requestedPanel: panel,
          requestedLevel: 'view',
          reason: 'Access requested via panel guard screen',
          status: 'pending',
          requestDate: new Date().toISOString(),
          requestedAt: new Date().toISOString()
        },
        ...state.panelRequests
      ]
    }))
    toast.success(`Access request for ${panel} submitted`)
    return { success: true }
  },

  // Customer actions
  blockCustomer: (customerId) =>
    set((state) => ({
      customers: state.customers.map((c) => c.id === customerId ? { ...c, status: 'blocked' as const } : c),
    })),

  unblockCustomer: (customerId) =>
    set((state) => ({
      customers: state.customers.map((c) => c.id === customerId ? { ...c, status: 'active' as const } : c),
    })),

  // Seller actions
  updateSellerStatus: (sellerId, status) =>
    set((state) => ({
      sellers: state.sellers.map((s) => s.id === sellerId ? { ...s, status } : s),
    })),
    
  updateSellerKYCStatus: (sellerId, kycStatus) =>
    set((state) => ({
      sellers: state.sellers.map((s) => 
        s.id === sellerId 
          ? { ...s, kycStatus, status: kycStatus === 'verified' ? 'active' : (kycStatus === 'rejected' ? 'rejected' : s.status) } 
          : s
      ),
    })),
    
  updateSellerDocStatus: (sellerId, docType, isVerified) =>
    set((state) => ({
      sellers: state.sellers.map((s) => {
        if (s.id !== sellerId) return s
        return {
          ...s,
          ...(docType === 'pan' ? { panVerified: isVerified } : {}),
          ...(docType === 'gst' ? { gstVerified: isVerified } : {}),
          ...(docType === 'bank' ? { bankVerified: isVerified } : {})
        }
      })
    })),

  // Product actions
  updateProductStatus: (productId, status) =>
    set((state) => ({
      products: state.products.map((p) => p.id === productId ? { ...p, status } : p),
    })),

  markNotificationRead: (notifId) =>
    set((state) => ({
      notifications: state.notifications.map((n) => n.id === notifId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })),
    })),

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => n.id === id ? { ...n, isDismissed: true } : n),
    })),

  dismissAllNotifications: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isDismissed: true })),
    })),

  updateNotificationPreferences: async (prefs) => {
    set({ notificationPreferences: prefs })
    return { success: true }
  },

  // Reviews actions (Phase 10)
  approveReview: async (id, note) => {
    set((state) => ({
      reviews: state.reviews.map(r => r.id === id ? { ...r, status: 'approved', adminNote: note || r.adminNote, updatedAt: new Date().toISOString() } : r)
    }))
    return { success: true }
  },
  
  rejectReview: async (id, note) => {
    set((state) => ({
      reviews: state.reviews.map(r => r.id === id ? { ...r, status: 'rejected', adminNote: note, updatedAt: new Date().toISOString() } : r)
    }))
    return { success: true }
  },
  
  bulkApproveReviews: async (ids) => {
    set((state) => ({
      reviews: state.reviews.map(r => ids.includes(r.id) ? { ...r, status: 'approved', updatedAt: new Date().toISOString() } : r)
    }))
    return { success: true }
  },
  
  bulkRejectReviews: async (ids) => {
    set((state) => ({
      reviews: state.reviews.map(r => ids.includes(r.id) ? { ...r, status: 'rejected', updatedAt: new Date().toISOString() } : r)
    }))
    return { success: true }
  },
  
  flagReview: async (id, reason) => {
    set((state) => ({
      reviews: state.reviews.map(r => r.id === id ? { ...r, status: 'flagged', flagReason: reason, flaggedBy: 'system', updatedAt: new Date().toISOString() } : r)
    }))
    return { success: true }
  },
  
  deleteReview: async (id) => {
    set((state) => ({
      reviews: state.reviews.filter(r => r.id !== id)
    }))
    return { success: true }
  },

  // Support Ticket actions (Phase 10)
  replyToTicket: async (ticketId, reply) => {
    set((state) => ({
      tickets: state.tickets.map(t => {
        if (t.id !== ticketId) return t
        const newMessage = {
          id: `msg_${Date.now()}`,
          ticketId,
          senderId: 'admin_1', // Mock current admin
          senderName: 'Current Admin',
          senderRole: 'super_admin' as const,
          message: reply.message,
          attachments: reply.attachments || [],
          createdAt: new Date().toISOString(),
          isInternal: reply.isInternal,
        } as SATicketMessage
        return { 
          ...t, 
          messages: [...t.messages, newMessage],
          updatedAt: new Date().toISOString(),
          firstResponseAt: t.firstResponseAt || new Date().toISOString()
        }
      })
    }))
    return { success: true }
  },

  updateTicket: async (ticketId: string, update: SATicketUpdateInput) => {
    set((state) => ({
      tickets: state.tickets.map(t => t.id === ticketId ? { ...t, ...update, updatedAt: new Date().toISOString() } : t)
    }))
    return { success: true }
  },

  assignTicket: async (ticketId, adminId) => {
    // In real app we'd fetch admin details
    set((state) => ({
      tickets: state.tickets.map(t => t.id === ticketId ? { ...t, assignedAdminId: adminId, assignedAdminName: 'Assigned Admin', updatedAt: new Date().toISOString() } : t)
    }))
    return { success: true }
  },

  closeTicket: async (ticketId) => {
    set((state) => ({
      tickets: state.tickets.map(t => t.id === ticketId ? { ...t, status: 'closed', resolvedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : t)
    }))
    return { success: true }
  },

  reopenTicket: async (ticketId) => {
    set((state) => ({
      tickets: state.tickets.map(t => t.id === ticketId ? { ...t, status: 'in_progress', updatedAt: new Date().toISOString() } : t)
    }))
    return { success: true }
  },

  addTicketInternalNote: async (ticketId, note) => {
    get().replyToTicket(ticketId, { message: note, isInternal: true })
    return { success: true }
  },

  // Getters
  getUnreadNotificationCount: () =>
    get().notifications.filter((n) => !n.isRead).length,

  getPendingRequestCount: () =>
    get().panelRequests.filter((r) => r.status === 'pending').length,

  // Phase 10 Getters
  getPendingReviewsCount: () => get().reviews.filter(r => r.status === 'pending_approval').length,
  getFlaggedReviewsCount: () => get().reviews.filter(r => r.status === 'flagged').length,
  getSentimentBreakdown: () => {
    const breakdown = { very_positive: 0, positive: 0, neutral: 0, negative: 0, very_negative: 0 }
    get().reviews.forEach(r => { if (breakdown[r.sentimentLabel] !== undefined) breakdown[r.sentimentLabel]++ })
    return breakdown as Record<SAReview['sentimentLabel'], number>
  },

  getCriticalNotificationCount: () => get().notifications.filter(n => !n.isRead && n.priority === 'critical').length,
  getNotificationsGroupedByType: () => {
    const grouped: any = {}
    get().notifications.forEach(n => {
      if (!grouped[n.type]) grouped[n.type] = []
      grouped[n.type].push(n)
    })
    return grouped
  },

  getOpenTicketsCount: () => get().tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length,
  getSlaBreachedTicketsCount: () => get().tickets.filter(t => t.slaBreached).length,
  getAvgFirstResponseTime: () => "4h 22m", // Mocked for simplicity
  getCSATScore: () => {
    const ratings = get().tickets.filter(t => t.satisfactionRating).map(t => t.satisfactionRating as number)
    return ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
  },

  // Dashboard Actions
  setDashboardDateRange: (range) => {
    set({ dashboardDateRange: range })
  },
  refreshDashboard: async () => {
    await new Promise((r) => setTimeout(r, 700))
    // chartData is now derived via getRevenueTrend() selector, not stored
    set({ dashboardDateRange: get().dashboardDateRange })
  },
  addActivityEvent: (activity) => {
    set((state) => ({
      recentActivity: [activity, ...state.recentActivity].slice(0, 50),
    }))
  },

  // Notes actions
  getNotesForEntity: (entityType, entityId) => {
    return get().notes.filter(n => n.entityType === entityType && n.entityId === entityId)
  },
  addNote: async (entityType, entityId, content) => {
    await new Promise(r => setTimeout(r, 200)) // mock API call
    const currentUser = { id: 'sa-001', name: 'Super Admin', avatar: undefined } // Mock current user
    const newNote: SANote = {
      id: Math.random().toString(36).slice(2, 9),
      entityType,
      entityId,
      content,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      createdAt: new Date().toISOString(),
      isPinned: false
    }
    set(state => ({ notes: [newNote, ...state.notes] }))
  },
  togglePinNote: async (noteId) => {
    await new Promise(r => setTimeout(r, 200))
    set(state => ({
      notes: state.notes.map(n => n.id === noteId ? { ...n, isPinned: !n.isPinned } : n)
    }))
  },
  deleteNote: async (noteId) => {
    await new Promise(r => setTimeout(r, 200))
    set({ notes: get().notes.filter(n => n.id !== noteId) })
  },

  // ── Audit Log actions ──────────────────────────────────────────────────
  setAuditFilter: (filter) => set(s => ({ auditFilter: { ...s.auditFilter, ...filter } })),
  clearAuditFilter: () => set({ auditFilter: {} }),
  setSelectedAuditLogId: (id) => set({ selectedAuditLogId: id }),

  getFilteredLogs: () => {
    const { auditLogs, auditFilter } = get()
    return auditLogs.filter(log => {
      if (auditFilter.category && log.category !== auditFilter.category) return false
      if (auditFilter.severity && log.severity !== auditFilter.severity) return false
      if (auditFilter.actorId && log.actorId !== auditFilter.actorId) return false
      if (auditFilter.dateFrom && new Date(log.timestamp) < new Date(auditFilter.dateFrom)) return false
      if (auditFilter.dateTo && new Date(log.timestamp) > new Date(auditFilter.dateTo)) return false
      if (auditFilter.search) {
        const q = auditFilter.search.toLowerCase()
        return log.action.toLowerCase().includes(q) ||
          log.targetEntityLabel?.toLowerCase().includes(q) ||
          log.actionCode.toLowerCase().includes(q) ||
          log.actorName.toLowerCase().includes(q)
      }
      return true
    })
  },

  getCriticalActionsToday: () => {
    const { auditLogs } = get()
    const todayStr = new Date().toISOString().split('T')[0]
    return auditLogs.filter(l => l.severity === 'critical' && l.timestamp.startsWith(todayStr))
  },

  getLogsByActor: (actorId) => get().auditLogs.filter(l => l.actorId === actorId),

  appendAuditLog: (log) => set(s => ({
    auditLogs: [{
      ...log,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    } as SAAuditLog, ...s.auditLogs]
  })),

  exportAuditLog: async () => {
    const logs = get().getFilteredLogs()
    const headers = ['Timestamp', 'Actor', 'Role', 'Action', 'Severity', 'Category', 'Target', 'IP Address']
    const rows = logs.map(l => [
      new Date(l.timestamp).toLocaleString(),
      l.actorName,
      l.actorRole,
      l.action,
      l.severity,
      l.category,
      l.targetEntityLabel || '',
      l.ipAddress
    ])
    
    const csvContent = [headers, ...rows].map(r => r.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Audit logs exported successfully')
  },
}))

// Alias export for new components
export { useSAStore as useSuperAdminStore }
