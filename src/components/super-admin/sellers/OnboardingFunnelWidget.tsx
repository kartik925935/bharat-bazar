'use client'

import React from 'react'
import { Check, Clock, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SASellerOnboardingStep } from '@/types/super-admin.types'

interface OnboardingFunnelWidgetProps {
  steps: SASellerOnboardingStep[]
}

const FUNNEL_STEPS = [
  { id: 'account_created', label: 'Account Created' },
  { id: 'email_verified', label: 'Email Verified' },
  { id: 'business_details', label: 'Business Details' },
  { id: 'kyc_submitted', label: 'KYC Submitted' },
  { id: 'kyc_verified', label: 'KYC Verified' },
  { id: 'bank_added', label: 'Bank Added' },
  { id: 'first_product', label: 'First Product' },
  { id: 'admin_approved', label: 'Admin Approved' },
  { id: 'first_sale', label: 'First Sale' },
]

export function OnboardingFunnelWidget({ steps }: OnboardingFunnelWidgetProps) {
  const isCompleted = (id: string) => (steps || []).some((s) => s.step === id && s.completedAt !== null)
  const isCurrent = (id: string) => {
    const idx = FUNNEL_STEPS.findIndex((s) => s.id === id)
    if (idx === 0) return !isCompleted(id)
    const prevCompleted = isCompleted(FUNNEL_STEPS[idx - 1].id)
    return prevCompleted && !isCompleted(id)
  }

  return (
    <div className="bg-[#1A1A26] border border-[#2A2A3E] rounded-xl p-4">
      <h3 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-4">Onboarding Funnel</h3>
      
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-3 w-px bg-[#2A2A3E]" />
        
        <div className="space-y-4">
          {FUNNEL_STEPS.map((step, idx) => {
            const completed = isCompleted(step.id)
            const current = isCurrent(step.id)
            
            return (
              <div key={step.id} className="relative flex items-center gap-3 z-10">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
                  completed ? "bg-green-500 border-green-500" :
                  current ? "bg-[#1A1A26] border-[#FF7A00]" : "bg-[#1A1A26] border-[#2A2A3E]"
                )}>
                  {completed ? <Check className="w-3.5 h-3.5 text-white" /> :
                   current ? <Clock className="w-3.5 h-3.5 text-[#FF7A00]" /> : null}
                </div>
                
                <div>
                  <p className={cn(
                    "text-sm font-bold",
                    completed ? "text-white" : current ? "text-[#FF7A00]" : "text-[#6B6B80]"
                  )}>
                    {step.label}
                  </p>
                  {completed && steps.find(s => s.step === step.id)?.completedAt && (
                    <p className="text-[10px] text-[#8B8B9E]">
                      {new Date(steps.find(s => s.step === step.id)!.completedAt!).toLocaleDateString()}
                    </p>
                  )}
                  {current && step.id === 'kyc_verified' && (
                     <p className="text-[10px] text-[#F59E0B] flex items-center gap-1 mt-0.5">
                       <ShieldAlert className="w-3 h-3" /> Needs Admin Review
                     </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
