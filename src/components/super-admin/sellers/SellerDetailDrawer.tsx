'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Store, Box, ShoppingBag, Banknote, ShieldCheck, Activity, AlertOctagon, MessageSquare, History, Phone, Mail, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/super-admin/shared/StatusBadge'
import { TierBadge } from '@/components/super-admin/shared/TierBadge'
import { InternalNotesThread } from '@/components/super-admin/shared/InternalNotesThread'
import { OnboardingFunnelWidget } from '@/components/super-admin/sellers/OnboardingFunnelWidget'
import { TierTrajectoryChart } from '@/components/super-admin/sellers/TierTrajectoryChart'
import { formatCurrency, formatRelativeTime } from '@/lib/utils/formatters'
import type { SASellerExtended } from '@/types/super-admin.types'

interface SellerDetailDrawerProps {
  seller: SASellerExtended | null
  onClose: () => void
  onUpdateStatus: (status: SASellerExtended['status']) => void
  initialTab?: string
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: Store },
  { id: 'products', label: 'Products', icon: Box },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'kyc', label: 'KYC & Business', icon: ShieldCheck },
  { id: 'metrics', label: 'Metrics', icon: Activity },
  { id: 'warnings', label: 'Warnings', icon: AlertOctagon },
  { id: 'notes', label: 'Notes', icon: MessageSquare },
]

