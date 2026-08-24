import React from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageComplianceChecklistProps {
  flags: string[]
  className?: string
}

const CHECKLIST = [
  { id: 'Missing high-res images', label: 'High Resolution (Min 1000x1000)' },
  { id: 'Watermarked images', label: 'No Watermarks or Text' },
  { id: 'Poor lighting', label: 'Adequate Lighting' },
  { id: 'Cluttered background', label: 'Clean/White Background' }
]

export function ImageComplianceChecklist({ flags, className }: ImageComplianceChecklistProps) {
  return (
    <div className={cn("bg-[#1A1A26] border border-[#2A2A3E] rounded-xl p-4", className)}>
      <h3 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-3">Image Guidelines</h3>
      <div className="space-y-2">
        {CHECKLIST.map((item) => {
          const failed = (flags || []).includes(item.id)
          return (
            <div key={item.id} className="flex items-center gap-2">
              <div className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                failed ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"
              )}>
                {failed ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
              </div>
              <span className={cn(
                "text-xs font-medium",
                failed ? "text-red-400" : "text-[#A0A0B8]"
              )}>
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
