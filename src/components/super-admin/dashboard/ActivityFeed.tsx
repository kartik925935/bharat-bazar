'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, UserCheck, FileCheck, RotateCcw, ClipboardList, CheckCircle2, DollarSign, UserPlus, Package } from 'lucide-react'
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import { formatRelativeTime } from '@/lib/utils/formatters'
import { SkeletonBase } from '@/components/super-admin/shared/SkeletonBase'
import type { ActivityType, DashboardActivity } from '@/lib/mock/sa-dashboard.mock'

const ACTIVITY_CONFIG: Record<ActivityType, { icon: React.ElementType, color: string, bg: string }> = {
  new_order: { icon: ShoppingCart, color: '#3B82F6', bg: 'bg-[#3B82F6]/10 border-[#3B82F6]/20' },
  seller_approved: { icon: UserCheck, color: '#22C55E', bg: 'bg-[#22C55E]/10 border-[#22C55E]/20' },
  kyc_submitted: { icon: FileCheck, color: '#F59E0B', bg: 'bg-[#F59E0B]/10 border-[#F59E0B]/20' },
  return_requested: { icon: RotateCcw, color: '#EF4444', bg: 'bg-[#EF4444]/10 border-[#EF4444]/20' },
  panel_request: { icon: ClipboardList, color: '#A855F7', bg: 'bg-[#A855F7]/10 border-[#A855F7]/20' },
  product_submitted: { icon: Package, color: '#FF7A00', bg: 'bg-[#FF7A00]/10 border-[#FF7A00]/20' },
  settlement_processed: { icon: DollarSign, color: '#22C55E', bg: 'bg-[#22C55E]/10 border-[#22C55E]/20' },
  customer_registered: { icon: UserPlus, color: '#3B82F6', bg: 'bg-[#3B82F6]/10 border-[#3B82F6]/20' },
  new_seller: { icon: UserCheck, color: '#F5C842', bg: 'bg-[#F5C842]/10 border-[#F5C842]/20' },
  payment_completed: { icon: CheckCircle2, color: '#22C55E', bg: 'bg-[#22C55E]/10 border-[#22C55E]/20' },
}

const itemVariants: any = {
  initial: { opacity: 0, height: 0, y: -20, backgroundColor: 'rgba(255, 122, 0, 0.2)' },
  animate: { opacity: 1, height: 'auto', y: 0, backgroundColor: 'rgba(255, 122, 0, 0)', transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
}

export function ActivityFeed({ isLoading = false }: { isLoading?: boolean }) {
  const { recentActivity } = useSuperAdminStore()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 flex flex-col h-full relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1E1E2E]">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-[#6B6B80] uppercase tracking-widest">Live Activity</h2>
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2A2A3E]">
        {isLoading ? (
          <div className="flex flex-col gap-6 relative">
            <div className="absolute left-5 top-2 bottom-0 w-px bg-[#1E1E2E] -z-10" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <SkeletonBase className="w-10 h-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2 mt-1">
                  <SkeletonBase className="w-3/4 h-4" />
                  <SkeletonBase className="w-20 h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ClipboardList className="w-8 h-8 text-[#3A3A50] mb-3" />
            <p className="text-sm font-medium text-[#6B6B80]">No recent activity</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline connection line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#2A2A3E] via-[#2A2A3E] to-transparent -z-10" />
            
            <AnimatePresence initial={false}>
              {recentActivity.map((activity: DashboardActivity) => {
                const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.new_order
                const Icon = config.icon

                return (
                  <motion.div
                    key={activity.id}
                    layout
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="flex gap-4 mb-6 last:mb-0 rounded-xl -mx-2 px-2 pt-1"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${config.bg} bg-[#111118]`}>
                      <Icon className="w-5 h-5" style={{ color: config.color }} />
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm text-[#D0D0E0] leading-snug">
                        <span className="font-bold text-white mr-1">{activity.actorName}</span>
                        {activity.message}
                      </p>
                      <p className="text-[10px] font-medium text-[#6B6B80] mt-1.5 uppercase tracking-wider">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}
