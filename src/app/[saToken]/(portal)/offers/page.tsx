'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gift, Plus, Zap, Clock, TrendingUp, Package,
  IndianRupee, BarChart2, Calendar, Eye, EyeOff,
  Trash2, Search, Edit3, Check, RefreshCw, ChevronRight
} from 'lucide-react'
import type { SAOfferExtended } from '@/types/super-admin.types'
import { ResponsiveSheet } from '@/components/ui/responsive-sheet'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { cn } from '@/lib/utils'
import { format, isPast, isFuture, differenceInHours, differenceInDays } from 'date-fns'
import { toast } from 'sonner'

import { MOCK_SA_OFFERS } from '@/lib/mock/sa-offers.mock'

type OfferStatus = 'active' | 'scheduled' | 'ended'

const STATUS_CONFIG: Record<OfferStatus, { label: string; color: string; bg: string }> = {
  active:    { label: 'Live Now',   color: '#22C55E', bg: '#22C55E15' },
  scheduled: { label: 'Scheduled',  color: '#F59E0B', bg: '#F59E0B15' },
  ended:     { label: 'Ended',      color: '#6B7280', bg: '#6B728015' },
}

function formatCountdown(endDate: string) {
  const hours = differenceInHours(new Date(endDate), new Date())
  if (hours < 0) return 'Ended'
  if (hours < 1) return '< 1 hour'
  if (hours < 24) return `${hours}h remaining`
  return `${differenceInDays(new Date(endDate), new Date())}d remaining`
}

function OfferCard({ offer, onClick }: { offer: SAOfferExtended; onClick: () => void }) {
  const cfg = STATUS_CONFIG[offer.status as OfferStatus]
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (offer.status !== 'active') return
    const t = setInterval(() => setTick(x => x + 1), 60000)
    return () => clearInterval(t)
  }, [offer.status])

  return (
    <motion.button
      layout
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="w-full p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl text-left hover:border-[#FF7A00]/30 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center">
            {offer.type === 'percentage' ? <Zap className="w-4 h-4 text-[#FF7A00]" /> : <IndianRupee className="w-4 h-4 text-[#FF7A00]" />}
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">{offer.name}</p>
            <p className="text-xs text-[#6B6B80]">{offer.appliesTo === 'all' ? 'All Products' : 'Category'}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap" style={{ background: cfg.bg, color: cfg.color }}>
          {cfg.label}
        </span>
      </div>

      {/* Discount + Countdown */}
      <div className="flex items-center gap-3 mb-3">
        <div className="px-3 py-1.5 bg-[#FF7A00]/10 rounded-lg flex-1 text-center">
          <p className="text-2xl font-extrabold text-[#FF7A00]">
            {offer.type === 'percentage' ? `${offer.value}%` : `₹${offer.value}`} <span className="text-sm font-semibold text-[#A0A0B8]">OFF</span>
          </p>
        </div>
        {offer.status === 'active' && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#EF4444]/10 rounded-xl border border-[#EF4444]/20">
            <Clock className="w-3.5 h-3.5 text-[#EF4444]" />
            <span className="text-xs font-bold text-[#EF4444]">{formatCountdown(offer.endDate)}</span>
          </div>
        )}
        {offer.status === 'scheduled' && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F59E0B]/10 rounded-xl border border-[#F59E0B]/20">
            <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-xs font-bold text-[#F59E0B]">Starts {format(new Date(offer.startDate), 'MMM d')}</span>
          </div>
        )}
      </div>

      {/* Stats (only for non-scheduled) */}
      {offer.status !== 'scheduled' && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Orders', value: offer.ordersGenerated.toLocaleString() },
            { label: 'Revenue', value: `₹${(offer.revenueGenerated / 100000).toFixed(1)}L` },
            { label: 'ROI', value: `${offer.roi}x` },
          ].map(({ label, value }) => (
            <div key={label} className="text-center py-1.5 bg-[#1A1A26] rounded-lg">
              <p className="text-[10px] text-[#6B6B80]">{label}</p>
              <p className="text-sm font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      )}
    </motion.button>
  )
}

