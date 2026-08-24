// MOCK ONLY — DELETE BEFORE SUPABASE MIGRATION
import type { IAuditLogService, IAuditLogEntry } from '../interfaces'

let MOCK_ACCESS_AUDIT_LOGS: IAuditLogEntry[] = []

export class MockAuditLogService implements IAuditLogService {
  async log(entry: Omit<IAuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    MOCK_ACCESS_AUDIT_LOGS.unshift({
      ...entry,
      id: `alog_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
    })
  }

  async list(): Promise<IAuditLogEntry[]> {
    return [...MOCK_ACCESS_AUDIT_LOGS]
  }
}
