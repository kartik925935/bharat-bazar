'use client'
import React from 'react'
import { Monitor, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'

type PreviewMode = 'mobile' | 'desktop'

interface StorefrontPreviewFrameProps {
  mode: PreviewMode
  onModeChange: (mode: PreviewMode) => void
  children: React.ReactNode
  label?: string
}

/**
 * StorefrontPreviewFrame
 * Renders a device-frame chrome (mobile/desktop) with mode toggle.
 * Shows a scaled-down reproduction of the storefront UI.
 * This is NOT an iframe of the live site — it renders React children
 * with actual config data for a real "what you see is what you get" experience.
 */
export function StorefrontPreviewFrame({
  mode,
  onModeChange,
  children,
  label = 'Live Preview',
}: StorefrontPreviewFrameProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Mode toggle pill */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B6B80] uppercase tracking-wider">{label}</span>
        <div className="flex items-center bg-[#1A1A26] border border-[#2A2A3E] rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => onModeChange('desktop')}
            aria-label="Desktop preview"
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
              mode === 'desktop'
                ? 'bg-[#FF7A00] text-white shadow'
                : 'text-[#6B6B80] hover:text-white'
            )}
          >
            <Monitor className="w-3.5 h-3.5" />
            Desktop
          </button>
          <button
            onClick={() => onModeChange('mobile')}
            aria-label="Mobile preview"
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
              mode === 'mobile'
                ? 'bg-[#FF7A00] text-white shadow'
                : 'text-[#6B6B80] hover:text-white'
            )}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile
          </button>
        </div>
      </div>

      {/* Device frame */}
      <div className="flex justify-center">
        {mode === 'desktop' ? (
          /* Desktop frame */
          <div className="w-full max-w-2xl">
            {/* Browser chrome */}
            <div className="bg-[#1A1A26] border border-[#2A2A3E] rounded-t-xl px-3 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/60" />
              </div>
              <div className="flex-1 bg-[#111118] rounded-md px-3 py-1 text-[10px] text-[#6B6B80]">
                bharatbazaar.in
              </div>
            </div>
            {/* Content */}
            <div className="border border-t-0 border-[#2A2A3E] rounded-b-xl overflow-hidden bg-white min-h-[200px]">
              <div className="transform origin-top scale-100 overflow-hidden">
                {children}
              </div>
            </div>
          </div>
        ) : (
          /* Mobile frame */
          <div className="w-[280px]">
            {/* Phone chrome */}
            <div className="bg-[#1A1A26] border border-[#2A2A3E] rounded-[2rem] p-2 shadow-2xl">
              {/* Notch */}
              <div className="flex justify-center mb-1">
                <div className="w-16 h-4 bg-[#111118] rounded-full" />
              </div>
              {/* Screen */}
              <div className="rounded-[1.5rem] overflow-hidden bg-white min-h-[400px]">
                {children}
              </div>
              {/* Home indicator */}
              <div className="flex justify-center mt-2">
                <div className="w-16 h-1 bg-[#2A2A3E] rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
