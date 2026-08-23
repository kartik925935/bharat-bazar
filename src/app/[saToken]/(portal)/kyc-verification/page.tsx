'use client'
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck, FileText, CheckCircle, XCircle, Clock,
  AlertTriangle, Search, Eye, ChevronRight, User,
  Building, CreditCard, Phone, Fingerprint, RefreshCw
} from 'lucide-react'
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import type { SASellerExtended } from '@/types/super-admin.types'
import { ResponsiveSheet } from '@/components/ui/responsive-sheet'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from 'sonner'

type KYCStatus = 'pending' | 'verified' | 'rejected'

interface DocCheck {
  id: string
  label: string
  icon: React.ElementType
  status: 'pending' | 'verified' | 'rejected' | 'missing'
}

const KYC_STATUS_CONFIG: Record<KYCStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending:  { label: 'Pending Review', color: '#F59E0B', bg: '#F59E0B15', icon: Clock },
  verified: { label: 'Verified',       color: '#22C55E', bg: '#22C55E15', icon: CheckCircle },
  rejected: { label: 'Rejected',       color: '#EF4444', bg: '#EF444415', icon: XCircle },
}

function getKYCStatus(seller: SASellerExtended): KYCStatus {
  return (seller.kycStatus as KYCStatus) ?? 'pending'
}

function KYCBadge({ status }: { status: KYCStatus }) {
  const cfg = KYC_STATUS_CONFIG[status]
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}

// Derived doc checks from seller data
function getDocChecks(seller: SASellerExtended): DocCheck[] {
  return [
    { id: 'pan', label: 'PAN Verified', icon: CreditCard, status: seller.panVerified ? 'verified' : 'pending' },
    { id: 'bank', label: 'Bank Verified', icon: Building, status: seller.bankVerified ? 'verified' : 'pending' },
    { id: 'gst', label: 'GST Verified', icon: FileText, status: seller.gstVerified ? 'verified' : 'pending' },
    { id: 'kyc', label: 'KYC Documents', icon: Fingerprint, status: seller.kycStatus === 'verified' ? 'verified' : seller.kycStatus === 'rejected' ? 'rejected' : 'pending' },
    { id: 'phone', label: 'Phone Registered', icon: Phone, status: seller.phone ? 'verified' : 'missing' },
  ]
}

const DOC_STATUS_CONFIG = {
  verified: { color: '#22C55E', label: 'Verified' },
  pending:  { color: '#F59E0B', label: 'Pending' },
  rejected: { color: '#EF4444', label: 'Rejected' },
  missing:  { color: '#6B7280', label: 'Not Provided' },
}

