'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, Eye, FileText, Loader2, RotateCcw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useSAStore } from '@/lib/store/super-admin-store'
import { useSAUIStore } from '@/lib/store/sa-ui-store'
import { saAdminEditSchema, type SAAdminEditInput } from '@/lib/validators/sa-validators'
import { PermissionMatrix } from './PermissionMatrix'
import { StatusBadge } from '@/components/super-admin/shared/StatusBadge'
import { buildDefaultGrants } from '@/lib/constants/sa-permissions'
import { formatRelativeTime } from '@/lib/utils/formatters'
import type { SAAdmin, PanelKey, AccessLevel, AdminStatus } from '@/types/super-admin.types'

type Tab = 'overview' | 'permissions' | 'activity'

const STATUS_VARIANT: Record<AdminStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  active: 'success',
  inactive: 'neutral',
  suspended: 'error',
  pending: 'warning',
}

const MOCK_ACTIVITY = [
  { action: 'Logged in from Mumbai, India', time: new Date(Date.now() - 12 * 60000).toISOString() },
  { action: 'Approved product SKU-8823 (Warli Art Set)', time: new Date(Date.now() - 3 * 3600000).toISOString() },
  { action: 'Updated seller status for Raj Weaves to Verified', time: new Date(Date.now() - 1 * 86400000).toISOString() },
  { action: 'Responded to support ticket #T-4421', time: new Date(Date.now() - 2 * 86400000).toISOString() },
  { action: 'Reviewed KYC documents for Artisan Hub NGO', time: new Date(Date.now() - 3 * 86400000).toISOString() },
]

interface AdminDetailDrawerProps {
  admin: SAAdmin | null
  onClose: () => void
}

