'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, ShoppingBag, ShieldAlert, CheckCircle2, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/super-admin/shared/StatusBadge'
import { RiskScoreIndicator } from '@/components/super-admin/shared/RiskScoreIndicator'
import { InternalNotesThread } from '@/components/super-admin/shared/InternalNotesThread'
import { formatRelativeTime } from '@/lib/utils/formatters'
import type { SACustomerExtended, CustomerOrderSnippet } from '@/types/super-admin.types'

interface CustomerDetailDrawerProps {
  customer: SACustomerExtended | null
  onClose: () => void
  onUpdateStatus: (status: SACustomerExtended['status']) => void
}

const TIER_COLORS: Record<string, string> = {
  bronze: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  silver: 'bg-slate-300/10 text-slate-300 border-slate-300/20',
  gold: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  platinum: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
}

export function CustomerDetailDrawer({ customer, onClose, onUpdateStatus }: CustomerDetailDrawerProps) {
  const [tab, setTab] = useState<'overview' | 'orders' | 'security' | 'notes'>('overview')

  if (!customer) return null

  // Mock order snippets for UI
  const orderSnippets: CustomerOrderSnippet[] = [
    { orderId: 'ORD-9302', date: new Date().toISOString(), amount: 4500, status: 'delivered', items: 3 },
    { orderId: 'ORD-8911', date: new Date(Date.now() - 86400000 * 5).toISOString(), amount: 1200, status: 'delivered', items: 1 },
    { orderId: 'ORD-7622', date: new Date(Date.now() - 86400000 * 15).toISOString(), amount: 8500, status: 'returned', items: 2 },
  ]

  const formatCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

  return (
    <AnimatePresence>
      <div className="fixed inset-x-0 top-16 bottom-9 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Drawer */}
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-[540px] h-full bg-[#0D0D14] border-l border-[#1E1E2E] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="shrink-0 p-5 border-b border-[#1E1E2E] flex items-start gap-4 bg-[#111118]">
            {customer.avatar ? (
              <img src={customer.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2A2A3E] to-[#1A1A26] flex items-center justify-center text-white text-xl font-black shrink-0 border border-[#2A2A3E]">
                {customer.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-base font-bold text-white truncate">{customer.name}</h2>
                <StatusBadge 
                  status={customer.status} 
                  variant={customer.status === 'active' ? 'success' : customer.status === 'blocked' ? 'error' : 'warning'} 
                />
                <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider', TIER_COLORS[customer.tier])}>
                  {customer.tier}
                </span>
                {customer.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-green-500 ml-1" />
                )}
              </div>
              <p className="text-xs text-[#8B8B9E] truncate mb-0.5">{customer.email} • {customer.phone}</p>
              <p className="text-[10px] text-[#5A5A70] font-semibold">
                Joined {new Date(customer.joinedAt).toLocaleDateString()}
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B80] hover:text-white hover:bg-white/5 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="shrink-0 flex border-b border-[#1E1E2E] bg-[#111118] px-2">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'security', label: 'Security & Risk', icon: ShieldAlert },
              { id: 'notes', label: 'Notes', icon: MessageSquare },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-bold transition-colors border-b-2',
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
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl border border-[#1E1E2E] bg-[#151520]">
                      <p className="text-xs text-[#6B6B80] font-bold uppercase tracking-wider mb-1">Total Spent</p>
                      <p className="text-2xl font-black text-white">{formatCurrency(customer.totalSpent)}</p>
                      <p className="text-[10px] text-[#5A5A70] mt-1 font-medium">Across {customer.totalOrders} orders</p>
                    </div>
                    <div className="p-4 rounded-xl border border-[#1E1E2E] bg-[#151520]">
                      <p className="text-xs text-[#6B6B80] font-bold uppercase tracking-wider mb-1">Avg Order Value</p>
                      <p className="text-2xl font-black text-white">{formatCurrency(customer.avgOrderValue)}</p>
                      <p className="text-[10px] text-[#5A5A70] mt-1 font-medium">Industry avg: ₹2,100</p>
                    </div>
                  </div>

                  {/* Contact & Location */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider">Contact Details</h3>
                    <div className="bg-[#1A1A26] border border-[#2A2A3E] rounded-xl p-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#6B6B80]">Email</span>
                        <span className="text-white font-medium">{customer.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B6B80]">Phone</span>
                        <span className="text-white font-medium">+91 {customer.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B6B80]">Location</span>
                        <span className="text-white font-medium">{customer.city}, {customer.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A26] border border-[#2A2A3E]">
                      <span className="text-xs font-bold text-[#8B8B9E]">Wishlist Items</span>
                      <span className="text-sm font-black text-white">{customer.wishlistCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A26] border border-[#2A2A3E]">
                      <span className="text-xs font-bold text-[#8B8B9E]">Cart Abandons</span>
                      <span className="text-sm font-black text-white">{customer.cartAbandonCount}</span>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider">Recent Orders</h3>
                    <button className="text-[10px] font-bold text-[#FF7A00] hover:underline">View All {customer.totalOrders}</button>
                  </div>
                  
                  <div className="space-y-3">
                    {orderSnippets.map((order) => (
                      <div key={order.orderId} className="p-4 rounded-xl border border-[#1E1E2E] bg-[#151520] hover:border-[#3A3A50] transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-bold text-white mb-0.5">{order.orderId}</p>
                            <p className="text-[10px] text-[#6B6B80]">{formatRelativeTime(order.date)}</p>
                          </div>
                          <span className={cn(
                            "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                            order.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                          )}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1E1E2E]">
                          <span className="text-xs font-medium text-[#A0A0B8]">{order.items} items</span>
                          <span className="text-sm font-black text-white">{formatCurrency(order.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'security' && (
                <div className="space-y-6">
                  <RiskScoreIndicator score={customer.riskScore} />

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider">Fraud & Risk Flags</h3>
                    {customer.fraudFlags.length > 0 ? (
                      <div className="space-y-2">
                        {customer.fraudFlags.map((flag, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            {flag}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 flex flex-col items-center justify-center text-center">
                        <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                        <p className="text-sm font-bold text-green-500">Account is Secure</p>
                        <p className="text-xs text-green-500/70 mt-1">No suspicious activity detected</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider">Return Behavior</h3>
                    <div className="bg-[#1A1A26] border border-[#2A2A3E] rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-[#A0A0B8]">Overall Return Rate</span>
                        <span className={cn(
                          "text-base font-black",
                          customer.returnRate > 15 ? 'text-red-500' : customer.returnRate > 8 ? 'text-amber-500' : 'text-green-500'
                        )}>
                          {customer.returnRate}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#111118] rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all", customer.returnRate > 15 ? 'bg-red-500' : customer.returnRate > 8 ? 'bg-amber-500' : 'bg-green-500')}
                          style={{ width: `${Math.min(customer.returnRate, 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#5A5A70] mt-3">Platform average is 6.5%. Rates above 15% are flagged for review.</p>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'notes' && (
                <InternalNotesThread entityType="customer" entityId={customer.id} />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 p-4 border-t border-[#1E1E2E] bg-[#111118] flex items-center justify-between gap-3">
            <button
              onClick={() => onUpdateStatus(customer.status === 'blocked' ? 'active' : 'blocked')}
              className={cn(
                'flex-1 h-10 rounded-xl text-sm font-bold border transition-colors',
                customer.status === 'blocked'
                  ? 'border-green-500/30 text-green-500 hover:bg-green-500/10'
                  : 'border-red-500/30 text-red-500 hover:bg-red-500/10'
              )}
            >
              {customer.status === 'blocked' ? 'Unblock Customer' : 'Block Customer'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
