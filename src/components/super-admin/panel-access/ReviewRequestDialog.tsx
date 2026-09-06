'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useSASessionStore } from '@/lib/store/sa-session-store'
import { reviewRequestSchema } from '@/lib/validators/panel-access.validator'
import type { SAPanelRequest } from '@/types/super-admin.types'
import { AlertCircle, Check, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type FormValues = z.infer<typeof reviewRequestSchema>

interface ReviewRequestDialogProps {
  open: boolean
  onClose: () => void
  request: SAPanelRequest | null
}

export function ReviewRequestDialog({ open, onClose, request }: ReviewRequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const reviewPanelRequest = useSASessionStore((s) => s.reviewPanelRequest)

  const form = useForm<FormValues>({
    resolver: zodResolver(reviewRequestSchema),
    defaultValues: { decision: 'approved', reviewNote: '' },
  })

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form
  const decision = watch('decision')

  const onSubmit = async (data: FormValues) => {
    if (!request) return
    setIsSubmitting(true)
    try {
      await reviewPanelRequest({
        requestId: request.id,
        decision: data.decision,
        reviewNote: data.reviewNote,
      })
      form.reset()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Review Access Request</DialogTitle>
        </DialogHeader>

        {request && (
          <div className="bg-gray-50 rounded-xl p-3 mb-2 text-sm space-y-1">
            <p><span className="font-medium">Admin:</span> {request.adminName}</p>
            <p><span className="font-medium">Panel:</span> {request.requestedPanel}</p>
            <p><span className="font-medium">Level:</span> {request.requestedLevel}</p>
            <p><span className="font-medium">Reason:</span> {request.reason}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Decision <span className="text-red-500">*</span></Label>
            <RadioGroup
              value={decision}
              onValueChange={(v) => setValue('decision', v as 'approved' | 'rejected')}
              className="flex gap-4"
            >
              <label className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer flex-1 transition-colors',
                decision === 'approved' ? 'border-green-500 bg-green-50' : 'border-gray-200'
              )}>
                <RadioGroupItem value="approved" className="sr-only" />
                <Check className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-700">Approve</span>
              </label>
              <label className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer flex-1 transition-colors',
                decision === 'rejected' ? 'border-red-500 bg-red-50' : 'border-gray-200'
              )}>
                <RadioGroupItem value="rejected" className="sr-only" />
                <X className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-700">Reject</span>
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-1.5">
            <Label>
              Note {decision === 'rejected' && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              {...register('reviewNote')}
              placeholder={decision === 'rejected' ? 'Reason for rejection (required)...' : 'Optional note...'}
              className="rounded-xl border-2 resize-none min-h-[80px]"
            />
            {errors.reviewNote && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.reviewNote.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'rounded-xl text-white',
                decision === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              )}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {decision === 'approved' ? 'Approve' : 'Reject'} Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
