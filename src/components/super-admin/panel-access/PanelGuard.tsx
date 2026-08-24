'use client'
import { useCurrentAdmin, useCurrentGrants } from '@/lib/hooks/useCurrentAdmin'
import { hasPanelAccess } from '@/lib/store/selectors/access.selectors'
import { PanelAccessRestricted } from './PanelAccessRestricted'
import type { PanelKey, AccessLevel } from '@/types/super-admin.types'

interface PanelGuardProps {
  panel: PanelKey
  minLevel?: AccessLevel
  children: React.ReactNode
}

/**
 * Wraps a panel's content with access control.
 * SUPER_ADMIN always bypasses.
 * Others must have at least minLevel access.
 * Shows PanelAccessRestricted with request CTA on denial.
 */
export function PanelGuard({ panel, minLevel = 'view', children }: PanelGuardProps) {
  const admin = useCurrentAdmin()
  const grants = useCurrentGrants()

  if (!admin) return null

  const hasAccess = hasPanelAccess(admin, grants, panel, minLevel)

  if (!hasAccess) {
    return <PanelAccessRestricted panel={panel} minLevel={minLevel} />
  }

  return <>{children}</>
}
