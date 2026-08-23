'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { saCredentialsSchema, type SACredentialsInput } from '@/lib/validators/sa-validators'
import { useSAAuthStore } from '@/lib/store/sa-auth-store'
import { cn } from '@/lib/utils'

export function SALoginStage1() {
  const [showPassword, setShowPassword] = useState(false)
  const { submitCredentials, isLoading, error, clearError, getLockoutSecondsRemaining, isLockedOut } = useSAAuthStore()

  const { register, handleSubmit, formState: { errors }, watch } = useForm<SACredentialsInput>({
    resolver: zodResolver(saCredentialsSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '', rememberEmail: false }
  })

  // Watch for floating labels
  const emailValue = watch('email')
  const passwordValue = watch('password')

  // Check lockout
  const lockedOut = isLockedOut('credentials')
  const [lockoutSeconds, setLockoutSeconds] = useState(getLockoutSecondsRemaining('credentials'))

  useEffect(() => {
    if (lockedOut) {
      const interval = setInterval(() => {
        const remaining = getLockoutSecondsRemaining('credentials')
        setLockoutSeconds(remaining)
        if (remaining <= 0) clearInterval(interval)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [lockedOut, getLockoutSecondsRemaining])

  const onSubmit = async (data: SACredentialsInput) => {
    if (lockedOut) return
    await submitCredentials(data)
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
        <h3 className="text-2xl font-serif font-bold text-white mb-3">Access Locked</h3>
        <p className="text-[#A0A0B8] max-w-xs leading-relaxed">
          Multiple invalid attempts detected.<br/>Please wait before trying again.
        </p>
      </motion.div>
    )
  }

  // --- Render Login Form ---
  return (
    <motion.div
      initial={false}
      animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2 font-serif tracking-tight">Sign In</h2>
        <p className="text-[#A0A0B8]">Enter your super admin credentials.</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 backdrop-blur-sm shadow-[0_4px_24px_rgba(239,68,68,0.15)]">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm font-medium leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-1.5 relative group">
          <div className="relative">
            <Mail className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 z-10",
              errors.email ? "text-red-500" : "text-[#6B7280] group-focus-within:text-[#FF7A00]"
            )} />
            
            <div className="relative">
              <input
                {...register('email')}
                type="email"
                id="email"
                className={cn(
                  "peer w-full h-14 bg-[#0E0E16] border-2 rounded-xl pl-12 pr-4 text-white outline-none transition-all duration-300 placeholder-transparent pt-4",
                  errors.email 
                    ? "border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]" 
                    : "border-[#2A2A3E] focus:border-[#FF7A00] focus:shadow-[0_0_0_4px_rgba(255,122,0,0.15)]"
                )}
                onFocus={clearError}
                autoFocus
                placeholder="Email address"
              />
              <label 
                htmlFor="email"
                className={cn(
                  "absolute left-12 transition-all duration-300 pointer-events-none text-sm",
                  emailValue 
                    ? "top-1.5 text-xs text-[#A0A0B8]" 
                    : "top-1/2 -translate-y-1/2 text-[#6B7280] peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[#FF7A00]",
                  errors.email && (emailValue || "peer-focus:text-red-500") && "text-red-400"
                )}
              >
                Email address
              </label>
            </div>
          </div>
          <AnimatePresence>
            {errors.email && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-xs px-1 font-medium"
              >
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5 relative group">
          <div className="relative">
            <Lock className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 z-10",
              errors.password ? "text-red-500" : "text-[#6B7280] group-focus-within:text-[#FF7A00]"
            )} />
            
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                className={cn(
                  "peer w-full h-14 bg-[#0E0E16] border-2 rounded-xl pl-12 pr-12 text-white outline-none transition-all duration-300 placeholder-transparent pt-4",
                  errors.password 
                    ? "border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]" 
                    : "border-[#2A2A3E] focus:border-[#FF7A00] focus:shadow-[0_0_0_4px_rgba(255,122,0,0.15)]"
                )}
                onFocus={clearError}
                placeholder="Password"
              />
              <label 
                htmlFor="password"
                className={cn(
                  "absolute left-12 transition-all duration-300 pointer-events-none text-sm",
                  passwordValue 
                    ? "top-1.5 text-xs text-[#A0A0B8]" 
                    : "top-1/2 -translate-y-1/2 text-[#6B7280] peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[#FF7A00]",
                  errors.password && (passwordValue || "peer-focus:text-red-500") && "text-red-400"
                )}
              >
                Password
              </label>
            </div>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#6B7280] hover:text-white transition-colors outline-none focus-visible:text-[#FF7A00]"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <AnimatePresence>
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-xs px-1 font-medium"
              >
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Remember Checkbox */}
        <div className="flex items-center pt-2 pb-4">
          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <div className="relative flex items-center justify-center w-5 h-5">
              <input
                {...register('rememberEmail')}
                type="checkbox"
                className="peer sr-only"
              />
              <div className="w-5 h-5 border-2 border-[#3A3A50] rounded-[6px] bg-[#0E0E16] peer-checked:bg-[#FF7A00] peer-checked:border-[#FF7A00] transition-all duration-300 group-hover:border-[#FF7A00]/50 peer-focus-visible:ring-2 ring-[#FF7A00]/40 ring-offset-2 ring-offset-[#111118]" />
              <svg 
                className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300 pointer-events-none"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[#A0A0B8] group-hover:text-white transition-colors">
              Remember my email on this device
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || lockedOut}
          className="relative w-full h-14 bg-gradient-to-r from-[#FF7A00] to-[#F5C842] hover:from-[#FF8A1A] hover:to-[#FFD05C] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(255,122,0,0.25)] hover:shadow-[0_6px_24px_rgba(255,122,0,0.4)] active:scale-[0.98] overflow-hidden group"
        >
          {/* Subtle shine effect on hover */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
          
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          ) : (
            'Authenticate'
          )}
        </button>
      </form>
      
      <div className="mt-8 text-center border-t border-[#1A1A26] pt-6">
        {/* Security by design: Super Admins cannot self-reset passwords via email link. Must contact sysadmin/ops */}
        <p className="text-xs text-[#6B7280] leading-relaxed">
          Account locked or forgot password?<br/>
          <button type="button" className="text-[#FF7A00] hover:text-white transition-colors underline underline-offset-4 decoration-transparent hover:decoration-white font-medium mt-1">
            Contact System Administrator
          </button>
        </p>
      </div>
    </motion.div>
  )
}
