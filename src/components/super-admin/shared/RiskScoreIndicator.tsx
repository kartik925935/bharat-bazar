'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RiskScoreIndicator({ score, className }: { score: number; className?: string }) {
  const getRiskLevel = (s: number) => {
    if (s < 30) return { label: 'Low Risk', color: 'text-green-500', bg: 'bg-green-500', icon: ShieldCheck, border: 'border-green-500/20', lightBg: 'bg-green-500/10' }
    if (s < 70) return { label: 'Medium Risk', color: 'text-amber-500', bg: 'bg-amber-500', icon: Shield, border: 'border-amber-500/20', lightBg: 'bg-amber-500/10' }
    return { label: 'High Risk', color: 'text-red-500', bg: 'bg-red-500', icon: ShieldAlert, border: 'border-red-500/20', lightBg: 'bg-red-500/10' }
  }

  const { label, color, bg, icon: Icon, border, lightBg } = getRiskLevel(score)
  const circumference = 2 * Math.PI * 18 // r=18
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className={cn('flex items-center gap-3 p-3 rounded-xl border bg-[#111118]', border, className)}>
      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle cx="24" cy="24" r="18" fill="none" className="stroke-[#2A2A3E]" strokeWidth="4" />
          <motion.circle
            cx="24"
            cy="24"
            r="18"
            fill="none"
            className={color.replace('text-', 'stroke-')}
            strokeWidth="4"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <span className={cn('absolute text-xs font-bold', color)}>{score}</span>
      </div>
      <div>
        <div className="flex items-center gap-1.5 mb-0.5">
          <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center', lightBg, color)}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <p className={cn('text-sm font-bold', color)}>{label}</p>
        </div>
        <p className="text-[10px] text-[#8B8B9E] font-medium leading-tight">
          Risk score is calculated based on return rate, failed deliveries, and flag history.
        </p>
      </div>
    </div>
  )
}
