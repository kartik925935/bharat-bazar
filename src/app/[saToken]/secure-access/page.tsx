'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { SA_TOKEN } from '@/lib/constants/sa-token'
import { useSAAuthStore } from '@/lib/store/sa-auth-store'
import { useSASessionStore } from '@/lib/store/sa-session-store'

import { SAAuthShell } from '@/components/super-admin/auth/SAAuthShell'
import { SAProgressIndicator } from '@/components/super-admin/auth/SAProgressIndicator'
import { SALoginStage1 } from '@/components/super-admin/auth/SALoginStage1'
import { SALoginStage2 } from '@/components/super-admin/auth/SALoginStage2'
import { SALoginStage3 } from '@/components/super-admin/auth/SALoginStage3'
import { SASuccessAnimation } from '@/components/super-admin/auth/SASuccessAnimation'
import { AdminSwitcherWidget } from '@/components/super-admin/panel-access/AdminSwitcherWidget'

// A generic 404 component that looks exactly like the standard storefront 404
function GenericNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">404</h1>
      <p className="text-gray-600">This page could not be found.</p>
      <a href="/" className="mt-6 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
        Return Home
      </a>
    </div>
  )
}

const slideVariants: any = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 },
      scale: { duration: 0.3 },
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 30 : -30,
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    }
  })
}
const isDev = process.env.NODE_ENV !== 'production'
const TEST_CREDS = [
  { email: 'superadmin@bharatbazaar.com', password: 'Super@123', role: 'SUPER_ADMIN', status: 'active' },
  { email: 'vikram.singh@bharatbazaar.com', password: 'Senior@123', role: 'SENIOR_ADMIN', status: 'active' },
  { email: 'neha.kapoor@bharatbazaar.com', password: 'Finance@123', role: 'FINANCE_ADMIN', status: 'active' },
  { email: 'rahul.d@bharatbazaar.com', password: 'OpsAdmin@123', role: 'OPERATIONS_ADMIN', status: 'active' },
  { email: 'pradeep.k@bharatbazaar.com', password: 'Support@123', role: 'SUPPORT_ADMIN', status: 'active' },
  { email: 'arun.nair@bharatbazaar.com', password: 'Content@123', role: 'CONTENT_ADMIN', status: 'active' },
  { email: 'divya.rao@bharatbazaar.com', password: 'Delivery@123', role: 'DELIVERY_ADMIN', status: 'pending' },
  { email: 'kabir.a@bharatbazaar.com', password: 'Custom@123', role: 'CUSTOM_ADMIN', status: 'active' },
  { email: 'sanya.m@bharatbazaar.com', password: 'Suspended@123', role: 'SUPPORT_ADMIN', status: 'suspended' },
  { email: 'aisha.p@bharatbazaar.com', password: 'Inactive@123', role: 'CONTENT_ADMIN', status: 'inactive' },
]
const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-500/10 text-green-400 border-green-500/20',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  suspended: 'bg-red-500/10 text-red-400 border-red-500/20',
  inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

export default function SecureAccessPage() {
  const router = useRouter()
  const params = useParams()
  const saToken = params.saToken as string
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  
  const { currentStage, checkSession: checkOldSession, trustedDeviceId, submitCredentials } = useSAAuthStore()
  const { currentAdminId, hydrateSession } = useSASessionStore()
  const willSkipDevice = !!trustedDeviceId
  const isDev = process.env.NODE_ENV !== 'production'

  // Track previous stage for slide direction
  const [prevStage, setPrevStage] = useState(currentStage)
  
  useEffect(() => {
    setPrevStage(currentStage)
  }, [currentStage])

  const stageOrder = { credentials: 0, totp: 1, device: 2, success: 3 }
  const direction = stageOrder[currentStage] > stageOrder[prevStage] ? 1 : -1

  useEffect(() => {
    // Hard Security Check
    if (saToken !== SA_TOKEN) {
      setIsValidToken(false)
      return
    }
    setIsValidToken(true)

    // Session Check (supports new multi-role store)
    if (currentAdminId) {
      hydrateSession().then(() => {
        router.replace(`/${saToken}/dashboard`)
      })
    } else if (checkOldSession()) {
      router.replace(`/${saToken}/dashboard`)
    }
  }, [saToken, currentAdminId, hydrateSession, checkOldSession, router])

  // Prevent flash while checking token
  if (isValidToken === null) return null

  // Invalid token -> render generic 404 (Obscure existence of portal)
  if (isValidToken === false) {
    return <GenericNotFound />
  }

  // Full Screen takeover for success
  if (currentStage === 'success') {
    return <SASuccessAnimation />
  }

  return (
    <SAAuthShell>
      <div className="w-full flex flex-col items-center">
        <SAProgressIndicator currentStage={currentStage} skipDevice={willSkipDevice} />
        
        <div className="w-full relative min-h-[460px] overflow-hidden rounded-2xl">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            
            {currentStage === 'credentials' && (
              <motion.div
                key="stage1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full absolute inset-0 overflow-y-auto"
              >
                <SALoginStage1 />
                {/* Test Credentials (Dev Only) */}
                {isDev && (
                  <div className="mt-6 pt-4 border-t border-[#1E1E2E] px-8 pb-8">
                    <p className="text-[10px] font-bold text-[#4A4A5E] tracking-widest uppercase mb-3">
                      Dev — Test Credentials (click to fill)
                    </p>
                    <div className="space-y-1.5">
                      {TEST_CREDS.map((cred) => (
                        <button
                          key={cred.email}
                          type="button"
                          onClick={() => {
                            const emailEl = document.querySelector('input[name="email"]') as HTMLInputElement;
                            const passEl = document.querySelector('input[name="password"]') as HTMLInputElement;
                            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
                            if (emailEl) { 
                              nativeInputValueSetter?.call(emailEl, cred.email);
                              emailEl.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                            if (passEl) { 
                              nativeInputValueSetter?.call(passEl, cred.password);
                              passEl.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#0D0D14] hover:bg-[#1A1A26] border border-[#1E1E2E] hover:border-[#2A2A3E] transition-colors text-left group"
                        >
                          <div>
                            <p className="text-xs text-white font-medium group-hover:text-[#FF7A00] transition-colors">
                              {cred.email}
                            </p>
                            <p className="text-[10px] text-[#4A4A5E]">{cred.password}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${STATUS_COLORS[cred.status]}`}>
                              {cred.status}
                            </span>
                            <span className="text-[9px] text-[#4A4A5E] font-mono">
                              {cred.role.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            
            {currentStage === 'totp' && (
              <motion.div
                key="stage2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full absolute inset-0"
              >
                <SALoginStage2 />
              </motion.div>
            )}
            
            {currentStage === 'device' && (
              <motion.div
                key="stage3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full absolute inset-0"
              >
                <SALoginStage3 />
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
      </div>
    </SAAuthShell>
  )
}
