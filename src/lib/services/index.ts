/**
 * Service Factory (swap point for Supabase migration)
 * 
 * Today: always returns mock implementations.
 * Later: read NEXT_PUBLIC_USE_SUPABASE and return Supabase-backed implementations.
 * 
 * CRITICAL: Every component and store action imports from HERE,
 * never from the mock class files directly.
 */
import type { IAuthService, IPanelAccessService, IAuditLogService } from './interfaces'
import { MockAuthService } from './mock/mock-auth.service'
import { MockPanelAccessService } from './mock/mock-panel-access.service'
import { MockAuditLogService } from './mock/mock-audit-log.service'

export const authService: IAuthService = new MockAuthService()
export const panelAccessService: IPanelAccessService = new MockPanelAccessService()
export const auditLogService: IAuditLogService = new MockAuditLogService()

export type { IAuthService, IPanelAccessService, IAuditLogService }
export type { SAAuthSession, IAuditLogEntry } from './interfaces'
