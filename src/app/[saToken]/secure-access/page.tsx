'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { SA_TOKEN } from '@/lib/constants/sa-token'
import { useSAAuthStore } from '@/lib/store/sa-auth-store'

import { SAAuthShell } from '@/components/super-admin/auth/SAAuthShell'
import { SAProgressIndicator } from '@/components/super-admin/auth/SAProgressIndicator'
import { SALoginStage1 } from '@/components/super-admin/auth/SALoginStage1'
import { SALoginStage2 } from '@/components/super-admin/auth/SALoginStage2'
import { SALoginStage3 } from '@/components/super-admin/auth/SALoginStage3'
import { SASuccessAnimation } from '@/components/super-admin/auth/SASuccessAnimation'

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

export default function SecureAccessPage() {
  const router = useRouter()
  const params = useParams()
  const saToken = params.saToken as string
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  
  const { currentStage, checkSession, trustedDeviceId } = useSAAuthStore()
  const willSkipDevice = !!trustedDeviceId

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

    // Session Check
    if (checkSession()) {
      router.replace(`/${saToken}/dashboard`)
    }
  }, [saToken, router, checkSession])

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
                className="w-full absolute inset-0"
              >
                <SALoginStage1 />
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
