'use client'
import React, { useState } from 'react'
import {
  TrendingUp, IndianRupee, Package, ArrowUpRight,
  ArrowDownRight, Clock, CheckCircle, AlertTriangle,
  BarChart2, Wallet, RefreshCw, ChevronRight
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useSAStore } from '@/lib/store/super-admin-store'
import {
  getTotalGMV,
  getTotalCommission,
  getPendingSettlementsTotal,
  getTotalRefunds,
  getPeriodGMV,
  getRevenueTrend,
  RevenueTrendPoint
} from '@/lib/store/selectors/finance.selectors'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

// ─── Tiny Sparkline SVG ──────────────────────────────────────────────────────
function Sparkline({ data, color = '#FF7A00' }: { data: number[]; color?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 120, h = 36
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Metric Card ─────────────────────────────────────────────────────────────
function MetricCard({
  label, value, subtitle, trend, trendLabel, sparkData, color = '#FF7A00', icon: Icon,
}: {
  label: string; value: string; subtitle?: string; trend?: number; trendLabel?: string
  sparkData?: number[]; color?: string; icon: React.ElementType
}) {
  const up = (trend ?? 0) >= 0
  return (
    <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5 hover:border-[#FF7A00]/20 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        {sparkData && <Sparkline data={sparkData} color={color} />}
      </div>
      <p className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-white mb-1">{value}</p>
      {subtitle && <p className="text-xs text-[#6B6B80]">{subtitle}</p>}
      {trend !== undefined && (
        <div className={cn('flex items-center gap-1 mt-1.5 text-xs font-semibold', up ? 'text-[#22C55E]' : 'text-[#EF4444]')}>
          {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(trend)}% {trendLabel ?? 'vs last period'}
        </div>
      )}
    </div>
  )
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
function MiniBarChart({ data }: { data: RevenueTrendPoint[] }) {
  const maxGmv = Math.max(...data.map(d => d.gmv), 1)
  return (
    <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white">Revenue Trend (Last 11 Days)</h2>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#FF7A00] inline-block" /> GMV</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] inline-block" /> Commission</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block" /> Refunds</span>
        </div>
      </div>
      {/* Bar chart with pure CSS/SVG */}
      <div className="flex items-end gap-1.5 h-32 w-full">
        {data.map(d => {
          const gmvPct = (d.gmv / maxGmv) * 100
          const comPct = (d.commission / maxGmv) * 100
          const refPct = (d.refunds / maxGmv) * 100
          return (
            <div key={d.date} className="flex-1 flex flex-col justify-end gap-0.5 group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1A1A26] border border-[#2A2A3E] rounded-lg px-2.5 py-1.5 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-xl">
                <p className="font-bold">{d.date}</p>
                <p className="text-[#FF7A00]">GMV: ₹{(d.gmv / 100000).toFixed(1)}L</p>
                <p className="text-[#22C55E]">Com: ₹{(d.commission / 1000).toFixed(0)}K</p>
                <p className="text-[#EF4444]">Ref: ₹{(d.refunds / 1000).toFixed(0)}K</p>
              </div>
              <div className="w-full rounded-t-sm bg-[#EF4444]/60" style={{ height: `${refPct}%`, minHeight: '2px' }} />
              <div className="w-full rounded-t-sm bg-[#22C55E]/80" style={{ height: `${comPct}%`, minHeight: '2px' }} />
              <div className="w-full rounded-t-sm bg-[#FF7A00]" style={{ height: `${gmvPct - comPct - refPct}%`, minHeight: '2px' }} />
            </div>
          )
        })}
      </div>
      <div className="flex justify-between mt-2">
        {data.map(d => <span key={d.date} className="text-[8px] text-[#3A3A50] flex-1 text-center">{d.date.replace('Jul ', '')}</span>)}
      </div>
    </div>
  )
}

// ─── Payout Pipeline ─────────────────────────────────────────────────────────
const PAYOUT_STATUS_CONFIG = {
  pending:    { color: '#3B82F6', bg: '#3B82F615', label: 'Upcoming' },
  processing: { color: '#F59E0B', bg: '#F59E0B15', label: 'Processing' },
  completed:  { color: '#22C55E', bg: '#22C55E15', label: 'Paid' },
  failed:     { color: '#EF4444', bg: '#EF444415', label: 'Failed' },
}

function PayoutPipeline() {
  const state = useSAStore()
  const events = state.settlements.filter(s => s.status === 'pending' || s.status === 'processing').slice(0, 5)
  return (
    <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5">
      <h2 className="text-sm font-bold text-white mb-4">Upcoming Payouts</h2>
      <div className="space-y-2">
        {events.map(ev => {
          const cfg = PAYOUT_STATUS_CONFIG[ev.status]
          return (
            <div key={ev.id} className="flex items-center gap-3 p-3 bg-[#1A1A26] rounded-xl">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{ev.sellerName}</p>
                <p className="text-[10px] text-[#6B6B80]">{format(new Date(ev.periodEnd || ev.createdAt), 'dd MMM yyyy')}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-white">₹{ev.netAmount.toLocaleString()}</p>
                <span className="text-[10px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Settlement Quick List ────────────────────────────────────────────────────
function SettlementQuickList({ saToken }: { saToken: string }) {
  const router = useRouter()
  const state = useSAStore()
  const settlements = state.settlements.slice(0, 5)
  const STATUS_CFG = {
    pending:    { color: '#F59E0B', label: 'Pending' },
    processing: { color: '#3B82F6', label: 'Processing' },
    completed:  { color: '#22C55E', label: 'Completed' },
    failed:     { color: '#EF4444', label: 'Failed' },
  }
  return (
    <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white">Recent Settlements</h2>
        <button
          onClick={() => router.push(`/${saToken}/finance/settlements`)}
          className="text-xs text-[#FF7A00] font-semibold flex items-center gap-1 hover:underline"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-2">
        {settlements.map(s => {
          const cfg = STATUS_CFG[s.status]
          return (
            <div key={s.id} className="flex items-center gap-3 p-3 bg-[#1A1A26] rounded-xl">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: `${cfg.color}20`, color: cfg.color }}>
                {s.sellerName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{s.sellerName}</p>
                <p className="text-[10px] text-[#6B6B80]">{s.ordersCount} orders</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-white">₹{s.netAmount.toLocaleString()}</p>
                <span className="text-[10px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FinanceOverviewPage() {
  const params = useParams<{ saToken: string }>()
  const saToken = params.saToken
  const state = useSAStore()
  
  const totalGMV = getTotalGMV(state as any)
  const totalCommission = getTotalCommission(state as any)
  const pendingSettlements = getPendingSettlementsTotal(state as any)
  const totalRefunds = getTotalRefunds(state as any)

  const periodGMV = getPeriodGMV(state as any, 30)
  
  const completedSettlements = state.settlements.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.netAmount, 0)
  
  const chartData = getRevenueTrend(state as any, 11)
  const periodRevenue = chartData.reduce((sum, d) => sum + d.commission, 0)

  const gmvSpark = chartData.map(d => d.gmv)
  const comSpark = chartData.map(d => d.commission)
  const refSpark = chartData.map(d => d.refunds)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-lg shadow-green-500/20">
          <IndianRupee className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Finance Overview</h1>
          <p className="text-sm text-[#6B6B80]">Platform-wide financial summary</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Total GMV" icon={TrendingUp} color="#FF7A00"
          value={`₹${(totalGMV / 10000000).toFixed(2)}Cr`}
          subtitle="All-time gross merchandise value"
          trend={18.4} sparkData={gmvSpark}
        />
        <MetricCard
          label="Total Commission" icon={BarChart2} color="#8B5CF6"
          value={`₹${(totalCommission / 100000).toFixed(1)}L`}
          subtitle="Platform revenue collected"
          trend={22.1} sparkData={comSpark}
        />
        <MetricCard
          label="Pending Settlements" icon={Clock} color="#F59E0B"
          value={`₹${(pendingSettlements / 100000).toFixed(1)}L`}
          subtitle="Due to sellers"
          trend={-8.3}
        />
        <MetricCard
          label="Total Refunds" icon={AlertTriangle} color="#EF4444"
          value={`₹${(totalRefunds / 100000).toFixed(1)}L`}
          subtitle="All-time refunds issued"
          trend={3.2} sparkData={refSpark}
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-[#111118] border border-[#2A2A3E] rounded-2xl">
          <p className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider mb-2">Period GMV (Last 30d)</p>
          <p className="text-2xl font-extrabold text-white">₹{(periodGMV / 100000).toFixed(1)}L</p>
          <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-[#22C55E]">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs last month
          </div>
        </div>
        <div className="p-5 bg-[#111118] border border-[#2A2A3E] rounded-2xl">
          <p className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider mb-2">Period Revenue (Last 11d)</p>
          <p className="text-2xl font-extrabold text-white">₹{(periodRevenue / 100000).toFixed(1)}L</p>
          <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-[#22C55E]">
            <ArrowUpRight className="w-3.5 h-3.5" /> +19.8% vs last month
          </div>
        </div>
        <div className="p-5 bg-[#111118] border border-[#2A2A3E] rounded-2xl">
          <p className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider mb-2">Completed Settlements</p>
          <p className="text-2xl font-extrabold text-white">₹{(completedSettlements / 10000000).toFixed(2)}Cr</p>
          <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-[#22C55E]">
            <CheckCircle className="w-3.5 h-3.5" /> Successfully disbursed
          </div>
        </div>
      </div>

      {/* Chart */}
      <MiniBarChart data={chartData} />

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PayoutPipeline />
        <SettlementQuickList saToken={saToken} />
      </div>
    </div>
  )
}