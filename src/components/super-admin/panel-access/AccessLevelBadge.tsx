'use client'
import { cn } from '@/lib/utils'
import type { AccessLevel } from '@/types/super-admin.types'
import { Lock, Eye, PenLine, Zap } from 'lucide-react'

interface AccessLevelBadgeProps {
  level: AccessLevel
  isBlocked?: boolean
  size?: 'sm' | 'md'
  className?: string
}

const CONFIG: Record<AccessLevel, {
  label: string
  className: string
  icon: React.ElementType
}> = {
  none: {
    label: 'None',
    className: 'bg-gray-100 text-gray-500 border-gray-200',
    icon: Lock,
  },
  view: {
    label: 'View',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Eye,
  },
  edit: {
    label: 'Edit',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: PenLine,
  },
  full: {
    label: 'Full',
    className: 'bg-green-50 text-green-700 border-green-200',
    icon: Zap,
  },
}

export function AccessLevelBadge({ level, isBlocked = false, size = 'md', className }: AccessLevelBadgeProps) {
  if (isBlocked) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1 border rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        'bg-red-50 text-red-700 border-red-200',
        className
      )}>
        <Lock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        Blocked
      </span>
    )
  }

  const config = CONFIG[level]
  const Icon = config.icon

  return (
    <span className={cn(
      'inline-flex items-center gap-1 border rounded-full font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
      config.className,
      className
    )}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  )
}
