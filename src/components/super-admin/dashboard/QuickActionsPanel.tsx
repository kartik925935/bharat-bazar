'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ClipboardList, FileCheck, Package, UserPlus, FileText, Settings } from 'lucide-react'
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import { SkeletonBase } from '@/components/super-admin/shared/SkeletonBase'

export function QuickActionsPanel({ isLoading = false }: { isLoading?: boolean }) {
  const params = useParams()
  const saToken = params.saToken as string
  const { getPendingRequestCount } = useSuperAdminStore()
  
  // Pending counts (would normally derive from store logic)
  const pendingPanel = getPendingRequestCount()
  const pendingKYC = 12 // mockup for now
  const pendingProducts = 8 // mockup for now

  const ACTIONS = [
    { label: 'Review Panel Requests', icon: ClipboardList, href: `/${saToken}/panel-requests`, count: pendingPanel, color: '#A855F7' },
    { label: 'Verify KYC', icon: FileCheck, href: `/${saToken}/kyc-verification`, count: pendingKYC, color: '#F59E0B' },
    { label: 'Approve Products', icon: Package, href: `/${saToken}/products?filter=pending`, count: pendingProducts, color: '#3B82F6' },
    { label: 'Create Admin', icon: UserPlus, href: `/${saToken}/admin-control?action=create`, color: '#22C55E' },
    { label: 'Audit Logs', icon: FileText, href: `/${saToken}/audit-logs`, color: '#6B7280' },
    { label: 'Platform Settings', icon: Settings, href: `/${saToken}/settings`, color: '#6B7280' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
  }

  const itemVariants: any = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  }

  return (
    <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 relative">
      <h2 className="text-sm font-bold text-[#6B6B80] uppercase tracking-widest mb-4">Quick Actions</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonBase key={i} className="h-[104px] rounded-xl" />
          ))}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show" 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {ACTIONS.map((action, i) => {
            const Icon = action.icon
            return (
              <motion.div key={i} variants={itemVariants} className="h-full">
                <Link
                  href={action.href}
                  className="flex flex-col items-center justify-center gap-3 p-4 h-full bg-gradient-to-b from-[#1A1A26] to-[#151520] border border-[#2A2A3E] rounded-xl hover:border-[#FF7A00]/40 hover:bg-[#1C1C2A] transition-all group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[#FF7A00]/0 group-hover:bg-[#FF7A00]/[0.02] transition-colors" />
                  
                  <div className="relative">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${action.color}15`, border: `1px solid ${action.color}30` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: action.color }} />
                    </div>
                    {action.count !== undefined && action.count > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#FF7A00] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(255,122,0,0.5)]">
                        {action.count}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs font-semibold text-center text-[#D0D0E0] group-hover:text-white transition-colors leading-tight">
                    {action.label}
                  </p>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
