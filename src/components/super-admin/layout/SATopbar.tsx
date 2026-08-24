'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronDown, Search, Menu, LogOut, Repeat2 } from 'lucide-react'
import { useSAUIStore } from '@/lib/store/sa-ui-store'
import { useSASessionStore } from '@/lib/store/sa-session-store'
import { useSAStore } from '@/lib/store/super-admin-store'
import { cn } from '@/lib/utils'
import { SANotificationDropdown } from './SANotificationDropdown'
import { AdminSwitcherWidget } from '@/components/super-admin/panel-access/AdminSwitcherWidget'

// ─── Breadcrumbs derived from pathname ───────────────────────────────────────
function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean).slice(1) // remove [saToken]
  
  if (segments.length === 0) return null
  
  const crumbs = segments.map((s) =>
    s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  )

  return (
    <div className="hidden md:flex items-center gap-1.5">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-[#3A3A50] text-sm">/</span>}
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            className={cn(
              'text-sm font-medium',
              i === crumbs.length - 1 ? 'text-white' : 'text-[#6B6B80]'
            )}
          >
            {crumb}
          </motion.span>
        </React.Fragment>
      ))}
    </div>
  )
}

// ─── Main Topbar ──────────────────────────────────────────────────────────────
export function SATopbar() {
  const router = useRouter()
  const params = useParams()
  const saToken = params.saToken as string

  const { toggleMobileSidebar, openCommandPalette, activeDropdown, setActiveDropdown } = useSAUIStore()

  // New service-backed session
  const currentAdmin = useSASessionStore((s) => s.currentAdmin)
  const logout = useSASessionStore((s) => s.logout)

  // Notifications from legacy store
  const { notifications } = useSAStore()
  const unreadCount = (notifications ?? []).filter((n) => !n.isRead).length

  const [showSwitcher, setShowSwitcher] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isDev = process.env.NODE_ENV !== 'production'

  const handleLogout = async () => {
    await logout()
    router.replace(`/${saToken}/secure-access`)
  }

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
        setShowSwitcher(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [setActiveDropdown])

  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#09090B]/90 backdrop-blur-md border-b border-[#1E1E2E] flex items-center px-4 lg:px-6 gap-4">

      {/* ── Left: Mobile Hamburger / Desktop Breadcrumbs ── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-[#A0A0B8] hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop breadcrumbs */}
        <div className="hidden lg:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* ── Center: Command Palette Trigger ── */}
      <button
        onClick={openCommandPalette}
        className="hidden sm:flex items-center gap-2 h-9 px-3 bg-[#111118] border border-[#2A2A3E] rounded-xl text-[#6B6B80] hover:text-white hover:border-[#FF7A00]/30 transition-all group flex-shrink-0 min-w-[200px] lg:min-w-[260px]"
      >
        <Search className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-sm text-left hidden md:block">Search anything...</span>
        <div className="flex items-center gap-0.5 shrink-0">
          <kbd className="px-1.5 py-0.5 bg-[#1A1A26] border border-[#2A2A3E] rounded-md text-[10px] font-mono text-[#6B6B80]">⌘K</kbd>
        </div>
      </button>

      {/* Mobile: search icon only */}
      <button
        onClick={openCommandPalette}
        className="sm:hidden w-9 h-9 rounded-xl flex items-center justify-center text-[#A0A0B8] hover:text-white hover:bg-white/5 transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* ── Right Section ── */}
      <div ref={dropdownRef} className="flex items-center gap-1.5">
        {/* Live Status (desktop only) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1E1E2E] bg-[#0E0E16] mr-2">
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
          </span>
          <span className="text-[11px] font-medium text-[#22C55E]">All Systems Operational</span>
        </div>

        {/* Dev Mode Admin Switcher */}
        {isDev && (
          <div className="relative">
            <button
              aria-label="Dev admin switcher"
              onClick={() => setShowSwitcher((v) => !v)}
              className="hidden lg:flex items-center gap-1.5 h-8 px-3 rounded-xl bg-purple-900/30 border border-purple-700/40 text-purple-300 text-xs font-medium hover:bg-purple-900/50 transition-colors"
            >
              <Repeat2 className="w-3.5 h-3.5" />
              <span>Dev Switch</span>
            </button>
            <AnimatePresence>
              {showSwitcher && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-[440px] bg-[#111118] border border-[#2A2A3E] rounded-2xl shadow-2xl p-3 z-50"
                >
                  <p className="text-[10px] text-purple-400 font-bold tracking-widest uppercase mb-2 px-1">Dev — Quick Switch Admin</p>
                  <AdminSwitcherWidget onClose={() => setShowSwitcher(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Divider */}
        <div className="hidden xl:block w-px h-5 bg-[#2A2A3E]" />

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setActiveDropdown(activeDropdown === 'notifications' ? null : 'notifications')}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-colors relative",
              activeDropdown === 'notifications'
                ? "bg-[#FF7A00]/10 text-[#FF7A00]"
                : "text-[#A0A0B8] hover:text-white hover:bg-white/5"
            )}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#09090B]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {activeDropdown === 'notifications' && (
              <SANotificationDropdown onClose={() => setActiveDropdown(null)} />
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-[#2A2A3E] mx-1" />

        {/* Admin Profile */}
        {currentAdmin && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF7A00]/30 to-[#F5C842]/20 border border-[#FF7A00]/30 flex items-center justify-center text-sm font-bold text-[#FF7A00]">
              {currentAdmin.name.charAt(0)}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-white leading-tight">{currentAdmin.name}</p>
              <p className="text-[10px] text-[#6B6B80]">{currentAdmin.role.replace(/_/g, ' ')}</p>
            </div>

            {/* Logout */}
            <button
              aria-label="Logout"
              onClick={handleLogout}
              className="ml-1 w-8 h-8 rounded-xl flex items-center justify-center text-[#6B6B80] hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
