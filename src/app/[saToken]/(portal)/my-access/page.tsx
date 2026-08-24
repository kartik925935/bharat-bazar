'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Lock, Eye, Pencil, Star, CheckCircle2, Clock, XCircle,
  Plus, AlertCircle, Loader2, ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/super-admin/shared/PageHeader'
import { EmptyState } from '@/components/super-admin/shared/EmptyState'
import { AccessLevelBadge } from '@/components/super-admin/panel-access/AccessLevelBadge'
import { RequestPanelAccessDialog } from '@/components/super-admin/panel-access/RequestPanelAccessDialog'
import { useSASessionStore } from '@/lib/store/sa-session-store'
import { getAdminEffectivePanels } from '@/lib/store/selectors/access.selectors'
import { formatRelativeTime } from '@/lib/utils/formatters'
import type { PanelKey, AccessLevel, SAPanelRequest } from '@/types/super-admin.types'

// ── All requestable panels ───────────────────────────────────────────────────
const ALL_PANELS: { key: PanelKey; label: string; description: string }[] = [
  { key: 'dashboard', label: 'Dashboard', description: 'Platform overview & KPIs' },
  { key: 'analytics', label: 'Analytics', description: 'Deep platform analytics & trends' },
  { key: 'finance', label: 'Finance', description: 'Revenue, commissions & settlements' },
  { key: 'sellers', label: 'Sellers', description: 'Manage seller accounts & shops' },
  { key: 'customers', label: 'Customers', description: 'Manage platform customers' },
  { key: 'orders', label: 'Orders', description: 'All platform orders & returns' },
  { key: 'products', label: 'Products', description: 'Product approvals & moderation' },
  { key: 'kyc-verification', label: 'KYC Verification', description: 'Verify seller documents' },
  { key: 'reviews', label: 'Reviews', description: 'Moderate product reviews' },
  { key: 'delivery', label: 'Delivery', description: 'Manage delivery partners' },
  { key: 'coupons', label: 'Coupons', description: 'Create & manage coupons' },
  { key: 'offers', label: 'Offers', description: 'Flash sales & promotions' },
  { key: 'panel-requests', label: 'Panel Requests', description: 'Access request inbox' },
  { key: 'audit-logs', label: 'Audit Logs', description: 'Full platform audit trail' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
const LEVEL_STYLES: Record<AccessLevel | 'none', { icon: React.ElementType; label: string; classes: string }> = {
  none:  { icon: Lock,    label: 'No Access',     classes: 'bg-[#3A3A50]/20 border-[#3A3A50]/40 text-[#6B6B80]' },
  view:  { icon: Eye,     label: 'View Only',     classes: 'bg-[#3B82F6]/10 border-[#3B82F6]/30 text-[#3B82F6]' },
  edit:  { icon: Pencil,  label: 'Edit Access',   classes: 'bg-[#FF7A00]/10 border-[#FF7A00]/30 text-[#FF7A00]' },
  full:  { icon: Star,    label: 'Full Control',  classes: 'bg-[#F5C842]/10 border-[#F5C842]/30 text-[#F5C842]' },
}

const REQUEST_STATUS_STYLES: Record<string, string> = {
  pending:  'bg-[#F5C842]/10 border-[#F5C842]/20 text-[#F5C842]',
  approved: 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]',
  rejected: 'bg-[#EF4444]/10 border-[#EF4444]/20 text-[#EF4444]',
  withdrawn:'bg-[#6B6B80]/10 border-[#6B6B80]/20 text-[#6B6B80]',
}
const REQUEST_STATUS_ICONS: Record<string, React.ElementType> = {
  pending:  Clock,
  approved: CheckCircle2,
  rejected: XCircle,
  withdrawn:AlertCircle,
}

// ── Panel Access Card ────────────────────────────────────────────────────────
function PanelAccessCard({
  panel,
  level,
  source,
  note,
  onRequest,
  hasPendingRequest,
}: {
  panel: PanelKey
  level: AccessLevel | 'none'
  source: 'default' | 'granted' | 'blocked' | 'none'
  note?: string
  onRequest: (panel: PanelKey) => void
  hasPendingRequest: boolean
}) {
  const { icon: Icon, label: levelLabel, classes } = LEVEL_STYLES[level]
  const panelMeta = ALL_PANELS.find((p) => p.key === panel)
  const isBlocked = source === 'blocked'

  return (
    <div className={cn(
      'bg-[#111118] border rounded-2xl p-4 flex flex-col gap-3 transition-all',
      isBlocked ? 'border-red-500/20' : 'border-[#1E1E2E] hover:border-[#2A2A3E]'
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white capitalize">{panel.replace(/-/g, ' ')}</p>
          {panelMeta && <p className="text-[11px] text-[#6B6B80] mt-0.5">{panelMeta.description}</p>}
        </div>
        <div className={cn('flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold shrink-0', classes)}>
          <Icon className="w-3 h-3" />
          {levelLabel}
        </div>
      </div>

      {/* Source badge */}
      <div className="flex items-center gap-2">
        {isBlocked ? (
          <span className="text-[10px] font-bold px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" /> Blocked by Super Admin
          </span>
        ) : source === 'granted' ? (
          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00] rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" /> Granted
          </span>
        ) : source === 'default' ? (
          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#3A3A50]/30 border border-[#3A3A50]/50 text-[#6B6B80] rounded-full flex items-center gap-1">
            <Shield className="w-2.5 h-2.5" /> Default Role Access
          </span>
        ) : null}

        {note && (
          <span className="text-[10px] text-[#6B6B80] italic truncate">&ldquo;{note}&rdquo;</span>
        )}
      </div>

      {/* Request upgrade button */}
      {!isBlocked && level !== 'full' && (
        <button
          disabled={hasPendingRequest}
          onClick={() => onRequest(panel)}
          className="flex items-center justify-center gap-1.5 h-8 rounded-xl border border-[#2A2A3E] text-[11px] font-bold text-[#6B6B80] hover:text-white hover:border-[#3A3A50] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {hasPendingRequest ? (
            <><Clock className="w-3 h-3" />Request Pending</>
          ) : (
            <><Plus className="w-3 h-3" />Request Upgrade</>
          )}
        </button>
      )}
    </div>
  )
}

