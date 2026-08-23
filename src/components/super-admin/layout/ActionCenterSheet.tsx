'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import {
  Clock, Scale, ShieldCheck, AlertTriangle, Headphones,
  ChevronRight, X, AlertCircle
} from 'lucide-react'
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import { cn } from '@/lib/utils'

interface ActionSection {
  id: string
  icon: React.ElementType
  label: string
  color: string
  items: { id: string; title: string; subtitle: string; route: string }[]
  viewAllRoute: string
}

export function ActionCenterSheet({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const params = useParams()
  const saToken = params.saToken as string
  const { notifications, panelRequests, getOpenTicketsCount } = useSuperAdminStore()

  // Build sections from live store data
  const sections: ActionSection[] = [
    {
      id: 'sla',
      icon: Clock,
      label: 'SLA Breaches',
      color: '#EF4444',
      items: [],
      viewAllRoute: `/${saToken}/orders?filter=sla_breached`,
    },
    {
      id: 'disputes',
      icon: Scale,
      label: 'Open Disputes',
      color: '#F59E0B',
      items: [],
      viewAllRoute: `/${saToken}/orders?filter=disputes`,
    },
    {
      id: 'kyc',
      icon: ShieldCheck,
      label: 'Pending KYC / Panel Requests',
      color: '#3B82F6',
      items: panelRequests
        .filter((r: any) => r.status === 'pending')
        .slice(0, 3)
        .map((r: any) => ({
          id: r.id,
          title: r.adminName,
          subtitle: `Panel access request · ${r.requestedRole}`,
          route: `/${saToken}/panel-requests`,
        })),
      viewAllRoute: `/${saToken}/panel-requests`,
    },
    {
      id: 'flagged',
      icon: AlertTriangle,
      label: 'Flagged Products',
      color: '#F59E0B',
      items: [],
      viewAllRoute: `/${saToken}/products?filter=flagged`,
    },
    {
      id: 'tickets',
      icon: Headphones,
      label: 'Unassigned Tickets',
      color: '#8B5CF6',
      items: [],
      viewAllRoute: `/${saToken}/support`,
    },
  ]

  const totalCount = sections.reduce((acc, s) => acc + s.items.length, 0)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[81] bg-[#0D0D14] border-t border-[#2A2A3E] rounded-t-3xl shadow-2xl max-h-[90dvh] flex flex-col"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-[#2A2A3E]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#1E1E2E] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-[#EF4444]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Action Center</h2>
                  <p className="text-[10px] text-[#6B6B80]">
                    {totalCount} item{totalCount !== 1 ? 's' : ''} need your attention
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close Action Center"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B80] hover:bg-white/5 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 px-4 py-4 space-y-4 pb-safe-bottom">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <div key={section.id} className="bg-[#111118] border border-[#2A2A3E] rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E2E]">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: section.color }} />
                        <span className="text-sm font-semibold text-white">{section.label}</span>
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: `${section.color}20`, color: section.color }}
                        >
                          {section.items.length}
                        </span>
                      </div>
                      <button
                        onClick={() => { router.push(section.viewAllRoute); onClose() }}
                        className="text-[11px] text-[#FF7A00] font-semibold flex items-center gap-0.5"
                      >
                        View All <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    {section.items.length === 0 ? (
                      <div className="px-4 py-5 text-center text-xs text-[#6B6B80]">
                        ✓ All clear
                      </div>
                    ) : (
                      <div className="divide-y divide-[#1E1E2E]">
                        {section.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => { router.push(item.route); onClose() }}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors text-left"
                          >
                            <div>
                              <p className="text-sm font-medium text-white">{item.title}</p>
                              <p className="text-[11px] text-[#6B6B80] mt-0.5">{item.subtitle}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#3A3A50] shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