export function AdminDetailDrawer({ admin, onClose }: AdminDetailDrawerProps) {
  const [tab, setTab] = useState<Tab>('overview')
  const [savingPermission, setSavingPermission] = useState<PanelKey | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { updateAdminStatus, updateAdminPermissions, deleteAdmin } = useSAStore()
  const { openConfirmModal } = useSAUIStore()

  const form = useForm<SAAdminEditInput>({
    resolver: zodResolver(saAdminEditSchema) as any,
    defaultValues: admin ? {
      name: admin.name,
      email: admin.email,
      role: admin.role as any,
      department: admin.department,
      status: admin.status,
    } : undefined,
    mode: 'onChange',
  })

  const { handleSubmit, register, formState: { errors, isDirty, isValid }, reset, watch } = form
  const selectedRole = watch('role')

  // Reset form when admin changes
  React.useEffect(() => {
    if (admin) {
      reset({
        name: admin.name,
        email: admin.email,
        role: admin.role as any,
        department: admin.department,
        status: admin.status,
      })
      setTab('overview')
    }
  }, [admin?.id])

  const onSave = async (data: SAAdminEditInput) => {
    if (!admin) return
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 700))
    updateAdminStatus(admin.id, data.status)
    // TODO: logAuditEvent({ action: 'admin_updated', ... })
    toast.success('Admin updated successfully')
    setIsSaving(false)
    reset(data)
  }

  const handlePermissionChange = async (panel: PanelKey, level: AccessLevel) => {
    if (!admin) return
    setSavingPermission(panel)
    await new Promise((r) => setTimeout(r, 500))
    // Update permissions array: replace existing grant or add new one
    const updatedPerms = [
      ...(admin.permissions ?? []).filter((g) => g.panel !== panel),
      { panel, level, source: 'granted' as const },
    ]
    updateAdminPermissions(admin.id, updatedPerms)
    setSavingPermission(null)
    toast.success(`${panel} → ${level}`, { description: 'Permission saved' })
  }

  const handleResetPermissions = () => {
    if (!admin) return
    openConfirmModal({
      title: 'Reset to Role Defaults',
      description: `This will reset all of ${admin.name}'s custom permissions back to the standard defaults for ${admin.role.replace(/_/g, ' ')}.`,
      confirmLabel: 'Reset',
      variant: 'warning',
      onConfirm: async () => {
        await new Promise((r) => setTimeout(r, 600))
        updateAdminPermissions(admin.id, buildDefaultGrants(admin.role))
        toast.success('Permissions reset to role defaults')
      },
    })
  }

  const handleDelete = () => {
    if (!admin) return
    openConfirmModal({
      title: 'Delete Admin Account',
      description: `This will permanently remove ${admin.name}'s access. This cannot be undone.`,
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: async () => {
        await new Promise((r) => setTimeout(r, 600))
        deleteAdmin(admin.id)
        toast.error(`${admin.name} has been removed`)
        onClose()
      },
    })
  }

  const handleSuspend = async () => {
    if (!admin) return
    const isSuspended = admin.status === 'suspended'
    await new Promise((r) => setTimeout(r, 500))
    updateAdminStatus(admin.id, isSuspended ? 'active' : 'suspended')
    toast.success(isSuspended ? `${admin.name} reactivated` : `${admin.name} suspended`)
  }

  if (!admin) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-x-0 top-16 bottom-9 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Drawer */}
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-[480px] h-full bg-[#0D0D14] border-l border-[#1E1E2E] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="shrink-0 p-5 border-b border-[#1E1E2E] flex items-start gap-4 bg-[#111118]">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white text-xl font-black shrink-0 shadow-lg shadow-[#FF7A00]/20">
              {admin.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h2 className="text-sm font-bold text-white">{admin.name}</h2>
                <StatusBadge status={admin.status} variant={STATUS_VARIANT[admin.status]} />
              </div>
              <p className="text-xs text-[#8B8B9E] truncate">{admin.email}</p>
              <p className="text-[10px] text-[#5A5A70] font-semibold mt-0.5 uppercase tracking-widest">
                {admin.role.replace(/_/g, ' ')} · {admin.department}
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B80] hover:text-white hover:bg-white/5 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="shrink-0 flex border-b border-[#1E1E2E] bg-[#111118]">
            {([['overview', 'Overview', FileText], ['permissions', 'Permissions', Shield], ['activity', 'Activity', Eye]] as const).map(([t, label, Icon]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-colors border-b-2',
                  tab === t ? 'text-[#FF7A00] border-[#FF7A00]' : 'text-[#6B6B80] border-transparent hover:text-[#A0A0B8]'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content — scrollable flex-1 */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2A2A3E]">
            {tab === 'overview' && (
              <form onSubmit={handleSubmit(onSave)} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#6B6B80] uppercase tracking-wider">Full Name</label>
                  <input {...register('name')} className="w-full h-10 bg-[#1A1A26] border border-[#2A2A3E] focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 rounded-xl px-3 text-sm text-white outline-none transition-all" />
                  {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#6B6B80] uppercase tracking-wider">Email</label>
                  <input {...register('email')} type="email" className="w-full h-10 bg-[#1A1A26] border border-[#2A2A3E] focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 rounded-xl px-3 text-sm text-white outline-none transition-all" />
                  {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#6B6B80] uppercase tracking-wider">Role</label>
                    <select {...register('role')} className="w-full h-10 bg-[#1A1A26] border border-[#2A2A3E] focus:border-[#FF7A00] rounded-xl px-3 text-sm text-white outline-none transition-all appearance-none">
                      {['SENIOR_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN', 'FINANCE_ADMIN', 'CONTENT_ADMIN', 'DELIVERY_ADMIN', 'CUSTOM_ADMIN'].map((r) => (
                        <option key={r} value={r} className="bg-[#1A1A26]">{r.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#6B6B80] uppercase tracking-wider">Status</label>
                    <select {...register('status')} className="w-full h-10 bg-[#1A1A26] border border-[#2A2A3E] focus:border-[#FF7A00] rounded-xl px-3 text-sm text-white outline-none transition-all appearance-none">
                      {['active', 'inactive', 'suspended', 'pending'].map((s) => (
                        <option key={s} value={s} className="bg-[#1A1A26]">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#6B6B80] uppercase tracking-wider">Department</label>
                  <input {...register('department')} className="w-full h-10 bg-[#1A1A26] border border-[#2A2A3E] focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 rounded-xl px-3 text-sm text-white outline-none transition-all" />
                  {errors.department && <p className="text-xs text-red-400">{errors.department.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-[#8B8B9E] border-t border-[#1E1E2E] pt-4">
                  <div>
                    <p className="font-bold text-[#6B6B80] uppercase tracking-wider mb-1">Created By</p>
                    <p className="text-white font-semibold">{admin.createdBy}</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#6B6B80] uppercase tracking-wider mb-1">Last Active</p>
                    <p className="text-white font-semibold">{admin.lastActive === '—' ? '—' : formatRelativeTime(admin.lastActive)}</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isDirty || !isValid || isSaving}
                  className="w-full h-10 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-opacity"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {tab === 'permissions' && (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#8B8B9E]">Changes are saved automatically per toggle.</p>
                  <button onClick={handleResetPermissions} className="flex items-center gap-1.5 text-xs font-bold text-[#6B6B80] hover:text-white border border-[#2A2A3E] hover:border-[#3A3A50] px-3 py-1.5 rounded-lg transition-colors">
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </div>
                {savingPermission && (
                  <div className="flex items-center gap-2 text-xs text-[#FF7A00] bg-[#FF7A00]/10 px-3 py-2 rounded-lg">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Saving permission for {savingPermission}...
                  </div>
                )}
                <PermissionMatrix
                  permissions={admin.permissions as any}
                  onChange={handlePermissionChange}
                />
              </div>
            )}

            {tab === 'activity' && (
              <div className="p-5 space-y-3">
                <p className="text-xs font-bold text-[#6B6B80] uppercase tracking-wider mb-4">Recent Activity</p>
                <div className="relative">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-[#1E1E2E]" />
                  {MOCK_ACTIVITY.map((item, idx) => (
                    <div key={idx} className="flex gap-4 mb-5 last:mb-0">
                      <div className="w-8 h-8 rounded-lg bg-[#1A1A26] border border-[#2A2A3E] flex items-center justify-center shrink-0 relative z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm text-[#D0D0E0] leading-snug">{item.action}</p>
                        <p className="text-[10px] text-[#6B6B80] mt-1 uppercase tracking-wider">{formatRelativeTime(item.time)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="shrink-0 p-4 border-t border-[#1E1E2E] bg-[#111118] flex items-center justify-between gap-3">
            <button
              onClick={handleSuspend}
              className={cn(
                'flex-1 h-9 rounded-xl text-xs font-bold border transition-colors',
                admin.status === 'suspended'
                  ? 'border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/10'
                  : 'border-[#F59E0B]/30 text-[#F59E0B] hover:bg-[#F59E0B]/10'
              )}
            >
              {admin.status === 'suspended' ? 'Reactivate Admin' : 'Suspend Admin'}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-bold text-red-500 border border-red-500/30 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
