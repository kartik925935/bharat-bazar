'use client'
import React, { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SARevenueDataPoint } from '@/lib/mock/sa-analytics.mock'

const formatINR = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`
  return `₹${val}`
}

const SERIES = [
  { key: 'gmv', label: 'GMV', color: '#FF7A00' },
  { key: 'platformRevenue', label: 'Platform Revenue', color: '#22C55E' },
  { key: 'commissions', label: 'Commissions', color: '#3B82F6' },
  { key: 'refunds', label: 'Refunds', color: '#EF4444' },
] as const

type SeriesKey = typeof SERIES[number]['key']

interface RevenueChartProps {
  data: SARevenueDataPoint[]
  granularity: 'daily' | 'weekly' | 'monthly'
  onGranularityChange: (g: 'daily' | 'weekly' | 'monthly') => void
  onExport: () => void
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111118] border border-[#2A2A3E] rounded-xl p-3 shadow-2xl min-w-[180px]">
      <p className="text-xs text-[#8B8B9E] mb-2 font-mono">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4 text-xs mb-1">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="text-white font-bold font-mono">{formatINR(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function RevenueChart({ data, granularity, onGranularityChange, onExport }: RevenueChartProps) {
  const [activeSeries, setActiveSeries] = useState<Set<SeriesKey>>(
    new Set(['gmv', 'platformRevenue', 'commissions', 'refunds'])
  )

  const toggleSeries = (key: SeriesKey) => {
    const next = new Set(activeSeries)
    if (next.has(key)) { if (next.size > 1) next.delete(key) }
    else next.add(key)
    setActiveSeries(next)
  }

  const formatXAxis = (val: string) => {
    const d = new Date(val)
    if (granularity === 'monthly') return d.toLocaleString('default', { month: 'short' })
    if (granularity === 'weekly') return `W${Math.ceil(d.getDate() / 7)} ${d.toLocaleString('default', { month: 'short' })}`
    return `${d.getDate()}/${d.getMonth() + 1}`
  }

  return (
    <div className="bg-[#0A0A12] border border-[#1E1E2E] rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-white">Revenue Overview</h3>
          <p className="text-xs text-[#6B6B80]">
            {data.length} data points • {granularity} view
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Granularity toggle */}
          <div className="flex bg-[#111118] border border-[#1E1E2E] rounded-lg p-0.5 gap-0.5">
            {(['daily', 'weekly', 'monthly'] as const).map(g => (
              <button
                key={g}
                onClick={() => onGranularityChange(g)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all',
                  granularity === g
                    ? 'bg-[#FF7A00] text-white shadow'
                    : 'text-[#6B6B80] hover:text-white'
                )}
              >
                {g}
              </button>
            ))}
          </div>
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111118] border border-[#1E1E2E] rounded-lg text-xs text-[#A0A0B8] hover:text-white hover:border-[#FF7A00]/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Series Toggles */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SERIES.map(s => (
          <button
            key={s.key}
            onClick={() => toggleSeries(s.key)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border',
              activeSeries.has(s.key)
                ? 'border-transparent text-white'
                : 'border-[#2A2A3E] text-[#4A4A5E] line-through'
            )}
            style={activeSeries.has(s.key) ? { backgroundColor: `${s.color}22`, borderColor: `${s.color}44`, color: s.color } : {}}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeSeries.has(s.key) ? s.color : '#4A4A5E' }} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="overflow-x-auto -mx-2">
        <div className="min-w-[560px]">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                {SERIES.map(s => (
                  <linearGradient key={s.key} id={`grad_${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A26" vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{ fill: '#6B6B80', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatINR} tick={{ fill: '#6B6B80', fontSize: 10 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CustomTooltip />} />
              {SERIES.map(s => activeSeries.has(s.key) && (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  fill={`url(#grad_${s.key})`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: s.color }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
