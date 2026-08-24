'use client'
import type { SAAdmin, SAPanelAccessGrant, PanelKey, AccessLevel } from '@/types/super-admin.types'

const ACCESS_LEVEL_RANK: Record<AccessLevel, number> = {
  none: 0,
  view: 1,
  edit: 2,
  full: 3,
}

/**
 * Returns the effective panel grants for a given admin.
 * Priority: blocked > granted > default
 */
export function getAdminEffectivePanels(
  grants: SAPanelAccessGrant[]
): SAPanelAccessGrant[] {
  if (!grants || grants.length === 0) return []

  const effectiveMap = new Map<PanelKey, SAPanelAccessGrant>()

  // 1. Default grants (lowest priority)
  grants.filter((g) => g.source === 'default').forEach((g) => {
    effectiveMap.set(g.panel, g)
  })

  // 2. Granted access overrides defaults
  grants.filter((g) => g.source === 'granted').forEach((g) => {
    effectiveMap.set(g.panel, g)
  })

  // 3. Blocked access (highest priority — overrides everything)
  grants.filter((g) => g.source === 'blocked').forEach((g) => {
    effectiveMap.set(g.panel, g)
  })

  return Array.from(effectiveMap.values())
}

/**
 * Check if an admin has at least minLevel access to a panel.
 * SUPER_ADMIN always returns true.
 */
export function hasPanelAccess(
  admin: SAAdmin | null,
  grants: SAPanelAccessGrant[],
  panel: PanelKey,
  minLevel: AccessLevel = 'view'
): boolean {
  if (!admin) return false
  // SUPER_ADMIN always bypasses all checks
  if (admin.role === 'SUPER_ADMIN') return true

  const effective = getAdminEffectivePanels(grants)
  const grant = effective.find((g) => g.panel === panel)
  if (!grant || grant.source === 'blocked') return false

  return ACCESS_LEVEL_RANK[grant.level] >= ACCESS_LEVEL_RANK[minLevel]
}

/**
 * Returns the count of pending panel access requests.
 * Returns 0 defensively if requests is null/empty.
 */
export function getPendingRequestsCount(
  requests: { status: string }[]
): number {
  if (!requests || requests.length === 0) return 0
  return requests.filter((r) => r.status === 'pending').length
}

/**
 * Builds the access matrix for all non-super admins.
 * Returns empty array defensively if no admins provided.
 */
export function getPanelAccessMatrix(
  admins: SAAdmin[],
  allGrants: SAPanelAccessGrant[]
): { admin: SAAdmin; grants: Partial<Record<PanelKey, SAPanelAccessGrant>> }[] {
  if (!admins || admins.length === 0) return []

  return admins
    .filter((a) => a.role !== 'SUPER_ADMIN')
    .map((admin) => {
      const adminGrants = allGrants.filter((g) => g.adminId === admin.id)
      const effective = getAdminEffectivePanels(adminGrants)
      const grantsMap: Partial<Record<PanelKey, SAPanelAccessGrant>> = {}
      effective.forEach((g) => {
        grantsMap[g.panel] = g
      })
      return { admin, grants: grantsMap }
    })
}
