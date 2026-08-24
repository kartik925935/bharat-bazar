'use client'
import React, { useMemo } from 'react'
import { Download, Search, Filter, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react'
import { useSAStore } from '@/lib/store/super-admin-store'
import { AuditDetailPanel } from '@/components/super-admin/audit/AuditDetailPanel'
import { AUDIT_CATEGORY_LABELS, AUDIT_ACTORS } from '@/lib/mock/sa-audit-v2.mock'
import type { AuditSeverity, AuditActionCategory } from '@/types/super-admin.types'
import { cn } from '@/lib/utils'

export default function AuditLogsPage({ params }: { params: Promise<{ saToken: string }> }) {
  const resolvedParams = React.use(params)
  const {
    auditLogs, auditFilter, setAuditFilter, clearAuditFilter,
    selectedAuditLogId, setSelectedAuditLogId, getFilteredLogs,
    exportAuditLog, getCriticalActionsToday
  } = useSAStore()

  const filteredLogs = getFilteredLogs()
  const criticalToday = getCriticalActionsToday()
  const selectedLog = useMemo(() => auditLogs.find(l => l.id === selectedAuditLogId) || null, [auditLogs, selectedAuditLogId])

  const todayStr = new Date().toISOString().split('T')[0]
  const logsToday = auditLogs.filter(l => l.timestamp.startsWith(todayStr))
  const uniqueActorsToday = new Set(logsToday.map(l => l.actorId)).size
  const warningsToday = logsToday.filter(l => l.severity === 'warning').length

  const severityColor = (sev: AuditSeverity) => {
    if (sev === 'critical') return 'border-l-[#EF4444]'
    if (sev === 'warning') return 'border-l-[#F59E0B]'
    return 'border-l-[#3B82F6]'
  }

  const severityBadge = (sev: AuditSeverity) => {
    if (sev === 'critical') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EF4444]/15 text-[#EF4444] uppercase">Critical</span>
    if (sev === 'warning') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F59E0B]/15 text-[#F59E0B] uppercase">Warning</span>
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3B82F6]/15 text-[#3B82F6] uppercase">Info</span>
  }

  return (
    <div className="flex flex-col h-full bg-[#09090B]">
      {/* Header & Stats */}
      <div className="p-4 md:p-6 border-b border-[#1E1E2E] shrink-0">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#22C55E]" />
              Audit Logs
            </h1>
            <p className="text-sm text-[#6B6B80] mt-1">Immutable record of all portal actions.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 py-2 text-center">
              <div className="text-xl font-bold text-white">{logsToday.length}</div>
              <div className="text-[10px] text-[#6B6B80] uppercase tracking-wide">Total Today</div>
            </div>
            <div className={cn("bg-[#111118] border rounded-xl px-4 py-2 text-center", criticalToday.length > 0 ? "border-[#EF4444]/30 bg-[#EF4444]/5" : "border-[#1E1E2E]")}>
              <div className={cn("text-xl font-bold flex justify-center items-center gap-1", criticalToday.length > 0 ? "text-[#EF4444]" : "text-white")}>
                {criticalToday.length > 0 && <AlertCircle className="w-4 h-4" />}
                {criticalToday.length}
              </div>
              <div className="text-[10px] text-[#6B6B80] uppercase tracking-wide">Critical Today</div>
            </div>
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 py-2 text-center hidden sm:block">
              <div className="text-xl font-bold text-white flex justify-center items-center gap-1">
                {warningsToday > 0 && <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />}
                {warningsToday}
              </div>
              <div className="text-[10px] text-[#6B6B80] uppercase tracking-wide">Warnings</div>
            </div>
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 py-2 text-center hidden md:block">
              <div className="text-xl font-bold text-white">{uniqueActorsToday}</div>
              <div className="text-[10px] text-[#6B6B80] uppercase tracking-wide">Active Actors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 md:px-6 bg-[#0E0E1A] border-b border-[#1E1E2E] shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B80]" />
              <input
                type="text"
                placeholder="Search action or target..."
                value={auditFilter.search || ''}
                onChange={(e) => setAuditFilter({ search: e.target.value })}
                className="w-64 h-9 pl-9 pr-3 bg-[#111118] border border-[#2A2A3E] rounded-lg text-sm text-white placeholder:text-[#4A4A5E] focus:outline-none focus:border-[#FF7A00]"
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={auditFilter.category || ''}
              onChange={(e) => setAuditFilter({ category: (e.target.value as AuditActionCategory) || undefined })}
              className="h-9 px-3 bg-[#111118] border border-[#2A2A3E] rounded-lg text-sm text-white focus:outline-none focus:border-[#FF7A00]"
            >
              <option value="">All Categories</option>
              {Object.entries(AUDIT_CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>

            {/* Actor Dropdown */}
            <select
              value={auditFilter.actorId || ''}
              onChange={(e) => setAuditFilter({ actorId: e.target.value || undefined })}
              className="h-9 px-3 bg-[#111118] border border-[#2A2A3E] rounded-lg text-sm text-white focus:outline-none focus:border-[#FF7A00]"
            >
              <option value="">All Actors</option>
              {AUDIT_ACTORS.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
              ))}
            </select>

            {/* Severity Pills */}
            <div className="flex items-center bg-[#111118] border border-[#2A2A3E] rounded-lg p-1">
              <button
                onClick={() => setAuditFilter({ severity: undefined })}
                className={cn('px-2.5 py-1 text-xs rounded-md transition-colors', !auditFilter.severity ? 'bg-[#2A2A3E] text-white' : 'text-[#6B6B80] hover:text-white')}
              >All</button>
              <button
                onClick={() => setAuditFilter({ severity: 'info' })}
                className={cn('px-2.5 py-1 text-xs rounded-md transition-colors', auditFilter.severity === 'info' ? 'bg-[#3B82F6]/20 text-[#3B82F6]' : 'text-[#6B6B80] hover:text-[#3B82F6]')}
              >Info</button>
              <button
                onClick={() => setAuditFilter({ severity: 'warning' })}
                className={cn('px-2.5 py-1 text-xs rounded-md transition-colors', auditFilter.severity === 'warning' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'text-[#6B6B80] hover:text-[#F59E0B]')}
              >Warning</button>
              <button
                onClick={() => setAuditFilter({ severity: 'critical' })}
                className={cn('px-2.5 py-1 text-xs rounded-md transition-colors', auditFilter.severity === 'critical' ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'text-[#6B6B80] hover:text-[#EF4444]')}
              >Critical</button>
            </div>

            {/* Clear Filters */}
            {Object.keys(auditFilter).length > 0 && (
              <button
                onClick={clearAuditFilter}
                className="text-xs text-[#FF7A00] hover:text-[#FF9A40] font-medium px-2"
              >
                Clear Filters
              </button>
            )}
          </div>

          <button
            onClick={exportAuditLog}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1A2E] border border-[#2A2A3E] text-[#A0A0B8] hover:text-white rounded-lg text-sm transition-colors ml-auto"
          >
            <Download className="w-4 h-4" />
            Export Filtered Log
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="bg-[#0A0A12] border border-[#1E1E2E] rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111118] border-b border-[#1E1E2E]">
                <th className="py-3 px-4 text-xs font-bold text-[#6B6B80] uppercase tracking-wider">Timestamp</th>
                <th className="py-3 px-4 text-xs font-bold text-[#6B6B80] uppercase tracking-wider">Severity</th>
                <th className="py-3 px-4 text-xs font-bold text-[#6B6B80] uppercase tracking-wider">Actor</th>
                <th className="py-3 px-4 text-xs font-bold text-[#6B6B80] uppercase tracking-wider">Action</th>
                <th className="py-3 px-4 text-xs font-bold text-[#6B6B80] uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 text-xs font-bold text-[#6B6B80] uppercase tracking-wider">Target</th>
                <th className="py-3 px-4 text-xs font-bold text-[#6B6B80] uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6B6B80] text-sm">
                    <Filter className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    No audit logs match the current filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedAuditLogId(log.id)}
                    className="border-b border-[#1E1E2E] last:border-0 hover:bg-[#111118] cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 text-xs text-[#A0A0B8] font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString(undefined, {
                        month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
                      })}
                    </td>
                    <td className={cn("py-3 px-4 border-l-2", severityColor(log.severity))}>
                      {severityBadge(log.severity)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{log.actorName}</span>
                        <span className="text-[10px] text-[#6B6B80]">{log.actorRole}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-[#E0E0E0] line-clamp-1 max-w-[280px]" title={log.action}>
                        {log.action}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-[#1A1A2E] border border-[#2A2A3E] text-[#A0A0B8] rounded text-[10px] font-medium whitespace-nowrap">
                        {AUDIT_CATEGORY_LABELS[log.category] || log.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {log.targetEntityLabel ? (
                        <span className="text-xs text-[#A0A0B8] line-clamp-1 max-w-[150px]" title={log.targetEntityLabel}>
                          {log.targetEntityLabel}
                        </span>
                      ) : (
                        <span className="text-xs text-[#4A4A5E]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#6B6B80] font-mono">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AuditDetailPanel
        log={selectedLog}
        onClose={() => setSelectedAuditLogId(null)}
        saToken={resolvedParams.saToken}
      />
    </div>
  )
}