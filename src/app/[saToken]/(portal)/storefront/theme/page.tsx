'use client'
import React, { useState, useEffect } from 'react'
import { Palette, RefreshCw, Check, Eye, Sun, Moon, Type } from 'lucide-react'
import { useStorefrontStore } from '@/lib/store/storefront-store'
import { StorefrontPreviewFrame } from '@/components/super-admin/storefront/StorefrontPreviewFrame'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const FONT_OPTIONS = [
  { id: 'inter', label: 'Inter', preview: 'The quick brown fox', class: 'font-sans' },
  { id: 'poppins', label: 'Poppins', preview: 'The quick brown fox', class: 'font-sans' },
  { id: 'lato', label: 'Lato', preview: 'The quick brown fox', class: 'font-sans' },
  { id: 'system', label: 'System Default', preview: 'The quick brown fox', class: 'font-sans' },
] as const

const PALETTE_PRESETS = [
  { name: 'Bharat Orange', primary: '#FF7A00', secondary: '#F5C842', accent: '#FF4500' },
  { name: 'Royal Indigo', primary: '#6366F1', secondary: '#818CF8', accent: '#4F46E5' },
  { name: 'Forest Green', primary: '#22C55E', secondary: '#A3E635', accent: '#16A34A' },
  { name: 'Regal Purple', primary: '#8B5CF6', secondary: '#C4B5FD', accent: '#7C3AED' },
  { name: 'Crimson Red', primary: '#EF4444', secondary: '#FCA5A5', accent: '#DC2626' },
]

