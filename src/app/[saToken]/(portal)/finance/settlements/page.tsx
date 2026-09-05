'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wallet, Search, Download, CheckCircle, Clock,
  AlertTriangle, XCircle, Eye, RefreshCw, Filter,
  Building, ChevronDown, ChevronUp, Play, RotateCcw
} from 'lucide-react'
import type { SASettlement } from '@/types/super-admin.types'
import { ResponsiveSheet } from '@/components/ui/responsive-sheet'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { fetchSettlementsAction, updateSettlementStatusAction } from '@/actions/super-admin/queries'

type SettlementStatus = SASettlement['status']

const STATUS_CONFIG: Record<SettlementStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending:    { label: 'Pending',    color: '#F59E0B', bg: '#F59E0B15', icon: Clock },
  processing: { label: 'Processing', color: '#3B82F6', bg: '#3B82F615', icon: RefreshCw },
  completed:  { label: 'Completed',  color: '#22C55E', bg: '#22C55E15', icon: CheckCircle },
  failed:     { label: 'Failed',     color: '#EF4444', bg: '#EF444415', icon: AlertTriangle },
}

function StatusBadge({ status }: { status: SettlementStatus }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['pending']
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}

// ─── Settlement Detail Sheet ──────────────────────────────────────────────────
function SettlementDetail({ settlement, onProcess, onRetry, onClose }: {
  settlement: SASettlement
  onProcess: (id: string) => void
  onRetry: (id: string) => void
  onClose: () => void
}) {
  const [acting, setActing] = useState(false)

  const handleAction = async (action: 'process' | 'retry') => {
    setActing(true)
    await (action === 'process' ? onProcess(settlement.id) : onRetry(settlement.id))
    setActing(false)
    onClose()
  }

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-bold text-white">{settlement.sellerName}</p>
          <p className="text-xs text-[#6B6B80] font-mono">{settlement.sellerId}</p>
        </div>
        <StatusBadge status={settlement.status} />
      </div>

      {/* Financial breakdown */}
      <div className="p-4 bg-[#FF7A00]/5 border border-[#FF7A00]/20 rounded-xl space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#A0A0B8]">Gross Amount</span>
          <span className="text-xl font-extrabold text-white">₹{(settlement.amount || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#A0A0B8]">Commission Deducted</span>
          <span className="text-base font-bold text-[#EF4444]">-₹{(settlement.commission || 0).toLocaleString()}</span>
        </div>
        <div className="h-px bg-[#2A2A3E]" />
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-white">Net Payout</span>
          <span className="text-2xl font-extrabold text-[#22C55E]">₹{(settlement.netAmount || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs text-[#6B6B80]">
          <span>Commission rate</span>
          <span className="text-[#FF7A00] font-semibold">{settlement.amount ? (((settlement.commission || 0) / settlement.amount) * 100).toFixed(1) : 0}%</span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        {[
          { label: 'Orders Included', value: settlement.ordersCount?.toString() || '0' },
          { label: 'Period Start', value: format(new Date(settlement.periodStart), 'dd MMM yyyy') },
          { label: 'Period End', value: format(new Date(settlement.periodEnd), 'dd MMM yyyy') },
          { label: 'Created', value: format(new Date(settlement.createdAt), 'dd MMM yyyy, hh:mm a') },
          ...(settlement.paidAt ? [{ label: 'Paid At', value: format(new Date(settlement.paidAt), 'dd MMM yyyy, hh:mm a') }] : []),
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between py-2 border-b border-[#1E1E2E] last:border-none">
            <span className="text-xs text-[#6B6B80]">{label}</span>
            <span className="text-xs font-semibold text-white">{value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {settlement.status === 'pending' && (
          <button
            onClick={() => handleAction('process')}
            disabled={acting}
            className="w-full h-12 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 disabled:opacity-50"
          >
            {acting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {acting ? 'Processing...' : 'Initiate Settlement'}
          </button>
        )}
        {settlement.status === 'failed' && (
          <button
            onClick={() => handleAction('retry')}
            disabled={acting}
            className="w-full h-12 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {acting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
            {acting ? 'Retrying...' : 'Retry Settlement'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Mobile Card ──────────────────────────────────────────────────────────────
function SettlementCard({ settlement, onClick }: { settlement: SASettlement; onClick: () => void }) {
  return (
    <motion.button
      layout
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl text-left hover:border-[#FF7A00]/30 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#1E1E2E] flex items-center justify-center font-bold text-sm text-white">
            {settlement.sellerName?.[0] || '?'}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{settlement.sellerName}</p>
            <p className="text-xs text-[#6B6B80]">{settlement.ordersCount || 0} orders</p>
          </div>
        </div>
        <StatusBadge status={settlement.status} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-[#1A1A26] rounded-lg text-center">
          <p className="text-[10px] text-[#6B6B80]">Gross</p>
          <p className="text-xs font-bold text-white">₹{((settlement.amount || 0) / 1000).toFixed(0)}K</p>
        </div>
        <div className="p-2 bg-[#1A1A26] rounded-lg text-center">
          <p className="text-[10px] text-[#6B6B80]">Commission</p>
          <p className="text-xs font-bold text-[#EF4444]">-₹{((settlement.commission || 0) / 1000).toFixed(0)}K</p>
        </div>
        <div className="p-2 bg-[#1A1A26] rounded-lg text-center">
          <p className="text-[10px] text-[#6B6B80]">Net</p>
          <p className="text-xs font-bold text-[#22C55E]">₹{((settlement.netAmount || 0) / 1000).toFixed(0)}K</p>
        </div>
      </div>
      <p className="text-[10px] text-[#4A4A5E] mt-2">
        {format(new Date(settlement.periodStart), 'dd MMM')} – {format(new Date(settlement.periodEnd), 'dd MMM yyyy')}
      </p>
    </motion.button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SettlementsPage() {
  const isMobile = useIsMobile()
  const [settlements, setSettlements] = useState<SASettlement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SettlementStatus | 'all'>('all')
  const [selected, setSelected] = useState<SASettlement | null>(null)
  const [sortField, setSortField] = useState<'netAmount' | 'createdAt'>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    async function load() {
      const { data } = await fetchSettlementsAction()
      setSettlements(data as SASettlement[] || [])
      setIsLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    let list = settlements.filter(s => {
      const matchSearch = !search || s.sellerName?.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || s.status === statusFilter
      return matchSearch && matchStatus
    })
    list = [...list].sort((a, b) => {
      const va = sortField === 'createdAt' ? new Date(a.createdAt).getTime() : (a.netAmount || 0)
      const vb = sortField === 'createdAt' ? new Date(b.createdAt).getTime() : (b.netAmount || 0)
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return list
  }, [settlements, search, statusFilter, sortField, sortDir])

  const totals = useMemo(() => ({
    pending: settlements.filter(s => s.status === 'pending').reduce((a, b) => a + (b.netAmount || 0), 0),
    processing: settlements.filter(s => s.status === 'processing').reduce((a, b) => a + (b.netAmount || 0), 0),
    completed: settlements.filter(s => s.status === 'completed').reduce((a, b) => a + (b.netAmount || 0), 0),
    failed: settlements.filter(s => s.status === 'failed').reduce((a, b) => a + (b.netAmount || 0), 0),
  }), [settlements])

  const handleProcess = async (id: string) => {
    const { success, error } = await updateSettlementStatusAction(id, 'processing')
    if (success) {
      setSettlements(prev => prev.map(s => s.id === id ? { ...s, status: 'processing' } : s))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: 'processing' } : null)
      toast.success('Settlement initiated — processing')
    } else {
      toast.error('Failed: ' + error)
    }
  }

  const handleRetry = async (id: string) => {
    const { success, error } = await updateSettlementStatusAction(id, 'pending')
    if (success) {
      setSettlements(prev => prev.map(s => s.id === id ? { ...s, status: 'pending' } : s))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: 'pending' } : null)
      toast.success('Settlement queued for retry')
    } else {
      toast.error('Failed: ' + error)
    }
  }

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const SortIcon = ({ field }: { field: typeof sortField }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp className={cn('w-2.5 h-2.5 -mb-0.5', sortField === field && sortDir === 'asc' ? 'text-[#FF7A00]' : 'text-[#3A3A50]')} />
      <ChevronDown className={cn('w-2.5 h-2.5', sortField === field && sortDir === 'desc' ? 'text-[#FF7A00]' : 'text-[#3A3A50]')} />
    </span>
  )

  if (isLoading) {
    return <div className="p-6 text-sm text-white">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-lg shadow-green-500/20">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Settlements</h1>
            <p className="text-sm text-[#6B6B80]">{settlements.length} total · {settlements.filter(s => s.status === 'pending').length} pending</p>
          </div>
        </div>
        <button onClick={() => toast.info('CSV export coming soon')} className="flex items-center gap-2 h-10 px-4 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white rounded-xl text-sm font-semibold border border-[#2A2A3E] transition-colors">
          <Download className="w-4 h-4 text-[#FF7A00]" /> Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending', value: `₹${(totals.pending / 1000).toFixed(0)}K`, color: '#F59E0B', count: settlements.filter(s => s.status === 'pending').length },
          { label: 'Processing', value: `₹${(totals.processing / 1000).toFixed(0)}K`, color: '#3B82F6', count: settlements.filter(s => s.status === 'processing').length },
          { label: 'Completed', value: `₹${(totals.completed / 100000).toFixed(1)}L`, color: '#22C55E', count: settlements.filter(s => s.status === 'completed').length },
          { label: 'Failed', value: `₹${(totals.failed / 1000).toFixed(0)}K`, color: '#EF4444', count: settlements.filter(s => s.status === 'failed').length },
        ].map(({ label, value, color, count }) => (
          <div key={label} className="p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl">
            <p className="text-[10px] text-[#6B6B80] uppercase tracking-wide mb-1">{label} ({count})</p>
            <p className="text-xl font-extrabold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B80]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search seller name..." className="w-full h-11 bg-[#111118] border border-[#2A2A3E] rounded-xl pl-9 pr-4 text-sm text-white focus:border-[#FF7A00] outline-none" />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'pending', 'processing', 'completed', 'failed'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={cn('px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all h-11', statusFilter === s ? 'bg-[#FF7A00] text-white' : 'bg-[#111118] border border-[#2A2A3E] text-[#6B6B80] hover:text-white')}>
              {s === 'all' ? 'All' : STATUS_CONFIG[s as SettlementStatus]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isMobile ? (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map(s => <SettlementCard key={s.id} settlement={s} onClick={() => setSelected(s)} />)}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Wallet className="w-12 h-12 text-[#3A3A50] mx-auto mb-3" />
              <p className="text-sm text-[#6B6B80]">No settlements match your filters</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E1E2E]">
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider">Seller</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider">Gross Amount</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider">Commission</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('netAmount')}>
                  Net Payout <SortIcon field="netAmount" />
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider">Period</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('createdAt')}>
                  Created <SortIcon field="createdAt" />
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-[#1E1E2E] hover:bg-[#1A1A26] transition-colors cursor-pointer" onClick={() => setSelected(s)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#1E1E2E] flex items-center justify-center text-xs font-bold text-white shrink-0">{s.sellerName?.[0] || '?'}</div>
                      <p className="text-sm font-semibold text-white">{s.sellerName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#A0A0B8]">{s.ordersCount}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-white">₹{(s.amount || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#EF4444]">-₹{(s.commission || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-bold text-[#22C55E]">₹{(s.netAmount || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-[#6B6B80]">{format(new Date(s.periodStart), 'dd MMM')} – {format(new Date(s.periodEnd), 'dd MMM')}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3 text-xs text-[#6B6B80]">{format(new Date(s.createdAt), 'dd MMM yy')}</td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    {s.status === 'pending' && (
                      <button onClick={() => { handleProcess(s.id); setSelected(null) }} className="h-7 px-2.5 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                        <Play className="w-3 h-3" /> Process
                      </button>
                    )}
                    {s.status === 'failed' && (
                      <button onClick={() => { handleRetry(s.id); setSelected(null) }} className="h-7 px-2.5 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" /> Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-[#6B6B80]">No settlements found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Sheet */}
      <ResponsiveSheet isOpen={!!selected} onClose={() => setSelected(null)} title="Settlement Details" desktopWidth="w-[520px]">
        {selected && (
          <SettlementDetail
            settlement={selected}
            onProcess={handleProcess}
            onRetry={handleRetry}
            onClose={() => setSelected(null)}
          />
        )}
      </ResponsiveSheet>
    </div>
  )
}