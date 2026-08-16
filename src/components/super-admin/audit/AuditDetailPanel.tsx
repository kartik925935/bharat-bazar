'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Monitor, Smartphone, Globe } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { SAAuditLogV2 } from '@/lib/mock/sa-audit-v2.mock'
import { AUDIT_CATEGORY_LABELS } from '@/lib/mock/sa-audit-v2.mock'

interface AuditDetailPanelProps {
  log: SAAuditLogV2 | null
  onClose: () => void
  saToken: string
}

function parseUserAgent(ua: string) {
  if (ua.toLowerCase().includes('iphone') || ua.toLowerCase().includes('android')) return <Smartphone className="w-4 h-4 text-[#8B8B9E]" />
  if (ua.toLowerCase().includes('mac') || ua.toLowerCase().includes('windows')) return <Monitor className="w-4 h-4 text-[#8B8B9E]" />
  return <Globe className="w-4 h-4 text-[#8B8B9E]" />
}

export function AuditDetailPanel({ log, onClose, saToken }: AuditDetailPanelProps) {
  if (!log) return null

  const getEntityUrl = () => {
    if (!log.targetEntityType || !log.targetEntityId) return null
    switch (log.targetEntityType) {
      case 'seller': return `/${saToken}/sellers?seller=${log.targetEntityId}`
      case 'product': return `/${saToken}/products?product=${log.targetEntityId}`
      case 'customer': return `/${saToken}/customers?customer=${log.targetEntityId}`
      case 'order': return `/${saToken}/orders?order=${log.targetEntityId}`
      case 'ticket': return `/${saToken}/support?ticket=${log.targetEntityId}`
      case 'review': return `/${saToken}/reviews?review=${log.targetEntityId}`
      default: return null
    }
  }

  const entityUrl = getEntityUrl()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#09090B]/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 bottom-0 w-full max-w-xl bg-[#111118] border-l border-[#2A2A3E] shadow-2xl flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#2A2A3E] shrink-0">
            <div>
              <h2 className="text-lg font-bold text-white">Audit Log Detail</h2>
              <p className="text-xs text-[#8B8B9E] font-mono mt-0.5">{log.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-[#8B8B9E] hover:text-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Action Summary */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={cn(
                  'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                  log.severity === 'critical' ? 'bg-[#EF4444]/15 text-[#EF4444]' :
                  log.severity === 'warning' ? 'bg-[#F59E0B]/15 text-[#F59E0B]' :
                  'bg-[#3B82F6]/15 text-[#3B82F6]'
                )}>
                  {log.severity}
                </span>
                <span className="text-xs text-[#A0A0B8]">{AUDIT_CATEGORY_LABELS[log.category] || log.category}</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-1">{log.action}</h3>
              <p className="text-xs text-[#6B6B80] font-mono">{log.actionCode}</p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider">Timestamp</p>
                <p className="text-sm text-white font-mono">{new Date(log.timestamp).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider">Actor</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-medium">{log.actorName}</span>
                  <span className="px-1.5 py-0.5 bg-[#1E1E2E] text-[#A0A0B8] rounded text-[10px] font-bold">{log.actorRole}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider">IP Address</p>
                <p className="text-sm text-white font-mono">{log.ipAddress}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider">Environment</p>
                <div className="flex items-center gap-1.5 text-sm text-[#A0A0B8]">
                  {parseUserAgent(log.userAgent)}
                  <span className="truncate" title={log.userAgent}>{log.userAgent.split('/')[0]}</span>
                </div>
              </div>
            </div>

            {/* Target Entity */}
            {log.targetEntityLabel && (
              <div className="p-4 bg-[#0A0A12] border border-[#1E1E2E] rounded-xl">
                <p className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider mb-2">Target Entity</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-[#2A2A3E] text-[#A0A0B8] rounded text-[10px] font-bold capitalize">{log.targetEntityType}</span>
                    <span className="text-sm text-white font-medium">{log.targetEntityLabel}</span>
                  </div>
                  {entityUrl && (
                    <Link
                      href={entityUrl}
                      onClick={onClose}
                      className="flex items-center gap-1 text-xs font-bold text-[#FF7A00] hover:text-[#FF9A40]"
                    >
                      View
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
                {log.targetEntityId && (
                  <p className="text-xs text-[#6B6B80] font-mono mt-1 ml-[46px]">{log.targetEntityId}</p>
                )}
              </div>
            )}

            {/* State Diff */}
            {(log.before || log.after) && (
              <div>
                <p className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider mb-3">State Changes</p>
                <div className="bg-[#0A0A12] border border-[#1E1E2E] rounded-xl overflow-hidden text-xs font-mono">
                  {/* Find all unique keys between before and after */}
                  {Array.from(new Set([...Object.keys(log.before || {}), ...Object.keys(log.after || {})])).map(key => {
                    const beforeVal = log.before?.[key]
                    const afterVal = log.after?.[key]
                    const isChanged = JSON.stringify(beforeVal) !== JSON.stringify(afterVal)

                    return (
                      <div key={key} className="grid grid-cols-2 divide-x divide-[#1E1E2E] border-b border-[#1E1E2E] last:border-0">
                        <div className={cn('p-3', isChanged && beforeVal !== undefined ? 'bg-[#EF4444]/5 text-[#FCA5A5]' : 'text-[#6B6B80]')}>
                          <span className="text-[#8B8B9E] mr-2">{key}:</span>
                          <span className={cn(isChanged && beforeVal !== undefined && 'line-through opacity-70')}>
                            {beforeVal !== undefined ? JSON.stringify(beforeVal) : 'null'}
                          </span>
                        </div>
                        <div className={cn('p-3', isChanged && afterVal !== undefined ? 'bg-[#22C55E]/5 text-[#86EFAC]' : 'text-[#6B6B80]')}>
                          <span className="text-[#8B8B9E] mr-2">{key}:</span>
                          <span>
                            {afterVal !== undefined ? JSON.stringify(afterVal) : 'null'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Additional Metadata */}
            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider mb-3">Additional Metadata</p>
                <div className="bg-[#0A0A12] border border-[#1E1E2E] rounded-xl p-3 text-xs font-mono text-[#A0A0B8]">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(log.metadata, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
