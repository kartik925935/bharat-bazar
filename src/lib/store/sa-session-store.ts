'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, panelAccessService, auditLogService } from '@/lib/services'
import type { SAAdmin, SAPanelAccessGrant, SAPanelRequest, PanelKey, AccessLevel } from '@/types/super-admin.types'
import { toast } from 'sonner'

interface SASessionState {
  // Persisted (localStorage key: sa-session)
  currentAdminId: string | null

  // Fetched at runtime (not persisted — always re-fetched via service)
  currentAdmin: SAAdmin | null
  currentGrants: SAPanelAccessGrant[]
  allAdmins: SAAdmin[]
  allRequests: SAPanelRequest[]
  allGrants: SAPanelAccessGrant[]
  isLoading: boolean
}

interface SASessionActions {
  // Auth
  login(email: string, password: string): Promise<{ success: boolean; error?: string }>
  logout(): Promise<void>
  switchAdminDev(adminId: string): Promise<void>
  hydrateSession(): Promise<void>

  // Panel access actions (all go through panelAccessService)
  requestPanelAccess(input: { panel: PanelKey; level: AccessLevel; reason: string }): Promise<void>
  reviewPanelRequest(input: {
    requestId: string
    decision: 'approved' | 'rejected'
    reviewNote?: string
  }): Promise<void>
  withdrawPanelRequest(requestId: string): Promise<void>
  grantPanelAccessDirect(input: { adminId: string; panel: PanelKey; level: AccessLevel; note?: string }): Promise<void>
  blockPanelAccess(input: { adminId: string; panel: PanelKey; note?: string }): Promise<void>
  refreshAllData(): Promise<void>
}

