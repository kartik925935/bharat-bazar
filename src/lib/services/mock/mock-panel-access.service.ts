// MOCK ONLY — DELETE BEFORE SUPABASE MIGRATION
import type { IPanelAccessService } from '../interfaces'
import type { SAPanelAccessGrant, SAPanelRequest, SAAdmin, PanelKey, AccessLevel } from '@/types/super-admin.types'
import { MOCK_ADMINS, MOCK_PANEL_REQUESTS } from '@/lib/mock/sa-admins.mock'
import { buildDefaultGrants } from '@/lib/constants/sa-permissions'

// In-memory mutable state (mirrors Supabase tables)
let panelGrants: SAPanelAccessGrant[] = []
let panelRequests: SAPanelRequest[] = [...MOCK_PANEL_REQUESTS]

// Seed default grants for all admins on module load
function seedGrants() {
  if (panelGrants.length > 0) return
  for (const admin of MOCK_ADMINS) {
    const defaults = buildDefaultGrants(admin.role)
    panelGrants.push(
      ...defaults.map((g) => ({
        ...g,
        id: `default_${admin.id}_${g.panel}`,
        adminId: admin.id,
      }))
    )
  }
}
seedGrants()

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export class MockPanelAccessService implements IPanelAccessService {
  async getEffectiveGrants(adminId: string): Promise<SAPanelAccessGrant[]> {
    const admin = MOCK_ADMINS.find((a) => a.id === adminId)
    if (!admin) return []

    // SUPER_ADMIN always gets everything
    if (admin.role === 'SUPER_ADMIN') {
      return buildDefaultGrants('SUPER_ADMIN').map((g) => ({
        ...g,
        id: `default_${adminId}_${g.panel}`,
        adminId,
      }))
    }

    const adminGrants = panelGrants.filter((g) => g.adminId === adminId)

    // Build effective map: blocked > granted > default
    const effectiveMap = new Map<PanelKey, SAPanelAccessGrant>()

    // 1. Default grants (lowest priority)
    const defaults = adminGrants.filter((g) => g.source === 'default')
    for (const g of defaults) effectiveMap.set(g.panel, g)

    // 2. Granted access overrides defaults
    const granted = adminGrants.filter((g) => g.source === 'granted')
    for (const g of granted) effectiveMap.set(g.panel, g)

    // 3. Blocked access (highest priority — overrides everything)
    const blocked = adminGrants.filter((g) => g.source === 'blocked')
    for (const g of blocked) effectiveMap.set(g.panel, g)

    return Array.from(effectiveMap.values())
  }

  async requestAccess(input: {
    adminId: string
    panel: PanelKey
    level: AccessLevel
    reason: string
  }): Promise<SAPanelRequest> {
    const admin = MOCK_ADMINS.find((a) => a.id === input.adminId)
    if (!admin) throw new Error('Admin not found')

    // Business rule: cannot have two pending requests for same admin+panel
    const existing = panelRequests.find(
      (r) =>
        r.adminId === input.adminId &&
        r.requestedPanel === input.panel &&
        r.status === 'pending'
    )
    if (existing) throw new Error('A pending request for this panel already exists.')

    const newRequest: SAPanelRequest = {
      id: generateId('req'),
      adminId: input.adminId,
      adminName: admin.name,
      adminEmail: admin.email,
      adminRole: admin.role,
      requestedPanel: input.panel,
      requestedLevel: input.level,
      reason: input.reason,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    }
    panelRequests.push(newRequest)
    return newRequest
  }

  async reviewRequest(input: {
    requestId: string
    decision: 'approved' | 'rejected'
    reviewerAdminId: string
    reviewerName: string
    reviewNote?: string
  }): Promise<SAPanelRequest> {
    const req = panelRequests.find((r) => r.id === input.requestId)
    if (!req) throw new Error('Request not found')

    req.status = input.decision
    req.reviewedAt = new Date().toISOString()
    req.reviewedByAdminId = input.reviewerAdminId
    req.reviewedByName = input.reviewerName
    req.reviewNote = input.reviewNote

    if (input.decision === 'approved') {
      // Create/update grant for this panel
      const existingGrantIdx = panelGrants.findIndex(
        (g) => g.adminId === req.adminId && g.panel === req.requestedPanel
      )
      const grant: SAPanelAccessGrant = {
        id: generateId('grant'),
        adminId: req.adminId,
        panel: req.requestedPanel,
        level: req.requestedLevel,
        source: 'granted',
        grantedByAdminId: input.reviewerAdminId,
        grantedByName: input.reviewerName,
        grantedAt: new Date().toISOString(),
        note: input.reviewNote,
      }
      if (existingGrantIdx >= 0) {
        panelGrants[existingGrantIdx] = grant
      } else {
        panelGrants.push(grant)
      }
    }

    return req
  }

  async withdrawRequest(requestId: string): Promise<void> {
    const req = panelRequests.find((r) => r.id === requestId)
    if (req && req.status === 'pending') {
      req.status = 'withdrawn'
    }
  }

  async grantDirect(input: {
    adminId: string
    panel: PanelKey
    level: AccessLevel
    reviewerAdminId: string
    reviewerName: string
    note?: string
  }): Promise<SAPanelAccessGrant> {
    const existingIdx = panelGrants.findIndex(
      (g) => g.adminId === input.adminId && g.panel === input.panel
    )
    const grant: SAPanelAccessGrant = {
      id: generateId('grant'),
      adminId: input.adminId,
      panel: input.panel,
      level: input.level,
      source: 'granted',
      grantedByAdminId: input.reviewerAdminId,
      grantedByName: input.reviewerName,
      grantedAt: new Date().toISOString(),
      note: input.note,
    }
    if (existingIdx >= 0) {
      panelGrants[existingIdx] = grant
    } else {
      panelGrants.push(grant)
    }
    return grant
  }

  async blockAccess(input: {
    adminId: string
    panel: PanelKey
    reviewerAdminId: string
    reviewerName: string
    note?: string
  }): Promise<SAPanelAccessGrant> {
    const existingIdx = panelGrants.findIndex(
      (g) => g.adminId === input.adminId && g.panel === input.panel
    )
    const blockGrant: SAPanelAccessGrant = {
      id: generateId('block'),
      adminId: input.adminId,
      panel: input.panel,
      level: 'none',
      source: 'blocked',
      grantedByAdminId: input.reviewerAdminId,
      grantedByName: input.reviewerName,
      grantedAt: new Date().toISOString(),
      note: input.note,
    }
    if (existingIdx >= 0) {
      panelGrants[existingIdx] = blockGrant
    } else {
      panelGrants.push(blockGrant)
    }
    return blockGrant
  }

  async listAllRequests(): Promise<SAPanelRequest[]> {
    return [...panelRequests].sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    )
  }

  async listAllAdmins(): Promise<SAAdmin[]> {
    return [...MOCK_ADMINS]
  }
}
