'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Server, Database, CreditCard, HardDrive, Activity } from 'lucide-react'
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import { SkeletonBase } from '@/components/super-admin/shared/SkeletonBase'

export function SystemHealthWidget({ isLoading = false }: { isLoading?: boolean }) {
  const { systemHealth } = useSuperAdminStore()

  const STATUS_COLORS = {
    operational: 'bg-[#22C55E]',
    degraded: 'bg-[#F59E0B]',
    down: 'bg-[#EF4444]'
  }

  const services = [
    { label: 'API Gateway', status: systemHealth.apiStatus, icon: Server },
    { label: 'Primary Database', status: systemHealth.dbStatus, icon: Database },
    { label: 'Payment Gateway', status: systemHealth.paymentGatewayStatus, icon: CreditCard },
    { label: 'Cloud Storage', status: systemHealth.storageStatus, icon: HardDrive },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 flex flex-col h-full relative"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-[#6B6B80] uppercase tracking-widest">System Health</h2>
        <Activity className="w-4 h-4 text-[#FF7A00]" />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SkeletonBase className="w-5 h-5 rounded" />
                <SkeletonBase className="w-28 h-4" />
              </div>
              <SkeletonBase className="w-16 h-4" />
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-[#1E1E2E] flex justify-between">
            <SkeletonBase className="w-20 h-3" />
            <SkeletonBase className="w-20 h-3" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 flex-1">
            {services.map((svc) => {
              const Icon = svc.icon
              const isOp = svc.status === 'operational'
              return (
                <div key={svc.label} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#6B6B80] group-hover:text-[#A0A0B8] transition-colors" />
                    <span className="text-sm font-semibold text-[#D0D0E0]">{svc.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8B8B9E]">{svc.status}</span>
                    <span className="relative flex w-2 h-2">
                      {isOp && (
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${STATUS_COLORS[svc.status]}`}
                        />
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${STATUS_COLORS[svc.status]}`} />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#1E1E2E] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-widest mb-0.5">Response</span>
              <span className="text-xs font-bold text-white tabular-nums">{systemHealth.avgResponseTime}ms</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-widest mb-0.5">Uptime</span>
              <span className="text-xs font-bold text-[#22C55E] tabular-nums">{systemHealth.uptimePercentage}%</span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
