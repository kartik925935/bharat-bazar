'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts'
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import { getSalesByCategory } from '@/lib/store/selectors/dashboard.selectors'
import { formatCurrency } from '@/lib/utils/formatters'
import { SkeletonBase } from '@/components/super-admin/shared/SkeletonBase'
import { cn } from '@/lib/utils'

// Custom active shape to slightly pop out the active pie slice
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8} // expand outer radius
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 14}
        fill={fill}
      />
    </g>
  )
}

export function CategoryBreakdownChart({ isLoading = false }: { isLoading?: boolean }) {
  const { orders } = useSuperAdminStore()
  const [activeIndex, setActiveIndex] = useState(-1)

  const CHART_COLORS = ['#FF7A00', '#F5C842', '#22C55E', '#3B82F6', '#A855F7', '#EC4899', '#14B8A6', '#6B7280']
  
  const categoryBreakdown = getSalesByCategory({ orders }).map((cat, i) => ({
    ...cat,
    color: CHART_COLORS[i % CHART_COLORS.length]
  }))

  const totalValue = categoryBreakdown.reduce((sum, item) => sum + item.total, 0)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 flex flex-col h-full relative overflow-hidden"
    >
      {isLoading ? (
        <div className="absolute inset-0 p-5 bg-[#111118] z-10 flex flex-col">
          <SkeletonBase className="w-32 h-5 mb-8" />
          <div className="flex-1 flex flex-col md:flex-row items-center gap-8">
            <SkeletonBase className="w-48 h-48 rounded-full shrink-0" />
            <div className="flex-1 w-full space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonBase key={i} className="w-full h-8 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Header */}
      <div className="mb-4 relative z-20">
        <h2 className="text-sm font-bold text-[#6B6B80] uppercase tracking-widest">Sales by Category</h2>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row items-center gap-6 xl:gap-8">
        {/* Donut Chart */}
        <div className="relative w-full max-w-[240px] aspect-square shrink-0">
          {!categoryBreakdown || categoryBreakdown.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#6B6B80] text-sm text-center px-4 bg-[#1A1A26] rounded-full">
              No category data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                dataKey="total"
                stroke="none"
                isAnimationActive={true}
                animationDuration={1200}
                animationBegin={200}
                // @ts-ignore
                activeIndex={activeIndex !== -1 ? activeIndex : undefined}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          )}
          {/* Center Text */}
          {categoryBreakdown && categoryBreakdown.length > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white tabular-nums tracking-tight">
                {formatCurrency(totalValue, true)}
              </span>
              <span className="text-[10px] font-semibold text-[#8B8B9E] uppercase tracking-widest">Total</span>
            </div>
          )}
        </div>

        {/* Custom Legend */}
        <div className="flex-1 w-full flex flex-col gap-1.5 overflow-y-auto max-h-[220px] pr-2 scrollbar-thin scrollbar-thumb-[#2A2A3E]">
          {categoryBreakdown.map((item, idx) => (
            <div
              key={item.category}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(-1)}
              className={cn(
                'flex items-center gap-3 p-2 rounded-xl transition-all cursor-default',
                activeIndex === idx ? 'bg-white/5' : 'hover:bg-white/[0.02]'
              )}
            >
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-xs font-semibold truncate transition-colors',
                  activeIndex === idx ? 'text-white' : 'text-[#A0A0B8]'
                )}>
                  {item.category}
                </p>
              </div>
              <div className="text-right shrink-0 flex items-center gap-3">
                <span className="text-xs font-bold text-white">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
