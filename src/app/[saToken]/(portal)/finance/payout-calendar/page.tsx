'use client'
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, CheckCircle, XCircle, Clock,
  AlertTriangle, ChevronLeft, ChevronRight, Package,
  RefreshCw, ArrowUpRight, Ban, Loader2
} from 'lucide-react'
import {
  MOCK_PAYOUT_CALENDAR, MOCK_PAYOUT_SUMMARY,
  type PayoutCalendarEvent, type PayoutStatus
} from '@/lib/mock/sa-payout-calendar.mock'
import { ResponsiveSheet } from '@/components/ui/responsive-sheet'
import { cn } from '@/lib/utils'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, isToday, isSameMonth, addMonths, subMonths, parseISO
} from 'date-fns'
import { toast } from 'sonner'

// ─── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CFG: Record<PayoutStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  upcoming:   { label: 'Upcoming',   color: '#FF7A00', bg: '#FF7A0015', icon: Clock },
  processing: { label: 'Processing', color: '#3B82F6', bg: '#3B82F615', icon: Loader2 },
  paid:       { label: 'Paid',       color: '#22C55E', bg: '#22C55E15', icon: CheckCircle },
  failed:     { label: 'Failed',     color: '#EF4444', bg: '#EF444415', icon: XCircle },
  on_hold:    { label: 'On Hold',    color: '#F59E0B', bg: '#F59E0B15', icon: Ban },
}

function fmtInr(n: number) { return `₹${(n / 100000).toFixed(1)}L` }

function StatusBadge({ status }: { status: PayoutStatus }) {
  const c = STATUS_CFG[status]
  const Icon = c.icon
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: c.bg, color: c.color }}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  )
}

