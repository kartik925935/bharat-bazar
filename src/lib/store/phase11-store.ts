'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  MOCK_REVENUE_SERIES, MOCK_REVENUE_WEEKLY, MOCK_REVENUE_MONTHLY,
  MOCK_COHORT_DATA, MOCK_GEOGRAPHIC_DATA, MOCK_FUNNEL_DATA,
  MOCK_SELLER_GROWTH, MOCK_PRODUCT_HEALTH, MOCK_PLATFORM_HEALTH,
  type SARevenueDataPoint, type SACohortRow, type SAGeographicDataPoint,
  type SAFunnelStep, type SASellerGrowthPoint, type SAProductHealthMetrics,
  type SAPlatformHealthScore
} from '@/lib/mock/sa-analytics.mock'
import { MOCK_AUDIT_LOGS_V2, type SAAuditLogV2 } from '@/lib/mock/sa-audit-v2.mock'
import { MOCK_PLATFORM_SETTINGS, type SAPlatformSettings } from '@/lib/mock/sa-settings.mock'
import type { SAAuditFilterInput } from '@/lib/validators/sa-audit.validators'
import type { SAPlatformSettingsInput, SAMaintenanceModeInput, SAFeatureFlagInput } from '@/lib/validators/sa-settings.validators'
import { toast } from 'sonner'

// ── Analytics State ──────────────────────────────────────────────────────────
interface AnalyticsState {
  revenueSeries: SARevenueDataPoint[]
  revenueWeekly: SARevenueDataPoint[]
  revenueMonthly: SARevenueDataPoint[]
  cohortData: SACohortRow[]
  geographicData: SAGeographicDataPoint[]
  funnelData: SAFunnelStep[]
  sellerGrowth: SASellerGrowthPoint[]
  productHealth: SAProductHealthMetrics
  platformHealth: SAPlatformHealthScore
  revenueGranularity: 'daily' | 'weekly' | 'monthly'
  geographyMetric: 'orders' | 'gmv' | 'activeSellers' | 'activeCustomers'
  setRevenueGranularity: (g: 'daily' | 'weekly' | 'monthly') => void
  setGeographyMetric: (m: 'orders' | 'gmv' | 'activeSellers' | 'activeCustomers') => void
  exportAnalyticsReport: (type: 'revenue' | 'geographic' | 'seller_growth') => Promise<void>
  getActiveRevenueSeries: () => SARevenueDataPoint[]
}

// ── Audit State ──────────────────────────────────────────────────────────────
interface AuditState {
  auditLogsV2: SAAuditLogV2[]
  auditFilter: SAAuditFilterInput
  selectedAuditLogId: string | null
  setAuditFilter: (filter: Partial<SAAuditFilterInput>) => void
  clearAuditFilter: () => void
  setSelectedAuditLogId: (id: string | null) => void
  getFilteredLogs: () => SAAuditLogV2[]
  exportAuditLog: () => Promise<void>
  getCriticalActionsToday: () => SAAuditLogV2[]
  getLogsByActor: (actorId: string) => SAAuditLogV2[]
  appendAuditLog: (log: Omit<SAAuditLogV2, 'id' | 'timestamp'>) => void
}

// ── Settings State ────────────────────────────────────────────────────────────
interface SettingsState {
  settings: SAPlatformSettings
  isSavingSettings: boolean
  updatePlatformSettings: (data: SAPlatformSettingsInput) => Promise<{ success: boolean }>
  toggleMaintenanceMode: (data: SAMaintenanceModeInput) => Promise<{ success: boolean }>
  toggleFeatureFlag: (data: SAFeatureFlagInput) => Promise<{ success: boolean }>
  updateNotificationSettings: (data: Partial<SAPlatformSettings['notifications']>) => Promise<{ success: boolean }>
  updateLegalVersion: (field: 'termsVersion' | 'privacyPolicyVersion', version: string) => Promise<{ success: boolean }>
}

type Phase11Store = AnalyticsState & AuditState & SettingsState

