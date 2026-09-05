'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart2, Search, Filter, Download, CheckCircle,
  AlertTriangle, Clock, XCircle, ChevronDown, ChevronUp,
  TrendingUp, RefreshCw
} from 'lucide-react'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { fetchCommissionsAction } from '@/actions/super-admin/queries'

// Simplified Commission Type for now since we just fetch categories from backend, 
// and mock the records for the view to not crash
type CommissionStatus = 'collected' | 'pending' | 'disputed' | 'waived'

interface SACommissionRecord {
  id: string
  sellerId: string
  sellerName: string
  orderId: string
  category: string
  orderAmount: number
  commissionRate: number
  commissionAmount: number
  status: CommissionStatus
  createdAt: string
}

const STATUS_CONFIG: Record<CommissionStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  collected: { label: 'Collected', color: '#22C55E', bg: '#22C55E15', icon: CheckCircle },
  pending:   { label: 'Pending',   color: '#F59E0B', bg: '#F59E0B15', icon: Clock },
  disputed:  { label: 'Disputed',  color: '#EF4444', bg: '#EF444415', icon: AlertTriangle },
  waived:    { label: 'Waived',    color: '#6B7280', bg: '#6B728015', icon: XCircle },
}

function StatusBadge({ status }: { status: CommissionStatus }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['pending']
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}

