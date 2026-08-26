'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useSASessionStore } from '@/lib/store/sa-session-store'
import { useCurrentGrants } from '@/lib/hooks/useCurrentAdmin'
import { getAdminEffectivePanels } from '@/lib/store/selectors/access.selectors'
import { panelRequestSchema } from '@/lib/validators/panel-access.validator'
import type { PanelKey } from '@/types/super-admin.types'
import { AlertCircle, Loader2 } from 'lucide-react'

const PANEL_LABELS: Record<PanelKey, string> = {
  'dashboard': 'Dashboard', 'analytics': 'Analytics',
  'finance': 'Finance', 'finance.commissions': 'Finance – Commissions', 'finance.settlements': 'Finance – Settlements',
  'kyc-verification': 'KYC Verification', 'products': 'Products', 'reviews': 'Reviews',
  'sellers': 'Sellers', 'customers': 'Customers', 'orders': 'Orders', 'returns': 'Returns',
  'delivery': 'Delivery', 'coupons': 'Coupons', 'offers': 'Offers',
  'panel-requests': 'Panel Requests', 'settings': 'Settings', 'storefront': 'Storefront', 'audit-logs': 'Audit Logs',
  'notifications': 'Notifications', 'support': 'Support', 'admin-control': 'Admin Control',
}

const ALL_PANEL_KEYS: PanelKey[] = Object.keys(PANEL_LABELS) as PanelKey[]

type FormValues = z.infer<typeof panelRequestSchema>

interface RequestPanelAccessDialogProps {
  open: boolean
  onClose: () => void
  defaultPanel?: PanelKey
}

export function RequestPanelAccessDialog({ open, onClose, defaultPanel }: RequestPanelAccessDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const requestPanelAccess = useSASessionStore((s) => s.requestPanelAccess)
  const grants = useCurrentGrants()
  const effective = getAdminEffectivePanels(grants)

  // Filter out panels the user already has full access to
  const availablePanels = ALL_PANEL_KEYS.filter((key) => {
    if (key === 'dashboard') return false
    const existing = effective.find((g) => g.panel === key)
    return !existing || existing.level !== 'full'
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(panelRequestSchema),
    defaultValues: {
      panel: defaultPanel ?? availablePanels[0],
      level: 'view',
      reason: '',
    },
  })

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      await requestPanelAccess({
        panel: data.panel,
        level: data.level as 'view' | 'edit' | 'full',
        reason: data.reason,
      })
      form.reset()
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit request'
      form.setError('reason', { message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Request Panel Access</DialogTitle>
          <DialogDescription>
            Submit a request for additional panel access. Super Admin will review it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Panel */}
          <div className="space-y-1.5">
            <Label>Panel <span className="text-red-500">*</span></Label>
            <Select
              defaultValue={defaultPanel ?? availablePanels[0]}
              onValueChange={(v) => setValue('panel', v as PanelKey)}
            >
              <SelectTrigger className="h-11 rounded-xl border-2">
                <SelectValue placeholder="Select panel" />
              </SelectTrigger>
              <SelectContent>
                {availablePanels.map((key) => (
                  <SelectItem key={key} value={key}>{PANEL_LABELS[key]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.panel && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.panel.message}
              </p>
            )}
          </div>

          {/* Level */}
          <div className="space-y-1.5">
            <Label>Access Level <span className="text-red-500">*</span></Label>
            <Select defaultValue="view" onValueChange={(v) => setValue('level', v as 'view' | 'edit' | 'full')}>
              <SelectTrigger className="h-11 rounded-xl border-2">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View — Read only</SelectItem>
                <SelectItem value="edit">Edit — Read + Write</SelectItem>
                <SelectItem value="full">Full — Complete control</SelectItem>
              </SelectContent>
            </Select>
            {errors.level && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.level.message}
              </p>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <Label>Reason <span className="text-red-500">*</span></Label>
            <Textarea
              {...register('reason')}
              placeholder="Explain why you need this access (min. 20 characters)..."
              className="rounded-xl border-2 resize-none min-h-[90px]"
            />
            {errors.reason && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.reason.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#FF7A00] hover:bg-[#FF4500] text-white"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
