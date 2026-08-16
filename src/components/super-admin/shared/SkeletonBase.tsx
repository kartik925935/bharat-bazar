'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonBaseProps {
  width?: string | number
  height?: string | number
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  className?: string
}

const roundedMap = {
  sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
  xl: 'rounded-xl', '2xl': 'rounded-2xl', full: 'rounded-full',
}

export function SkeletonBase({ width, height, rounded = 'lg', className }: SkeletonBaseProps) {
  return (
    <div
      className={cn(
        'bg-[#1A1A26] relative overflow-hidden',
        roundedMap[rounded],
        className
      )}
      style={{ width, height }}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  )
}

// Must add to tailwind.config.js:  'shimmer': { '100%': { transform: 'translateX(200%)' } }
// or add to globals.css:
// @keyframes shimmer { 100% { transform: translateX(200%) } }