// ─── Commission Rate Table ────────────────────────────────────────────────────
function CommissionRatesPanel({ rates }: { rates: any[] }) {
  // Use fetched backend rates
  return (
    <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5">
      <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-[#FF7A00]" /> Base Commission Rates by Category
      </h2>
      <div className="space-y-2.5">
        {rates.length === 0 ? (
          <div className="text-sm text-[#6B6B80] py-4 text-center">No commission data available.</div>
        ) : rates.map(cr => (
          <div key={cr.categoryId} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-white">{cr.categoryName}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#6B6B80]">Base Rate</span>
                  <span className="text-sm font-extrabold text-[#FF7A00]">{cr.baseRate}%</span>
                </div>
              </div>
              <div className="h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF4500]" style={{ width: `${(cr.baseRate / 15) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Mobile Commission Card ───────────────────────────────────────────────────
function CommissionCard({ record }: { record: SACommissionRecord }) {
  return (
    <div className="p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-bold text-white">{record.sellerName}</p>
          <p className="text-xs text-[#6B6B80]">{record.orderId} · {record.category}</p>
        </div>
        <StatusBadge status={record.status} />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="text-center p-2 bg-[#1A1A26] rounded-lg">
          <p className="text-[10px] text-[#6B6B80]">Order</p>
          <p className="text-sm font-bold text-white">₹{record.orderAmount.toLocaleString()}</p>
        </div>
        <div className="text-center p-2 bg-[#1A1A26] rounded-lg">
          <p className="text-[10px] text-[#6B6B80]">Rate</p>
          <p className="text-sm font-bold text-[#FF7A00]">{record.commissionRate}%</p>
        </div>
        <div className="text-center p-2 bg-[#1A1A26] rounded-lg">
          <p className="text-[10px] text-[#6B6B80]">Earned</p>
          <p className="text-sm font-bold text-[#22C55E]">₹{record.commissionAmount.toLocaleString()}</p>
        </div>
      </div>
      <p className="text-[10px] text-[#4A4A5E] mt-2">{format(new Date(record.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
    </div>
  )
}

// ─── Summary Stats ───────────────────────────────────────────────────────────
function CommissionSummary({ records }: { records: SACommissionRecord[] }) {
  const total = records.reduce((a, b) => a + b.commissionAmount, 0)
  const collected = records.filter(r => r.status === 'collected').reduce((a, b) => a + b.commissionAmount, 0)
  const pending = records.filter(r => r.status === 'pending').reduce((a, b) => a + b.commissionAmount, 0)
  const disputed = records.filter(r => r.status === 'disputed').reduce((a, b) => a + b.commissionAmount, 0)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: 'Total Commission', value: `₹${total.toLocaleString()}`, color: '#FF7A00' },
        { label: 'Collected', value: `₹${collected.toLocaleString()}`, color: '#22C55E' },
        { label: 'Pending', value: `₹${pending.toLocaleString()}`, color: '#F59E0B' },
        { label: 'Disputed', value: `₹${disputed.toLocaleString()}`, color: '#EF4444' },
      ].map(({ label, value, color }) => (
        <div key={label} className="p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl">
          <p className="text-[10px] text-[#6B6B80] uppercase tracking-wide mb-1">{label}</p>
          <p className="text-xl font-extrabold" style={{ color }}>{value}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CommissionsPage() {
  const isMobile = useIsMobile()
  const [rates, setRates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // We mock the commission ledger records to avoid setting up a giant order system right now.
  // The UI is workable and rates are from the backend.
  const [records, setRecords] = useState<SACommissionRecord[]>([
    {
      id: 'CR-001', sellerId: 'S-101', sellerName: 'Tech Haven', orderId: 'ORD-901',
      category: 'Electronics', orderAmount: 45000, commissionRate: 8, commissionAmount: 3600,
      status: 'collected', createdAt: new Date().toISOString()
    },
    {
      id: 'CR-002', sellerId: 'S-102', sellerName: 'Urban Style', orderId: 'ORD-902',
      category: 'Fashion', orderAmount: 2500, commissionRate: 15, commissionAmount: 375,
      status: 'pending', createdAt: new Date().toISOString()
    }
  ])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CommissionStatus | 'all'>('all')
  const [sortField, setSortField] = useState<'commissionAmount' | 'orderAmount' | 'createdAt'>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    async function load() {
      const { data } = await fetchCommissionsAction()
      if (data && data.length > 0) {
        setRates(data)
      } else {
        // Fallback mock rates
        setRates([
          { categoryId: 'cat_electronics', categoryName: 'Electronics', baseRate: 8 },
          { categoryId: 'cat_fashion', categoryName: 'Fashion', baseRate: 15 },
          { categoryId: 'cat_groceries', categoryName: 'Groceries', baseRate: 5 }
        ])
      }
      setIsLoading(false)
    }
    load()
  }, [])

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filtered = useMemo(() => {
    let list = records.filter(r => {
      const q = search.toLowerCase()
      const matchSearch = !search || r.sellerName.toLowerCase().includes(q) || r.orderId.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
      const matchStatus = statusFilter === 'all' || r.status === statusFilter
      return matchSearch && matchStatus
    })
    list = [...list].sort((a, b) => {
      const va = sortField === 'createdAt' ? new Date(a.createdAt).getTime() : a[sortField]
      const vb = sortField === 'createdAt' ? new Date(b.createdAt).getTime() : b[sortField]
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number)
    })
    return list
  }, [records, search, statusFilter, sortField, sortDir])

  const handleResolveDispute = (id: string) => {
    toast.success('Dispute resolved — commission marked as collected')
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'collected' } : r))
  }

  const SortIcon = ({ field }: { field: typeof sortField }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp className={cn('w-2.5 h-2.5 -mb-0.5', sortField === field && sortDir === 'asc' ? 'text-[#FF7A00]' : 'text-[#3A3A50]')} />
      <ChevronDown className={cn('w-2.5 h-2.5', sortField === field && sortDir === 'desc' ? 'text-[#FF7A00]' : 'text-[#3A3A50]')} />
    </span>
  )

  if (isLoading) return <div className="p-6 text-sm text-white">Loading...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Commissions</h1>
            <p className="text-sm text-[#6B6B80]">{filtered.length} records</p>
          </div>
        </div>
        <button
          onClick={() => toast.info('CSV export coming soon')}
          className="flex items-center gap-2 h-10 px-4 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white rounded-xl text-sm font-semibold border border-[#2A2A3E] transition-colors"
        >
          <Download className="w-4 h-4 text-[#FF7A00]" /> Export
        </button>
      </div>

      <CommissionSummary records={records} />

      {/* Rates panel */}
      <CommissionRatesPanel rates={rates} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B80]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search seller, order ID or category..." className="w-full h-11 bg-[#111118] border border-[#2A2A3E] rounded-xl pl-9 pr-4 text-sm text-white focus:border-[#FF7A00] outline-none" />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'collected', 'pending', 'disputed', 'waived'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={cn('px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all h-11', statusFilter === s ? 'bg-[#FF7A00] text-white' : 'bg-[#111118] border border-[#2A2A3E] text-[#6B6B80] hover:text-white')}>
              {s === 'all' ? 'All' : STATUS_CONFIG[s as CommissionStatus]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isMobile ? (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id}>
              <CommissionCard record={r} />
              {r.status === 'disputed' && (
                <button onClick={() => handleResolveDispute(r.id)} className="w-full mt-1.5 h-9 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                  <CheckCircle className="w-3.5 h-3.5" /> Resolve Dispute
                </button>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16"><BarChart2 className="w-12 h-12 text-[#3A3A50] mx-auto mb-3" /><p className="text-sm text-[#6B6B80]">No commission records found</p></div>
          )}
        </div>
      ) : (
        <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E1E2E]">
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider">Seller</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('orderAmount')}>
                  Order Amt <SortIcon field="orderAmount" />
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider">Rate</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('commissionAmount')}>
                  Earned <SortIcon field="commissionAmount" />
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('createdAt')}>
                  Date <SortIcon field="createdAt" />
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-[#1E1E2E] hover:bg-[#1A1A26] transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-white">{r.sellerName}</td>
                  <td className="px-4 py-3 text-xs font-mono text-[#6B6B80]">{r.orderId}</td>
                  <td className="px-4 py-3 text-xs text-[#A0A0B8]">{r.category}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-white">₹{r.orderAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-bold text-[#FF7A00]">{r.commissionRate}%</td>
                  <td className="px-4 py-3 text-sm font-bold text-[#22C55E]">₹{r.commissionAmount.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-xs text-[#6B6B80]">{format(new Date(r.createdAt), 'dd MMM yy')}</td>
                  <td className="px-4 py-3">
                    {r.status === 'disputed' && (
                      <button onClick={() => handleResolveDispute(r.id)} className="h-7 px-2.5 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] rounded-lg text-xs font-bold transition-colors">
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-[#6B6B80]">No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}