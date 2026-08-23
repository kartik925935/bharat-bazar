'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { KeyRound, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { OTPInput } from './OTPInput'
import { useSAAuthStore } from '@/lib/store/sa-auth-store'

export function SALoginStage2() {
  const [code, setCode] = useState('')
  const { 
    submitTotp, isLoading, error, clearError, goBack, emailForFlow,
    getLockoutSecondsRemaining, isLockedOut, resendTotp, resendCooldownEndsAt 
  } = useSAAuthStore()

  // Check lockout
  const lockedOut = isLockedOut('totp')
  const [lockoutSeconds, setLockoutSeconds] = useState(getLockoutSecondsRemaining('totp'))
  
  // Cooldown timer
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (lockedOut) {
      const interval = setInterval(() => {
        const remaining = getLockoutSecondsRemaining('totp')
        setLockoutSeconds(remaining)
        if (remaining <= 0) clearInterval(interval)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [lockedOut, getLockoutSecondsRemaining])

  useEffect(() => {
    if (resendCooldownEndsAt) {
      const interval = setInterval(() => {
        const remaining = Math.ceil((resendCooldownEndsAt - Date.now()) / 1000)
        setCooldown(remaining > 0 ? remaining : 0)
        if (remaining <= 0) clearInterval(interval)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [resendCooldownEndsAt])

  const maskEmail = (email: string) => {
    if (!email) return ''
    const [name, domain] = email.split('@')
    if (name.length <= 2) return email
    return `${name[0]}***@${domain}`
  }

  const handleAutoSubmit = async (val?: string) => {
    const submitCode = val || code
    if (submitCode.length === 6 && !lockedOut && !isLoading) {
      await submitTotp(submitCode)
    }
  }

  const handleResend = async () => {
    if (cooldown <= 0 && !isLoading) {
      await resendTotp()
    }
  }

  // --- Render Lockout State ---
  if (lockedOut && lockoutSeconds > 0) {
    const dashOffset = 283 - (283 * (60 - lockoutSeconds)) / 60
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full flex flex-col items-center justify-center text-center py-8"
      >
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1A1A26" strokeWidth="6" />
            <motion.circle 
              cx="50" cy="50" r="45" fill="none" 
              stroke="#EF4444" strokeWidth="6" strokeDasharray="283"
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 linear"
            />
          </svg>
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-3xl font-bold font-mono text-[#EF4444]"
          >
            {lockoutSeconds}s
          </motion.div>
        </div>
        <h3 className="text-2xl font-serif font-bold text-white mb-3">Verification Locked</h3>
        <p className="text-[#A0A0B8] max-w-xs leading-relaxed mb-6">
          Multiple invalid codes entered.<br/>Please wait before trying again.
        </p>
        <button 
          onClick={goBack}
          className="flex items-center gap-2 text-sm text-[#FF7A00] font-medium hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Login
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={false}
      animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col items-center"
    >
      <div className="w-full flex justify-start mb-6">
        <button 
          onClick={goBack}
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A26] border border-[#2A2A3E] hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/10 transition-all duration-300"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 text-[#A0A0B8] group-hover:text-[#FF7A00] transition-colors" />
        </button>
      </div>

      <div className="relative mb-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-10px] border border-[#FF7A00]/20 border-dashed rounded-full"
        />
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#F5C842] flex items-center justify-center shadow-[0_0_30px_rgba(255,122,0,0.3)]">
          <KeyRound className="w-7 h-7 text-white" />
        </div>
      </div>

      <div className="text-center mb-10 w-full">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 font-serif tracking-tight">Verify Identity</h2>
        <p className="text-[#A0A0B8] text-base leading-relaxed max-w-sm mx-auto">
          Enter the 6-digit code from your<br/>authenticator app
        </p>
        <div className="mt-4 py-2 px-4 bg-[#1A1A26]/50 rounded-lg inline-block border border-[#2A2A3E]/50">
          <p className="text-sm text-[#8B8B9E]">
            Verifying: <strong className="text-[#D0D0E0] font-medium tracking-wide">{maskEmail(emailForFlow || '')}</strong>
          </p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden w-full mb-6"
          >
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 backdrop-blur-sm shadow-[0_4px_24px_rgba(239,68,68,0.15)]">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm font-medium leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full mb-8 flex justify-center">
        <OTPInput 
          length={6} 
          value={code} 
          onChange={(val) => {
            setCode(val)
            clearError()
          }} 
          onComplete={handleAutoSubmit}
          disabled={isLoading}
        />
      </div>

      <button
        onClick={() => handleAutoSubmit()}
        disabled={isLoading || code.length !== 6}
        className="relative w-full h-14 bg-gradient-to-r from-[#FF7A00] to-[#F5C842] hover:from-[#FF8A1A] hover:to-[#FFD05C] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(255,122,0,0.25)] hover:shadow-[0_6px_24px_rgba(255,122,0,0.4)] active:scale-[0.98] overflow-hidden group mb-6"
      >
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin text-white" />
        ) : (
          'Verify Authenticator'
        )}
      </button>

      <div className="text-center text-sm font-medium">
        {cooldown > 0 ? (
          <span className="text-[#6B6B80] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#FF7A00]" />
            Didn't receive a code? Resend in {cooldown}s
          </span>
        ) : (
          <button 
            onClick={handleResend}
            disabled={isLoading}
            className="text-[#FF7A00] hover:text-[#F5C842] transition-colors underline underline-offset-4 decoration-[#FF7A00]/30 hover:decoration-[#F5C842]"
          >
            Resend Code
          </button>
        )}
      </div>
    </motion.div>
  )
}
