'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { SAPlatformHealthScore } from '@/lib/mock/sa-analytics.mock'

interface PlatformHealthGaugeProps {
  health: SAPlatformHealthScore
}

function CircularGauge({ score, size = 180 }: { score: number; size?: number }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = (size - 24) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference
  const color = score >= 85 ? '#22C55E' : score >= 70 ? '#F59E0B' : '#EF4444'

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#1E1E2E" strokeWidth={12}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-black"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {animatedScore}
        </motion.span>
        <span className="text-xs text-[#6B6B80] font-medium mt-1">/ 100</span>
      </div>
    </div>
  )
}

function MetricStat({ label, value, suffix, isLag = false }: {
  label: string; value: number; suffix?: string; isLag?: boolean
}) {
  const isGood = isLag ? value < 12 : value >= 85
  const color = isGood ? 'text-[#22C55E]' : value >= 70 ? 'text-[#F59E0B]' : 'text-[#EF4444]'

  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 bg-[#0E0E1A] rounded-xl border border-[#1E1E2E]">
      <span className={cn('text-xl font-bold', color)}>
        {isLag ? `${value}h` : `${value}%`}
      </span>
      <span className="text-[10px] text-[#6B6B80] text-center leading-tight uppercase tracking-wider font-semibold">
        {label}
      </span>
    </div>
  )
}

export function PlatformHealthCard({ health }: PlatformHealthGaugeProps) {
  const scoreColor = health.overall >= 85 ? 'text-[#22C55E]' : health.overall >= 70 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
  const borderColor = health.overall >= 85 ? 'border-[#22C55E]/20' : health.overall >= 70 ? 'border-[#F59E0B]/20' : 'border-[#EF4444]/20'

  return (
    <div className={cn('bg-[#0A0A12] border rounded-2xl p-6', borderColor)}>
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Gauge */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <CircularGauge score={health.overall} size={160} />
          <div className="text-center">
            <p className={cn('text-sm font-bold', scoreColor)}>
              {health.overall >= 85 ? '🟢 Platform Healthy' : health.overall >= 70 ? '🟡 Needs Attention' : '🔴 Critical Issues'}
            </p>
            <p className="text-[10px] text-[#6B6B80] mt-0.5">Platform Health Score</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 w-full">
          <h3 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-4">
            Component Metrics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <MetricStat label="Order Fulfillment" value={health.components.orderFulfillmentRate} />
            <MetricStat label="Seller Response" value={health.components.sellerResponseRate} />
            <MetricStat label="Payment Success" value={health.components.paymentSuccessRate} />
            <MetricStat label="Dispute Resolution" value={health.components.disputeResolutionRate} />
            <MetricStat label="Review Approval Lag" value={health.components.reviewApprovalLag} isLag />
          </div>
          <p className="text-[11px] text-[#4A4A5E] mt-4">
            Score computed from platform operational metrics. Updated daily.
          </p>
        </div>
      </div>
    </div>
  )
}
