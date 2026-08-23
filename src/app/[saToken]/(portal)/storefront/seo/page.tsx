'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, Save, AlertTriangle, CheckCircle, RefreshCw, Eye } from 'lucide-react'
import { useStorefrontStore } from '@/lib/store/storefront-store'
import { saSEOConfigSchema, type SASEOConfigInput } from '@/lib/validators/sa-storefront.validators'
import type { SASEOPageConfig } from '@/lib/mock/sa-storefront.mock'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

function SERPPreview({ title, description, url }: { title: string; description: string; url: string }) {
  const truncTitle = title.length > 60 ? title.slice(0, 57) + '...' : title
  const truncDesc = description.length > 155 ? description.slice(0, 152) + '...' : description

  return (
    <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] font-sans">
      <p className="text-[11px] text-[#666] mb-0.5">{url || 'bharatbazaar.in › page'}</p>
      <p className={cn('text-[#1A0DAB] text-base font-medium leading-snug', title.length > 60 && 'text-[#EF4444]')}>
        {truncTitle || <span className="text-gray-400 italic">Title will appear here</span>}
      </p>
      <p className="text-[13px] text-[#545454] leading-snug mt-0.5">
        {truncDesc || <span className="text-gray-400 italic">Description will appear here...</span>}
      </p>
      {title.length > 60 && <p className="text-[10px] text-[#EF4444] mt-1">⚠ Title too long ({title.length}/60 chars)</p>}
      {description.length > 155 && <p className="text-[10px] text-[#EF4444]">⚠ Description too long ({description.length}/155 chars)</p>}
    </div>
  )
}

function SEOConfigEditor({ config, onSave }: { config: SASEOPageConfig; onSave: () => void }) {
  const { updateSEOConfig } = useStorefrontStore()
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SASEOConfigInput>({
    resolver: zodResolver(saSEOConfigSchema),
    defaultValues: {
      metaTitleTemplate: config.metaTitleTemplate,
      metaDescriptionTemplate: config.metaDescriptionTemplate,
      noIndex: config.noIndex,
    }
  })
  const watchedTitle = watch('metaTitleTemplate')
  const watchedDesc = watch('metaDescriptionTemplate')
  const watchedNoIndex = watch('noIndex')
  const [saving, setSaving] = useState(false)

  const onSubmit = async (data: SASEOConfigInput) => {
    setSaving(true)
    await updateSEOConfig(config.id, data)
    onSave()
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4 border-t border-[#2A2A3E]">
      {/* Live SERP Preview */}
      <div>
        <p className="text-xs font-semibold text-[#6B6B80] uppercase tracking-wider mb-2">Google SERP Preview</p>
        <SERPPreview
          title={watchedTitle.replace(/\{\{[^}]+\}\}/g, '[value]')}
          description={watchedDesc.replace(/\{\{[^}]+\}\}/g, '[value]')}
          url={`bharatbazaar.in${config.routePattern.replace('[slug]', 'example')}`}
        />
      </div>

      {/* Token hint */}
      <div className="p-3 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl">
        <p className="text-[11px] text-[#6B6B80]">
          <span className="text-[#FF9A40] font-semibold">Token support: </span>
          Use <code className="bg-[#111118] px-1 rounded">{'{{productName}}'}</code>, <code className="bg-[#111118] px-1 rounded">{'{{sellerName}}'}</code>, <code className="bg-[#111118] px-1 rounded">{'{{categoryName}}'}</code>, <code className="bg-[#111118] px-1 rounded">{'{{price}}'}</code> for dynamic pages.
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="text-xs font-semibold text-[#A0A0B8] flex items-center justify-between mb-1.5">
          <span>Meta Title Template <span className="text-[#EF4444]">*</span></span>
          <span className={cn('text-xs', watchedTitle?.length > 60 ? 'text-[#EF4444]' : 'text-[#6B6B80]')}>{watchedTitle?.length || 0}/70</span>
        </label>
        <input
          {...register('metaTitleTemplate')}
          className="w-full h-11 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none"
        />
        {errors.metaTitleTemplate && <p className="text-[#EF4444] text-xs mt-1">{errors.metaTitleTemplate.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-semibold text-[#A0A0B8] flex items-center justify-between mb-1.5">
          <span>Meta Description Template <span className="text-[#EF4444]">*</span></span>
          <span className={cn('text-xs', watchedDesc?.length > 155 ? 'text-[#EF4444]' : 'text-[#6B6B80]')}>{watchedDesc?.length || 0}/160</span>
        </label>
        <textarea
          {...register('metaDescriptionTemplate')}
          rows={3}
          className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 py-2.5 text-sm text-white focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none resize-none"
        />
        {errors.metaDescriptionTemplate && <p className="text-[#EF4444] text-xs mt-1">{errors.metaDescriptionTemplate.message}</p>}
      </div>

      {/* noIndex */}
      <div className="flex items-start gap-3">
        <input type="checkbox" {...register('noIndex')} id={`noIndex-${config.id}`} className="w-4 h-4 mt-0.5 rounded border-[#3A3A50] bg-[#111118] text-[#FF7A00]" />
        <label htmlFor={`noIndex-${config.id}`} className="text-sm text-[#A0A0B8] cursor-pointer">
          Block from search engines (noindex)
          {watchedNoIndex && (
            <span className="ml-2 px-2 py-0.5 bg-[#EF4444]/10 text-[#EF4444] text-[10px] font-bold rounded-full">
              ⚠ Hidden from Google
            </span>
          )}
        </label>
      </div>

      <button type="submit" disabled={saving} className="w-full h-11 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? 'Saving...' : 'Save SEO Config'}
      </button>
    </form>
  )
}

export default function SEOManagerPage() {
  const { seoConfigs } = useStorefrontStore()
  const [expandedId, setExpandedId] = useState<string | null>(seoConfigs[0]?.id ?? null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">SEO Manager</h1>
          <p className="text-sm text-[#6B6B80]">Manage meta titles, descriptions & indexing per route</p>
        </div>
      </div>

      {/* Sitemap card */}
      <div className="flex items-center justify-between p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl">
        <div>
          <p className="text-sm font-semibold text-white">XML Sitemap</p>
          <p className="text-xs text-[#6B6B80]">Last generated: 2 hours ago · 248 URLs indexed</p>
        </div>
        <button className="flex items-center gap-2 h-9 px-4 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white rounded-xl text-xs font-semibold transition-colors">
          <RefreshCw className="w-3.5 h-3.5 text-[#FF7A00]" /> Regenerate
        </button>
      </div>

      {/* Config list */}
      <div className="space-y-3">
        {seoConfigs.map(config => (
          <div key={config.id} className="bg-[#111118] border border-[#2A2A3E] rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === config.id ? null : config.id)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-white">{config.label}</p>
                  <code className="text-[10px] text-[#6B6B80] bg-[#1A1A26] px-1.5 py-0.5 rounded-md font-mono">{config.routePattern}</code>
                  {config.noIndex && (
                    <span className="px-1.5 py-0.5 bg-[#EF4444]/10 text-[#EF4444] text-[10px] font-bold rounded-full">noindex</span>
                  )}
                </div>
                <p className="text-xs text-[#6B6B80] mt-0.5 truncate">{config.metaTitleTemplate}</p>
              </div>
              <div className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all', expandedId === config.id ? 'rotate-180' : '')}>
                <CheckCircle className={cn('w-4 h-4', config.noIndex ? 'text-[#EF4444]' : 'text-[#22C55E]')} />
              </div>
            </button>

            {expandedId === config.id && (
              <div className="px-4 pb-5">
                <SEOConfigEditor config={config} onSave={() => {}} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
