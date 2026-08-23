'use client'
import { create } from 'zustand'
import { MOCK_SA_ADMINS, MOCK_PANEL_REQUESTS } from '@/lib/mock/sa-admins.mock'
import { MOCK_SA_CUSTOMERS } from '@/lib/mock/sa-customers.mock'
import { MOCK_SA_SELLERS } from '@/lib/mock/sa-sellers.mock'
import { MOCK_SA_PRODUCTS } from '@/lib/mock/sa-products.mock'
import { MOCK_SA_ORDERS } from '@/lib/mock/sa-orders.mock'
import { MOCK_SA_DELIVERY } from '@/lib/mock/sa-delivery.mock'
import { MOCK_SA_FINANCE_SUMMARY, MOCK_SA_SETTLEMENTS, MOCK_SA_COUPONS } from '@/lib/mock/sa-finance.mock'
import { MOCK_SA_AUDIT_LOGS } from '@/lib/mock/sa-audit.mock'
import { MOCK_SA_NOTIFICATIONS, MOCK_SA_CHART_DATA, MOCK_SA_ANALYTICS_METRICS } from '@/lib/mock/sa-notifications.mock'
import { MOCK_REVIEWS } from '@/lib/mock/sa-reviews.mock'
import { MOCK_TICKETS } from '@/lib/mock/sa-support.mock'
import * as dashboardMock from '@/lib/mock/sa-dashboard.mock'
import type {
  SAAdmin, SAPanelRequest, SACustomer, SASeller, SAProduct,
  SAOrder, SADeliveryPartner, SASettlement, SACoupon, SAAuditLog,
  SANotification, SAChartData, SAAnalyticsMetric, SAFinanceSummary,
  AdminStatus, SellerStatus, ProductStatus, PanelRequestStatus,
  SAAdminPermissions, SAPanel, SAPermissionLevel, SANote,
  SAReview, SATicket, SATicketMessage, ReviewFlagReason, NotificationType,
  SATicketReplyInput, SATicketUpdateInput, SANotificationPreferencesInput
} from '@/types/super-admin.types'

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
}

interface SuperAdminActions {
  // Admin actions
  updateAdminStatus: (adminId: string, status: AdminStatus) => void
  updateAdminPermissions: (adminId: string, permissions: SAAdminPermissions) => void
  deleteAdmin: (adminId: string) => void
  // Panel request actions
  approvePanelRequest: (requestId: string, reviewNote?: string) => void
  rejectPanelRequest: (requestId: string, reviewNote: string) => void
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
}

export const useSAStore = create<SuperAdminState & SuperAdminActions>((set, get) => ({
  // Initial state from mocks
  admins: MOCK_SA_ADMINS,
  panelRequests: MOCK_PANEL_REQUESTS,
  customers: MOCK_SA_CUSTOMERS,
  sellers: MOCK_SA_SELLERS,
  products: MOCK_SA_PRODUCTS,
  orders: MOCK_SA_ORDERS,
  deliveryPartners: MOCK_SA_DELIVERY,
  financeSummary: MOCK_SA_FINANCE_SUMMARY,
  settlements: MOCK_SA_SETTLEMENTS,
  coupons: MOCK_SA_COUPONS,
  auditLogs: MOCK_SA_AUDIT_LOGS,
  notifications: MOCK_SA_NOTIFICATIONS,
  notificationPreferences: {
    emailOnCritical: true,
    emailOnHigh: true,
    browserPushEnabled: false,
    mutedTypes: [],
  },
  reviews: MOCK_REVIEWS,
  tickets: MOCK_TICKETS,
  chartData: dashboardMock.MOCK_CHART_DATA,
  analyticsMetrics: MOCK_SA_ANALYTICS_METRICS,
  notes: [],
  
  // Dashboard slice
  dashboardMetrics: dashboardMock.MOCK_DASHBOARD_METRICS,
  categoryBreakdown: dashboardMock.MOCK_CATEGORY_BREAKDOWN,
  topSellers: dashboardMock.MOCK_TOP_SELLERS_DASHBOARD,
  recentActivity: dashboardMock.MOCK_RECENT_ACTIVITY,
  systemHealth: dashboardMock.MOCK_SYSTEM_HEALTH,
  dashboardDateRange: '30d',

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
  approvePanelRequest: (requestId, reviewNote) =>
    set((state) => {
      const request = state.panelRequests.find((r) => r.id === requestId)
      if (!request) return state
      // Update the admin's permissions when approved
      const updatedAdmins = state.admins.map((a) => {
        if (a.id === request.adminId) {
          return {
            ...a,
            permissions: { ...a.permissions, [request.requestedPanel]: request.requestedLevel },
          }
        }
        return a
      })
      return {
        panelRequests: state.panelRequests.map((r) =>
          r.id === requestId ? { ...r, status: 'approved' as PanelRequestStatus, reviewNote, reviewedAt: new Date().toISOString() } : r
        ),
        admins: updatedAdmins,
      }
    }),

  rejectPanelRequest: (requestId, reviewNote) =>
    set((state) => ({
      panelRequests: state.panelRequests.map((r) =>
        r.id === requestId ? { ...r, status: 'rejected' as PanelRequestStatus, reviewNote, reviewedAt: new Date().toISOString() } : r
      ),
    })),

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
    set({ chartData: dashboardMock.MOCK_CHART_DATA })
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
    set(state => ({
      notes: state.notes.filter(n => n.id !== noteId)
    }))
  },
}))

// Alias export for new components
export { useSAStore as useSuperAdminStore }
