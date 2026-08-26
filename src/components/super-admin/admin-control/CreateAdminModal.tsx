'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useSAStore } from '@/lib/store/super-admin-store'
import { buildDefaultGrants } from '@/lib/constants/sa-permissions'
import type { SAAdminRole, SAPanelAccessGrant } from '@/types/super-admin.types'

interface CreateAdminModalProps {
  open: boolean
  onClose: () => void
}

type FormData = { name: string; email: string; department: string }

const ROLE_CONFIGS: { role: SAAdminRole; label: string; description: string; keyPanels: string[] }[] = [
  { role: 'SENIOR_ADMIN', label: 'Senior Admin', description: 'Broad platform oversight across most modules', keyPanels: ['Orders (Full)', 'Sellers (Edit)', 'Support (Full)'] },
  { role: 'OPERATIONS_ADMIN', label: 'Operations Admin', description: 'Manages orders, delivery and daily ops', keyPanels: ['Orders (Full)', 'Delivery (Full)', 'Products (Edit)'] },
  { role: 'SUPPORT_ADMIN', label: 'Support Admin', description: 'Handles customer support and tickets', keyPanels: ['Support (Full)', 'Reviews (Edit)', 'Customers (View)'] },
  { role: 'FINANCE_ADMIN', label: 'Finance Admin', description: 'Finance, settlements, coupons and analytics', keyPanels: ['Finance (Full)', 'Coupons (Full)', 'Analytics (Full)'] },
  { role: 'CONTENT_ADMIN', label: 'Content Admin', description: 'Manages product catalogue and reviews', keyPanels: ['Products (Full)', 'Reviews (Full)', 'Offers (View)'] },
  { role: 'DELIVERY_ADMIN', label: 'Delivery Admin', description: 'Oversees delivery partners and logistics', keyPanels: ['Delivery (Full)', 'Orders (View)', 'Analytics (View)'] },
  { role: 'CUSTOM_ADMIN', label: 'Custom Admin', description: 'Create a role with custom permissions later', keyPanels: ['None (Set Later)'] },
]

