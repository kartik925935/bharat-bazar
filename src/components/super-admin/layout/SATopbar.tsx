'use client'

import React, { useEffect, useRef } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronDown, Search, Command, Menu, LogOut, Settings, Shield, BarChart3, Users } from 'lucide-react'
import { useSAAuthStore } from '@/lib/store/sa-auth-store'
import { useSAUIStore } from '@/lib/store/sa-ui-store'
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import { cn } from '@/lib/utils'
import { SANotificationDropdown } from './SANotificationDropdown'
import { SAProfileDropdown } from './SAProfileDropdown'

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
  
  const { superAdmin } = useSAAuthStore()
  const { toggleMobileSidebar, openCommandPalette, activeDropdown, setActiveDropdown } = useSAUIStore()
  const { notifications } = useSuperAdminStore()
  
  const unreadCount = notifications.filter((n) => !n.isRead).length
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
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

        {/* Profile trigger */}
        <div className="relative">
          <button
            onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
            className={cn(
              "flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors",
              activeDropdown === 'profile'
                ? "bg-[#FF7A00]/10"
                : "hover:bg-white/5"
            )}
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF7A00]/30 to-[#F5C842]/20 border border-[#FF7A00]/30 flex items-center justify-center text-sm font-bold text-[#FF7A00]">
              {superAdmin?.name.charAt(0) || 'A'}
            </div>
            <span className="hidden lg:block text-sm font-medium text-white max-w-[120px] truncate">
              {superAdmin?.name || 'Super Admin'}
            </span>
            <motion.div
              animate={{ rotate: activeDropdown === 'profile' ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-[#6B6B80]" />
            </motion.div>
          </button>

          <AnimatePresence>
            {activeDropdown === 'profile' && (
              <SAProfileDropdown onClose={() => setActiveDropdown(null)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