function ColorSwatch({ label, field, value, onChange }: {
  label: string
  field: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-[#A0A0B8] block">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-12 h-12 rounded-xl border border-[#2A2A3E] cursor-pointer bg-transparent"
        />
        <div>
          <input
            type="text"
            value={value}
            onChange={e => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && onChange(e.target.value)}
            className="w-28 h-10 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white font-mono focus:border-[#FF7A00] outline-none"
          />
          <div
            className="h-2 rounded-full mt-1"
            style={{ background: value, opacity: 0.7 }}
          />
        </div>
      </div>
    </div>
  )
}

// Mini storefront preview populated with current theme values
function StorefrontThemePreview({
  primary, secondary, accent, font
}: {
  primary: string; secondary: string; accent: string; font: string
}) {
  return (
    <div className={cn('font-sans bg-[#FAFAF8] text-[#1C1B14] overflow-hidden rounded-xl')} style={{ fontFamily: font === 'system' ? 'system-ui' : font }}>
      {/* Nav */}
      <nav className="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }} />
          <span className="text-sm font-extrabold" style={{ color: primary }}>Bharat Bazaar</span>
        </div>
        <div className="flex gap-3 text-xs text-gray-500">
          <span>Shop</span><span>Artisans</span>
          <span className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold" style={{ background: accent }}>Sale</span>
        </div>
      </nav>
      {/* Hero */}
      <div className="px-4 py-6 text-white" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
        <p className="text-xs font-bold mb-1">🎉 Exclusive Artisan Collection</p>
        <p className="text-[11px] opacity-80">Handcrafted with love from India's villages</p>
        <button className="mt-3 px-4 py-1.5 bg-white text-xs font-bold rounded-full" style={{ color: primary }}>
          Shop Now →
        </button>
      </div>
      {/* Category chips */}
      <div className="px-4 py-3 flex gap-2 overflow-x-hidden">
        {['Pottery', 'Handloom', 'Jewellery'].map((cat, i) => (
          <div key={cat} className={cn('px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap')}
            style={{ background: i === 0 ? primary : secondary, color: i === 0 ? 'white' : '#1C1B14' }}
          >
            {cat}
          </div>
        ))}
      </div>
      {/* Product card */}
      <div className="mx-4 mb-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="h-16 rounded-lg mb-2" style={{ background: `${secondary}40` }} />
        <p className="text-xs font-semibold">Handmade Clay Diya Set</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm font-bold" style={{ color: primary }}>₹349</p>
          <button className="text-[10px] px-2 py-1 rounded-full text-white font-bold" style={{ background: primary }}>Add</button>
        </div>
      </div>
    </div>
  )
}

export default function ThemeBrandingPage() {
  const { storefrontTheme, updateStorefrontTheme } = useStorefrontStore()
  const [localTheme, setLocalTheme] = useState(storefrontTheme)
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop')
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const updateLocal = (partial: Partial<typeof localTheme>) => {
    setLocalTheme(t => ({ ...t, ...partial }))
    setIsDirty(true)
  }

  const handleSave = async () => {
    setSaving(true)
    await updateStorefrontTheme(localTheme)
    setIsDirty(false)
    setSaving(false)
  }

  const applyPreset = (preset: typeof PALETTE_PRESETS[0]) => {
    updateLocal({ primaryColor: preset.primary, secondaryColor: preset.secondary, accentColor: preset.accent })
    toast.info(`${preset.name} palette applied — save to publish`)
  }

  const handleReset = () => {
    setLocalTheme(storefrontTheme)
    setIsDirty(false)
    toast.info('Changes reverted to saved theme')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#8B5CF6] flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Theme & Branding</h1>
            <p className="text-sm text-[#6B6B80]">Colors, typography, and storefront identity</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <button onClick={handleReset} className="h-10 px-3 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-[#A0A0B8] rounded-xl text-sm font-semibold transition-colors">
              Reset
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] hover:opacity-90 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Saving...' : isDirty ? 'Save Theme' : 'Saved'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          {/* Palette Presets */}
          <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">Quick Palette Presets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PALETTE_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-3 p-3 bg-[#1A1A26] hover:bg-[#2A2A3E] border border-[#2A2A3E] hover:border-[#FF7A00]/30 rounded-xl transition-all text-left"
                >
                  <div className="flex gap-1 shrink-0">
                    {[preset.primary, preset.secondary, preset.accent].map((color, i) => (
                      <div key={i} className="w-4 h-4 rounded-full" style={{ background: color }} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#A0A0B8]">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Pickers */}
          <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5 space-y-5">
            <h2 className="text-sm font-bold text-white">Custom Colors</h2>
            <ColorSwatch label="Primary Color" field="primaryColor" value={localTheme.primaryColor} onChange={v => updateLocal({ primaryColor: v })} />
            <ColorSwatch label="Secondary Color" field="secondaryColor" value={localTheme.secondaryColor} onChange={v => updateLocal({ secondaryColor: v })} />
            <ColorSwatch label="Accent Color" field="accentColor" value={localTheme.accentColor} onChange={v => updateLocal({ accentColor: v })} />
          </div>

          {/* Typography */}
          <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Type className="w-4 h-4 text-[#FF7A00]" /> Font Family
            </h2>
            <div className="space-y-2">
              {FONT_OPTIONS.map(font => (
                <button
                  key={font.id}
                  onClick={() => updateLocal({ fontFamily: font.id as any })}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left',
                    localTheme.fontFamily === font.id
                      ? 'bg-[#FF7A00]/10 border-[#FF7A00]/30'
                      : 'bg-[#1A1A26] border-[#2A2A3E] hover:border-[#3A3A50]'
                  )}
                >
                  <div>
                    <p className={cn('text-sm font-semibold text-white', font.class)}>{font.label}</p>
                    <p className={cn('text-xs text-[#6B6B80]', font.class)}>{font.preview}</p>
                  </div>
                  {localTheme.fontFamily === font.id && <Check className="w-4 h-4 text-[#FF7A00] shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5">
          <StorefrontPreviewFrame mode={previewMode} onModeChange={setPreviewMode} label="Live Theme Preview">
            <StorefrontThemePreview
              primary={localTheme.primaryColor}
              secondary={localTheme.secondaryColor}
              accent={localTheme.accentColor}
              font={localTheme.fontFamily}
            />
          </StorefrontPreviewFrame>
        </div>
      </div>
    </div>
  )
}
