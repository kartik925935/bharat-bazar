'use client'
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { SAFunnelStep } from '@/lib/mock/sa-analytics.mock'

interface ConversionFunnelProps {
  data: SAFunnelStep[]
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  // TODO: Connect to real analytics pipeline (e.g., PostHog or custom Supabase events table)
  const maxCount = data[0]?.count ?? 1
  const maxDropOff = useMemo(() => {
    return data.reduce((max, step) => step.dropOffRate > max.dropOffRate ? step : max, data[0])
  }, [data])

  const getBarColor = (index: number, total: number) => {
    const ratio = index / (total - 1)
    if (ratio < 0.4) return '#22C55E'
    if (ratio < 0.7) return '#F59E0B'
    return '#EF4444'
  }

  return (
    <div className="bg-[#0A0A12] border border-[#1E1E2E] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-white">Conversion Funnel</h3>
          <p className="text-xs text-[#6B6B80]">Last 30 days · {data[0]?.count.toLocaleString()} total sessions</p>
        </div>
        <span className="px-2 py-1 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg text-[10px] font-bold text-[#F59E0B] uppercase">
          Overall {data[0]?.count ? ((data[data.length - 1]?.count / data[0]?.count) * 100).toFixed(1) : '0.0'}% Conversion
        </span>
      </div>

      <div className="space-y-3">
        {data.map((step, i) => {
          const widthPct = (step.count / maxCount) * 100
          const color = getBarColor(i, data.length)
          const isMaxDrop = step.step === maxDropOff.step || step === maxDropOff

          return (
            <div key={step.step} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs px-1">
                <span className="text-[#A0A0B8] font-medium">{step.step}</span>
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold font-mono">{step.count.toLocaleString()}</span>
                  {step.dropOffRate > 0 && (
                    <span className={cn(
                      'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold',
                      isMaxDrop
                        ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                        : 'bg-[#1E1E2E] text-[#6B6B80]'
                    )}>
                      {isMaxDrop && '⚠ '}-{step.dropOffRate}%
                    </span>
                  )}
                </div>
              </div>
              <motion.div
                className="h-9 rounded-lg relative overflow-hidden"
                style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: i * 0.1 }}
              >
                <motion.div
                  className="h-full rounded-lg"
                  style={{ backgroundColor: `${color}55`, backgroundImage: `linear-gradient(90deg, ${color}88, ${color}44)` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.8, ease: 'easeOut' }}
                />
                <div
                  className="absolute inset-y-0 flex items-center px-3 text-xs font-bold"
                  style={{ color }}
                >
                  {widthPct.toFixed(0)}%
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>

      {/* Insight Callout */}
      {maxDropOff.dropOffRate > 0 && (
        <div className="mt-5 p-3 bg-[#F59E0B]/8 border border-[#F59E0B]/20 rounded-xl">
          <p className="text-sm text-[#F59E0B] font-semibold">
            💡 Biggest drop-off: {maxDropOff.step} ({maxDropOff.dropOffRate}% dropped)
          </p>
          <p className="text-xs text-[#A0A0B8] mt-1">
            {maxDropOff.step === 'Add to Cart'
              ? 'Consider cart abandonment recovery via WhatsApp or email reminders.'
              : maxDropOff.step === 'Product Page View'
              ? 'Improve homepage CTAs and product discoverability.'
              : 'Reduce checkout friction — simplify address/payment forms.'}
          </p>
        </div>
      )}
    </div>
  )
}
