'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Settings, Shield, FileText, LogOut } from 'lucide-react'
import { useSAAuthStore } from '@/lib/store/sa-auth-store'
import { useSAUIStore } from '@/lib/store/sa-ui-store'

export function SAProfileDropdown({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const params = useParams()
  const saToken = params.saToken as string
  const { superAdmin, logout } = useSAAuthStore()
  const { openConfirmModal } = useSAUIStore()

  const handleLogout = () => {
    onClose()
    openConfirmModal({
      title: 'Log Out?',
      description: 'Are you sure you want to end your session? You will need to re-authenticate to access the portal.',
      variant: 'warning',
      confirmLabel: 'Log Out',
      onConfirm: () => {
        logout()
        router.replace(`/${saToken}/secure-access`)
      },
    })
  }

  const menuItems = [
    { icon: Settings, label: 'Account Settings', href: `/${saToken}/settings` },
    { icon: Shield, label: 'Security & 2FA', href: `/${saToken}/settings` },
    { icon: FileText, label: 'My Activity Log', href: `/${saToken}/audit-logs` },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-0 top-full mt-2 w-64 bg-[#111118] border border-[#2A2A3E] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
    >
      {/* Profile Header */}
      <div className="p-4 border-b border-[#1E1E2E] flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF7A00]/20 to-[#F5C842]/10 border border-[#FF7A00]/30 flex items-center justify-center text-xl font-bold text-[#FF7A00]">
          {superAdmin?.name.charAt(0) || 'A'}
        </div>
        <div className="text-center">
          <p className="font-bold text-white text-sm">{superAdmin?.name || 'Super Admin'}</p>
          <p className="text-xs text-[#8B8B9E] mt-0.5">{superAdmin?.email}</p>
          <span className="inline-block mt-2 px-2 py-0.5 bg-[#F5C842]/10 border border-[#F5C842]/20 rounded-full text-[10px] font-bold text-[#F5C842] uppercase tracking-widest">
            {superAdmin?.role.replace('_', ' ') || 'Super Admin'}
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        {menuItems.map(({ icon: Icon, label, href }) => (
          <Link
            key={href + label}
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#A0A0B8] hover:text-white hover:bg-white/[0.04] transition-colors group"
          >
            <Icon className="w-4 h-4 text-[#6B6B80] group-hover:text-[#FF7A00] transition-colors" />
            {label}
          </Link>
        ))}

        <div className="h-px bg-[#1E1E2E] my-2" />

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors group"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </motion.div>
  )
}
