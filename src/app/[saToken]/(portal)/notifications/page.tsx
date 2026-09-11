'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Trash2, Shield, AlertTriangle, DollarSign, Package, UserCheck, Star, FileCheck, Info, Settings, BellOff } from 'lucide-react'
import { fetchNotificationsAction, fetchNotificationPreferencesAction, updateNotificationPreferencesAction, markNotificationReadAction, markAllNotificationsReadAction, dismissNotificationAction } from '@/actions/super-admin/notifications'
import { cn } from '@/lib/utils'
import type { SANotification, NotificationType } from '@/types/super-admin.types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saNotificationPreferencesSchema, type SANotificationPreferencesInput } from '@/lib/validators/sa-operations.validators'
import { toast } from 'sonner'
import Link from 'next/link'

function getNotifIcon(type: NotificationType) {
  const map: Record<NotificationType, React.ElementType> = {
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<SANotification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<SANotificationPreferencesInput>({
    resolver: zodResolver(saNotificationPreferencesSchema),
    defaultValues: {
      emailOnCritical: true,
      emailOnHigh: false,
      browserPushEnabled: false,
      mutedTypes: []
    }
  })

  React.useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [notifRes, prefRes] = await Promise.all([
      fetchNotificationsAction(),
      fetchNotificationPreferencesAction()
    ])
    if (notifRes.data) setNotifications(notifRes.data)
    if (prefRes.data) reset(prefRes.data)
    setLoading(false)
  }

  const markNotificationRead = async (id: string) => {
    await markNotificationReadAction(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
  }

  const markAllNotificationsRead = async () => {
    await markAllNotificationsReadAction()
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readAt: n.readAt || new Date().toISOString() })))
  }

  const dismissNotification = async (id: string) => {
    await dismissNotificationAction(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isDismissed: true } : n))
  }

  const visibleNotifications = notifications
    .filter(n => !n.isDismissed)
    .filter(n => activeTab === 'all' || !n.isRead)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const onSavePreferences = async (data: SANotificationPreferencesInput) => {
    const { error } = await updateNotificationPreferencesAction(data)
    if (error) {
      toast.error('Failed to update preferences: ' + error)
    } else {
      toast.success('Preferences updated successfully')
    }
  }

  if (loading) {
    return <div className="p-6 text-white text-sm">Loading notifications...</div>
  }

  return (
    <div className="h-full flex min-h-0 bg-[#0B0B12]">
      {/* Left Column - Notifications Feed */}
      <div className="flex-1 flex flex-col min-h-0 border-r border-[#1E1E2E]">
        <div className="shrink-0 p-6 border-b border-[#1E1E2E] bg-[#111118]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Notifications Center</h1>
              <p className="text-[#8B8B9E] text-sm">View and manage system alerts and tasks.</p>
            </div>
            <button 
              onClick={markAllNotificationsRead}
              className="px-4 py-2 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl text-xs font-bold text-white hover:bg-[#2A2A3E] transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-green-500" /> Mark all read
            </button>
          </div>

          <div className="flex gap-2 p-1 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl w-fit">
            {(['all', 'unread'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-colors",
                  activeTab === tab ? "bg-[#FF7A00] text-white" : "text-[#8B8B9E] hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {visibleNotifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64 text-center"
              >
                <div className="w-16 h-16 bg-[#1A1A26] border border-[#2A2A3E] rounded-2xl flex items-center justify-center mb-4">
                  <BellOff className="w-6 h-6 text-[#6B6B80]" />
                </div>
                <h3 className="text-white font-bold mb-1">All caught up</h3>
                <p className="text-sm text-[#8B8B9E]">You have no {activeTab === 'unread' ? 'unread' : ''} notifications.</p>
              </motion.div>
            ) : (
              visibleNotifications.map((notif) => {
                const Icon = getNotifIcon(notif.type)
                const pColor = PRIORITY_COLORS[notif.priority] || PRIORITY_COLORS.low

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={notif.id}
                    className={cn(
                      "group p-4 rounded-xl border transition-all flex gap-4 relative overflow-hidden",
                      notif.isRead ? "bg-[#111118] border-[#1E1E2E]" : "bg-[#1A1A26] border-[#FF7A00]/30 shadow-[0_0_15px_rgba(255,122,0,0.05)]"
                    )}
                  >
                    {!notif.isRead && <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#FF7A00]" />}
                    
                    <div className="shrink-0 mt-1">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border",
                        notif.isRead ? "bg-[#151520] border-[#2A2A3E]" : "bg-[#FF7A00]/10 border-[#FF7A00]/20"
                      )}>
                        <Icon className={cn("w-5 h-5", notif.isRead ? "text-[#8B8B9E]" : "text-[#FF7A00]")} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn("w-2 h-2 rounded-full", pColor)} title={`Priority: ${notif.priority}`} />
                            <h4 className={cn("text-sm font-bold line-clamp-1", notif.isRead ? "text-[#A0A0B8]" : "text-white")}>
                              {notif.title}
                            </h4>
                          </div>
                          <p className="text-sm text-[#8B8B9E] leading-relaxed mb-3">{notif.body}</p>
                          <div className="flex items-center gap-4 text-xs text-[#6B6B80]">
                            <span>{new Date(notif.createdAt).toLocaleString()}</span>
                            {notif.readAt && <span>Read: {new Date(notif.readAt).toLocaleString()}</span>}
                          </div>
                        </div>

                        <div className="shrink-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notif.isRead && (
                            <button onClick={() => markNotificationRead(notif.id)} className="w-8 h-8 rounded-lg bg-[#2A2A3E] hover:bg-[#3A3A50] text-white flex items-center justify-center transition-colors" title="Mark Read">
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => dismissNotification(notif.id)} className="w-8 h-8 rounded-lg bg-[#2A2A3E] hover:bg-red-500 hover:text-white text-[#8B8B9E] flex items-center justify-center transition-colors" title="Dismiss">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {notif.actionRoute && notif.actionLabel && (
                        <div className="mt-4">
                          <Link href={notif.actionRoute}>
                            <button className="px-4 py-2 bg-[#1A1A26] hover:bg-[#2A2A3E] text-[#FF7A00] border border-[#2A2A3E] hover:border-[#FF7A00]/50 rounded-lg text-xs font-bold transition-colors">
                              {notif.actionLabel}
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column - Preferences */}
      <div className="w-[360px] shrink-0 bg-[#0B0B12] flex flex-col">
        <div className="p-6 border-b border-[#1E1E2E]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#8B8B9E]" /> Preferences
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <form id="notif-prefs" onSubmit={handleSubmit(onSavePreferences)} className="space-y-6">
            
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Delivery Channels</h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-[#2A2A3E] bg-[#111118] cursor-pointer hover:border-[#3A3A50]">
                  <input type="checkbox" {...register('emailOnCritical')} className="mt-0.5 accent-[#FF7A00]" />
                  <div>
                    <span className="text-sm font-medium text-white block">Email on Critical</span>
                    <span className="text-xs text-[#6B6B80]">Send immediate email for critical alerts</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-xl border border-[#2A2A3E] bg-[#111118] cursor-pointer hover:border-[#3A3A50]">
                  <input type="checkbox" {...register('emailOnHigh')} className="mt-0.5 accent-[#FF7A00]" />
                  <div>
                    <span className="text-sm font-medium text-white block">Email on High Priority</span>
                    <span className="text-xs text-[#6B6B80]">Send email for high priority notifications</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-xl border border-[#2A2A3E] bg-[#111118] cursor-pointer hover:border-[#3A3A50]">
                  <input type="checkbox" {...register('browserPushEnabled')} className="mt-0.5 accent-[#FF7A00]" />
                  <div>
                    <span className="text-sm font-medium text-white block">Browser Push</span>
                    <span className="text-xs text-[#6B6B80]">Enable desktop push notifications</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-4">Muted Categories</h3>
              <div className="space-y-2">
                {[
                  { id: 'new_seller_application', label: 'New Seller Applications' },
                  { id: 'kyc_submitted', label: 'KYC Submissions' },
                  { id: 'review_flagged', label: 'Flagged Reviews' },
                  { id: 'settlement_processed', label: 'Settlements' },
                ].map((type) => (
                  <label key={type.id} className="flex items-center gap-3 p-2 cursor-pointer group">
                    <input type="checkbox" value={type.id} {...register('mutedTypes')} className="accent-[#FF7A00]" />
                    <span className="text-sm text-[#A0A0B8] group-hover:text-white transition-colors">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </form>
        </div>
        <div className="p-6 border-t border-[#1E1E2E] bg-[#111118]">
          <button 
            form="notif-prefs"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#FF7A00] hover:bg-[#FF4500] text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  )
}