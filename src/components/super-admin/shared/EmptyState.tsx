'use client'

import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
      <div className="w-16 h-16 rounded-full bg-[#1A1A26] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[#3A3A50]" />
      </div>
      <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
      {description && <p className="text-xs text-[#8B8B9E] max-w-sm mb-6 leading-relaxed">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
