import type {
  SAAdmin, SAPanelAccessGrant, SAPanelRequest,
  PanelKey, AccessLevel, SAAdminRole
} from '@/types/super-admin.types'

// ============================================================
// AUTH SESSION (mirrors Supabase auth.users separation)
// ============================================================
export interface SAAuthSession {
  adminId: string
  email: string
  loggedInAt: string
}

// ============================================================
// AUTH SERVICE INTERFACE
// ============================================================
export interface IAuthService {
  login(
    email: string,
    password: string
  ): Promise<{ success: boolean; admin?: SAAdmin; error?: string }>
  logout(adminId: string): Promise<void>
  getSession(): SAAuthSession | null
}

// ============================================================
// PANEL ACCESS SERVICE INTERFACE
// ============================================================
export interface IPanelAccessService {
  /** Effective grants: blocked > granted > default */
  getEffectiveGrants(adminId: string): Promise<SAPanelAccessGrant[]>

  /** Admin requests access to a panel they don't currently have */
  requestAccess(input: {
    adminId: string
    panel: PanelKey
    level: AccessLevel
    reason: string
  }): Promise<SAPanelRequest>

  /** Super Admin approves or rejects a request */
  reviewRequest(input: {
    requestId: string
    decision: 'approved' | 'rejected'
    reviewerAdminId: string
    reviewerName: string
    reviewNote?: string
  }): Promise<SAPanelRequest>

  /** Admin withdraws their own pending request */
  withdrawRequest(requestId: string): Promise<void>

  /** Super Admin directly grants access without a request */
  grantDirect(input: {
    adminId: string
    panel: PanelKey
    level: AccessLevel
    reviewerAdminId: string
    reviewerName: string
    note?: string
  }): Promise<SAPanelAccessGrant>

  /** Super Admin blocks a specific panel for an admin */
  blockAccess(input: {
    adminId: string
    panel: PanelKey
    reviewerAdminId: string
    reviewerName: string
    note?: string
  }): Promise<SAPanelAccessGrant>

  /** List all panel requests (for Super Admin inbox) */
  listAllRequests(): Promise<SAPanelRequest[]>

  /** List all admins (for matrix, sidebar, quick-switch) */
  listAllAdmins(): Promise<SAAdmin[]>
}

// ============================================================
// AUDIT LOG SERVICE INTERFACE
// ============================================================
export interface IAuditLogEntry {
  id: string
  actorAdminId: string
  actorName: string
  actionType:
    | 'LOGIN'
    | 'LOGOUT'
    | 'PANEL_ACCESS_REQUESTED'
    | 'PANEL_ACCESS_APPROVED'
    | 'PANEL_ACCESS_REJECTED'
    | 'PANEL_ACCESS_GRANTED'
    | 'PANEL_ACCESS_BLOCKED'
    | 'PANEL_REQUEST_WITHDRAWN'
  targetAdminId?: string
  payload: Record<string, unknown>
  timestamp: string
  ip: string
}

export interface IAuditLogService {
  log(entry: Omit<IAuditLogEntry, 'id' | 'timestamp'>): Promise<void>
  list(): Promise<IAuditLogEntry[]>
}
