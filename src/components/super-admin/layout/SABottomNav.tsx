'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ShoppingCart, UserCheck,
  AlertTriangle, MoreHorizontal
} from 'lucide-react'
import { useSAUIStore } from '@/lib/store/sa-ui-store'
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import { cn } from '@/lib/utils'

interface BottomTab {
  id: string
  label: string
  icon: React.ElementType
  href?: string
  action?: 'alerts' | 'more'
  badgeKey?: 'alerts' | 'more'
}

const BOTTOM_TABS: BottomTab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: 'dashboard' },
  { id: 'orders',    label: 'Orders',    icon: ShoppingCart,    href: 'orders' },
  { id: 'sellers',   label: 'Sellers',   icon: UserCheck,       href: 'sellers' },
  { id: 'alerts',    label: 'Alerts',    icon: AlertTriangle,   action: 'alerts', badgeKey: 'alerts' },
  { id: 'more',      label: 'More',      icon: MoreHorizontal,  action: 'more' },
]

export function SABottomNav() {
  const pathname = usePathname()
  const params = useParams()
  const saToken = params.saToken as string
  const { openActionCenter, openMoreMenu } = useSAUIStore() as any
  const { notifications, panelRequests, getOpenTicketsCount } = useSuperAdminStore()

  const alertCount = [
    notifications.filter((n: any) => !n.isRead && n.priority === 'critical').length,
    panelRequests.filter((r: any) => r.status === 'pending').length,
    getOpenTicketsCount()
  ].reduce((a, b) => a + b, 0)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#09090B]/95 backdrop-blur-lg border-t border-[#1E1E2E] pb-safe-bottom md:hidden"
      aria-label="Bottom navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center">
        {BOTTOM_TABS.map((tab) => {
          const isActive = tab.href
            ? pathname.includes(`/${saToken}/${tab.href}`)
            : false
          const Icon = tab.icon
          const badge = tab.badgeKey === 'alerts' ? alertCount : 0

          const handlePress = () => {
            if (tab.action === 'alerts') openActionCenter?.()
            if (tab.action === 'more') openMoreMenu?.()
          }

          const content = (
            <div className="relative flex flex-col items-center gap-0.5 py-3 px-1 min-w-0">
              {/* Active top bar */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavBar"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#FF7A00]"
                />
              )}
              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-[#FF7A00]' : 'text-[#6B6B80]'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#09090B]">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-[10px] font-medium leading-none truncate',
                isActive ? 'text-[#FF7A00]' : 'text-[#6B6B80]'
              )}>
                {tab.label}
              </span>
            </div>
          )

          return (
            <div key={tab.id} className="flex-1 min-w-0">
              {tab.href ? (
                <Link href={`/${saToken}/${tab.href}`} className="block w-full" aria-label={tab.label}>
                  {content}
                </Link>
              ) : (
                <button
                  onClick={handlePress}
                  className="block w-full"
                  aria-label={tab.label}
                >
                  {content}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