export const useSASessionStore = create<SASessionState & SASessionActions>()(
  persist(
    (set, get) => ({
      currentAdminId: null,
      currentAdmin: null,
      currentGrants: [],
      allAdmins: [],
      allRequests: [],
      allGrants: [],
      isLoading: false,

      // ─── Auth ─────────────────────────────────────────────
      async login(email, password) {
        set({ isLoading: true })
        const result = await authService.login(email, password)
        if (!result.success || !result.admin) {
          set({ isLoading: false })
          return { success: false, error: result.error }
        }

        const admin = result.admin
        const grants = await panelAccessService.getEffectiveGrants(admin.id)
        const allAdmins = await panelAccessService.listAllAdmins()
        const allRequests = await panelAccessService.listAllRequests()

        await auditLogService.log({
          actorAdminId: admin.id,
          actorName: admin.name,
          actionType: 'LOGIN',
          payload: { email },
          ip: 'MOCK',
        })

        set({
          currentAdminId: admin.id,
          currentAdmin: admin,
          currentGrants: grants,
          allAdmins,
          allRequests,
          isLoading: false,
        })
        return { success: true }
      },

      async logout() {
        const { currentAdminId, currentAdmin } = get()
        if (currentAdminId && currentAdmin) {
          await auditLogService.log({
            actorAdminId: currentAdminId,
            actorName: currentAdmin.name,
            actionType: 'LOGOUT',
            payload: {},
            ip: 'MOCK',
          })
          await authService.logout(currentAdminId)
        }
        set({
          currentAdminId: null,
          currentAdmin: null,
          currentGrants: [],
          allRequests: [],
        })
      },

      /** Dev-only: instantly switch to any admin without password */
      async switchAdminDev(adminId) {
        let allAdmins = get().allAdmins
        if (!allAdmins.length) {
          allAdmins = await panelAccessService.listAllAdmins()
          set({ allAdmins })
        }
        const admin = allAdmins.find((a) => a.id === adminId)
        if (!admin) return
        
        // Ensure mock auth service knows we're logged in
        if (typeof window !== 'undefined') {
          localStorage.setItem('sa-auth-session', JSON.stringify({
            adminId: admin.id,
            email: admin.email,
            loggedInAt: new Date().toISOString(),
          }))
        }
        
        const grants = await panelAccessService.getEffectiveGrants(adminId)
        set({ currentAdminId: adminId, currentAdmin: admin, currentGrants: grants })
      },

      /** Called on app boot to restore session from localStorage */
      async hydrateSession() {
        const { currentAdminId } = get()
        if (!currentAdminId) return

        set({ isLoading: true })
        try {
          const [allAdmins, allRequests, grants] = await Promise.all([
            panelAccessService.listAllAdmins(),
            panelAccessService.listAllRequests(),
            panelAccessService.getEffectiveGrants(currentAdminId),
          ])
          const admin = allAdmins.find((a) => a.id === currentAdminId) ?? null
          set({
            currentAdmin: admin,
            currentGrants: grants,
            allAdmins,
            allRequests,
            isLoading: false,
          })
        } catch {
          set({ isLoading: false })
        }
      },

      async refreshAllData() {
        const { currentAdminId } = get()
        if (!currentAdminId) return
        const [allAdmins, allRequests, grants] = await Promise.all([
          panelAccessService.listAllAdmins(),
          panelAccessService.listAllRequests(),
          panelAccessService.getEffectiveGrants(currentAdminId),
        ])
        set({ allAdmins, allRequests, currentGrants: grants })
      },

      // ─── Panel Access Actions ──────────────────────────────
      async requestPanelAccess({ panel, level, reason }) {
        const { currentAdminId, currentAdmin } = get()
        if (!currentAdminId || !currentAdmin) return

        await panelAccessService.requestAccess({
          adminId: currentAdminId,
          panel,
          level,
          reason,
        })
        await auditLogService.log({
          actorAdminId: currentAdminId,
          actorName: currentAdmin.name,
          actionType: 'PANEL_ACCESS_REQUESTED',
          payload: { panel, level, reason },
          ip: 'MOCK',
        })
        await get().refreshAllData()
        toast.success(`Access request submitted for ${panel}`)
      },

      async reviewPanelRequest({ requestId, decision, reviewNote }) {
        const { currentAdminId, currentAdmin, allRequests } = get()
        if (!currentAdminId || !currentAdmin) return

        const req = allRequests.find((r) => r.id === requestId)
        await panelAccessService.reviewRequest({
          requestId,
          decision,
          reviewerAdminId: currentAdminId,
          reviewerName: currentAdmin.name,
          reviewNote,
        })
        await auditLogService.log({
          actorAdminId: currentAdminId,
          actorName: currentAdmin.name,
          actionType: decision === 'approved' ? 'PANEL_ACCESS_APPROVED' : 'PANEL_ACCESS_REJECTED',
          targetAdminId: req?.adminId,
          payload: { requestId, decision, panel: req?.requestedPanel, reviewNote },
          ip: 'MOCK',
        })
        await get().refreshAllData()
        toast.success(`Request ${decision}`)
      },

      async withdrawPanelRequest(requestId) {
        const { currentAdminId, currentAdmin, allRequests } = get()
        if (!currentAdminId || !currentAdmin) return

        const req = allRequests.find((r) => r.id === requestId)
        await panelAccessService.withdrawRequest(requestId)
        await auditLogService.log({
          actorAdminId: currentAdminId,
          actorName: currentAdmin.name,
          actionType: 'PANEL_REQUEST_WITHDRAWN',
          payload: { requestId, panel: req?.requestedPanel },
          ip: 'MOCK',
        })
        await get().refreshAllData()
        toast.info('Request withdrawn')
      },

      async grantPanelAccessDirect({ adminId, panel, level, note }) {
        const { currentAdminId, currentAdmin } = get()
        if (!currentAdminId || !currentAdmin) return

        await panelAccessService.grantDirect({
          adminId,
          panel,
          level,
          reviewerAdminId: currentAdminId,
          reviewerName: currentAdmin.name,
          note,
        })
        await auditLogService.log({
          actorAdminId: currentAdminId,
          actorName: currentAdmin.name,
          actionType: 'PANEL_ACCESS_GRANTED',
          targetAdminId: adminId,
          payload: { panel, level, note },
          ip: 'MOCK',
        })
        await get().refreshAllData()
        toast.success(`${panel} access granted`)
      },

      async blockPanelAccess({ adminId, panel, note }) {
        const { currentAdminId, currentAdmin } = get()
        if (!currentAdminId || !currentAdmin) return

        await panelAccessService.blockAccess({
          adminId,
          panel,
          reviewerAdminId: currentAdminId,
          reviewerName: currentAdmin.name,
          note,
        })
        await auditLogService.log({
          actorAdminId: currentAdminId,
          actorName: currentAdmin.name,
          actionType: 'PANEL_ACCESS_BLOCKED',
          targetAdminId: adminId,
          payload: { panel, note },
          ip: 'MOCK',
        })
        await get().refreshAllData()
        toast.warning(`${panel} access blocked`)
      },
    }),
    {
      name: 'sa-session',
      // Only persist the session ID — runtime data is always re-fetched
      partialize: (state) => ({ currentAdminId: state.currentAdminId }),
    }
  )
)
