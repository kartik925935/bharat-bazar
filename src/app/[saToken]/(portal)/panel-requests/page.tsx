'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, Clock, CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/super-admin/shared/PageHeader'
import { EmptyState } from '@/components/super-admin/shared/EmptyState'
import { StatusBadge } from '@/components/super-admin/shared/StatusBadge'
import { PermissionMatrix } from '@/components/super-admin/admin-control/PermissionMatrix'
import { useSAStore } from '@/lib/store/super-admin-store'
import { formatRelativeTime } from '@/lib/utils/formatters'
import { saPanelRequestReviewSchema, type SAPanelRequestReviewInput } from '@/lib/validators/sa-validators'
import type { SAPanelRequest, PanelRequestStatus } from '@/types/super-admin.types'

type TabFilter = 'pending' | 'approved' | 'rejected'

const ROLE_LABEL: Record<string, string> = {
  SENIOR_ADMIN: 'Senior Admin',
  OPERATIONS_ADMIN: 'Operations Admin',
  SUPPORT_ADMIN: 'Support Admin',
  FINANCE_ADMIN: 'Finance Admin',
  CONTENT_ADMIN: 'Content Admin',
  DELIVERY_ADMIN: 'Delivery Admin',
}

const LEVEL_COLORS: Record<string, string> = {
  none: 'text-[#6B6B80] bg-[#3A3A50]/30 border-[#3A3A50]/50',
  view: 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/30',
  edit: 'text-[#FF7A00] bg-[#FF7A00]/10 border-[#FF7A00]/30',
  full: 'text-[#F5C842] bg-[#F5C842]/10 border-[#F5C842]/30',
}

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
    resolver: zodResolver(saPanelRequestReviewSchema) as any,
    mode: 'onChange',
    defaultValues: { reviewNote: '', decision: 'approved' }, // placeholder to allow isValid to depend only on note
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

function PanelRequestCard({
  request,
  onApprove,
  onReject,
}: {
  request: SAPanelRequest
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
        isApproved ? 'border-l-[3px] border-[#22C55E] border-t-[#1E1E2E] border-r-[#1E1E2E] border-b-[#1E1E2E]' :
        isRejected ? 'border-l-[3px] border-[#EF4444] border-t-[#1E1E2E] border-r-[#1E1E2E] border-b-[#1E1E2E]' :
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
        "{request.reason}"
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
          <p className="text-[#D0D0E0] italic">"{request.reviewNote}"</p>
        </div>
      )}

      {/* Footer buttons */}
      {isPending && !showReviewForm && (
        <div className="flex gap-3">
          <button
            onClick={() => setShowReviewForm(true)}
            className="w-full h-9 rounded-xl border border-[#2A2A3E] text-xs font-bold text-[#8B8B9E] hover:text-white hover:border-[#3A3A50] transition-colors"
          >
            Review & Decide
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

export default function PanelRequestsPage() {
  const { panelRequests, approvePanelRequest, rejectPanelRequest } = useSAStore()
  const [activeTab, setActiveTab] = useState<TabFilter>('pending')

  const filtered = panelRequests.filter((r) => r.status === activeTab)

  const pendingCount = panelRequests.filter((r) => r.status === 'pending').length

  const handleApprove = async (id: string, note: string) => {
    await new Promise((r) => setTimeout(r, 700))
    approvePanelRequest(id, note)
    toast.success('Panel access approved', { description: 'Admin permissions updated.' })
  }

  const handleReject = async (id: string, note: string) => {
    await new Promise((r) => setTimeout(r, 600))
    rejectPanelRequest(id, note)
    toast.error('Request rejected', { description: 'No permission changes were made.' })
  }

  const TABS: { key: TabFilter; label: string; icon: React.ElementType }[] = [
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'approved', label: 'Approved', icon: CheckCircle2 },
    { key: 'rejected', label: 'Rejected', icon: XCircle },
  ]

  const EMPTY_MESSAGES: Record<TabFilter, { title: string; description: string }> = {
    pending: { title: 'No pending requests', description: 'All panel access requests have been reviewed.' },
    approved: { title: 'No approved requests yet', description: 'Approved requests will appear here.' },
    rejected: { title: 'No rejected requests', description: 'Rejected requests will appear here.' },
  }

  return (
    <div className="space-y-6 pb-safe">
      <PageHeader
        title="Panel Access Requests"
        description="Review and manage admin requests for elevated panel access"
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#111118] border border-[#1E1E2E] rounded-2xl p-1 w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              'relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors',
              activeTab === key ? 'text-white' : 'text-[#6B6B80] hover:text-[#A0A0B8]'
            )}
          >
            {activeTab === key && (
              <motion.div layoutId="tab-bg" className="absolute inset-0 bg-[#1E1E2E] rounded-xl" />
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
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}