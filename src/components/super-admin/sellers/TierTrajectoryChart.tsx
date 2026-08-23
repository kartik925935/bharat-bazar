'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils/formatters'
import type { SASellerPerformanceMonth } from '@/types/super-admin.types'

interface TierTrajectoryChartProps {
  data: SASellerPerformanceMonth[]
}

export function TierTrajectoryChart({ data }: TierTrajectoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-40 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl flex items-center justify-center">
        <p className="text-xs text-[#6B6B80]">Not enough performance history.</p>
      </div>
    )
  }

  const maxSales = Math.max(...data.map(d => d.sales), 1000)
  const paddingY = 20
  const paddingX = 20
  const height = 160
  const width = 400
  
  const innerHeight = height - paddingY * 2
  const innerWidth = width - paddingX * 2
  
  const stepX = innerWidth / Math.max(data.length - 1, 1)

  const points = data.map((d, i) => {
    const x = paddingX + i * stepX
    const y = paddingY + innerHeight - (d.sales / maxSales) * innerHeight
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="bg-[#1A1A26] border border-[#2A2A3E] rounded-xl p-4 overflow-hidden">
      <h3 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-2">Sales Trajectory (6 months)</h3>
      <div className="w-full overflow-x-auto scrollbar-none">
        <div className="min-w-[400px]">
          <svg width={width} height={height} className="w-full h-full overflow-visible">
            {/* Grid lines */}
            {[0, 0.5, 1].map((ratio, i) => {
              const y = paddingY + innerHeight * ratio
              return (
                <g key={i}>
                  <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#2A2A3E" strokeDasharray="4 4" />
                  <text x={0} y={y + 3} fill="#6B6B80" fontSize="10" fontWeight="bold">
                    {formatCurrency(maxSales * (1 - ratio))}
                  </text>
                </g>
              )
            })}

            {/* Line */}
            <motion.polyline
              points={points}
              fill="none"
              stroke="#FF7A00"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />

            {/* Data points */}
            {data.map((d, i) => {
              const x = paddingX + i * stepX
              const y = paddingY + innerHeight - (d.sales / maxSales) * innerHeight
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="4" fill="#09090B" stroke="#FF7A00" strokeWidth="2" />
                  <text x={x} y={height - 2} fill="#A0A0B8" fontSize="10" textAnchor="middle">{d.month}</text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}
