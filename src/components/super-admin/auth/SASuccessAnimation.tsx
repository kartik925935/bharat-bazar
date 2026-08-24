'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { useSAAuthStore } from '@/lib/store/sa-auth-store'
import { useSASessionStore } from '@/lib/store/sa-session-store'

export function SASuccessAnimation() {
  const router = useRouter()
  const params = useParams()
  const saToken = params.saToken as string
  const { superAdmin } = useSAAuthStore()

  useEffect(() => {
    // Auto redirect after animation sequence finishes
    const timer = setTimeout(async () => {
      if (superAdmin?.id) {
        await useSASessionStore.getState().switchAdminDev(superAdmin.id)
      }
      router.push(`/${saToken}/dashboard`)
    }, 2200)
    return () => clearTimeout(timer)
  }, [router, saToken, superAdmin])

  return (
    <div className="absolute inset-0 z-50 bg-[#09090B] flex flex-col items-center justify-center font-sans overflow-hidden backdrop-blur-xl">

      {/* Background radial glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute w-[800px] h-[800px] bg-gradient-to-br from-[#FF7A00]/5 to-[#F5C842]/5 rounded-full blur-[120px]"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Checkmark Circle */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.1 }}
          className="w-28 h-28 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#F5C842] shadow-[0_0_60px_rgba(255,122,0,0.4)] flex items-center justify-center mb-10 relative"
        >
          {/* Subtle pulse behind the circle */}
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full border border-[#FF7A00]"
          />

          {/* Confetti Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, Math.random() * 0.5 + 0.8, 0],
                  x: Math.cos((i * 30 * Math.PI) / 180) * (Math.random() * 60 + 80),
                  y: Math.sin((i * 30 * Math.PI) / 180) * (Math.random() * 60 + 80)
                }}
                transition={{ duration: 1, delay: 0.3 + Math.random() * 0.2, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-white -ml-1 -mt-1 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              />
            ))}
          </div>

          <svg className="w-14 h-14 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <motion.path
              d="M20 6 9 17 4 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>

        {/* Text Reveal */}
        <div className="overflow-hidden mb-3">
          <motion.h2
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight"
          >
            Access Granted
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex flex-col items-center gap-1"
        >
          <p className="text-[#A0A0B8] text-xl font-light">
            Welcome back, <span className="text-white font-medium">{superAdmin?.name || 'Admin'}</span>
          </p>
          <p className="text-[#6B6B80] text-sm">
            Super Admin Protocol Initiated
          </p>
        </motion.div>
      </div>

      {/* Loading Bar Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-16 w-64 flex flex-col items-center gap-3"
      >
        <div className="w-full h-1 bg-[#1A1A26] rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-[#FF7A00] to-[#F5C842] relative"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B6B80] font-bold">
          Establishing Secure Connection
        </p>
      </motion.div>
    </div>
  )
}
