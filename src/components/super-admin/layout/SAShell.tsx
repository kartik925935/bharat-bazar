'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSAUIStore } from '@/lib/store/sa-ui-store'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { SATopbar } from './SATopbar'
import { SASidebar } from './SASidebar'
import { SABottomNav } from './SABottomNav'
import { SASessionBar } from './SASessionBar'
import { ActionCenterSheet } from './ActionCenterSheet'
import { ConfirmModal } from '@/components/super-admin/shared/ConfirmModal'
import { KeyboardShortcutsModal } from '@/components/super-admin/shared/KeyboardShortcutsModal'

// Mobile "More" menu reuses the full sidebar hierarchy in a slide-up sheet
import { getSANavigation } from '@/lib/constants/sa-navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { X } from 'lucide-react'

const SIDEBAR_EXPANDED_WIDTH = 280
const SIDEBAR_COLLAPSED_WIDTH = 72

function MoreMenuSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const params = useParams()
  const saToken = params.saToken as string
  const navSections = getSANavigation(saToken)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[71] bg-[#0D0D14] border-t border-[#2A2A3E] rounded-t-3xl max-h-[85dvh] flex flex-col"
          >
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-[#2A2A3E]" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#1E1E2E] shrink-0">
              <h2 className="text-base font-bold text-white">All Sections</h2>
              <button onClick={onClose} aria-label="Close menu" className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B80] hover:bg-white/5">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-3 py-3 pb-safe-bottom">
              {navSections.map((section) => (
                <div key={section.title} className="mb-4">
                  <p className="text-[10px] font-bold text-[#4A4A5E] tracking-widest uppercase px-2 mb-1.5">
                    {section.title}
                  </p>
                  {section.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#A0A0B8] hover:bg-[#1E1E2E] hover:text-white transition-colors"
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function SAShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const bp = useBreakpoint()
  const {
    sidebarCollapsed,
    mobileSidebarOpen,
    closeMobileSidebar,
    toggleCommandPalette,
    closeCommandPalette,
    setActiveDropdown,
    commandPaletteOpen,
  } = useSAUIStore()

  const [actionCenterOpen, setActionCenterOpen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)

  // Compute sidebar width: tablet defaults to collapsed
  const effectiveCollapsed = bp !== 'desktop' ? true : sidebarCollapsed
  const sidebarWidth = effectiveCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH

  // ── Global keyboard shortcuts ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggleCommandPalette()
        return
      }
      if (e.key === 'Escape') {
        if (commandPaletteOpen) { closeCommandPalette(); return }
        setActiveDropdown(null)
        if (mobileSidebarOpen) closeMobileSidebar()
        setActionCenterOpen(false)
        setMoreMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [commandPaletteOpen, mobileSidebarOpen, toggleCommandPalette, closeCommandPalette, setActiveDropdown, closeMobileSidebar])

  // Close mobile sidebar on route change
  useEffect(() => {
    closeMobileSidebar()
    setMoreMenuOpen(false)
  }, [pathname, closeMobileSidebar])

  // Expose action center/more menu open handlers via store (SABottomNav uses them)
  const store = useSAUIStore() as any
  useEffect(() => {
    if (store.openActionCenter === undefined) {
      // Patch in runtime handlers
      Object.assign(store, {
        openActionCenter: () => setActionCenterOpen(true),
        openMoreMenu: () => setMoreMenuOpen(true),
      })
    }
  })

  const isMobile = bp === 'mobile'
  const isDesktop = bp === 'desktop'

  return (
    <div className="min-h-screen bg-[#09090B] text-white font-sans overflow-hidden">

      {/* ── Fixed Topbar ──────────────────────────────────────────────────── */}
      <SATopbar />

      {/* ── Desktop / Tablet Sidebar ──────────────────────────────────────── */}
      {!isMobile && (
        <motion.aside
          animate={{ width: sidebarWidth }}
          transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          className="fixed left-0 top-16 bottom-9 z-30 overflow-hidden hidden md:block"
          style={{ borderRight: '1px solid #1E1E2E' }}
        >
          <SASidebar />
        </motion.aside>
      )}

      {/* ── Main Content Area ─────────────────────────────────────────────── */}
      <motion.main
        animate={{ marginLeft: isMobile ? 0 : sidebarWidth }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className="min-h-screen pt-16 relative"
        style={{
          paddingBottom: isMobile ? '80px' : '36px', // 80px for bottom nav, 36px for session bar
        }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(160deg, #0A0A0F 0%, #09090B 60%)' }}
        />

        {/* Scrollable content */}
        <div className="relative z-10 max-w-[1600px] mx-auto p-3 md:p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>

      {/* ── Mobile Bottom Nav ─────────────────────────────────────────────── */}
      {isMobile && <SABottomNav />}

      {/* ── Desktop Session Bar ───────────────────────────────────────────── */}
      {!isMobile && <SASessionBar />}

      {/* ── Action Center Sheet ───────────────────────────────────────────── */}
      <ActionCenterSheet
        isOpen={actionCenterOpen}
        onClose={() => setActionCenterOpen(false)}
      />

      {/* ── More Menu Sheet (mobile) ──────────────────────────────────────── */}
      <MoreMenuSheet
        isOpen={moreMenuOpen}
        onClose={() => setMoreMenuOpen(false)}
      />

      {/* ── Global Overlays ───────────────────────────────────────────────── */}
      <ConfirmModal />
      <KeyboardShortcutsModal />
    </div>
  )
}
