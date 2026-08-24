'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Clock, CheckCircle2, XCircle, Loader2, ArrowRight, Shield,
  LayoutGrid, Inbox, Lock, Eye, Pencil, Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/super-admin/shared/PageHeader'
import { EmptyState } from '@/components/super-admin/shared/EmptyState'
import { useSASessionStore } from '@/lib/store/sa-session-store'
import { hasPanelAccess, getPanelAccessMatrix } from '@/lib/store/selectors/access.selectors'
import { formatRelativeTime } from '@/lib/utils/formatters'
import { saPanelRequestReviewSchema, type SAPanelRequestReviewInput } from '@/lib/validators/sa-validators'
import { ReviewRequestDialog } from '@/components/super-admin/panel-access/ReviewRequestDialog'
import type { SAPanelRequest, PanelKey, AccessLevel } from '@/types/super-admin.types'

type InboxTab = 'pending' | 'approved' | 'rejected'
type PageTab = 'inbox' | 'matrix'

// ── Helpers ─────────────────────────────────────────────────────────────────
const LEVEL_COLORS: Record<AccessLevel | 'none', string> = {
  none: 'text-[#6B6B80] bg-[#3A3A50]/30 border-[#3A3A50]/50',
  view: 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/30',
  edit: 'text-[#FF7A00] bg-[#FF7A00]/10 border-[#FF7A00]/30',
  full: 'text-[#F5C842] bg-[#F5C842]/10 border-[#F5C842]/30',
}

const LEVEL_ICONS: Record<AccessLevel | 'none', React.ElementType> = {
  none: Lock,
  view: Eye,
  edit: Pencil,
  full: Star,
}

const STATUS_TAB_COLORS: Record<InboxTab, string> = {
  pending: 'text-[#F5C842]',
  approved: 'text-[#22C55E]',
  rejected: 'text-[#EF4444]',
}

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  SENIOR_ADMIN: 'Senior Admin',
  OPERATIONS_ADMIN: 'Operations',
  SUPPORT_ADMIN: 'Support',
  FINANCE_ADMIN: 'Finance',
  CONTENT_ADMIN: 'Content',
  DELIVERY_ADMIN: 'Delivery',
  CUSTOM_ADMIN: 'Custom',
}

// All panels that appear in the matrix columns
const MATRIX_PANELS: PanelKey[] = [
  'dashboard', 'analytics', 'finance', 'sellers', 'customers',
  'orders', 'products', 'kyc-verification', 'reviews',
  'delivery', 'coupons', 'offers', 'panel-requests', 'audit-logs',
]

// ── Review Form ──────────────────────────────────────────────────────────────
function ReviewForm({
  request,
  onDecide,
  onCancel,
}: {
  request: SAPanelRequest
  onDecide: (decision: 'approved' | 'rejected', note: string) => Promise<void>
  onCancel: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingDecision, setPendingDecision] = useState<'approved' | 'rejected' | null>(null)

  const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm<SAPanelRequestReviewInput>({
    resolver: zodResolver(saPanelRequestReviewSchema) as never,
    mode: 'onChange',
    defaultValues: { reviewNote: '', decision: 'approved' },
  })

  const onSubmit = async (data: SAPanelRequestReviewInput) => {
    setIsSubmitting(true)
    setPendingDecision(data.decision)
    await onDecide(data.decision, data.reviewNote)
    setIsSubmitting(false)
  }

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="mt-4 pt-4 border-t border-[#1E1E2E] space-y-3 overflow-hidden"
    >
      <input type="hidden" {...register('decision')} value={pendingDecision ?? ''} />
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider">
          Review Note <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('reviewNote')}
          rows={2}
          placeholder="Provide a brief reason for your decision (required for audit trail)..."
          className="w-full bg-[#1A1A26] border border-[#2A2A3E] focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 rounded-xl px-3 py-2 text-sm text-white outline-none transition-all placeholder:text-[#5A5A70] resize-none"
          style={{ fontSize: '16px' }}
        />
        {errors.reviewNote && <p className="text-xs text-red-400">{errors.reviewNote.message}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel} className="flex-1 h-9 rounded-xl border border-[#2A2A3E] text-xs font-bold text-[#6B6B80] hover:text-white hover:border-[#3A3A50] transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          onClick={() => setValue('decision', 'rejected')}
          className="flex-1 h-9 rounded-xl border border-red-500/30 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-40"
        >
          {isSubmitting && pendingDecision === 'rejected' ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Reject'}
        </button>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          onClick={() => setValue('decision', 'approved')}
          className="flex-1 h-9 rounded-xl bg-gradient-to-r from-[#F5C842] to-[#F59E0B] text-xs font-bold text-[#1C1B14] hover:shadow-lg hover:shadow-[#F5C842]/20 transition-all disabled:opacity-40"
        >
          {isSubmitting && pendingDecision === 'approved' ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Approve'}
        </button>
      </div>
    </motion.form>
  )
}

