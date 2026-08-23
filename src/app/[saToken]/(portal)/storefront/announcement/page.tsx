'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Megaphone, Eye, EyeOff, Check, Clock, Globe, History, RefreshCw } from 'lucide-react'
import { useStorefrontStore } from '@/lib/store/storefront-store'
import { saAnnouncementBarSchema, type SAAnnouncementBarInput } from '@/lib/validators/sa-storefront.validators'
import { StorefrontPreviewFrame } from '@/components/super-admin/storefront/StorefrontPreviewFrame'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Past announcements for "Reuse" feature
const PAST_ANNOUNCEMENTS = [
  { id: 'past_001', message: '🎁 Republic Day Special — Flat ₹200 off on orders above ₹1499', backgroundColor: '#1A56DB', textColor: '#FFFFFF' },
  { id: 'past_002', message: '🚚 Free shipping on all orders this weekend only!', backgroundColor: '#16A34A', textColor: '#FFFFFF' },
  { id: 'past_003', message: '🎉 New artisans from Odisha just joined! Explore their crafts.', backgroundColor: '#7C3AED', textColor: '#FFFFFF' },
]

export default function AnnouncementBarPage() {
  const { announcementBar, updateAnnouncementBar, deactivateAnnouncementBar } = useStorefrontStore()
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop')
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<SAAnnouncementBarInput>({
    resolver: zodResolver(saAnnouncementBarSchema),
    defaultValues: {
      message: announcementBar?.message ?? '',
      linkText: announcementBar?.linkText ?? '',
      linkUrl: announcementBar?.linkUrl ?? '',
      backgroundColor: announcementBar?.backgroundColor ?? '#FF7A00',
      textColor: announcementBar?.textColor ?? '#FFFFFF',
      dismissible: announcementBar?.dismissible ?? true,
      displayPages: 'all',
    }
  })

  const watchedValues = watch()

  const onSubmit = async (data: SAAnnouncementBarInput) => {
    setSaving(true)
    await updateAnnouncementBar({ ...data, isActive: true })
    setSaving(false)
    toast.success('Announcement bar updated & activated')
  }

  const handleReuse = (past: typeof PAST_ANNOUNCEMENTS[0]) => {
    setValue('message', past.message)
    setValue('backgroundColor', past.backgroundColor)
    setValue('textColor', past.textColor)
    toast.info('Template loaded — review and save to publish')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center">
          <Megaphone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Announcement Bar</h1>
          <p className="text-sm text-[#6B6B80]">
            Status: <span className={cn('font-semibold', announcementBar?.isActive ? 'text-[#22C55E]' : 'text-[#6B6B80]')}>
              {announcementBar?.isActive ? '● Live' : '○ Hidden'}
            </span>
          </p>
        </div>
        {announcementBar?.isActive && (
          <button
            onClick={() => deactivateAnnouncementBar()}
            className="ml-auto flex items-center gap-1.5 h-9 px-3 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] rounded-xl text-sm font-semibold transition-colors"
          >
            <EyeOff className="w-3.5 h-3.5" /> Hide Bar
          </button>
        )}
      </div>

      {/* Live Preview at top */}
      <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5">
        <StorefrontPreviewFrame mode={previewMode} onModeChange={setPreviewMode} label="Live Preview">
          <div>
            {/* Announcement Bar Preview */}
            <div
              className="px-4 py-2.5 flex items-center justify-center gap-3 text-xs font-medium"
              style={{ backgroundColor: watchedValues.backgroundColor, color: watchedValues.textColor }}
            >
              <span>{watchedValues.message || 'Your announcement text will appear here...'}</span>
              {watchedValues.linkText && (
                <a className="underline font-bold">{watchedValues.linkText} →</a>
              )}
            </div>
            {/* Mini nav */}
            <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
              <span className="text-orange-500 font-bold text-sm">Bharat Bazaar</span>
              <span className="text-xs text-gray-400">Navigation</span>
            </div>
            <div className="bg-gray-50 px-4 py-6 text-center text-xs text-gray-400">Homepage content...</div>
          </div>
        </StorefrontPreviewFrame>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5 space-y-5">
            <h2 className="text-base font-bold text-white">Configuration</h2>

            {/* Message */}
            <div>
              <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">
                Message <span className="text-[#EF4444]">*</span>
              </label>
              <textarea
                {...register('message')}
                rows={2}
                placeholder="e.g. 🎉 Free shipping on orders above ₹999!"
                className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 py-2.5 text-sm text-white focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none resize-none"
              />
              <div className="flex justify-between mt-1">
                {errors.message && <p className="text-[#EF4444] text-xs">{errors.message.message}</p>}
                <p className="text-[#6B6B80] text-xs ml-auto">{watchedValues.message?.length || 0}/150</p>
              </div>
            </div>

            {/* Link Text + URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">Link Text (optional)</label>
                <input
                  {...register('linkText')}
                  placeholder="e.g. Shop Now"
                  className="w-full h-10 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">Link URL (optional)</label>
                <input
                  {...register('linkUrl')}
                  placeholder="e.g. /products"
                  className="w-full h-10 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none"
                />
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">Background Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" {...register('backgroundColor')} className="w-10 h-10 rounded-lg border border-[#2A2A3E] cursor-pointer bg-transparent" />
                  <input {...register('backgroundColor')} className="flex-1 h-10 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white font-mono focus:border-[#FF7A00] outline-none" />
                </div>
                {errors.backgroundColor && <p className="text-[#EF4444] text-xs mt-1">{errors.backgroundColor.message}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">Text Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" {...register('textColor')} className="w-10 h-10 rounded-lg border border-[#2A2A3E] cursor-pointer bg-transparent" />
                  <input {...register('textColor')} className="flex-1 h-10 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white font-mono focus:border-[#FF7A00] outline-none" />
                </div>
                {errors.textColor && <p className="text-[#EF4444] text-xs mt-1">{errors.textColor.message}</p>}
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" {...register('dismissible')} className="rounded border-[#3A3A50] bg-[#111118] text-[#FF7A00] focus:ring-[#FF7A00]/20 w-4 h-4" />
                <span className="text-sm text-[#A0A0B8]">Allow users to dismiss</span>
              </label>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#6B6B80]" />
                <select {...register('displayPages')} className="h-9 bg-[#1A1A26] border border-[#2A2A3E] rounded-lg px-2 text-sm text-white focus:border-[#FF7A00] outline-none">
                  <option value="all">All Pages</option>
                  <option value="homepage_only">Homepage Only</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full h-12 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] hover:opacity-90 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save & Activate'}
            </button>
          </form>
        </div>

        {/* Past announcements */}
        <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-[#6B6B80]" />
            <h2 className="text-sm font-bold text-white">Past Announcements</h2>
          </div>
          <p className="text-xs text-[#6B6B80] mb-4">Quickly reuse a previous announcement as a starting point.</p>
          <div className="space-y-3">
            {PAST_ANNOUNCEMENTS.map((past) => (
              <div key={past.id} className="p-3 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl">
                <div
                  className="text-xs px-2 py-1 rounded-md mb-2 truncate"
                  style={{ backgroundColor: past.backgroundColor, color: past.textColor }}
                >
                  {past.message}
                </div>
                <button
                  onClick={() => handleReuse(past)}
                  className="text-xs text-[#FF7A00] font-semibold flex items-center gap-1 hover:underline"
                >
                  <RefreshCw className="w-3 h-3" /> Reuse Template
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
