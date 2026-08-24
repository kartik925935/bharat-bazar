import React from 'react'
import { motion } from 'framer-motion'
import { Check, AlertTriangle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompletenessScoreProps {
  score: number
  flags: string[]
  className?: string
}

export function CompletenessScore({ score, flags, className }: CompletenessScoreProps) {
  const getScoreDetails = (s: number) => {
    if (s >= 90) return { label: 'Excellent', color: 'text-green-500', bg: 'bg-green-500', icon: Check, border: 'border-green-500/20', lightBg: 'bg-green-500/10' }
    if (s >= 60) return { label: 'Good', color: 'text-amber-500', bg: 'bg-amber-500', icon: AlertTriangle, border: 'border-amber-500/20', lightBg: 'bg-amber-500/10' }
    return { label: 'Poor', color: 'text-red-500', bg: 'bg-red-500', icon: AlertCircle, border: 'border-red-500/20', lightBg: 'bg-red-500/10' }
  }

  const { label, color, bg, icon: Icon, border, lightBg } = getScoreDetails(score)
  const circumference = 2 * Math.PI * 18 // r=18
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className={cn('p-4 rounded-xl border bg-[#111118]', border, className)}>
      <div className="flex items-start gap-4">
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
          <span className={cn('absolute text-xs font-bold', color)}>{score}%</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <div className={cn('w-5 h-5 rounded-md flex items-center justify-center', lightBg, color)}>
              <Icon className="w-3 h-3" />
            </div>
            <p className={cn('text-sm font-bold', color)}>{label} Listing</p>
          </div>
          <p className="text-[10px] text-[#8B8B9E] font-medium leading-tight">
            Based on description length, high-res images, and filled attributes.
          </p>
        </div>
      </div>
      
      {flags && flags.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#1E1E2E] space-y-1.5">
          <h4 className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider mb-2">Needs Improvement</h4>
          {flags.map((flag, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-[#A0A0B8]">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 shrink-0" />
              {flag}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
