'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Shield, X } from 'lucide-react'
import { getSANavigation, type SANavItem } from '@/lib/constants/sa-navigation'
import { useSAUIStore } from '@/lib/store/sa-ui-store'
import { useSAAuthStore } from '@/lib/store/sa-auth-store'
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import { cn } from '@/lib/utils'
import { DEFAULT_ROLE_PERMISSIONS } from '@/lib/constants/sa-permissions'
import type { AdminRole } from '@/types/super-admin.types'

// ─── Tooltip for collapsed sidebar ───────────────────────────────────────────
function SidebarTooltip({ label, description }: { label: string; description?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -4, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -4, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none"
    >
      <div className="bg-[#1E1E30] border border-[#2A2A3E] rounded-xl px-3 py-2 shadow-2xl shadow-black/50 whitespace-nowrap">
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-[#2A2A3E]" />
        <p className="text-sm font-semibold text-white">{label}</p>
        {description && <p className="text-xs text-[#8B8B9E] mt-0.5">{description}</p>}
      </div>
    </motion.div>
  )
}

// ─── Single Nav Item ──────────────────────────────────────────────────────────
function NavItem({ item, collapsed, onNavigate, unreadCount }: {
  item: SANavItem
  collapsed: boolean
  onNavigate?: () => void
  unreadCount?: number
}) {
  const pathname = usePathname()
  const [showTooltip, setShowTooltip] = useState(false)
  const [subExpanded, setSubExpanded] = useState(false)
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
  const Icon = item.icon
  const hasSubs = item.subItems && item.subItems.length > 0

  const handleClick = () => {
    if (hasSubs && !collapsed) {
      setSubExpanded(!subExpanded)
      return
    }
    onNavigate?.()
  }

  const mainContent = (
      <motion.div
        className={cn(
          'relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer select-none transition-colors duration-200 group',
          isActive
            ? 'bg-[#FF7A00]/10 border border-[#FF7A00]/20'
            : 'hover:bg-white/[0.04] border border-transparent'
        )}
        onHoverStart={() => collapsed && setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        onClick={handleClick}
      >
        {/* Active indicator bar */}
        {isActive && (
          <motion.div
            layoutId="activeBar"
            className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b from-[#FF7A00] to-[#F5C842]"
          />
        )}

        {/* Icon */}
        <div className={cn('w-5 h-5 shrink-0 transition-colors', isActive ? 'text-[#FF7A00]' : 'text-[#6B6B80] group-hover:text-[#A0A0B8]')}>
          <Icon className="w-full h-full" />
        </div>

        {/* Label */}
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className={cn(
                'flex-1 text-sm font-medium whitespace-nowrap overflow-hidden transition-colors',
                isActive ? 'text-[#FF9A40]' : 'text-[#A0A0B8] group-hover:text-white'
              )}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Badge */}
        {!collapsed && unreadCount != null && unreadCount > 0 && (
          <span className="ml-auto px-1.5 py-0.5 bg-[#EF4444] text-white text-[10px] font-bold rounded-full min-w-[18px] text-center leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {collapsed && unreadCount != null && unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-[#09090B]" />
        )}

        {/* Sub-item chevron */}
        {hasSubs && !collapsed && (
          <motion.div
            animate={{ rotate: subExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4 text-[#6B6B80]" />
          </motion.div>
        )}
      </motion.div>
  )

  return (
    <div className="relative">
      {hasSubs ? mainContent : (
        <Link href={item.href} className="block no-underline">
          {mainContent}
        </Link>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {collapsed && showTooltip && (
          <SidebarTooltip label={item.label} description={item.description} />
        )}
      </AnimatePresence>

      {/* Sub Items */}
      <AnimatePresence>
        {!collapsed && hasSubs && subExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden pl-8 mt-0.5"
          >
            {item.subItems!.map((sub) => {
              const subActive = pathname === sub.href
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5',
                    subActive
                      ? 'text-[#FF7A00] bg-[#FF7A00]/10'
                      : 'text-[#6B6B80] hover:text-white hover:bg-white/[0.03]'
                  )}
                >
                  <span className={cn('w-1 h-1 rounded-full', subActive ? 'bg-[#FF7A00]' : 'bg-[#3A3A50]')} />
                  {sub.label}
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Sidebar Component ───────────────────────────────────────────────────
interface SASidebarProps {
  isDrawer?: boolean
  onClose?: () => void
}

export function SASidebar({ isDrawer = false, onClose }: SASidebarProps) {
  const params = useParams()
  const saToken = params.saToken as string
  const { sidebarCollapsed, toggleSidebar } = useSAUIStore()
  const { superAdmin } = useSAAuthStore()
  
  // Get notification/pending counts from store
  const { notifications, panelRequests, getOpenTicketsCount } = useSuperAdminStore()
  const unreadNotifs = notifications.filter(n => !n.isRead).length
  const pendingRequests = panelRequests.filter(r => r.status === 'pending').length
  const openTickets = getOpenTicketsCount()

  const role = (superAdmin?.role as AdminRole) || 'SUPER_ADMIN'
  const permissions = DEFAULT_ROLE_PERMISSIONS[role]

  const navSections = getSANavigation(saToken)
    .map((section) => ({
      ...section,
      items: section.items
        .filter((item) => {
          const perm = permissions[item.panel]
          return perm && perm !== 'none'
        })
        .map((item) => {
          if (!item.subItems) return item
          return {
            ...item,
            subItems: item.subItems.filter((sub) => {
              const perm = permissions[sub.panel]
              return perm && perm !== 'none'
            }),
          }
        }),
    }))
    .filter((section) => section.items.length > 0)
  
  const collapsed = !isDrawer && sidebarCollapsed

  const getBadgeCount = (badge?: string) => {
    if (badge === 'unread') return unreadNotifs
    if (badge === 'pending') return pendingRequests
    if (badge === 'tickets') return openTickets
    return 0
  }

  return (
    <div className={cn(
      'flex flex-col h-full bg-[#09090B] border-r border-[#1E1E2E] overflow-hidden',
      !isDrawer && 'relative'
    )}>
      {/* ── Header ── */}
      <div className={cn(
        'flex items-center gap-3 border-b border-[#1E1E2E] shrink-0',
        collapsed ? 'px-3 py-4 justify-center' : 'px-4 py-4'
      )}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#F5C842] flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
          <Shield className="w-4.5 h-4.5 text-white" />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <p className="font-serif text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#F5C842] whitespace-nowrap">
                Bharat Bazaar
              </p>
              <span className="inline-block px-1.5 py-0.5 bg-[#F5C842]/10 border border-[#F5C842]/20 rounded-full text-[9px] font-bold text-[#F5C842] tracking-widest uppercase whitespace-nowrap">
                {superAdmin?.role.replace('_', ' ') || 'Super Admin'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {isDrawer && (
          <button
            onClick={onClose}
            aria-label="Close Sidebar"
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-[#6B6B80] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2A2A3E]">
        {navSections.map((section, sectionIdx) => (
          <div key={section.title} className={cn(sectionIdx > 0 && 'mt-5')}>
            {/* Section Header */}
            <AnimatePresence>
              {!collapsed ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-1 text-[10px] font-bold text-[#4A4A5E] tracking-[0.15em] uppercase"
                >
                  {section.title}
                </motion.p>
              ) : (
                <div className="h-px bg-[#1E1E2E] mx-2 mb-2" />
              )}
            </AnimatePresence>

            {/* Items */}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  onNavigate={onClose}
                  unreadCount={getBadgeCount(item.badge)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Admin Mini Profile Footer ── */}
      {superAdmin && (
        <div className={cn(
          'shrink-0 border-t border-[#1E1E2E] p-3',
          collapsed ? 'flex justify-center' : ''
        )}>
          {collapsed ? (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#F5C842]/10 border border-[#FF7A00]/20 flex items-center justify-center text-sm font-bold text-[#FF7A00]">
              {superAdmin.name.charAt(0)}
            </div>
          ) : (
            <div className="flex items-center gap-3 px-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#F5C842]/10 border border-[#FF7A00]/20 flex items-center justify-center text-sm font-bold text-[#FF7A00] shrink-0">
                {superAdmin.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{superAdmin.name}</p>
                <p className="text-[10px] text-[#6B6B80] font-medium">{superAdmin.role.replace('_', ' ')}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Collapse Toggle (Desktop only, not drawer) ── */}
      {!isDrawer && (
        <button
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="absolute -right-3 top-[72px] z-10 w-6 h-6 rounded-full bg-[#1E1E30] border border-[#2A2A3E] flex items-center justify-center text-[#6B6B80] hover:text-white hover:bg-[#2A2A3E] transition-colors shadow-lg"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronLeft className="w-3 h-3" />
          </motion.div>
        </button>
      )}
    </div>
  )
}