export function SellerDetailDrawer({ seller, onClose, onUpdateStatus, initialTab = 'overview' }: SellerDetailDrawerProps) {
  const [tab, setTab] = useState<string>(initialTab)

  // Reset tab when seller changes or on open
  React.useEffect(() => {
    if (seller) setTab(initialTab)
  }, [seller, initialTab])

  if (!seller) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-x-0 top-16 bottom-9 z-50 flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-[640px] h-full bg-[#0D0D14] border-l border-[#1E1E2E] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="shrink-0 p-5 border-b border-[#1E1E2E] flex items-start gap-4 bg-[#111118]">
            {seller.avatar ? (
              <img src={seller.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E1E2E] to-[#111118] flex items-center justify-center text-[#A0A0B8] text-2xl font-black shrink-0 border border-[#2A2A3E]">
                {seller.shopName.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <h2 className="text-lg font-bold text-white truncate">{seller.shopName}</h2>
                <StatusBadge 
                  status={seller.status} 
                  variant={
                    seller.status === 'active' ? 'success' : 
                    seller.status === 'suspended' || seller.status === 'rejected' ? 'error' : 'warning'
                  } 
                />
                <TierBadge tier={seller.tier} showIcon />
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#2A2A3E] bg-[#1A1A26] text-[#A0A0B8] uppercase tracking-wider">
                  {seller.sellerType.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-[#8B8B9E] truncate mb-1">
                {seller.legalName} • ID: <span className="font-mono text-white">{seller.sellerId}</span>
              </p>
              <div className="flex items-center gap-3 text-[10px] font-medium text-[#5A5A70]">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +91 {seller.phone}</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {seller.email}</span>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B80] hover:text-white hover:bg-white/5 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable horizontal tabs */}
          <div className="shrink-0 flex overflow-x-auto scrollbar-none border-b border-[#1E1E2E] bg-[#111118] px-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-3 text-[11px] font-bold transition-colors border-b-2 whitespace-nowrap',
                  tab === t.id ? 'text-[#FF7A00] border-[#FF7A00]' : 'text-[#6B6B80] border-transparent hover:text-[#A0A0B8]'
                )}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2A2A3E]">
            <div className="p-5">
              {tab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl border border-[#1E1E2E] bg-[#151520]">
                      <p className="text-xs text-[#6B6B80] font-bold uppercase tracking-wider mb-1">Total Sales</p>
                      <p className="text-xl font-black text-white">{formatCurrency(seller.totalSales)}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-[#1E1E2E] bg-[#151520]">
                      <p className="text-xs text-[#6B6B80] font-bold uppercase tracking-wider mb-1">Total Orders</p>
                      <p className="text-xl font-black text-white">{seller.totalOrders}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-[#1E1E2E] bg-[#151520]">
                      <p className="text-xs text-[#6B6B80] font-bold uppercase tracking-wider mb-1">Rating</p>
                      <p className="text-xl font-black text-white">{seller.rating.toFixed(1)} / 5.0</p>
                    </div>
                  </div>

                  <OnboardingFunnelWidget steps={seller.onboardingSteps} />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-[#1A1A26] border border-[#2A2A3E]">
                      <h4 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-3">Location</h4>
                      <p className="text-sm font-medium text-white flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#FF7A00] shrink-0 mt-0.5" />
                        {seller.village ? `${seller.village}, ` : ''}{seller.district ? `${seller.district}, ` : ''}{seller.state}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#1A1A26] border border-[#2A2A3E]">
                      <h4 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-3">Commission</h4>
                      <p className="text-sm font-medium text-white flex items-center gap-2">
                        <span className="text-2xl font-black text-[#FF7A00]">{seller.commissionRate}%</span>
                        <span className="text-xs text-[#6B6B80]">Base rate</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'kyc' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#1E1E2E] bg-[#151520]">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">Overall KYC Status</h3>
                      <p className="text-xs text-[#6B6B80]">Documents verification status</p>
                    </div>
                    <StatusBadge 
                      status={seller.kycStatus} 
                      variant={seller.kycStatus === 'verified' ? 'success' : seller.kycStatus === 'rejected' ? 'error' : 'warning'} 
                    />
                  </div>

                  <div className="space-y-2">
                    {[
                      { label: 'PAN Card', verified: seller.panVerified },
                      { label: 'GST Certificate', verified: seller.gstVerified },
                      { label: 'Bank Account', verified: seller.bankVerified },
                    ].map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A26] border border-[#2A2A3E]">
                        <span className="text-sm font-medium text-[#D0D0E0]">{doc.label}</span>
                        {doc.verified ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-1 rounded-md">
                            <AlertOctagon className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {seller.documentsExpiringSoon.length > 0 && (
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 mt-6">
                      <h4 className="text-xs font-bold text-red-500 flex items-center gap-1.5 mb-2">
                        <AlertOctagon className="w-3.5 h-3.5" /> Documents Expiring Soon
                      </h4>
                      <ul className="list-disc list-inside text-sm text-red-400">
                        {seller.documentsExpiringSoon.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {tab === 'metrics' && (
                <div className="space-y-6">
                  <TierTrajectoryChart data={seller.performanceHistory} />
                </div>
              )}

              {tab === 'notes' && (
                <InternalNotesThread entityType="seller" entityId={seller.id} />
              )}
              
              {/* Additional tabs can be implemented similarly */}
              {['products', 'orders', 'warnings'].includes(tab) && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A26] border border-[#2A2A3E] flex items-center justify-center mb-4">
                    <span className="text-xl">🚧</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Coming Soon</h3>
                  <p className="text-xs text-[#6B6B80] max-w-[200px]">This tab is under construction for this view.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 p-4 border-t border-[#1E1E2E] bg-[#111118] flex items-center gap-3">
            {seller.status === 'pending' || seller.status === 'under_review' ? (
              <>
                <button
                  onClick={() => onUpdateStatus('active')}
                  className="flex-1 h-10 rounded-xl text-sm font-bold bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  Approve Seller
                </button>
                <button
                  onClick={() => onUpdateStatus('rejected')}
                  className="flex-1 h-10 rounded-xl text-sm font-bold bg-[#1A1A26] border border-[#2A2A3E] text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Reject
                </button>
              </>
            ) : (
              <button
                onClick={() => onUpdateStatus(seller.status === 'suspended' ? 'active' : 'suspended')}
                className={cn(
                  'flex-1 h-10 rounded-xl text-sm font-bold border transition-colors',
                  seller.status === 'suspended'
                    ? 'border-green-500/30 text-green-500 hover:bg-green-500/10'
                    : 'border-amber-500/30 text-amber-500 hover:bg-amber-500/10'
                )}
              >
                {seller.status === 'suspended' ? 'Reactivate Seller' : 'Suspend Seller'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