export function CreateAdminModal({ open, onClose }: CreateAdminModalProps) {
  const [selectedRole, setSelectedRole] = useState<SAAdminRole>('OPERATIONS_ADMIN')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { admins } = useSAStore()

  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<FormData>({
    mode: 'onChange',
  })

  const handleClose = () => {
    reset()
    setSelectedRole('OPERATIONS_ADMIN')
    onClose()
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    // TODO: trigger Supabase invite email via Resend
    // TODO: logAuditEvent({ action: 'admin_created', ... })
    const newAdmin = {
      id: `adm_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: selectedRole,
      department: data.department,
      status: 'pending' as const,
      permissions: buildDefaultGrants(selectedRole),
      createdAt: new Date().toISOString(),
      lastActive: '—',
      createdBy: 'Arjun Mehta', // would come from current SA session
    }
    // Directly mutate the store by faking an update
    setIsSubmitting(false)
    toast.success(`Invitation sent to ${data.email}`, {
      description: `${data.name} will be listed as Pending until they accept.`,
    })
    handleClose()
  }

  const defaultPerms = buildDefaultGrants(selectedRole)
  const fullPanels = defaultPerms.filter((p) => p.level === 'full').map((p) => p.panel)
  const editPanels = defaultPerms.filter((p) => p.level === 'edit').map((p) => p.panel)
  const viewPanels = defaultPerms.filter((p) => p.level === 'view').map((p) => p.panel)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-[#0D0D14] border border-[#1E1E2E] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#1E1E2E] bg-[#0D0D14] z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF7A00]/20 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-[#FF7A00]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Invite New Admin</h2>
                  <p className="text-[10px] text-[#6B6B80]">An invitation email will be sent to the new admin</p>
                </div>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-lg text-[#6B6B80] hover:text-white hover:bg-white/5 flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2A2A3E]">
                {/* Section 1 */}
              <div>
                <h3 className="text-[10px] font-black text-[#6B6B80] uppercase tracking-widest mb-4">1 — Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8B8B9E]">Full Name <span className="text-red-500">*</span></label>
                    <input
                      {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
                      placeholder="e.g. Vikram Singh"
                      className="w-full h-10 bg-[#1A1A26] border border-[#2A2A3E] focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 rounded-xl px-3 text-sm text-white outline-none transition-all placeholder:text-[#5A5A70]"
                    />
                    {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8B8B9E]">Work Email <span className="text-red-500">*</span></label>
                    <input
                      {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                      type="email"
                      placeholder="e.g. vikram@bharatbazaar.com"
                      className="w-full h-10 bg-[#1A1A26] border border-[#2A2A3E] focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 rounded-xl px-3 text-sm text-white outline-none transition-all placeholder:text-[#5A5A70]"
                    />
                    {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-[#8B8B9E]">Department <span className="text-red-500">*</span></label>
                    <input
                      {...register('department', { required: 'Department is required' })}
                      placeholder="e.g. Platform Operations"
                      className="w-full h-10 bg-[#1A1A26] border border-[#2A2A3E] focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 rounded-xl px-3 text-sm text-white outline-none transition-all placeholder:text-[#5A5A70]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2 — Role Selector */}
              <div>
                <h3 className="text-[10px] font-black text-[#6B6B80] uppercase tracking-widest mb-4">2 — Assign Role</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROLE_CONFIGS.map((config) => {
                    const isSelected = selectedRole === config.role
                    return (
                      <button
                        key={config.role}
                        type="button"
                        onClick={() => setSelectedRole(config.role)}
                        className={cn(
                          'text-left p-4 rounded-xl border transition-all relative',
                          isSelected
                            ? 'border-[#F5C842] bg-[#F5C842]/5'
                            : 'border-[#2A2A3E] hover:border-[#3A3A50] bg-[#111118]'
                        )}
                      >
                        {isSelected && (
                          <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#F5C842] flex items-center justify-center">
                            <Check className="w-3 h-3 text-[#1C1B14]" />
                          </span>
                        )}
                        <p className={cn('text-sm font-bold mb-1', isSelected ? 'text-[#F5C842]' : 'text-white')}>
                          {config.label}
                        </p>
                        <p className="text-[10px] text-[#8B8B9E] mb-2 leading-relaxed">{config.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {config.keyPanels.map((p) => (
                            <span key={p} className="text-[9px] font-bold px-1.5 py-0.5 bg-white/5 text-[#A0A0B8] rounded-full border border-white/10">{p}</span>
                          ))}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Section 3 — Permission Preview */}
              <div className="border border-[#2A2A3E] rounded-xl p-4 bg-[#111118]">
                <h3 className="text-[10px] font-black text-[#6B6B80] uppercase tracking-widest mb-3">Default Permissions Preview</h3>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <p className="font-bold text-[#F59E0B] mb-1.5">Full Access</p>
                    {fullPanels.length === 0 ? <p className="text-[#5A5A70]">None</p> : fullPanels.map((p) => (
                      <p key={p} className="text-[#D0D0E0] capitalize">{p.replace(/-/g, ' ')}</p>
                    ))}
                  </div>
                  <div>
                    <p className="font-bold text-[#FF7A00] mb-1.5">Edit</p>
                    {editPanels.length === 0 ? <p className="text-[#5A5A70]">None</p> : editPanels.map((p) => (
                      <p key={p} className="text-[#D0D0E0] capitalize">{p.replace(/-/g, ' ')}</p>
                    ))}
                  </div>
                  <div>
                    <p className="font-bold text-[#3B82F6] mb-1.5">View</p>
                    {viewPanels.length === 0 ? <p className="text-[#5A5A70]">None</p> : viewPanels.map((p) => (
                      <p key={p} className="text-[#D0D0E0] capitalize">{p.replace(/-/g, ' ')}</p>
                    ))}
                  </div>
                </div>
                <p className="text-[9px] text-[#5A5A70] mt-3 pt-3 border-t border-[#1E1E2E]">You can customize these permissions after the admin is created.</p>
              </div>

              </div>

              {/* Submit */}
              <div className="p-5 border-t border-[#1E1E2E] bg-[#0D0D14] flex gap-3 z-10 shrink-0">
                <button type="button" onClick={handleClose} className="flex-1 h-11 rounded-xl text-sm font-bold text-[#6B6B80] border border-[#2A2A3E] hover:border-[#3A3A50] hover:text-white transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="flex-1 h-11 rounded-xl text-sm font-bold bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#FF7A00]/20 transition-opacity"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {isSubmitting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
