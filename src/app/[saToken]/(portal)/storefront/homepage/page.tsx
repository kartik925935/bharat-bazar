'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useParams } from 'next/navigation'
import {
  Home, ChevronUp, ChevronDown, Eye, EyeOff, Edit3,
  Plus, Trash2, GripVertical, Sparkles, Globe,
  Image as ImageIcon, Tag, Star, BarChart2, Shield,
  Mail, Zap, Check, X, ChevronRight, Save
} from 'lucide-react'
import { useStorefrontStore } from '@/lib/store/storefront-store'
import { StorefrontPreviewFrame } from '@/components/super-admin/storefront/StorefrontPreviewFrame'
import { ResponsiveSheet } from '@/components/ui/responsive-sheet'
import { EmptyState } from '@/components/super-admin/shared/EmptyState'
import { cn } from '@/lib/utils'
import type { SAHomepageSection, SAHeroSlide, HomepageSectionType } from '@/lib/mock/sa-storefront.mock'
import { format } from 'date-fns'

const SECTION_ICONS: Record<HomepageSectionType, React.ElementType> = {
  hero_carousel: ImageIcon,
  categories_grid: Tag,
  featured_products: Star,
  flash_sale: Zap,
  seller_stories: Sparkles,
  stats_counter: BarChart2,
  trust_badges: Shield,
  newsletter_bar: Mail,
}

const SECTION_LABELS: Record<HomepageSectionType, string> = {
  hero_carousel: 'Hero Carousel',
  categories_grid: 'Categories Grid',
  featured_products: 'Featured Products',
  flash_sale: 'Flash Sale',
  seller_stories: 'Seller Stories',
  stats_counter: 'Stats Counter',
  trust_badges: 'Trust Badges',
  newsletter_bar: 'Newsletter Bar',
}

// ─── Hero Slide Mini Preview ────────────────────────────────────────────────
function HeroPreview({ slides, mode }: { slides: SAHeroSlide[], mode: 'mobile' | 'desktop' }) {
  const [active, setActive] = useState(0)
  const activeSlides = slides.filter(s => s.isActive)
  if (activeSlides.length === 0) return (
    <div className="bg-gray-100 flex items-center justify-center h-32 text-gray-400 text-sm">No active slides</div>
  )
  const slide = activeSlides[active % activeSlides.length]
  const h = mode === 'desktop' ? 'h-40' : 'h-32'

  return (
    <div className={`relative ${h} bg-gradient-to-r from-orange-500 to-red-500 overflow-hidden`}>
      <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
        <h2 className={cn('font-bold leading-tight mb-1', mode === 'desktop' ? 'text-xl' : 'text-sm')}>{slide.headline}</h2>
        <p className={cn('opacity-90 mb-2', mode === 'desktop' ? 'text-sm' : 'text-xs')}>{slide.subheadline}</p>
        <button className="self-start px-3 py-1 bg-white text-orange-500 rounded-full text-xs font-bold">{slide.ctaText}</button>
      </div>
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {activeSlides.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} className={cn('w-1.5 h-1.5 rounded-full transition-colors', i === active % activeSlides.length ? 'bg-white' : 'bg-white/40')} />
        ))}
      </div>
    </div>
  )
}

// ─── Section Preview Block ──────────────────────────────────────────────────
function SectionPreviewBlock({ section, mode }: { section: SAHomepageSection, mode: 'mobile' | 'desktop' }) {
  const colors: Record<HomepageSectionType, string> = {
    hero_carousel: 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200',
    categories_grid: 'bg-purple-50 border-purple-200',
    featured_products: 'bg-blue-50 border-blue-200',
    flash_sale: 'bg-yellow-50 border-yellow-200',
    seller_stories: 'bg-green-50 border-green-200',
    stats_counter: 'bg-gray-50 border-gray-200',
    trust_badges: 'bg-teal-50 border-teal-200',
    newsletter_bar: 'bg-pink-50 border-pink-200',
  }
  const Icon = SECTION_ICONS[section.type]
  const h = mode === 'desktop' ? 'h-14' : 'h-10'

  return (
    <div className={cn('border flex items-center gap-2 px-3', h, colors[section.type])}>
      <Icon className="w-4 h-4 text-gray-500 shrink-0" />
      <span className="text-xs font-medium text-gray-600">{section.title}</span>
    </div>
  )
}