// ─── Seller KYC Card (Mobile) ─────────────────────────────────────────────────
function KYCCard({ seller, onClick }: { seller: SASellerExtended; onClick: () => void }) {
  const status = getKYCStatus(seller)
  const checks = getDocChecks(seller)
  const verifiedCount = checks.filter(c => c.status === 'verified').length

  return (
    <motion.button
      layout
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="w-full p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl text-left hover:border-[#FF7A00]/30 active:scale-[0.98] transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E1E2E] to-[#2A2A3E] flex items-center justify-center text-sm font-bold text-white">
            {seller.displayName?.[0] ?? seller.email[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{seller.displayName ?? seller.email}</p>
            <p className="text-xs text-[#6B6B80]">{seller.shopName ?? 'No shop name'}</p>
          </div>
        </div>
        <KYCBadge status={status} />
      </div>
      {/* Doc progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden">
          <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${(verifiedCount / checks.length) * 100}%` }} />
        </div>
        <span className="text-xs text-[#6B6B80]">{verifiedCount}/{checks.length} docs</span>
      </div>
    </motion.button>
  )
}

// ─── KYC Detail Sheet ─────────────────────────────────────────────────────────
function KYCDetailSheet({ seller, onClose, onDecision }: {
  seller: SASellerExtended
  onClose: () => void
  onDecision: (sellerId: string, status: string) => void
}) {
  const { updateSellerDocStatus } = useSuperAdminStore()
  const checks = getDocChecks(seller)
  const status = getKYCStatus(seller)
  const [docStates, setDocStates] = useState<Record<string, DocCheck['status']>>(
    Object.fromEntries(checks.map(c => [c.id, c.status]))
  )
  const [deciding, setDeciding] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showReject, setShowReject] = useState(false)

  const updateDocStatus = (id: string, newStatus: DocCheck['status']) => {
    setDocStates(prev => ({ ...prev, [id]: newStatus }))
    if (id === 'pan' || id === 'gst' || id === 'bank') {
      updateSellerDocStatus(seller.id, id as any, newStatus === 'verified')
    }
  }

  const handleDecisionOverride = async (newStatus: KYCStatus) => {
    if (newStatus === 'rejected' && !rejectionReason.trim()) {
      toast.error('Enter rejection reason')
      return
    }
    setDeciding(true)
    await new Promise(r => setTimeout(r, 600))
    onDecision(seller.id, newStatus)
    if (newStatus === 'verified') toast.success(`KYC verified for ${seller.displayName}`)
    else if (newStatus === 'rejected') toast.success(`KYC rejected — seller notified`)
    else toast.success(`KYC marked as pending`)
    onClose()
    setDeciding(false)
  }

  const allVerified = Object.values(docStates).every(s => s === 'verified')

  return (
    <div className="p-5 pb-24 space-y-5">
      {/* Seller profile */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF4500]/20 flex items-center justify-center text-xl font-bold text-[#FF7A00]">
          {seller.displayName?.[0] ?? 'S'}
        </div>
        <div>
          <h3 className="text-base font-bold text-white">{seller.displayName ?? seller.email}</h3>
          <p className="text-sm text-[#6B6B80]">{seller.shopName}</p>
          <p className="text-xs text-[#6B6B80]">{seller.district ? `${seller.district}, ` : ''}{seller.state} · Joined {seller.joinedAt ? format(new Date(seller.joinedAt), 'MMM yyyy') : 'N/A'}</p>
        </div>
      </div>

      <div className="p-3 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl">
        <p className="text-[10px] text-[#6B6B80] font-semibold uppercase tracking-wider mb-1">Current KYC Status</p>
        <KYCBadge status={status} />
      </div>

      {/* Document Checklist — tap to cycle through statuses */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-[#6B6B80] uppercase tracking-wider">Document Verification</h4>
        </div>
        <div className="space-y-3">
          {checks.map(doc => {
            const docStatus = docStates[doc.id]
            const cfg = DOC_STATUS_CONFIG[docStatus]
            const Icon = doc.icon
            return (
              <div
                key={doc.id}
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl gap-4"
              >
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${cfg.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                  </div>
                  <span className="text-sm font-semibold text-white">{doc.label}</span>
                </div>
                
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto bg-[#0D0D14] p-1 rounded-lg border border-[#2A2A3E]">
                  <button
                    onClick={() => updateDocStatus(doc.id, 'verified')}
                    className={cn("px-3 py-1 rounded-md text-xs font-bold transition-all", docStatus === 'verified' ? "bg-green-500/20 text-green-500" : "text-[#6B6B80] hover:text-white hover:bg-[#2A2A3E]")}
                  >
                    Verified
                  </button>
                  <button
                    onClick={() => updateDocStatus(doc.id, 'pending')}
                    className={cn("px-3 py-1 rounded-md text-xs font-bold transition-all", docStatus === 'pending' ? "bg-amber-500/20 text-amber-500" : "text-[#6B6B80] hover:text-white hover:bg-[#2A2A3E]")}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updateDocStatus(doc.id, 'rejected')}
                    className={cn("px-3 py-1 rounded-md text-xs font-bold transition-all", docStatus === 'rejected' ? "bg-red-500/20 text-red-500" : "text-[#6B6B80] hover:text-white hover:bg-[#2A2A3E]")}
                  >
                    Rejected
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed Seller Information */}
      <div className="space-y-6">
        {/* Personal Information */}
        <div>
          <h4 className="text-xs font-bold text-[#FF7A00] uppercase tracking-wider mb-3">Personal Information</h4>
          <div className="space-y-2">
            {[
              { label: 'Full Legal Name', value: seller.legalName ?? 'N/A' },
              { label: 'Display Name', value: seller.displayName ?? 'N/A' },
              { label: 'Email Address', value: seller.email ?? 'N/A' },
              { label: 'Mobile Number', value: seller.phone ?? 'N/A' },
              { label: 'Alternate Phone', value: seller.alternatePhone ?? 'Not provided' },
              { label: 'Date of Birth', value: seller.dateOfBirth ?? 'Not provided' },
              { label: 'Seller Type', value: seller.sellerType ?? 'N/A' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-[#1E1E2E] last:border-none">
                <span className="text-xs text-[#6B6B80]">{label}</span>
                <span className="text-xs font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* KYC Information */}
        <div>
          <h4 className="text-xs font-bold text-[#FF7A00] uppercase tracking-wider mb-3">KYC Information</h4>
          <div className="space-y-2">
            {[
              { label: 'PAN Number', value: seller.panNumber ?? 'Not provided' },
              { label: 'Aadhaar Number', value: seller.aadhaarNumber ?? 'Not provided' },
              { label: 'GST Number', value: seller.gstNumber ?? 'Not provided' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-[#1E1E2E] last:border-none">
                <span className="text-xs text-[#6B6B80]">{label}</span>
                <span className="text-xs font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shop Details */}
        <div>
          <h4 className="text-xs font-bold text-[#FF7A00] uppercase tracking-wider mb-3">Shop Details</h4>
          <div className="space-y-2">
            {[
              { label: 'Shop Name', value: seller.shopName ?? 'N/A' },
              { label: 'Username', value: seller.username ?? 'N/A' },
              { label: 'Category', value: seller.shopCategory ?? 'N/A' },
              { label: 'Subcategory', value: seller.shopSubcategory ?? 'N/A' },
              { label: 'Tagline', value: seller.shopTagline ?? 'N/A' },
              { label: 'Address', value: seller.address ?? 'N/A' },
              { label: 'Village/Area', value: seller.village ?? 'N/A' },
              { label: 'City', value: seller.city ?? 'N/A' },
              { label: 'District', value: seller.district ?? 'N/A' },
              { label: 'State', value: seller.state ?? 'N/A' },
              { label: 'Pincode', value: seller.pincode ?? 'N/A' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start py-2 border-b border-[#1E1E2E] last:border-none gap-4">
                <span className="text-xs text-[#6B6B80] shrink-0">{label}</span>
                <span className="text-xs font-semibold text-white text-right break-words">{value}</span>
              </div>
            ))}
            <div className="py-2 border-b border-[#1E1E2E] last:border-none">
              <span className="text-xs text-[#6B6B80] block mb-1">Shop Description</span>
              <span className="text-xs font-semibold text-white block break-words whitespace-pre-wrap">{seller.shopDescription ?? 'No description provided.'}</span>
            </div>
          </div>
        </div>

        {/* Banking Details */}
        <div>
          <h4 className="text-xs font-bold text-[#FF7A00] uppercase tracking-wider mb-3">Banking Details</h4>
          <div className="space-y-2">
            {[
              { label: 'Account Name', value: seller.bankAccountName ?? 'N/A' },
              { label: 'Bank Name', value: seller.bankName ?? 'N/A' },
              { label: 'Branch Name', value: seller.branchName ?? 'N/A' },
              { label: 'IFSC Code', value: seller.ifscCode ?? 'N/A' },
              { label: 'Account Number', value: seller.accountNumber ?? 'N/A' },
              { label: 'Account Type', value: seller.accountType ?? 'N/A' },
              { label: 'UPI ID', value: seller.upiId ?? 'Not provided' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-[#1E1E2E] last:border-none">
                <span className="text-xs text-[#6B6B80]">{label}</span>
                <span className="text-xs font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decision Buttons */}
      <div className="space-y-4 pt-4 border-t border-[#1E1E2E]">
        <h4 className="text-xs font-bold text-[#6B6B80] uppercase tracking-wider">Update KYC Status</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleDecisionOverride('verified')}
            disabled={deciding || (!allVerified && status !== 'verified')}
            className={cn("flex-1 min-w-[100px] h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
              status === 'verified' ? "bg-[#22C55E] text-white shadow-lg shadow-green-500/20" : "bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20"
            )}
          >
            <CheckCircle className="w-4 h-4" /> Verified
          </button>
          
          <button
            onClick={() => setShowReject(true)}
            disabled={deciding}
            className={cn("flex-1 min-w-[100px] h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
              status === 'rejected' || showReject ? "bg-[#EF4444] text-white shadow-lg shadow-red-500/20" : "bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20"
            )}
          >
            <XCircle className="w-4 h-4" /> Rejected
          </button>

          <button
            onClick={() => handleDecisionOverride('pending')}
            disabled={deciding}
            className={cn("flex-1 min-w-[100px] h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
              status === 'pending' ? "bg-[#F59E0B] text-white shadow-lg shadow-amber-500/20" : "bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20"
            )}
          >
            <Clock className="w-4 h-4" /> Pending
          </button>
        </div>

        {showReject && (
          <div className="space-y-3 mt-3 animate-in fade-in slide-in-from-top-2">
            <textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection (will be sent to seller)..."
              rows={3}
              className="w-full bg-[#1A1A26] border border-[#EF4444]/30 rounded-xl px-3 py-2.5 text-sm text-white resize-none focus:border-[#EF4444] outline-none"
            />
            <div className="flex gap-2">
              <button onClick={() => handleDecisionOverride('rejected')} disabled={deciding} className="flex-1 h-11 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                {deciding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Confirm Reject
              </button>
              <button onClick={() => setShowReject(false)} className="h-11 px-4 bg-[#1E1E2E] text-[#A0A0B8] rounded-xl text-sm">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function KYCVerificationPage() {
  const isMobile = useIsMobile()
  const { sellers, updateSellerKYCStatus } = useSuperAdminStore()
  const [search, setSearch] = useState('')
  const [tabFilter, setTabFilter] = useState<KYCStatus | 'all'>('all')
  const [selected, setSelected] = useState<SASellerExtended | null>(null)

  const allSellers = sellers as SASellerExtended[]

  const kycSellers = useMemo(() => allSellers.filter(s => {
    const status = getKYCStatus(s)
    const matchSearch = !search || (s.displayName ?? s.email).toLowerCase().includes(search.toLowerCase())
    const matchTab = tabFilter === 'all' || status === tabFilter
    return matchSearch && matchTab
  }), [allSellers, search, tabFilter])

  const counts = useMemo(() => ({
    all: allSellers.length,
    pending: allSellers.filter(s => getKYCStatus(s) === 'pending').length,
    verified: allSellers.filter(s => getKYCStatus(s) === 'verified').length,
    rejected: allSellers.filter(s => getKYCStatus(s) === 'rejected').length,
  }), [allSellers])

  const handleDecision = (sellerId: string, newStatus: string) => {
    updateSellerKYCStatus(sellerId, newStatus as any)
    setSelected(null)
  }

  const TABS = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'verified', label: 'Verified' },
    { id: 'rejected', label: 'Rejected' },
  ] as const

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-lg shadow-green-500/20">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">KYC Verification</h1>
          <p className="text-sm text-[#6B6B80]">{counts.pending} pending · {counts.verified} verified</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: counts.all, color: '#3B82F6' },
          { label: 'Pending', value: counts.pending, color: '#F59E0B' },
          { label: 'Verified', value: counts.verified, color: '#22C55E' },
          { label: 'Rejected', value: counts.rejected, color: '#EF4444' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl">
            <p className="text-[10px] text-[#6B6B80] uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search + tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B80]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search seller name or email..."
            className="w-full h-11 bg-[#111118] border border-[#2A2A3E] rounded-xl pl-9 pr-4 text-sm text-white focus:border-[#FF7A00] outline-none"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setTabFilter(tab.id as any)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all h-9',
                tabFilter === tab.id ? 'bg-[#FF7A00] text-white' : 'bg-[#111118] border border-[#2A2A3E] text-[#6B6B80] hover:text-white'
              )}
            >
              {tab.label}
              <span className={cn('px-1.5 py-0.5 rounded-full text-[10px] font-bold', tabFilter === tab.id ? 'bg-white/20 text-white' : 'bg-[#1E1E2E] text-[#6B6B80]')}>
                {counts[tab.id as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isMobile ? (
        <div className="space-y-3">
          <AnimatePresence>
            {kycSellers.map(s => <KYCCard key={s.id} seller={s} onClick={() => setSelected(s)} />)}
          </AnimatePresence>
          {kycSellers.length === 0 && (
            <div className="text-center py-16">
              <ShieldCheck className="w-12 h-12 text-[#3A3A50] mx-auto mb-3" />
              <p className="text-sm text-[#6B6B80]">No sellers match your filter</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E1E2E]">
                {['Seller', 'Shop', 'KYC Status', 'Aadhaar', 'PAN', 'Bank', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kycSellers.map(seller => {
                const status = getKYCStatus(seller)
                return (
                  <tr key={seller.id} className="border-b border-[#1E1E2E] hover:bg-[#1A1A26] transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{seller.displayName ?? seller.email}</p>
                        <p className="text-xs text-[#6B6B80]">{seller.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#A0A0B8]">{seller.shopName ?? '—'}</td>
                    <td className="px-4 py-3"><KYCBadge status={status} /></td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs font-semibold', seller.panVerified ? 'text-[#22C55E]' : 'text-[#EF4444]')}>
                        {seller.panVerified ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs font-semibold', seller.gstVerified ? 'text-[#22C55E]' : 'text-[#EF4444]')}>
                        {seller.gstVerified ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs font-semibold', seller.bankVerified ? 'text-[#22C55E]' : 'text-[#EF4444]')}>
                        {seller.bankVerified ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(seller)}
                        className="flex items-center gap-1.5 h-8 px-3 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#FF7A00]" /> Review
                      </button>
                    </td>
                  </tr>
                )
              })}
              {kycSellers.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-[#6B6B80]">No sellers match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ResponsiveSheet isOpen={!!selected} onClose={() => setSelected(null)} title="KYC Review" desktopWidth="w-[560px]">
        {selected && <KYCDetailSheet seller={selected} onClose={() => setSelected(null)} onDecision={handleDecision} />}
      </ResponsiveSheet>
    </div>
  )
}