// ── My Request History ───────────────────────────────────────────────────────
function MyRequestHistory({ requests, adminId }: { requests: SAPanelRequest[]; adminId: string }) {
  const myRequests = requests
    .filter((r) => r.adminId === adminId)
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())

  const withdraw = useSASessionStore((s) => s.withdrawPanelRequest)
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null)

  if (myRequests.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No requests yet"
        description="You haven't submitted any panel access requests yet."
      />
    )
  }

  const handleWithdraw = async (id: string) => {
    setWithdrawingId(id)
    await withdraw(id)
    setWithdrawingId(null)
  }

  return (
    <div className="space-y-3">
      {myRequests.map((req) => {
        const StatusIcon = REQUEST_STATUS_ICONS[req.status] ?? Clock
        return (
          <div key={req.id} className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white capitalize">{req.requestedPanel.replace(/-/g, ' ')}</span>
                  <AccessLevelBadge level={req.requestedLevel} />
                  <span className={cn(
                    'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border',
                    REQUEST_STATUS_STYLES[req.status]
                  )}>
                    <StatusIcon className="w-2.5 h-2.5" />
                    {req.status}
                  </span>
                </div>
                <p className="text-xs text-[#6B6B80] mt-1 italic">&ldquo;{req.reason}&rdquo;</p>
                <p className="text-[10px] text-[#4A4A5E] mt-1">{formatRelativeTime(req.requestedAt)}</p>
                {req.reviewNote && (
                  <p className="text-[11px] text-[#D0D0E0] mt-2 bg-[#1A1A26] border border-[#2A2A3E] rounded-lg px-3 py-1.5 italic">
                    Reviewer note: &ldquo;{req.reviewNote}&rdquo;
                  </p>
                )}
              </div>
              {req.status === 'pending' && (
                <button
                  onClick={() => handleWithdraw(req.id)}
                  disabled={withdrawingId === req.id}
                  className="shrink-0 h-8 px-3 rounded-xl border border-[#2A2A3E] text-[11px] font-bold text-[#6B6B80] hover:text-red-400 hover:border-red-500/30 disabled:opacity-40 transition-colors"
                >
                  {withdrawingId === req.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Withdraw'}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function MyAccessPage() {
  const currentAdmin = useSASessionStore((s) => s.currentAdmin)
  const currentGrants = useSASessionStore((s) => s.currentGrants)
  const allRequests = useSASessionStore((s) => s.allRequests)

  const [requestingPanel, setRequestingPanel] = useState<PanelKey | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  if (!currentAdmin) {
    return (
      <EmptyState icon={Shield} title="Not authenticated" description="Please log in to view your access." />
    )
  }

  const isSuperAdmin = currentAdmin.role === 'SUPER_ADMIN'

  // Effective grants (resolved priority: blocked > granted > default)
  const effectiveGrants = getAdminEffectivePanels(currentGrants)

  // Build display map: panel → effective grant
  const grantMap = new Map(effectiveGrants.map((g) => [g.panel, g]))

  // Pending requests for this admin (to disable re-request)
  const myPendingPanels = new Set(
    allRequests
      .filter((r) => r.adminId === currentAdmin.id && r.status === 'pending')
      .map((r) => r.requestedPanel)
  )

  const myRequests = allRequests.filter((r) => r.adminId === currentAdmin.id)

  return (
    <div className="space-y-6 pb-safe">
      <PageHeader
        title="My Access"
        description="Your current panel permissions and access request history"
      />

      {/* Admin identity card */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF7A00]/30 to-[#F5C842]/20 border border-[#FF7A00]/20 flex items-center justify-center text-lg font-bold text-[#FF7A00] shrink-0">
          {currentAdmin.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-white">{currentAdmin.name}</p>
          <p className="text-sm text-[#6B6B80]">{currentAdmin.email}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full">
              {currentAdmin.role.replace(/_/g, ' ')}
            </span>
            <span className={cn(
              'text-[10px] font-bold px-2 py-0.5 rounded-full border',
              currentAdmin.status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
              currentAdmin.status === 'suspended' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
              'bg-gray-500/10 border-gray-500/20 text-gray-400'
            )}>
              {currentAdmin.status}
            </span>
          </div>
        </div>
        {isSuperAdmin && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5C842]/10 border border-[#F5C842]/20 rounded-xl shrink-0">
            <Star className="w-3.5 h-3.5 text-[#F5C842]" />
            <span className="text-xs font-bold text-[#F5C842]">Full Access</span>
          </div>
        )}
      </div>

      {/* Super Admin bypass note */}
      {isSuperAdmin ? (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#F5C842]/10 border border-[#F5C842]/20 rounded-2xl">
          <Shield className="w-5 h-5 text-[#F5C842] shrink-0" />
          <p className="text-sm text-[#F5C842]">
            As <strong>Super Admin</strong>, you have unrestricted access to all panels. The RBAC system does not apply to your account.
          </p>
        </div>
      ) : (
        <>
          {/* Access grid */}
          <div>
            <h2 className="text-base font-bold text-white mb-3">Your Panel Permissions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {ALL_PANELS.map(({ key }) => {
                const grant = grantMap.get(key)
                const level: AccessLevel | 'none' = grant?.level ?? 'none'
                const source = grant?.source ?? 'none'
                return (
                  <PanelAccessCard
                    key={key}
                    panel={key}
                    level={level}
                    source={source}
                    note={grant?.note}
                    onRequest={setRequestingPanel}
                    hasPendingRequest={myPendingPanels.has(key)}
                  />
                )
              })}
            </div>
          </div>

          {/* Request history toggle */}
          <div>
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="flex items-center gap-2 text-sm font-bold text-white mb-3 hover:text-[#FF7A00] transition-colors"
            >
              <motion.div animate={{ rotate: showHistory ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
              My Request History
              {myRequests.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#1E1E2E] border border-[#2A2A3E] text-[#6B6B80] rounded-full">
                  {myRequests.length}
                </span>
              )}
            </button>
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <MyRequestHistory requests={allRequests} adminId={currentAdmin.id} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Request dialog */}
      <RequestPanelAccessDialog
        open={requestingPanel !== null}
        defaultPanel={requestingPanel ?? undefined}
        onClose={() => setRequestingPanel(null)}
      />
    </div>
  )
}
