'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'
import { useCountUp } from '@/lib/hooks/useCountUp'
import { formatMetricValue } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: number
  format: 'currency' | 'number' | 'percentage'
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  period?: string
  icon: LucideIcon
  iconColor?: string
  isLoading?: boolean
  onClick?: () => void
  delay?: number
}

const cardVariants: any = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: delay * 0.08 },
  }),
}

export function StatCard({
  label, value, format, change, changeType, period, icon: Icon,
  iconColor = '#FF7A00', isLoading = false, onClick, delay = 0,
}: StatCardProps) {
  const animatedValue = useCountUp(value, 900)
  const formattedValue = formatMetricValue(Math.round(animatedValue), format)
  const isClickable = !!onClick

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-[#111118] border border-[#1E1E2E] p-5 animate-pulse">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#1E1E2E]" />
          <div className="h-3 bg-[#1E1E2E] rounded-full w-28 mt-1.5" />
        </div>
        <div className="h-8 bg-[#1E1E2E] rounded-full w-32 mb-3" />
        <div className="h-3 bg-[#1E1E2E] rounded-full w-20" />
      </div>
    )
  }

  return (
    <motion.div
      custom={delay}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      onClick={onClick}
      whileHover={isClickable ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'relative group rounded-2xl bg-[#111118] border border-[#1E1E2E] p-5 overflow-hidden',
        'transition-all duration-300',
        isClickable
          ? 'cursor-pointer hover:border-[#FF7A00]/30 hover:shadow-[0_0_24px_rgba(255,122,0,0.08)]'
          : '',
      )}
    >
      {/* Subtle glow on hover */}
      {isClickable && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      )}

      {/* Top Row: Icon + Label */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg, ${iconColor}25, ${iconColor}10)`, border: `1px solid ${iconColor}25` }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        <p className="text-xs font-bold text-[#6B6B80] uppercase tracking-widest mt-2 leading-tight">
          {label}
        </p>
      </div>

      {/* Value */}
      <div className="mb-3">
        <span className="text-3xl font-bold text-white tracking-tight tabular-nums">
          {formattedValue}
        </span>
      </div>

      {/* Change Indicator */}
      <div className="flex items-center gap-1.5">
        {changeType === 'increase' && (
          <>
            <TrendingUp className="w-3.5 h-3.5 text-[#22C55E]" />
            <span className="text-xs font-semibold text-[#22C55E]">
              +{change?.toFixed(1)}%
            </span>
          </>
        )}
        {changeType === 'decrease' && (
          <>
            <TrendingDown className="w-3.5 h-3.5 text-[#EF4444]" />
            <span className="text-xs font-semibold text-[#EF4444]">
              {change?.toFixed(1)}%
            </span>
          </>
        )}
        {changeType === 'neutral' && (
          <Minus className="w-3 h-3 text-[#6B6B80]" />
        )}
        {period && (
          <span className="text-xs text-[#6B6B80] font-medium">{period}</span>
        )}
      </div>
    </motion.div>
  )
}