// ─── Section Row (in the manager list) ─────────────────────────────────────
function SectionRow({
  section,
  onEdit,
  onToggle,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  section: SAHomepageSection
  onEdit: () => void
  onToggle: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}) {
  const Icon = SECTION_ICONS[section.type]
  return (
    <div className={cn(
      'flex items-center gap-3 p-4 rounded-2xl border transition-all',
      section.isActive
        ? 'bg-[#111118] border-[#2A2A3E]'
        : 'bg-[#0A0A0F] border-[#1E1E2E] opacity-60'
    )}>
      {/* Drag handle (desktop hint) */}
      <GripVertical className="w-4 h-4 text-[#3A3A50] hidden md:block cursor-grab shrink-0" />

      {/* Mobile order controls */}
      <div className="flex flex-col gap-0.5 md:hidden shrink-0">
        <button onClick={onMoveUp} disabled={isFirst} aria-label="Move up" className="w-6 h-6 rounded-md flex items-center justify-center text-[#6B6B80] hover:bg-[#1E1E2E] disabled:opacity-30 transition-colors">
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button onClick={onMoveDown} disabled={isLast} aria-label="Move down" className="w-6 h-6 rounded-md flex items-center justify-center text-[#6B6B80] hover:bg-[#1E1E2E] disabled:opacity-30 transition-colors">
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Icon + Info */}
      <div className="w-9 h-9 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#FF7A00]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{section.title}</p>
        <p className="text-xs text-[#6B6B80]">{SECTION_LABELS[section.type]} · Edited {format(new Date(section.lastEditedAt), 'MMM d')} by {section.lastEditedBy}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onToggle}
          aria-label={section.isActive ? 'Deactivate section' : 'Activate section'}
          className={cn(
            'h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors',
            section.isActive
              ? 'bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20'
              : 'bg-[#3A3A50]/20 text-[#6B6B80] hover:bg-[#3A3A50]/40'
          )}
        >
          {section.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{section.isActive ? 'Live' : 'Hidden'}</span>
        </button>
        <button
          onClick={onEdit}
          aria-label="Edit section"
          className="h-8 px-2.5 rounded-lg bg-[#1E1E2E] hover:bg-[#2A2A3E] text-[#A0A0B8] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Edit</span>
        </button>
      </div>
    </div>
  )
}

