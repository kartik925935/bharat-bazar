import React from 'react'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  withDot?: boolean
  className?: string
}

const VARIANTS = {
  success: {
    bg: 'bg-[#22C55E]/10',
    text: 'text-[#22C55E]',
    border: 'border-[#22C55E]/20',
    dot: 'bg-[#22C55E]',
  },
  warning: {
    bg: 'bg-[#F59E0B]/10',
    text: 'text-[#F59E0B]',
    border: 'border-[#F59E0B]/20',
    dot: 'bg-[#F59E0B]',
  },
  error: {
    bg: 'bg-[#EF4444]/10',
    text: 'text-[#EF4444]',
    border: 'border-[#EF4444]/20',
    dot: 'bg-[#EF4444]',
  },
  info: {
    bg: 'bg-[#3B82F6]/10',
    text: 'text-[#3B82F6]',
    border: 'border-[#3B82F6]/20',
    dot: 'bg-[#3B82F6]',
  },
  neutral: {
    bg: 'bg-white/5',
    text: 'text-[#A0A0B8]',
    border: 'border-white/10',
    dot: 'bg-[#6B6B80]',
  },
}

export function StatusBadge({ status, variant, withDot = true, className }: StatusBadgeProps) {
  const styles = VARIANTS[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      {withDot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', styles.dot)} />}
      {status}
    </span>
  )
}