// ── Request Card ─────────────────────────────────────────────────────────────
function PanelRequestCard({
  request,
  canReview,
  onApprove,
  onReject,
}: {
  request: SAPanelRequest
  canReview: boolean
  onApprove: (id: string, note: string) => Promise<void>
  onReject: (id: string, note: string) => Promise<void>
}) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const isPending = request.status === 'pending'
  const isApproved = request.status === 'approved'
  const isRejected = request.status === 'rejected'

  const handleDecide = async (decision: 'approved' | 'rejected', note: string) => {
    if (decision === 'approved') await onApprove(request.id, note)
    else await onReject(request.id, note)
    setShowReviewForm(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={cn(
        'bg-[#111118] border rounded-2xl p-5 relative overflow-hidden',
        isApproved ? 'border-l-[3px] border-l-[#22C55E] border-t-[#1E1E2E] border-r-[#1E1E2E] border-b-[#1E1E2E]' :
        isRejected ? 'border-l-[3px] border-l-[#EF4444] border-t-[#1E1E2E] border-r-[#1E1E2E] border-b-[#1E1E2E]' :
        'border-[#1E1E2E]'
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 flex-wrap mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2A2A3E] to-[#1A1A26] flex items-center justify-center text-sm font-bold text-[#A0A0B8] border border-[#2A2A3E] shrink-0">
          {request.adminName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-white">{request.adminName}</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20 rounded-full uppercase tracking-wider">
              {ROLE_LABEL[request.adminRole] ?? request.adminRole}
            </span>
          </div>
          <p className="text-xs text-[#6B6B80] mt-0.5">{formatRelativeTime(request.requestedAt)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-[#D0D0E0] capitalize">{request.requestedPanel.replace(/-/g, ' ')}</span>
          <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider', LEVEL_COLORS[request.requestedLevel])}>
            {request.requestedLevel}
          </span>
        </div>
      </div>

      {/* Reason */}
      <blockquote className="border-l-2 border-[#FF7A00]/40 pl-3 text-sm text-[#D0D0E0] italic leading-relaxed mb-4">
        &ldquo;{request.reason}&rdquo;
      </blockquote>

      {/* Permission delta preview */}
      {isPending && (
        <div className="flex items-center gap-2 text-xs bg-[#1A1A26] rounded-xl px-3 py-2 mb-4">
          <span className="text-[#6B6B80] font-semibold capitalize">{request.requestedPanel.replace(/-/g, ' ')}:</span>
          <span className={cn('font-bold px-1.5 py-0.5 rounded border text-[9px] uppercase', LEVEL_COLORS['none'])}>None</span>
          <ArrowRight className="w-3 h-3 text-[#6B6B80]" />
          <span className={cn('font-bold px-1.5 py-0.5 rounded border text-[9px] uppercase', LEVEL_COLORS[request.requestedLevel])}>
            {request.requestedLevel}
          </span>
        </div>
      )}

      {/* Review result (non-pending) */}
      {!isPending && request.reviewNote && (
        <div className={cn(
          'flex flex-col gap-1 px-3 py-2 rounded-xl text-xs mb-4',
          isApproved ? 'bg-[#22C55E]/10 border border-[#22C55E]/20' : 'bg-[#EF4444]/10 border border-[#EF4444]/20'
        )}>
          <div className="flex items-center gap-1.5 font-bold mb-1">
            {isApproved ? <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> : <XCircle className="w-3.5 h-3.5 text-[#EF4444]" />}
            <span className={isApproved ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
              {isApproved ? 'Approved' : 'Rejected'} by {request.reviewedBy}
            </span>
            {request.reviewedAt && <span className="text-[#6B6B80] font-normal ml-auto">{formatRelativeTime(request.reviewedAt)}</span>}
          </div>
          <p className="text-[#D0D0E0] italic">&ldquo;{request.reviewNote}&rdquo;</p>
        </div>
      )}

      {/* Footer buttons (only SUPER_ADMIN / SENIOR_ADMIN can review) */}
      {isPending && canReview && !showReviewForm && (
        <div className="flex gap-3">
          <button
            onClick={() => setShowReviewForm(true)}
            className="w-full h-9 rounded-xl border border-[#2A2A3E] text-xs font-bold text-[#8B8B9E] hover:text-white hover:border-[#3A3A50] transition-colors"
          >
            Review &amp; Decide
          </button>
        </div>
      )}

      <AnimatePresence>
        {showReviewForm && (
          <ReviewForm
            request={request}
            onDecide={handleDecide}
            onCancel={() => setShowReviewForm(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── RBAC Matrix ──────────────────────────────────────────────────────────────
function RBACMatrix() {
  const allAdmins = useSASessionStore((s) => s.allAdmins)
  const allGrants = useSASessionStore((s) => s.allGrants)

  const matrix = getPanelAccessMatrix(allAdmins, allGrants)

  if (matrix.length === 0) {
    return (
      <EmptyState
        icon={LayoutGrid}
        title="No admin data"
        description="The RBAC matrix will populate once admins are loaded."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#1E1E2E]">
      <table className="w-full min-w-[900px] text-xs">
        <thead>
          <tr className="bg-[#0D0D14] border-b border-[#1E1E2E]">
            <th className="text-left px-4 py-3 text-[#6B6B80] font-bold uppercase tracking-wider whitespace-nowrap sticky left-0 bg-[#0D0D14] z-10">
              Admin
            </th>
            <th className="text-left px-3 py-3 text-[#6B6B80] font-bold uppercase tracking-wider whitespace-nowrap">
              Role
            </th>
            {MATRIX_PANELS.map((panel) => (
              <th key={panel} className="px-2 py-3 text-[#6B6B80] font-bold uppercase tracking-wider whitespace-nowrap text-center">
                {panel.replace(/-/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map(({ admin, grants }, i) => (
            <tr
              key={admin.id}
              className={cn(
                'border-b border-[#1E1E2E] transition-colors hover:bg-[#111118]',
                i % 2 === 0 ? 'bg-[#09090B]' : 'bg-[#0D0D14]'
              )}
            >
              {/* Admin Name (sticky) */}
              <td className={cn('px-4 py-3 sticky left-0 z-10', i % 2 === 0 ? 'bg-[#09090B]' : 'bg-[#0D0D14]')}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF7A00]/20 to-[#F5C842]/10 border border-[#FF7A00]/20 flex items-center justify-center text-[10px] font-bold text-[#FF7A00] shrink-0">
                    {admin.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white whitespace-nowrap">{admin.name}</p>
                    <p className="text-[10px] text-[#6B6B80]">{admin.email}</p>
                  </div>
                </div>
              </td>
              {/* Role */}
              <td className="px-3 py-3 whitespace-nowrap">
                <span className="text-[9px] font-bold px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
                  {ROLE_LABEL[admin.role] ?? admin.role}
                </span>
              </td>
              {/* Panel cells */}
              {MATRIX_PANELS.map((panel) => {
                const grant = grants[panel]
                const level: AccessLevel | 'none' = grant?.level ?? 'none'
                const isBlocked = grant?.source === 'blocked'
                const Icon = isBlocked ? Lock : LEVEL_ICONS[level]

                return (
                  <td key={panel} className="px-2 py-3 text-center">
                    <div className="flex justify-center">
                      <span className={cn(
                        'inline-flex items-center justify-center w-6 h-6 rounded-md border',
                        isBlocked ? 'bg-red-500/10 border-red-500/30 text-red-400' : LEVEL_COLORS[level]
                      )}>
                        <Icon className="w-3 h-3" />
                      </span>
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-3 bg-[#0D0D14] border-t border-[#1E1E2E]">
        <p className="text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider">Legend:</p>
        {(['none', 'view', 'edit', 'full'] as const).map((lv) => {
          const Icon = LEVEL_ICONS[lv]
          return (
            <div key={lv} className="flex items-center gap-1.5">
              <span className={cn('inline-flex items-center justify-center w-5 h-5 rounded border', LEVEL_COLORS[lv])}>
                <Icon className="w-2.5 h-2.5" />
              </span>
              <span className="text-[10px] text-[#6B6B80] capitalize">{lv}</span>
            </div>
          )
        })}
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded border bg-red-500/10 border-red-500/30 text-red-400">
            <Lock className="w-2.5 h-2.5" />
          </span>
          <span className="text-[10px] text-[#6B6B80]">Blocked</span>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function PanelRequestsPage() {
  const currentAdmin = useSASessionStore((s) => s.currentAdmin)
  const allRequests = useSASessionStore((s) => s.allRequests)
  const currentGrants = useSASessionStore((s) => s.currentGrants)
  const reviewPanelRequest = useSASessionStore((s) => s.reviewPanelRequest)

  const [pageTab, setPageTab] = useState<PageTab>('inbox')
  const [activeTab, setActiveTab] = useState<InboxTab>('pending')

  const isSuperAdmin = currentAdmin?.role === 'SUPER_ADMIN'
  const isSeniorAdmin = currentAdmin?.role === 'SENIOR_ADMIN'
  const canReview = isSuperAdmin || isSeniorAdmin || hasPanelAccess(currentAdmin, currentGrants, 'panel-requests', 'edit')

  const filtered = allRequests.filter((r) => r.status === activeTab)
  const pendingCount = allRequests.filter((r) => r.status === 'pending').length

  const handleApprove = async (id: string, note: string) => {
    await reviewPanelRequest({ requestId: id, decision: 'approved', reviewNote: note })
  }

  const handleReject = async (id: string, note: string) => {
    await reviewPanelRequest({ requestId: id, decision: 'rejected', reviewNote: note })
  }

  const INBOX_TABS: { key: InboxTab; label: string; icon: React.ElementType }[] = [
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'approved', label: 'Approved', icon: CheckCircle2 },
    { key: 'rejected', label: 'Rejected', icon: XCircle },
  ]

  const EMPTY_MESSAGES: Record<InboxTab, { title: string; description: string }> = {
    pending: { title: 'No pending requests', description: 'All panel access requests have been reviewed.' },
    approved: { title: 'No approved requests yet', description: 'Approved requests will appear here.' },
    rejected: { title: 'No rejected requests', description: 'Rejected requests will appear here.' },
  }

  return (
    <div className="space-y-6 pb-safe">
      <PageHeader
        title="Panel Access Requests"
        description="Review admin access requests and manage the RBAC permission matrix"
      />

      {/* Page-level Tab toggle (Inbox / Matrix) */}
      <div className="flex items-center gap-1 bg-[#111118] border border-[#1E1E2E] rounded-2xl p-1 w-fit">
        {[
          { key: 'inbox' as PageTab, label: 'Request Inbox', icon: Inbox },
          { key: 'matrix' as PageTab, label: 'RBAC Matrix', icon: LayoutGrid },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setPageTab(key)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors',
              pageTab === key ? 'text-white' : 'text-[#6B6B80] hover:text-[#A0A0B8]'
            )}
          >
            {pageTab === key && (
              <motion.div layoutId="page-tab-bg" className="absolute inset-0 bg-[#1E1E2E] rounded-xl" />
            )}
            <Icon className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {pageTab === 'inbox' ? (
          <motion.div
            key="inbox"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* Inbox sub-tabs */}
            <div className="flex items-center gap-1 bg-[#111118] border border-[#1E1E2E] rounded-2xl p-1 w-fit">
              {INBOX_TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    'relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors',
                    activeTab === key ? STATUS_TAB_COLORS[key] : 'text-[#6B6B80] hover:text-[#A0A0B8]'
                  )}
                >
                  {activeTab === key && (
                    <motion.div layoutId="inbox-tab-bg" className="absolute inset-0 bg-[#1E1E2E] rounded-xl" />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{label}</span>
                  {key === 'pending' && pendingCount > 0 && (
                    <span className="relative z-10 w-4 h-4 rounded-full bg-[#FF7A00] text-white text-[9px] font-black flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Not authorized to review */}
            {!canReview && activeTab === 'pending' && filtered.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-3 bg-[#F5C842]/10 border border-[#F5C842]/20 rounded-xl">
                <Shield className="w-4 h-4 text-[#F5C842] shrink-0" />
                <p className="text-xs text-[#F5C842]">
                  You have <strong>view</strong> access to this panel. Only admins with <strong>edit</strong> or higher can approve / reject requests.
                </p>
              </div>
            )}

            {/* Cards */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                  <EmptyState
                    icon={activeTab === 'pending' ? Clock : activeTab === 'approved' ? CheckCircle2 : XCircle}
                    title={EMPTY_MESSAGES[activeTab].title}
                    description={EMPTY_MESSAGES[activeTab].description}
                  />
                ) : (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-4"
                  >
                    <AnimatePresence>
                      {filtered.map((req) => (
                        <PanelRequestCard
                          key={req.id}
                          request={req}
                          canReview={canReview}
                          onApprove={handleApprove}
                          onReject={handleReject}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <RBACMatrix />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}