'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import { DateRangeFilter } from '@/components/super-admin/shared/DateRangeFilter'
import { formatCurrency, formatNumber } from '@/lib/utils/formatters'
import { SA_CHART_COLORS, SA_CHART_GRADIENT_ID } from '@/lib/constants/sa-chart-theme'
import { SkeletonBase } from '@/components/super-admin/shared/SkeletonBase'

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A2E] border border-[#3A3A50] rounded-xl p-3 shadow-2xl shadow-black/50">
        <p className="text-xs font-semibold text-[#8B8B9E] mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3 mt-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm font-medium text-[#D0D0E0]">{entry.name}:</span>
            <span className="text-sm font-bold text-white ml-auto tabular-nums">
              {entry.name === 'Revenue' ? formatCurrency(entry.value) : formatNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function RevenueChart({ isLoading = false }: { isLoading?: boolean }) {
  const { chartData, dashboardDateRange, setDashboardDateRange } = useSuperAdminStore()

  // Generate a mock subset based on date range just to make it look dynamic
  const data = useMemo(() => {
    let days = 30
    if (dashboardDateRange === '7d') days = 7
    if (dashboardDateRange === '90d') days = 90
    
    // Quick mock to expand or contract chartData based on range
    if (days === 30) return chartData
    if (days === 7) return chartData.slice(-7)
    
    // For 90d, we'll duplicate some data to fake it
    return Array.from({ length: 90 }, (_, i) => {
      const idx = i % chartData.length
      return {
        ...chartData[idx],
        date: new Date(Date.now() - (89 - i) * 86400000).toISOString().split('T')[0],
      }
    })
  }, [chartData, dashboardDateRange])

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 flex flex-col h-full relative overflow-hidden"
    >
      {isLoading ? (
        <div className="absolute inset-0 p-5 bg-[#111118] z-10 flex flex-col">
          <div className="flex justify-between mb-8">
            <div>
              <SkeletonBase className="w-32 h-5 mb-2" />
              <SkeletonBase className="w-48 h-8" />
            </div>
            <SkeletonBase className="w-40 h-8" />
          </div>
          <SkeletonBase className="flex-1 w-full rounded-xl" />
        </div>
      ) : null}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-20">
        <div>
          <h2 className="text-sm font-bold text-[#6B6B80] uppercase tracking-widest mb-1">Revenue Overview</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight tabular-nums">
              {formatCurrency(totalRevenue, true)}
            </span>
            <span className="text-xs font-semibold text-[#22C55E]">↑ 12.4%</span>
          </div>
        </div>
        <DateRangeFilter value={dashboardDateRange} onChange={setDashboardDateRange as any} />
      </div>

      {/* Chart */}
      <div className="flex-1 w-full h-[240px] md:h-[320px] min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={SA_CHART_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={SA_CHART_COLORS.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={SA_CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={SA_CHART_COLORS.grid} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: SA_CHART_COLORS.axis, fontSize: 12, fontWeight: 500 }}
              tickFormatter={(val) => {
                const date = new Date(val)
                return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`
              }}
              minTickGap={20}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: SA_CHART_COLORS.axis, fontSize: 12, fontWeight: 500 }}
              tickFormatter={(val) => formatCurrency(val, true)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3A3A50', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke={SA_CHART_COLORS.primary}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#${SA_CHART_GRADIENT_ID})`}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
