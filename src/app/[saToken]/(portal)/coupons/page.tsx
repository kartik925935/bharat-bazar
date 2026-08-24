'use client'
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Tag, Plus, Copy, Check, BarChart2, Calendar,
  Clock, Users, TrendingUp, AlertTriangle, Eye,
  EyeOff, Trash2, Search, Filter, RefreshCw, X
} from 'lucide-react'
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import type { SACoupon } from '@/types/super-admin.types'
import { ResponsiveSheet } from '@/components/ui/responsive-sheet'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { cn } from '@/lib/utils'
import { format, isPast, isFuture, differenceInDays } from 'date-fns'
import { toast } from 'sonner'

type CouponStatus = 'active' | 'inactive' | 'expired' | 'scheduled'

const STATUS_CONFIG: Record<CouponStatus, { label: string; color: string; bg: string }> = {
  active:    { label: 'Active',     color: '#22C55E', bg: '#22C55E15' },
  inactive:  { label: 'Inactive',   color: '#6B7280', bg: '#6B728015' },
  expired:   { label: 'Expired',    color: '#EF4444', bg: '#EF444415' },
  scheduled: { label: 'Scheduled',  color: '#F59E0B', bg: '#F59E0B15' },
}

function usagePercent(c: SACoupon) {
  return Math.min((c.usageCount / c.usageLimit) * 100, 100)
}

