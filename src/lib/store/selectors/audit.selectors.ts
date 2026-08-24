import type { SAAuditLog } from '@/types/super-admin.types'

export interface AuditState {
  auditLogs: SAAuditLog[]
}

/** Returns audit logs in strict descending chronological order */
export const getAuditLogsSorted = (state: AuditState): SAAuditLog[] =>
  [...state.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

/** Count of audit logs that occurred today */
export const getAuditTodayCount = (state: AuditState): number => {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  return state.auditLogs.filter(log => new Date(log.timestamp) >= todayStart).length
}

/** Count of critical/failure actions today */
export const getAuditCriticalTodayCount = (state: AuditState): number => {
  const criticalActions: SAAuditLog['action'][] = [
    'login_failed', 'admin_suspended', 'admin_deleted',
    'customer_blocked', 'seller_suspended',
  ]
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  return state.auditLogs.filter(
    log => criticalActions.includes(log.action) && new Date(log.timestamp) >= todayStart
  ).length
}

export const getAuditStats = (state: AuditState) => ({
  total: state.auditLogs.length,
  today: getAuditTodayCount(state),
  criticalToday: getAuditCriticalTodayCount(state),
})