function downloadCSV(filename: string, rows: string[][], headers: string[]) {
  const csvContent = [headers, ...rows].map(r => r.map(cell => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const usePhase11Store = create<Phase11Store>()(
  persist(
    (set, get) => ({
      // ── Analytics ──────────────────────────────────────────────────────────
      revenueSeries: MOCK_REVENUE_SERIES,
      revenueWeekly: MOCK_REVENUE_WEEKLY,
      revenueMonthly: MOCK_REVENUE_MONTHLY,
      cohortData: MOCK_COHORT_DATA,
      geographicData: MOCK_GEOGRAPHIC_DATA,
      funnelData: MOCK_FUNNEL_DATA,
      sellerGrowth: MOCK_SELLER_GROWTH,
      productHealth: MOCK_PRODUCT_HEALTH,
      platformHealth: MOCK_PLATFORM_HEALTH,
      revenueGranularity: 'daily',
      geographyMetric: 'gmv',

      setRevenueGranularity: (g) => set({ revenueGranularity: g }),
      setGeographyMetric: (m) => set({ geographyMetric: m }),

      getActiveRevenueSeries: () => {
        const { revenueGranularity, revenueSeries, revenueWeekly, revenueMonthly } = get()
        if (revenueGranularity === 'weekly') return revenueWeekly
        if (revenueGranularity === 'monthly') return revenueMonthly
        return revenueSeries
      },

      exportAnalyticsReport: async (type) => {
        const { revenueSeries, geographicData, sellerGrowth } = get()
        if (type === 'revenue') {
          downloadCSV('revenue-report.csv',
            revenueSeries.map(r => [r.date, String(r.gmv), String(r.platformRevenue), String(r.commissions), String(r.refunds), String(r.netRevenue)]),
            ['Date', 'GMV', 'Platform Revenue', 'Commissions', 'Refunds', 'Net Revenue']
          )
        } else if (type === 'geographic') {
          downloadCSV('geographic-report.csv',
            geographicData.map(g => [g.state, g.stateCode, String(g.orders), String(g.gmv), String(g.activeSellers), String(g.activeCustomers), String(g.avgOrderValue)]),
            ['State', 'Code', 'Orders', 'GMV', 'Active Sellers', 'Active Customers', 'Avg Order Value']
          )
        } else if (type === 'seller_growth') {
          downloadCSV('seller-growth-report.csv',
            sellerGrowth.map(s => [s.month, String(s.newSellers), String(s.approvedSellers), String(s.suspendedSellers), String(s.cumulativeActive)]),
            ['Month', 'New Sellers', 'Approved', 'Suspended', 'Cumulative Active']
          )
        }
        toast.success('Report downloaded successfully')
      },

      // ── Audit ──────────────────────────────────────────────────────────────
      auditLogsV2: MOCK_AUDIT_LOGS_V2,
      auditFilter: {},
      selectedAuditLogId: null,

      setAuditFilter: (filter) => set(s => ({ auditFilter: { ...s.auditFilter, ...filter } })),
      clearAuditFilter: () => set({ auditFilter: {} }),
      setSelectedAuditLogId: (id) => set({ selectedAuditLogId: id }),

      getFilteredLogs: () => {
        const { auditLogsV2, auditFilter } = get()
        return auditLogsV2.filter(log => {
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

      exportAuditLog: async () => {
        const logs = get().getFilteredLogs()
        downloadCSV('audit-log.csv',
          logs.map(l => [
            l.timestamp, l.severity, l.actorName, l.actorRole, l.action,
            l.actionCode, l.category, l.targetEntityLabel || '—', l.ipAddress, l.userAgent
          ]),
          ['Timestamp', 'Severity', 'Actor', 'Role', 'Action', 'Action Code', 'Category', 'Target', 'IP Address', 'User Agent']
        )
        toast.success('Audit log exported')
      },

      getCriticalActionsToday: () => {
        const today = new Date(); today.setHours(0, 0, 0, 0)
        return get().auditLogsV2.filter(l =>
          l.severity === 'critical' && new Date(l.timestamp) >= today
        )
      },

      getLogsByActor: (actorId) => get().auditLogsV2.filter(l => l.actorId === actorId),

      appendAuditLog: (log) => {
        const newLog: SAAuditLogV2 = {
          ...log,
          id: `audit_${Date.now()}`,
          timestamp: new Date().toISOString(),
        }
        set(s => ({ auditLogsV2: [newLog, ...s.auditLogsV2] }))
      },

      // ── Settings ───────────────────────────────────────────────────────────
      settings: MOCK_PLATFORM_SETTINGS,
      isSavingSettings: false,

      updatePlatformSettings: async (data) => {
        set({ isSavingSettings: true })
        await new Promise(r => setTimeout(r, 800))
        set(s => ({
          settings: { ...s.settings, ...data, lastUpdatedAt: new Date().toISOString(), lastUpdatedBy: 'Arjun Mehta' },
          isSavingSettings: false,
        }))
        get().appendAuditLog({
          actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
          action: 'Updated platform business rules',
          actionCode: 'SETTINGS_UPDATED', category: 'platform_settings', severity: 'warning',
          ipAddress: '103.21.58.xxx', userAgent: 'Browser',
          after: data as Record<string, unknown>,
        })
        toast.success('Business rules saved successfully')
        return { success: true }
      },

      toggleMaintenanceMode: async (data) => {
        await new Promise(r => setTimeout(r, 600))
        set(s => ({
          settings: {
            ...s.settings,
            maintenanceMode: data.enabled,
            maintenanceMessage: data.message,
            maintenanceScheduledEnd: data.scheduledEnd,
            lastUpdatedAt: new Date().toISOString(),
            lastUpdatedBy: 'Arjun Mehta',
          }
        }))
        get().appendAuditLog({
          actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
          action: data.enabled ? 'Platform maintenance mode ENABLED' : 'Platform maintenance mode DISABLED',
          actionCode: data.enabled ? 'MAINTENANCE_MODE_ENABLED' : 'MAINTENANCE_MODE_DISABLED',
          category: 'platform_settings', severity: 'critical',
          ipAddress: '103.21.58.xxx', userAgent: 'Browser',
          before: { maintenance_mode: !data.enabled }, after: { maintenance_mode: data.enabled },
        })
        toast.success(data.enabled ? 'Maintenance mode enabled' : 'Maintenance mode disabled')
        return { success: true }
      },

      toggleFeatureFlag: async (data) => {
        await new Promise(r => setTimeout(r, 400))
        set(s => ({
          settings: {
            ...s.settings,
            features: { ...s.settings.features, [data.feature]: data.enabled },
            lastUpdatedAt: new Date().toISOString(),
          }
        }))
        get().appendAuditLog({
          actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
          action: `${data.enabled ? 'Enabled' : 'Disabled'} feature flag: ${data.feature}`,
          actionCode: 'FEATURE_FLAG_TOGGLED', category: 'platform_settings',
          severity: data.enabled ? 'info' : 'warning',
          ipAddress: '103.21.58.xxx', userAgent: 'Browser',
          before: { [data.feature]: !data.enabled }, after: { [data.feature]: data.enabled },
        })
        toast.success(`Feature ${data.feature} ${data.enabled ? 'enabled' : 'disabled'}`)
        return { success: true }
      },

      updateNotificationSettings: async (data) => {
        await new Promise(r => setTimeout(r, 500))
        set(s => ({
          settings: {
            ...s.settings,
            notifications: { ...s.settings.notifications, ...data },
            lastUpdatedAt: new Date().toISOString(),
          }
        }))
        toast.success('Notification settings saved')
        return { success: true }
      },

      updateLegalVersion: async (field, version) => {
        await new Promise(r => setTimeout(r, 500))
        set(s => ({
          settings: {
            ...s.settings,
            [field]: version,
            lastUpdatedAt: new Date().toISOString(),
            lastUpdatedBy: 'Arjun Mehta',
          }
        }))
        get().appendAuditLog({
          actorId: 'admin_001', actorName: 'Arjun Mehta', actorRole: 'super_admin',
          action: `Updated ${field === 'termsVersion' ? 'Terms of Service' : 'Privacy Policy'} to ${version}`,
          actionCode: 'LEGAL_VERSION_UPDATED', category: 'platform_settings', severity: 'warning',
          ipAddress: '103.21.58.xxx', userAgent: 'Browser',
          after: { [field]: version },
        })
        toast.success(`Legal version updated to ${version}`)
        return { success: true }
      },
    }),
    {
      name: 'phase11-store',
      partialize: (state) => ({
        settings: state.settings,
        revenueGranularity: state.revenueGranularity,
        geographyMetric: state.geographyMetric,
        auditFilter: state.auditFilter,
      }),
    }
  )
)