// ─── Create Offer Form (3-step wizard) ────────────────────────────────────────
function CreateOfferWizard({ onClose, onCreated }: { onClose: () => void; onCreated: (o: SAOfferExtended) => void }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', type: 'percentage' as 'percentage' | 'fixed' | 'buy_x_get_y',
    value: '', appliesTo: 'all' as 'all' | 'category',
    startDate: '', endDate: '',
  })
  const [saving, setSaving] = useState(false)

  const handleCreate = async () => {
    if (!form.name || !form.value || !form.endDate) { toast.error('Fill all required fields'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    const now = new Date()
    const start = form.startDate ? new Date(form.startDate) : now
    const end = new Date(form.endDate)
    const newOffer: SAOfferExtended = {
      id: `off-${Date.now()}`, name: form.name, type: form.type,
      value: Number(form.value),
      startDate: start.toISOString(), endDate: end.toISOString(),
      status: isFuture(start) ? 'scheduled' : isPast(end) ? 'ended' : 'active',
      bannerImage: '', appliesTo: form.appliesTo,
      productsCount: 0, revenueGenerated: 0, ordersGenerated: 0, discountCost: 0, roi: 0,
    }
    onCreated(newOffer)
    toast.success(`Offer "${form.name}" created`)
    setSaving(false)
    onClose()
  }

  return (
    <div className="p-5">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map(s => (
          <React.Fragment key={s}>
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all', step >= s ? 'bg-[#FF7A00] text-white' : 'bg-[#1E1E2E] text-[#6B6B80]')}>
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && <div className={cn('flex-1 h-0.5 rounded-full transition-all', step > s ? 'bg-[#FF7A00]' : 'bg-[#1E1E2E]')} />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h3 className="text-base font-bold text-white">Step 1: Basic Details</h3>
            <div>
              <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">Offer Name <span className="text-[#EF4444]">*</span></label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Republic Day Mega Sale" className="w-full h-11 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">Discount Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['percentage', 'fixed', 'buy_x_get_y'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={cn('p-3 rounded-xl border text-xs font-semibold capitalize text-center transition-all', form.type === t ? 'bg-[#FF7A00]/10 border-[#FF7A00]/40 text-[#FF7A00]' : 'bg-[#1A1A26] border-[#2A2A3E] text-[#6B6B80] hover:text-white')}>
                    {t === 'percentage' ? '% Off' : t === 'fixed' ? '₹ Off' : 'Buy X Get Y'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">Value ({form.type === 'percentage' ? '%' : '₹'}) <span className="text-[#EF4444]">*</span></label>
              <input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder={form.type === 'percentage' ? '25' : '500'} className="w-full h-11 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none" />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h3 className="text-base font-bold text-white">Step 2: Schedule & Scope</h3>
            <div>
              <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">Applies To</label>
              <div className="grid grid-cols-2 gap-2">
                {(['all', 'category'] as const).map(a => (
                  <button key={a} type="button" onClick={() => setForm(f => ({ ...f, appliesTo: a }))}
                    className={cn('p-3 rounded-xl border text-sm font-semibold capitalize transition-all', form.appliesTo === a ? 'bg-[#FF7A00]/10 border-[#FF7A00]/40 text-[#FF7A00]' : 'bg-[#1A1A26] border-[#2A2A3E] text-[#6B6B80]')}>
                    {a === 'all' ? 'All Products' : 'Specific Category'}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">Start Date</label>
                <input type="datetime-local" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="w-full h-11 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">End Date <span className="text-[#EF4444]">*</span></label>
                <input type="datetime-local" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="w-full h-11 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none" />
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h3 className="text-base font-bold text-white">Step 3: Review & Launch</h3>
            <div className="p-4 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl space-y-3">
              {[
                { label: 'Name', value: form.name },
                { label: 'Discount', value: `${form.value}${form.type === 'percentage' ? '%' : ' ₹'} OFF` },
                { label: 'Applies To', value: form.appliesTo === 'all' ? 'All Products' : 'Specific Category' },
                { label: 'Start', value: form.startDate ? format(new Date(form.startDate), 'dd MMM yyyy, hh:mm a') : 'Immediately' },
                { label: 'End', value: form.endDate ? format(new Date(form.endDate), 'dd MMM yyyy, hh:mm a') : 'Not set' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-xs text-[#6B6B80]">{label}</span>
                  <span className="text-xs font-bold text-white">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 mt-6">
        {step > 1 && <button onClick={() => setStep(s => s - 1)} className="h-12 px-4 bg-[#1E1E2E] text-[#A0A0B8] rounded-xl text-sm font-semibold">Back</button>}
        {step < 3 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={step === 1 && (!form.name || !form.value)} className="flex-1 h-12 bg-[#FF7A00] hover:bg-[#FF9A40] text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
            Next Step <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleCreate} disabled={saving} className="flex-1 h-12 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {saving ? 'Launching...' : 'Launch Offer'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OffersPage() {
  const [offers, setOffers] = useState<SAOfferExtended[]>(MOCK_SA_OFFERS)
  const [selected, setSelected] = useState<SAOfferExtended | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [statusFilter, setStatusFilter] = useState<OfferStatus | 'all'>('all')

  const filtered = useMemo(() => offers.filter(o => statusFilter === 'all' || o.status === statusFilter), [offers, statusFilter])

  const stats = useMemo(() => ({
    active: offers.filter(o => o.status === 'active').length,
    scheduled: offers.filter(o => o.status === 'scheduled').length,
    totalRevenue: offers.reduce((a, b) => a + b.revenueGenerated, 0),
    totalOrders: offers.reduce((a, b) => a + b.ordersGenerated, 0),
  }), [offers])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center shadow-lg shadow-red-500/20">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Offers & Flash Sales</h1>
            <p className="text-sm text-[#6B6B80]">{stats.active} live · {stats.scheduled} scheduled</p>
          </div>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 h-10 px-4 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Offer</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Live', value: stats.active, color: '#22C55E' },
          { label: 'Scheduled', value: stats.scheduled, color: '#F59E0B' },
          { label: 'Total Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, color: '#3B82F6' },
          { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), color: '#8B5CF6' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl">
            <p className="text-[10px] text-[#6B6B80] uppercase tracking-wide mb-1">{label}</p>
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5">
        {(['all', 'active', 'scheduled', 'ended'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={cn('px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all h-9', statusFilter === s ? 'bg-[#FF7A00] text-white' : 'bg-[#111118] border border-[#2A2A3E] text-[#6B6B80] hover:text-white')}>
            {s === 'all' ? 'All' : STATUS_CONFIG[s as OfferStatus].label}
          </button>
        ))}
      </div>

      {/* Offers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filtered.map(o => <OfferCard key={o.id} offer={o} onClick={() => setSelected(o)} />)}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            <Gift className="w-12 h-12 text-[#3A3A50] mx-auto mb-3" />
            <p className="text-sm text-[#6B6B80]">No offers found</p>
          </div>
        )}
      </div>

      {/* Offer Detail Sheet */}
      <ResponsiveSheet isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} desktopWidth="w-[520px]">
        {selected && (
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="px-4 py-2 bg-[#FF7A00]/10 rounded-xl">
                <p className="text-2xl font-extrabold text-[#FF7A00]">{selected.type === 'percentage' ? `${selected.value}%` : `₹${selected.value}`} OFF</p>
              </div>
              <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: STATUS_CONFIG[selected.status as OfferStatus].bg, color: STATUS_CONFIG[selected.status as OfferStatus].color }}>
                {STATUS_CONFIG[selected.status as OfferStatus].label}
              </span>
            </div>
            {selected.status === 'active' && (
              <div className="flex items-center gap-2 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl">
                <Clock className="w-4 h-4 text-[#EF4444]" />
                <p className="text-sm font-bold text-[#EF4444]">{formatCountdown(selected.endDate)}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Orders', value: selected.ordersGenerated.toLocaleString(), icon: Package, color: '#3B82F6' },
                { label: 'Revenue', value: `₹${(selected.revenueGenerated / 100000).toFixed(1)}L`, icon: TrendingUp, color: '#22C55E' },
                { label: 'Discount Cost', value: `₹${(selected.discountCost / 1000).toFixed(0)}K`, icon: IndianRupee, color: '#EF4444' },
                { label: 'ROI', value: `${selected.roi}x`, icon: BarChart2, color: '#F59E0B' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="p-3 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                    <p className="text-[10px] text-[#6B6B80]">{label}</p>
                  </div>
                  <p className="text-lg font-bold" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
            {[
              { label: 'Applies To', value: selected.appliesTo === 'all' ? 'All Products' : 'Specific Category' },
              { label: 'Products Included', value: selected.productsCount.toLocaleString() },
              { label: 'Start', value: format(new Date(selected.startDate), 'dd MMM yyyy, hh:mm a') },
              { label: 'End', value: format(new Date(selected.endDate), 'dd MMM yyyy, hh:mm a') },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-[#1E1E2E] last:border-none">
                <span className="text-xs text-[#6B6B80]">{label}</span>
                <span className="text-xs font-bold text-white">{value}</span>
              </div>
            ))}
            <button onClick={() => { setOffers(prev => prev.filter(o => o.id !== selected.id)); setSelected(null); toast.success('Offer deleted') }} className="w-full h-10 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
              <Trash2 className="w-4 h-4" /> Delete Offer
            </button>
          </div>
        )}
      </ResponsiveSheet>

      {/* Create Wizard */}
      <ResponsiveSheet isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Offer" desktopWidth="w-[520px]">
        <CreateOfferWizard onClose={() => setShowCreate(false)} onCreated={o => setOffers(prev => [o, ...prev])} />
      </ResponsiveSheet>
    </div>
  )
}