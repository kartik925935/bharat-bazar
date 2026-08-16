'use client'
// NOTE: Auth guard is currently client-side via Zustand.
// TODO: When Supabase is added, move this to middleware.ts for server-side route protection.

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, LogIn } from 'lucide-react'
import { SA_TOKEN } from '@/lib/constants/sa-token'
import { useSAAuthStore } from '@/lib/store/sa-auth-store'
import { useSAUIStore } from '@/lib/store/sa-ui-store'
import { SAShell } from '@/components/super-admin/layout/SAShell'
import { CommandPalette } from '@/components/super-admin/command-palette/CommandPalette'
import { useKeyboardChord } from '@/hooks/useKeyboardChord'
import { DEFAULT_ROLE_PERMISSIONS } from '@/lib/constants/sa-permissions'
import type { AdminRole, SAPanel } from '@/types/super-admin.types'

// ─── Fortress Loading Screen ────────────────────────────────────────────────
function FortressLoader() {
  return (
    <div className="fixed inset-0 z-[200] bg-[#09090B] flex flex-col items-center justify-center gap-6">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/20 to-[#F5C842]/10 rounded-2xl blur-xl" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#F5C842] flex items-center justify-center shadow-[0_0_40px_rgba(255,122,0,0.3)]">
          <Shield className="w-8 h-8 text-white" />
        </div>
      </motion.div>
      <div className="flex flex-col items-center gap-2">
        <p className="font-serif text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#F5C842]">
          Bharat Bazaar
        </p>
        <p className="text-xs text-[#6B6B80] tracking-widest uppercase font-medium">Verifying Session</p>
      </div>
      <div className="w-32 h-0.5 bg-[#1A1A26] rounded-full overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="h-full w-1/2 bg-gradient-to-r from-transparent via-[#FF7A00] to-transparent"
        />
      </div>
    </div>
  )
}

// ─── Session Expired Modal ────────────────────────────────────────────────────
function SessionExpiredModal({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-[#111118] border border-[#2A2A3E] rounded-2xl p-8 shadow-2xl text-center"
      >
        <div className="w-14 h-14 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mx-auto mb-6">
          <LogIn className="w-7 h-7 text-[#EF4444]" />
        </div>
        <h2 className="text-2xl font-bold text-white font-serif mb-3">Session Expired</h2>
        <p className="text-[#A0A0B8] leading-relaxed mb-8">
          Your session has expired for security reasons. Please log in again to continue.
        </p>
        <button
          onClick={onLogout}
          className="w-full h-12 bg-gradient-to-r from-[#FF7A00] to-[#F5C842] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Log In Again
        </button>
      </motion.div>
    </div>
  )
}

// ─── Restricted Access Screen ───────────────────────────────────────────────
function RestrictedAccessScreen({ panel }: { panel: string }) {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-6">
        <Shield className="w-10 h-10 text-red-500" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-3 font-serif">Access Restricted</h1>
      <p className="text-[#A0A0B8] max-w-md text-center mb-8">
        You don't have permission to view the <span className="text-white font-medium capitalize">{panel.replace('-', ' ')}</span> panel. If you need access, you can request it from a Super Admin.
      </p>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white rounded-xl font-medium transition-colors"
        >
          Go Back
        </button>
        <button 
          onClick={() => alert('Access request sent (Mock)')}
          className="px-6 py-2.5 bg-gradient-to-r from-[#FF7A00] to-[#F5C842] text-white rounded-xl font-medium shadow-lg hover:opacity-90 transition-opacity"
        >
          Request Access
        </button>
      </div>
    </div>
  )
}

// ─── Idle Timeout Modal ───────────────────────────────────────────────────────
function IdleWarningModal({ countdown, onStayLoggedIn, onLogout }: {
  countdown: number
  onStayLoggedIn: () => void
  onLogout: () => void
}) {
  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-[#111118] border border-[#F59E0B]/30 rounded-2xl p-8 shadow-2xl text-center"
      >
        <div className="w-14 h-14 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-7 h-7 text-[#F59E0B]" />
        </div>
        <h2 className="text-2xl font-bold text-white font-serif mb-3">Inactivity Detected</h2>
        <p className="text-[#A0A0B8] leading-relaxed mb-2">
          You've been inactive for 25 minutes.
        </p>
        <p className="text-white font-bold text-lg mb-8">
          Logging out in <span className="text-[#FF7A00] font-mono text-2xl">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="flex-1 h-11 bg-[#1A1A26] border border-[#2A2A3E] text-white rounded-xl font-medium hover:bg-[#2A2A3E] transition-colors"
          >
            Log Out
          </button>
          <button
            onClick={onStayLoggedIn}
            className="flex-1 h-11 bg-gradient-to-r from-[#FF7A00] to-[#F5C842] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Stay Logged In
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Main Layout ─────────────────────────────────────────────────────────────
export default function SuperAdminPortalLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const router = useRouter()
  const saToken = params.saToken as string
  
  const { isAuthenticated, checkSession, logout } = useSAAuthStore()
  const { openCommandPalette } = useSAUIStore()
  
  const [authState, setAuthState] = useState<'checking' | 'ok' | 'expired'>('checking')
  const [showIdleWarning, setShowIdleWarning] = useState(false)
  const [idleCountdown, setIdleCountdown] = useState(60)
  
  const handleLogout = useCallback(() => {
    logout()
    router.replace(`/${saToken}/secure-access`)
  }, [logout, router, saToken])

  // ── 1. Token Validation ──────────────────────────────────────────────────
  if (saToken !== SA_TOKEN) {
    notFound()
  }

  // ── Keyboard Shortcuts (Cmd+K and Chords) ────────────────────────────────
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openCommandPalette()
      }
      // '?' for shortcuts modal could be added here if needed
    }
    window.addEventListener('keydown', handleGlobalKey)
    return () => window.removeEventListener('keydown', handleGlobalKey)
  }, [openCommandPalette])

  useKeyboardChord([
    { firstKey: 'g', secondKey: 'd', action: () => router.push(`/${saToken}/dashboard`) },
    { firstKey: 'g', secondKey: 'o', action: () => router.push(`/${saToken}/orders`) },
    { firstKey: 'g', secondKey: 's', action: () => router.push(`/${saToken}/sellers`) },
    { firstKey: 'g', secondKey: 'p', action: () => router.push(`/${saToken}/products`) },
    { firstKey: 'g', secondKey: 'c', action: () => router.push(`/${saToken}/customers`) },
    { firstKey: 'g', secondKey: 'f', action: () => router.push(`/${saToken}/finance`) },
  ])

  // ── 2. Initial Auth Check ────────────────────────────────────────────────
  useEffect(() => {
    const valid = checkSession()
    if (!valid) {
      router.replace(`/${saToken}/secure-access`)
      return
    }
    setAuthState('ok')
  }, [checkSession, router, saToken, isAuthenticated])

  // ── 3. Session Expiry Watcher (every 30s) ────────────────────────────────
  useEffect(() => {
    if (authState !== 'ok') return
    const interval = setInterval(() => {
      if (!checkSession()) setAuthState('expired')
    }, 30_000)
    return () => clearInterval(interval)
  }, [authState, checkSession])

  // ── 4. Idle Timeout (25 min → 5 min countdown) ────────────────────────────
  useEffect(() => {
    if (authState !== 'ok') return
    let idleTimer: ReturnType<typeof setTimeout>
    let countdownTimer: ReturnType<typeof setInterval>
    let currentCountdown = 300 // 5 minutes

    const resetIdle = () => {
      if (showIdleWarning) return // Don't reset while warning is showing
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        setShowIdleWarning(true)
        currentCountdown = 300
        setIdleCountdown(300)
        
        countdownTimer = setInterval(() => {
          currentCountdown -= 1
          setIdleCountdown(currentCountdown)
          if (currentCountdown <= 0) {
            clearInterval(countdownTimer)
            setShowIdleWarning(false)
            handleLogout()
          }
        }, 1000)
      }, 25 * 60 * 1000) // 25 minutes
    }

    const events = ['mousemove', 'keypress', 'click', 'scroll', 'touchstart']
    events.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }))
    resetIdle()

    return () => {
      clearTimeout(idleTimer)
      clearInterval(countdownTimer)
      events.forEach((e) => window.removeEventListener(e, resetIdle))
    }
  }, [authState, showIdleWarning, handleLogout])

  const handleStayLoggedIn = () => {
    setShowIdleWarning(false)
    setIdleCountdown(60)
  }

  if (authState === 'checking') return <FortressLoader />

  // ── Access Guard Check ──
  const pathname = usePathname()
  const role = (superAdmin?.role as AdminRole) || 'SUPER_ADMIN'
  const permissions = superAdmin?.permissions || DEFAULT_ROLE_PERMISSIONS[role]
  
  const panelStr = pathname?.split('/')[2]
  let hasAccess = true
  
  // If we are on a known panel path, check permissions
  // dashboard, sellers, etc.
  if (panelStr && authState === 'ok' && panelStr !== 'dashboard') {
    const perm = permissions[panelStr as SAPanel]
    if (perm === 'none') {
      hasAccess = false
    }
    // Note: If perm is undefined, we assume it's an internal route that doesn't need panel-level protection, 
    // or we might want to default to false. For safety, we only block if it's explicitly 'none'.
  }

  return (
    <>
      {authState === 'expired' && <SessionExpiredModal onLogout={handleLogout} />}
      {showIdleWarning && (
        <IdleWarningModal
          countdown={idleCountdown}
          onStayLoggedIn={handleStayLoggedIn}
          onLogout={handleLogout}
        />
      )}
      <SAShell>
        {hasAccess ? children : <RestrictedAccessScreen panel={panelStr || 'this'} />}
      </SAShell>
      <CommandPalette saToken={saToken} />
    </>
  )
}
