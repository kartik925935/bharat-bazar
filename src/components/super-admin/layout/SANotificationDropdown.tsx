'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Bell, BellOff, Shield, DollarSign, UserCheck, Package,
  FileCheck, Star, AlertTriangle, Info
} from 'lucide-react'
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import { cn } from '@/lib/utils'
import type { SANotification } from '@/types/super-admin.types'

function formatRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function getNotifIcon(type: string) {
  const map: Record<string, React.ElementType> = {
    new_seller_application: UserCheck,
    kyc_submitted: FileCheck,
    product_submitted: Package,
    order_sla_breach: AlertTriangle,
    dispute_opened: AlertTriangle,
    dispute_escalated: AlertTriangle,
    payment_failed: DollarSign,
    reconciliation_mismatch: DollarSign,
    coupon_abuse_detected: AlertTriangle,
    review_flagged: Star,
    system_alert: Shield,
    settlement_processed: DollarSign,
    admin_action: UserCheck,
  }
  return map[type] || Info
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-[#EF4444]',
  high: 'bg-[#F59E0B]',
  medium: 'bg-[#3B82F6]',
  low: 'bg-[#6B6B80]',
}

function NotifItem({ notif, onRead }: { notif: SANotification; onRead: (id: string) => void }) {
  const Icon = getNotifIcon(notif.type)
  const priorityColor = PRIORITY_COLORS[notif.priority] || PRIORITY_COLORS.low

  return (
    <div
      className={cn(
        'flex gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-white/[0.03] relative border-l-2',
        notif.isRead ? 'border-transparent' : 'border-[#FF7A00]'
      )}
      onClick={() => onRead(notif.id)}
    >
      {/* Priority dot */}
      <span className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${priorityColor} ${notif.isRead ? 'opacity-40' : ''}`} />

      {/* Icon */}
      <div className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border',
        notif.isRead ? 'bg-[#1A1A26]/40 border-[#2A2A3E]/50' : 'bg-[#FF7A00]/10 border-[#FF7A00]/20'
      )}>
        <Icon className={cn('w-4.5 h-4.5', notif.isRead ? 'text-[#6B6B80]' : 'text-[#FF7A00]')} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        <p className={cn('text-sm font-semibold line-clamp-1', notif.isRead ? 'text-[#A0A0B8]' : 'text-white')}>
          {notif.title}
        </p>
        <p className="text-xs text-[#8B8B9E] mt-0.5 line-clamp-2 leading-relaxed">{notif.body}</p>
        <p className="text-[10px] text-[#6B6B80] mt-1.5 font-medium">{formatRelativeTime(notif.createdAt)}</p>
      </div>
    </div>
  )
}

export function SANotificationDropdown({ onClose }: { onClose: () => void }) {
  const params = useParams()
  const saToken = params.saToken as string
  const { notifications, markNotificationRead } = useSuperAdminStore()
  const [tab, setTab] = useState<'all' | 'unread'>('all')

  const filtered = tab === 'unread' ? notifications.filter((n) => !n.isRead) : notifications
  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAllRead = () => {
    notifications.filter((n) => !n.isRead).forEach((n) => markNotificationRead(n.id))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-0 top-full mt-2 w-[360px] bg-[#111118] border border-[#2A2A3E] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E2E]">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 bg-[#EF4444] text-white text-[10px] font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-[11px] font-medium text-[#FF7A00] hover:text-[#F5C842] transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex px-4 py-2 gap-3 border-b border-[#1E1E2E]">
        {(['all', 'unread'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'text-xs font-semibold py-1 px-2 rounded-lg transition-colors capitalize',
              tab === t ? 'bg-[#FF7A00]/10 text-[#FF7A00]' : 'text-[#6B6B80] hover:text-white'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-0.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <BellOff className="w-8 h-8 text-[#3A3A50] mb-3" />
            <p className="text-sm font-medium text-[#6B6B80]">You're all caught up!</p>
            <p className="text-xs text-[#4A4A5E] mt-1">No {tab === 'unread' ? 'unread ' : ''}notifications</p>
          </div>
        ) : (
          filtered.map((n) => (
            <NotifItem key={n.id} notif={n} onRead={markNotificationRead} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#1E1E2E] p-3 text-center">
        <Link
          href={`/${saToken}/notifications`}
          onClick={onClose}
          className="text-xs font-semibold text-[#FF7A00] hover:text-[#F5C842] transition-colors"
        >
          View all notifications →
        </Link>
      </div>
    </motion.div>
  )
}