// ─── Hero Slide Editor ──────────────────────────────────────────────────────
function HeroSlideEditor() {
  const { heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide, reorderHeroSlides } = useStorefrontStore()
  const [editingSlide, setEditingSlide] = useState<SAHeroSlide | null>(null)
  const [form, setForm] = useState({ headline: '', subheadline: '', ctaText: '', ctaLink: '', imageUrl: '' })
  const [saving, setSaving] = useState(false)

  const startEdit = (slide: SAHeroSlide) => {
    setEditingSlide(slide)
    setForm({ headline: slide.headline, subheadline: slide.subheadline, ctaText: slide.ctaText, ctaLink: slide.ctaLink, imageUrl: slide.imageUrl })
  }

  const handleSave = async () => {
    if (!editingSlide) return
    setSaving(true)
    await updateHeroSlide(editingSlide.id, form)
    setEditingSlide(null)
    setSaving(false)
  }

  return (
    <div className="space-y-3">
      {heroSlides.map((slide, idx) => (
        <div key={slide.id} className={cn('flex items-start gap-3 p-3.5 rounded-xl border', slide.isActive ? 'bg-[#1A1A26] border-[#2A2A3E]' : 'bg-[#111118] border-[#1E1E2E] opacity-60')}>
          <div className="w-16 h-10 rounded-lg bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center shrink-0 text-[#FF7A00]">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{slide.headline}</p>
            <p className="text-xs text-[#6B6B80] truncate">{slide.ctaText} → {slide.ctaLink}</p>
            {slide.scheduledStart && (
              <p className="text-[10px] text-[#F59E0B] mt-0.5">📅 {format(new Date(slide.scheduledStart), 'MMM d')} – {slide.scheduledEnd ? format(new Date(slide.scheduledEnd), 'MMM d') : '?'}</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => updateHeroSlide(slide.id, { isActive: !slide.isActive })}
              className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors', slide.isActive ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#3A3A50]/20 text-[#6B6B80]')}
            >
              {slide.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button onClick={() => startEdit(slide)} className="w-8 h-8 rounded-lg bg-[#1E1E2E] hover:bg-[#2A2A3E] flex items-center justify-center text-[#A0A0B8] hover:text-white transition-colors">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => deleteHeroSlide(slide.id)} className="w-8 h-8 rounded-lg bg-[#EF4444]/10 hover:bg-[#EF4444]/20 flex items-center justify-center text-[#EF4444] transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}

      {/* Edit form */}
      <AnimatePresence>
        {editingSlide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-[#1A1A26] border border-[#FF7A00]/30 rounded-xl space-y-3">
              <p className="text-sm font-semibold text-white">Editing: {editingSlide.headline}</p>
              {(['headline', 'subheadline', 'ctaText', 'ctaLink'] as const).map((field) => (
                <div key={field}>
                  <label className="text-xs text-[#6B6B80] font-medium capitalize block mb-1">{field.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    value={form[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    className="w-full h-10 bg-[#111118] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition-all"
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 h-9 px-4 bg-[#FF7A00] hover:bg-[#FF9A40] text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : <><Save className="w-3.5 h-3.5" /> Save Slide</>}
                </button>
                <button onClick={() => setEditingSlide(null)} className="h-9 px-3 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-[#A0A0B8] rounded-xl text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => addHeroSlide({ headline: 'New Slide', subheadline: 'Subtitle', ctaText: 'Shop Now', ctaLink: '/products', imageUrl: '', isActive: false })}
        className="w-full h-10 border border-dashed border-[#2A2A3E] hover:border-[#FF7A00]/40 rounded-xl text-xs font-semibold text-[#6B6B80] hover:text-[#FF7A00] flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Slide
      </button>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function HomepageBuilderPage() {
  const {
    homepageSections,
    heroSlides,
    reorderHomepageSections,
    toggleSectionActive,
    publishHomepageChanges,
  } = useStorefrontStore()

  const [editingSection, setEditingSection] = useState<SAHomepageSection | null>(null)
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop')
  const [showPreview, setShowPreview] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const sorted = [...homepageSections].sort((a, b) => a.order - b.order)

  const moveSection = (id: string, dir: 'up' | 'down') => {
    const ids = sorted.map(s => s.id)
    const idx = ids.indexOf(id)
    if (dir === 'up' && idx > 0) { [ids[idx-1], ids[idx]] = [ids[idx], ids[idx-1]] }
    if (dir === 'down' && idx < ids.length - 1) { [ids[idx+1], ids[idx]] = [ids[idx], ids[idx+1]] }
    reorderHomepageSections(ids)
  }

  const handlePublish = async () => {
    setPublishing(true)
    await publishHomepageChanges()
    setPublishing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Homepage Builder</h1>
            <p className="text-sm text-[#6B6B80]">{sorted.filter(s => s.isActive).length} of {sorted.length} sections live</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 h-10 px-4 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white rounded-xl text-sm font-semibold transition-colors border border-[#2A2A3E]"
          >
            <Eye className="w-4 h-4 text-[#FF7A00]" /> Preview
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] hover:opacity-90 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
          >
            <Globe className="w-4 h-4" />
            {publishing ? 'Publishing...' : 'Publish Changes'}
          </button>
        </div>
      </div>

      {/* Section list + side preview (desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Manager */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#6B6B80] uppercase tracking-wider">Page Sections</h2>
          {sorted.map((section, idx) => (
            <SectionRow
              key={section.id}
              section={section}
              onEdit={() => setEditingSection(section)}
              onToggle={() => toggleSectionActive(section.id)}
              onMoveUp={() => moveSection(section.id, 'up')}
              onMoveDown={() => moveSection(section.id, 'down')}
              isFirst={idx === 0}
              isLast={idx === sorted.length - 1}
            />
          ))}
        </div>

        {/* Desktop inline preview */}
        <div className="hidden lg:block">
          <StorefrontPreviewFrame mode={previewMode} onModeChange={setPreviewMode} label="Page Preview">
            <div className="font-sans">
              {/* Storefront Nav mockup */}
              <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
                <span className="text-orange-500 font-bold text-sm">Bharat Bazaar</span>
                <div className="flex gap-3 text-xs text-gray-500">
                  {previewMode === 'desktop' ? ['Shop','Categories','Artisans','Offers'].map(l => <span key={l}>{l}</span>) : <div className="w-4 h-3 flex flex-col gap-0.5"><div className="h-0.5 bg-gray-400" /><div className="h-0.5 bg-gray-400" /><div className="h-0.5 bg-gray-400" /></div>}
                </div>
              </div>
              {/* Sections in order */}
              {sorted.filter(s => s.isActive).map(section => (
                <div key={section.id}>
                  {section.type === 'hero_carousel'
                    ? <HeroPreview slides={heroSlides} mode={previewMode} />
                    : <SectionPreviewBlock section={section} mode={previewMode} />
                  }
                </div>
              ))}
            </div>
          </StorefrontPreviewFrame>
        </div>
      </div>

      {/* Section Edit Sheet */}
      <ResponsiveSheet
        isOpen={!!editingSection}
        onClose={() => setEditingSection(null)}
        title={editingSection ? `Edit: ${editingSection.title}` : ''}
        desktopWidth="w-[560px]"
      >
        {editingSection && (
          <div className="p-5 space-y-6">
            {editingSection.type === 'hero_carousel' && (
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Hero Slides</h3>
                <HeroSlideEditor />
              </div>
            )}
            {editingSection.type === 'stats_counter' && (
              <div className="space-y-4">
                <p className="text-xs text-[#6B6B80]">Override the numbers shown in the stats section.</p>
                {Object.entries(editingSection.config as Record<string, unknown>).map(([key, val]) => (
                  <div key={key}>
                    <label className="text-xs text-[#6B6B80] font-medium capitalize block mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      defaultValue={String(val)}
                      type="number"
                      className="w-full h-10 bg-[#111118] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
            {!['hero_carousel', 'stats_counter'].includes(editingSection.type) && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/10 flex items-center justify-center mb-3">
                  {React.createElement(SECTION_ICONS[editingSection.type], { className: 'w-6 h-6 text-[#FF7A00]' })}
                </div>
                <p className="text-sm font-semibold text-white mb-1">{SECTION_LABELS[editingSection.type]}</p>
                <p className="text-xs text-[#6B6B80]">This section is managed automatically from its source module.</p>
                <p className="text-xs text-[#6B6B80] mt-0.5">
                  {editingSection.type === 'flash_sale' && 'Configure via Offers → Flash Sales'}
                  {editingSection.type === 'featured_products' && 'Configure via Products → Featured'}
                  {editingSection.type === 'seller_stories' && 'Configure via Sellers → Stories'}
                  {editingSection.type === 'categories_grid' && 'Reflects active top-level categories'}
                  {editingSection.type === 'trust_badges' && 'Auto-generated from platform config'}
                  {editingSection.type === 'newsletter_bar' && 'Configure via Email Marketing settings'}
                </p>
              </div>
            )}
          </div>
        )}
      </ResponsiveSheet>

      {/* Full-screen preview (mobile opens sheet, desktop shows same) */}
      <ResponsiveSheet
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Storefront Preview"
        desktopWidth="w-[700px]"
      >
        <div className="p-5">
          <StorefrontPreviewFrame mode={previewMode} onModeChange={setPreviewMode}>
            <div className="font-sans">
              <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
                <span className="text-orange-500 font-bold text-sm">Bharat Bazaar</span>
                <span className="text-xs text-gray-400">Preview Mode</span>
              </div>
              {sorted.filter(s => s.isActive).map(section => (
                <div key={section.id}>
                  {section.type === 'hero_carousel'
                    ? <HeroPreview slides={heroSlides} mode={previewMode} />
                    : <SectionPreviewBlock section={section} mode={previewMode} />
                  }
                </div>
              ))}
            </div>
          </StorefrontPreviewFrame>
        </div>
      </ResponsiveSheet>
    </div>
  )
}
