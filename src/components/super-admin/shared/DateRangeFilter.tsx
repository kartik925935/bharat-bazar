'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DateRangeFilterProps {
  value: '7d' | '30d' | '90d' | 'custom'
  onChange: (range: '7d' | '30d' | '90d' | 'custom') => void
  className?: string
}

const RANGES: { label: string; value: '7d' | '30d' | '90d' | 'custom' }[] = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: 'Custom', value: 'custom' },
]

export function DateRangeFilter({ value, onChange, className }: DateRangeFilterProps) {
  return (
    <div className={cn('flex items-center bg-[#0E0E16] border border-[#2A2A3E] rounded-xl p-1 gap-0.5', className)}>
      {RANGES.map((r) => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className="relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors z-10"
          style={{ color: value === r.value ? '#fff' : '#6B6B80' }}
        >
          {value === r.value && (
            <motion.div
              layoutId="dateRangePill"
              className="absolute inset-0 rounded-lg z-[-1]"
              style={{ background: 'linear-gradient(135deg, #FF7A00, #F5C842)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          {r.label}
        </button>
      ))}
    </div>
  )
}