function CouponBadge({ status }: { status: CouponStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success(`Copied "${code}"`)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 bg-[#1E1E2E] hover:bg-[#2A2A3E] rounded-xl border border-[#2A2A3E] transition-all group"
    >
      <code className="text-sm font-bold font-mono text-white">{code}</code>
      {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5 text-[#6B6B80] group-hover:text-[#FF7A00]" />}
    </button>
  )
}

// ─── Coupon Card (Mobile) ─────────────────────────────────────────────────────
function CouponCard({ coupon, onClick }: { coupon: SACoupon; onClick: () => void }) {
  const pct = usagePercent(coupon)
  const daysLeft = differenceInDays(new Date(coupon.endDate), new Date())

  return (
    <motion.div
      layout
      className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-4 hover:border-[#FF7A00]/30 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <CopyCode code={coupon.code} />
        <CouponBadge status={coupon.status as CouponStatus} />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="px-3 py-1.5 bg-[#FF7A00]/10 rounded-lg">
          <p className="text-lg font-extrabold text-[#FF7A00]">
            {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#6B6B80]">Min order: <span className="text-white font-semibold">₹{coupon.minOrder}</span></p>
          {coupon.maxDiscount && <p className="text-xs text-[#6B6B80]">Max off: <span className="text-white font-semibold">₹{coupon.maxDiscount}</span></p>}
        </div>
      </div>
      {/* Usage */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-[#6B6B80] mb-1">
          <span>{coupon.usageCount.toLocaleString()} used</span>
          <span>{coupon.usageLimit.toLocaleString()} limit · {pct.toFixed(0)}%</span>
        </div>
        <div className="h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full', pct > 80 ? 'bg-[#EF4444]' : pct > 50 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]')}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-[#6B6B80]">
          {coupon.status === 'expired' ? 'Expired' : daysLeft > 0 ? `${daysLeft}d remaining` : 'Ends today'} · {format(new Date(coupon.endDate), 'dd MMM yyyy')}
        </p>
        <button onClick={onClick} className="text-xs text-[#FF7A00] font-semibold flex items-center gap-1 hover:underline">
          Details <Tag className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  )
}

// ─── Create Coupon Form ───────────────────────────────────────────────────────
function CreateCouponForm({ onClose, onCreated }: { onClose: () => void; onCreated: (c: SACoupon) => void }) {
  const [form, setForm] = useState({
    code: '', type: 'percentage' as 'percentage' | 'fixed',
    value: '', minOrder: '', maxDiscount: '',
    usageLimit: '', userLimit: '1',
    startDate: '', endDate: '', appliesTo: 'all' as SACoupon['appliesTo'],
  })
  const [saving, setSaving] = useState(false)

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    setForm(f => ({ ...f, code }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code || !form.value || !form.endDate) { toast.error('Fill in required fields'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    const newCoupon: SACoupon = {
      id: `coup-${Date.now()}`, code: form.code.toUpperCase(),
      type: form.type, value: Number(form.value),
      minOrder: Number(form.minOrder) || 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      usageLimit: Number(form.usageLimit) || 1000,
      usageCount: 0, userLimit: Number(form.userLimit) || 1,
      status: isFuture(new Date(form.startDate || Date.now())) ? 'inactive' : 'active',
      startDate: form.startDate || new Date().toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      createdBy: 'sa-001', createdAt: new Date().toISOString(),
      appliesTo: form.appliesTo,
    }
    onCreated(newCoupon)
    toast.success(`Coupon "${newCoupon.code}" created`)
    setSaving(false)
    onClose()
  }

  const F = ({ label, field, type = 'text', placeholder = '', required = false }: { label: string; field: keyof typeof form; type?: string; placeholder?: string; required?: boolean }) => (
    <div>
      <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">{label}{required && <span className="text-[#EF4444] ml-1">*</span>}</label>
      <input
        type={type}
        value={form[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        placeholder={placeholder}
        className="w-full h-11 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none"
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-4">
      {/* Code */}
      <div>
        <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">Coupon Code <span className="text-[#EF4444]">*</span></label>
        <div className="flex gap-2">
          <input
            value={form.code}
            onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase().replace(/\s/g, '') }))}
            placeholder="e.g. BHARAT20"
            className="flex-1 h-11 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm font-mono text-white focus:border-[#FF7A00] outline-none uppercase"
          />
          <button type="button" onClick={generateCode} className="h-11 px-3 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-[#A0A0B8] rounded-xl text-xs font-semibold transition-colors whitespace-nowrap">Auto-gen</button>
        </div>
      </div>

      {/* Type + Value */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">Discount Type</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className="w-full h-11 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none">
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>
        </div>
        <F label={`Value (${form.type === 'percentage' ? '%' : '₹'})`} field="value" type="number" placeholder="20" required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <F label="Min Order (₹)" field="minOrder" type="number" placeholder="500" />
        {form.type === 'percentage' && <F label="Max Discount (₹)" field="maxDiscount" type="number" placeholder="500" />}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <F label="Usage Limit" field="usageLimit" type="number" placeholder="10000" />
        <F label="Per User Limit" field="userLimit" type="number" placeholder="1" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <F label="Start Date" field="startDate" type="date" />
        <F label="End Date *" field="endDate" type="date" required />
      </div>

      <div>
        <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">Applies To</label>
        <select value={form.appliesTo} onChange={e => setForm(f => ({ ...f, appliesTo: e.target.value as any }))} className="w-full h-11 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none">
          <option value="all">All Products</option>
          <option value="category">Specific Category</option>
          <option value="seller">Specific Seller</option>
          <option value="product">Specific Product</option>
        </select>
      </div>

      <button type="submit" disabled={saving} className="w-full h-12 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50">
        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        {saving ? 'Creating...' : 'Create Coupon'}
      </button>
    </form>
  )
}

// ─── Analytics Mini Chart ─────────────────────────────────────────────────────
function CouponAnalytics({ coupon }: { coupon: SACoupon }) {
  const pct = usagePercent(coupon)
  const daysLeft = differenceInDays(new Date(coupon.endDate), new Date())
  const estimatedRevenue = coupon.usageCount * (coupon.type === 'percentage' ? coupon.minOrder * (1 - coupon.value / 100) : coupon.minOrder)

  return (
    <div className="p-5 space-y-4">
      <h3 className="text-sm font-bold text-white">Coupon Analytics</h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Uses', value: coupon.usageCount.toLocaleString(), color: 'text-[#3B82F6]' },
          { label: 'Limit', value: coupon.usageLimit.toLocaleString(), color: 'text-white' },
          { label: 'Days Left', value: daysLeft > 0 ? daysLeft : 'Expired', color: daysLeft > 7 ? 'text-[#22C55E]' : 'text-[#EF4444]' },
          { label: 'Per-User Cap', value: coupon.userLimit, color: 'text-white' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-3 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl">
            <p className="text-[10px] text-[#6B6B80] mb-1">{label}</p>
            <p className={cn('text-lg font-bold', color)}>{value}</p>
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-between text-xs text-[#6B6B80] mb-2">
          <span>Usage Burn Rate</span>
          <span className={cn('font-bold', pct > 80 ? 'text-[#EF4444]' : pct > 50 ? 'text-[#F59E0B]' : 'text-[#22C55E]')}>{pct.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-[#1E1E2E] rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full transition-all', pct > 80 ? 'bg-[#EF4444]' : pct > 50 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]')} style={{ width: `${pct}%` }} />
        </div>
        {pct > 80 && (
          <p className="text-xs text-[#EF4444] mt-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> High burn rate — consider extending limit
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CouponsPage() {
  const isMobile = useIsMobile()
  const { coupons, setCoupons } = useSuperAdminStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CouponStatus | 'all'>('all')
  const [selected, setSelected] = useState<SACoupon | null>(null)
  const [detailTab, setDetailTab] = useState<'info' | 'analytics'>('info')
  const [showCreate, setShowCreate] = useState(false)

  const filtered = useMemo(() => coupons.filter(c => {
    const matchSearch = !search || c.code.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  }), [coupons, search, statusFilter])

  const stats = useMemo(() => ({
    active: coupons.filter(c => c.status === 'active').length,
    expired: coupons.filter(c => c.status === 'expired').length,
    totalUses: coupons.reduce((a, b) => a + b.usageCount, 0),
  }), [coupons])

  const handleDeleteCoupon = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id))
    setSelected(null)
    toast.success('Coupon deleted')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Coupons</h1>
            <p className="text-sm text-[#6B6B80]">{stats.active} active · {stats.totalUses.toLocaleString()} total uses</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 h-10 px-4 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Coupon</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active', value: stats.active, color: '#22C55E' },
          { label: 'Expired', value: stats.expired, color: '#EF4444' },
          { label: 'Total Uses', value: stats.totalUses.toLocaleString(), color: '#3B82F6' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl text-center">
            <p className="text-[10px] text-[#6B6B80] uppercase tracking-wide mb-1">{label}</p>
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B80]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search coupon code..." className="w-full h-11 bg-[#111118] border border-[#2A2A3E] rounded-xl pl-9 pr-4 text-sm text-white focus:border-[#FF7A00] outline-none" />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'active', 'inactive', 'expired'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={cn('px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all h-11', statusFilter === s ? 'bg-[#FF7A00] text-white' : 'bg-[#111118] border border-[#2A2A3E] text-[#6B6B80] hover:text-white')}>
              {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Coupon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map(c => <CouponCard key={c.id} coupon={c} onClick={() => { setSelected(c); setDetailTab('info') }} />)}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            <Tag className="w-12 h-12 text-[#3A3A50] mx-auto mb-3" />
            <p className="text-sm text-[#6B6B80]">No coupons found</p>
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      <ResponsiveSheet isOpen={!!selected} onClose={() => setSelected(null)} title={selected ? `Coupon: ${selected.code}` : ''} desktopWidth="w-[520px]">
        {selected && (
          <div>
            {/* Tab bar */}
            <div className="flex gap-1 px-5 pt-4 pb-0">
              {(['info', 'analytics'] as const).map(tab => (
                <button key={tab} onClick={() => setDetailTab(tab)} className={cn('flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors', detailTab === tab ? 'bg-[#FF7A00] text-white' : 'text-[#6B6B80] hover:text-white hover:bg-[#1E1E2E]')}>
                  {tab === 'analytics' ? <BarChart2 className="w-3.5 h-3.5" /> : <Tag className="w-3.5 h-3.5" />}
                  {tab}
                </button>
              ))}
            </div>
            {detailTab === 'info' ? (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <CopyCode code={selected.code} />
                  <CouponBadge status={selected.status as CouponStatus} />
                </div>
                <div className="p-4 bg-[#FF7A00]/10 rounded-xl text-center">
                  <p className="text-3xl font-extrabold text-[#FF7A00]">
                    {selected.type === 'percentage' ? `${selected.value}% OFF` : `₹${selected.value} OFF`}
                  </p>
                  <p className="text-xs text-[#6B6B80] mt-1">Min order ₹{selected.minOrder}{selected.maxDiscount ? ` · Max ₹${selected.maxDiscount}` : ''}</p>
                </div>
                {[
                  { label: 'Applies To', value: selected.appliesTo },
                  { label: 'Per User Limit', value: selected.userLimit },
                  { label: 'Start Date', value: format(new Date(selected.startDate), 'dd MMM yyyy') },
                  { label: 'End Date', value: format(new Date(selected.endDate), 'dd MMM yyyy') },
                  { label: 'Created', value: format(new Date(selected.createdAt), 'dd MMM yyyy') },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-[#1E1E2E] last:border-none">
                    <span className="text-xs text-[#6B6B80]">{label}</span>
                    <span className="text-xs font-semibold text-white capitalize">{value}</span>
                  </div>
                ))}
                <button onClick={() => handleDeleteCoupon(selected.id)} className="w-full h-10 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete Coupon
                </button>
              </div>
            ) : (
              <CouponAnalytics coupon={selected} />
            )}
          </div>
        )}
      </ResponsiveSheet>

      {/* Create Sheet */}
      <ResponsiveSheet isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Coupon" desktopWidth="w-[520px]">
        <CreateCouponForm onClose={() => setShowCreate(false)} onCreated={c => setCoupons([c, ...coupons])} />
      </ResponsiveSheet>
    </div>
  )
}