'use client'

import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ActionItem {
  label: string
  icon: LucideIcon
  onClick: () => void
  variant?: 'default' | 'danger'
  disabled?: boolean
}

interface ActionDropdownProps {
  items: ActionItem[]
}

export function ActionDropdown({ items }: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-8 h-8 rounded-lg hover:bg-white/[0.04] transition-colors flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20">
          <MoreVertical className="w-4 h-4 text-[#6B6B80] group-hover:text-white transition-colors" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-[#1A1A26] border-[#2A2A3E] shadow-2xl p-1 rounded-xl">
        {items.map((item, idx) => {
          const Icon = item.icon
          const isDanger = item.variant === 'danger'
          return (
            <DropdownMenuItem
              key={idx}
              onClick={item.onClick}
              disabled={item.disabled}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors outline-none",
                isDanger 
                  ? "text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-red-500/10 hover:bg-red-500/10" 
                  : "text-[#D0D0E0] hover:text-white focus:text-white focus:bg-white/[0.04] hover:bg-white/[0.04]",
                item.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