// ─── Payout Detail Sheet ──────────────────────────────────────────────────────
function PayoutDetailSheet({ event, onClose, onRetry, onHold }: {
  event: PayoutCalendarEvent
  onClose: () => void
  onRetry: (id: string) => void
  onHold: (id: string) => void
}) {
  const [acting, setActing] = useState(false)
  const cfg = STATUS_CFG[event.status]

  const handleRetry = async () => {
    setActing(true)
    await new Promise(r => setTimeout(r, 800))
    onRetry(event.id)
    toast.success(`Retry initiated for ${event.shopName}`)
    setActing(false)
    onClose()
  }
  const handleHold = async () => {
    setActing(true)
    await new Promise(r => setTimeout(r, 600))
    onHold(event.id)
    toast.success('Payout placed on hold')
    setActing(false)
    onClose()
  }

  return (
    <div className="p-5 pb-24 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold" style={{ background: cfg.bg, color: cfg.color }}>
          {event.shopName[0]}
        </div>
        <div>
          <h3 className="text-base font-bold text-white">{event.shopName}</h3>
          <p className="text-sm text-[#6B6B80]">{event.sellerName} · {event.sellerType.replace('_', ' ')}</p>
        </div>
      </div>

      {/* Amount */}
      <div className="p-4 bg-gradient-to-r from-[#FF7A00]/10 to-[#FF4500]/5 border border-[#FF7A00]/20 rounded-2xl">
        <p className="text-[10px] font-bold text-[#FF7A00] uppercase tracking-wider mb-1">Payout Amount</p>
        <p className="text-3xl font-extrabold text-white">₹{event.amount.toLocaleString('en-IN')}</p>
        <p className="text-xs text-[#6B6B80] mt-1">{event.ordersIncluded} orders · {event.cycle} cycle</p>
      </div>

      {/* Status badge */}
      <div className="p-3 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl flex items-center justify-between">
        <p className="text-xs text-[#6B6B80] font-semibold uppercase tracking-wider">Status</p>
        <StatusBadge status={event.status} />
      </div>

      {/* Details list */}
      <div>
        <h4 className="text-xs font-bold text-[#FF7A00] uppercase tracking-wider mb-3">Payout Details</h4>
        <div className="space-y-0">
          {[
            { label: 'Scheduled Date', value: format(parseISO(event.scheduledDate), 'dd MMM yyyy, hh:mm a') },
            { label: 'Processed Date', value: event.processedDate ? format(parseISO(event.processedDate), 'dd MMM yyyy, hh:mm a') : '—' },
            { label: 'Bank', value: event.bankName ?? '—' },
            { label: 'Account (Last 4)', value: event.accountLast4 ? `••••${event.accountLast4}` : '—' },
            { label: 'UTR Number', value: event.utrNumber ?? '—' },
            { label: 'Payout Cycle', value: event.cycle.charAt(0).toUpperCase() + event.cycle.slice(1) },
            { label: 'Orders Included', value: `${event.ordersIncluded} orders` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2.5 border-b border-[#1E1E2E] last:border-none">
              <span className="text-xs text-[#6B6B80]">{label}</span>
              <span className="text-xs font-semibold text-white">{value}</span>
            </div>
          ))}
        </div>
        {event.failureReason && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl mt-3">
            <p className="text-xs text-red-400 font-semibold mb-1">Failure / Hold Reason</p>
            <p className="text-sm text-white">{event.failureReason}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {(event.status === 'failed' || event.status === 'on_hold') && (
        <div className="pt-4 border-t border-[#1E1E2E]">
          <button onClick={handleRetry} disabled={acting} className="w-full h-12 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 disabled:opacity-50">
            {acting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {acting ? 'Initiating Retry...' : 'Retry Payout'}
          </button>
        </div>
      )}
      {event.status === 'upcoming' && (
        <div className="pt-4 border-t border-[#1E1E2E]">
          <button onClick={handleHold} disabled={acting} className="w-full h-12 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            {acting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
            Place on Hold
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Calendar Cell ─────────────────────────────────────────────────────────────
function CalendarDay({ date, events, currentMonth, onSelect }: {
  date: Date
  events: PayoutCalendarEvent[]
  currentMonth: Date
  onSelect: (e: PayoutCalendarEvent) => void
}) {
  const isCurrentMonth = isSameMonth(date, currentMonth)
  const isCurrentDay = isToday(date)
  const totalAmount = events.reduce((s, e) => s + e.amount, 0)

  return (
    <div className={cn(
      'min-h-[80px] p-1.5 border-b border-r border-[#1E1E2E] transition-colors',
      !isCurrentMonth && 'opacity-25',
      isCurrentDay && 'bg-[#FF7A00]/5'
    )}>
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1',
        isCurrentDay ? 'bg-[#FF7A00] text-white' : 'text-[#6B6B80]'
      )}>
        {format(date, 'd')}
      </div>
      {totalAmount > 0 && (
        <div className="text-[9px] font-bold text-[#FF7A00] mb-1">{fmtInr(totalAmount)}</div>
      )}
      <div className="space-y-0.5">
        {events.slice(0, 2).map(ev => {
          const cfg = STATUS_CFG[ev.status]
          return (
            <button
              key={ev.id}
              onClick={() => onSelect(ev)}
              className="w-full text-left px-1 py-0.5 rounded text-[9px] font-semibold truncate hover:opacity-80 transition-opacity"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              {ev.shopName}
            </button>
          )
        })}
        {events.length > 2 && (
          <button onClick={() => onSelect(events[2])} className="text-[9px] text-[#6B6B80] pl-1 hover:text-white transition-colors">
            +{events.length - 2} more
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PayoutCalendarPage() {
  const [events, setEvents] = useState<PayoutCalendarEvent[]>(MOCK_PAYOUT_CALENDAR)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selected, setSelected] = useState<PayoutCalendarEvent | null>(null)
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | 'all'>('all')

  const summary = MOCK_PAYOUT_SUMMARY

  const filteredEvents = useMemo(() =>
    statusFilter === 'all' ? events : events.filter(e => e.status === statusFilter)
  , [events, statusFilter])

  const calDays = useMemo(() => eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  }), [currentMonth])

  const eventsForDay = (day: Date) =>
    filteredEvents.filter(e => isSameDay(parseISO(e.scheduledDate), day))

  const handleRetry = (id: string) =>
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'processing' as PayoutStatus } : e))

  const handleHold = (id: string) =>
    setEvents(prev => prev.map(e => e.id === id
      ? { ...e, status: 'on_hold' as PayoutStatus, failureReason: 'Placed on hold by super admin' }
      : e
    ))

  const SUMMARY_CARDS = [
    { label: 'Upcoming', value: fmtInr(summary.totalScheduled), count: summary.upcomingCount, color: '#FF7A00', icon: Clock },
    { label: 'Processing', value: `${summary.processingCount} active`, count: summary.processingCount, color: '#3B82F6', icon: Loader2 },
    { label: 'Paid (Month)', value: fmtInr(summary.totalPaid), count: summary.paidCount, color: '#22C55E', icon: CheckCircle },
    { label: 'Failed / Hold', value: fmtInr(summary.totalFailed + summary.totalOnHold), count: summary.failedCount, color: '#EF4444', icon: AlertTriangle },
  ]

  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const firstDayOffset = startOfMonth(currentMonth).getDay()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Payout Calendar</h1>
          <p className="text-sm text-[#6B6B80]">Schedule and track all seller payouts</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SUMMARY_CARDS.map(({ label, value, count, color, icon: Icon }) => (
          <div key={label} className="p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl hover:border-[#FF7A00]/20 transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-[#6B6B80] font-bold uppercase tracking-wider">{label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
            </div>
            <p className="text-xl font-extrabold text-white">{value}</p>
            <p className="text-xs text-[#6B6B80] mt-0.5">{count} payouts</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {(['all', 'upcoming', 'processing', 'paid', 'failed', 'on_hold'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              'px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all h-9',
              statusFilter === s ? 'bg-[#FF7A00] text-white' : 'bg-[#111118] border border-[#2A2A3E] text-[#6B6B80] hover:text-white'
            )}
          >
            {s === 'all' ? 'All' : STATUS_CFG[s].label}
          </button>
        ))}
      </div>

      {/* Calendar Widget */}
      <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl overflow-hidden">
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E2E]">
          <button
            onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
            className="w-8 h-8 rounded-lg bg-[#1A1A26] hover:bg-[#2A2A3E] flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <h2 className="text-base font-bold text-white">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button
            onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
            className="w-8 h-8 rounded-lg bg-[#1A1A26] hover:bg-[#2A2A3E] flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-[#1E1E2E]">
          {WEEKDAYS.map(d => (
            <div key={d} className="px-2 py-2.5 text-center text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider border-r border-[#1E1E2E] last:border-none">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`pad-${i}`} className="min-h-[80px] border-b border-r border-[#1E1E2E]" />
          ))}
          {calDays.map(day => (
            <CalendarDay
              key={day.toISOString()}
              date={day}
              events={eventsForDay(day)}
              currentMonth={currentMonth}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      {/* List of all payouts for this month */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-[#FF7A00]" />
          All Payouts — {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="space-y-2">
          <AnimatePresence>
            {filteredEvents
              .filter(e => isSameMonth(parseISO(e.scheduledDate), currentMonth))
              .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
              .map(ev => {
                const cfg = STATUS_CFG[ev.status]
                return (
                  <motion.button
                    key={ev.id}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelected(ev)}
                    className="w-full p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl text-left hover:border-[#FF7A00]/30 active:scale-[0.99] transition-all group"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
                          {ev.shopName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-[#FF7A00] transition-colors">{ev.shopName}</p>
                          <p className="text-xs text-[#6B6B80]">{ev.sellerName} · {format(parseISO(ev.scheduledDate), 'dd MMM, hh:mm a')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-auto">
                        <p className="text-sm font-bold text-white">₹{ev.amount.toLocaleString('en-IN')}</p>
                        <StatusBadge status={ev.status} />
                        <ArrowUpRight className="w-4 h-4 text-[#3A3A50] group-hover:text-[#FF7A00] transition-colors" />
                      </div>
                    </div>
                  </motion.button>
                )
              })}
          </AnimatePresence>
          {filteredEvents.filter(e => isSameMonth(parseISO(e.scheduledDate), currentMonth)).length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-[#3A3A50] mx-auto mb-3" />
              <p className="text-sm text-[#6B6B80]">No payouts for this month</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Sheet */}
      <ResponsiveSheet isOpen={!!selected} onClose={() => setSelected(null)} title="Payout Details" desktopWidth="w-[500px]">
        {selected && (
          <PayoutDetailSheet
            event={selected}
            onClose={() => setSelected(null)}
            onRetry={handleRetry}
            onHold={handleHold}
          />
        )}
      </ResponsiveSheet>
    </div>
  )
}

