import React from 'react'
import { cn } from '@/lib/utils'

interface TierBadgeProps {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  className?: string
  showIcon?: boolean
}

const TIER_CONFIG = {
  bronze: { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '🥉' },
  silver: { color: 'text-slate-300', bg: 'bg-slate-300/10', border: 'border-slate-300/20', icon: '🥈' },
  gold: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: '🥇' },
  platinum: { color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', icon: '💎' },
}

export function TierBadge({ tier, className, showIcon = false }: TierBadgeProps) {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.bronze
  
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider flex items-center gap-1 w-max', config.bg, config.color, config.border, className)}>
      {showIcon && <span className="text-xs">{config.icon}</span>}
      {tier}
    </span>
  )
}
