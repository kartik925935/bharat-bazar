'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import type { SAAuthStage } from '@/lib/store/sa-auth-store'

interface StepConfig {
  id: SAAuthStage
  label: string
  short: string
}

const ALL_STEPS: StepConfig[] = [
  { id: 'credentials', label: 'Credentials', short: '01' },
  { id: 'totp', label: 'Authenticator', short: '02' },
  { id: 'device', label: 'Device', short: '03' },
]

const STAGE_ORDER: Record<SAAuthStage, number> = {
  credentials: 0,
  totp: 1,
  device: 2,
  success: 3,
}

function getStatus(stepId: SAAuthStage, currentStage: SAAuthStage): 'completed' | 'current' | 'upcoming' {
  if (currentStage === 'success') return 'completed'
  const stepIdx = STAGE_ORDER[stepId]
  const currentIdx = STAGE_ORDER[currentStage]
  if (stepIdx < currentIdx) return 'completed'
  if (stepIdx === currentIdx) return 'current'
  return 'upcoming'
}

interface SAProgressIndicatorProps {
  currentStage: SAAuthStage
  skipDevice?: boolean
}

export function SAProgressIndicator({ currentStage, skipDevice = false }: SAProgressIndicatorProps) {
  const steps = skipDevice ? ALL_STEPS.slice(0, 2) : ALL_STEPS

  return (
    <div className="w-full mb-10">
      <div className="flex items-stretch gap-2">
        {steps.map((step, idx) => {
          const status = getStatus(step.id, currentStage)
          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex-1 flex flex-col gap-2">
                {/* Bar */}
                <div className="relative h-1.5 rounded-full bg-[#1A1A26] overflow-hidden">
                  {(status === 'completed' || status === 'current') && (
                    <motion.div
                      layoutId={`prog-fill-${step.id}`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 bg-gradient-to-r from-[#FF7A00] to-[#F5C842]"
                    />
                  )}
                  {status === 'current' && (
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-white/20"
                    />
                  )}
                </div>

                {/* Label row */}
                <div className="flex items-center gap-1.5">
                  <AnimatePresence>
                    {status === 'completed' && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        <Check className="w-3 h-3 text-[#22C55E]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span
                    className={`text-xs font-medium transition-colors duration-300 ${
                      status === 'upcoming' ? 'text-[#4A4A5E]' : status === 'current' ? 'text-[#FF7A00]' : 'text-[#A0A0B8]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>

              {/* Connector dot (not after last) */}
              {idx < steps.length - 1 && (
                <div className="flex flex-col pt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full mt-0 transition-colors duration-500 ${
                    STAGE_ORDER[currentStage] > STAGE_ORDER[step.id] ? 'bg-[#FF7A00]' : 'bg-[#2A2A3E]'
                  }`} />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
