'use client'
import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { cn } from '@/lib/utils'

interface ResponsiveSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  /** Width class for the desktop side panel (default: w-[640px]) */
  desktopWidth?: string
}

/**
 * ResponsiveSheet
 * - Mobile: full-screen bottom sheet with swipe-down-to-dismiss, drag handle, max-height 92dvh
 * - Desktop: right-side fixed panel
 * Single API, used everywhere a "drawer" or "detail modal" appears.
 */
export function ResponsiveSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
  desktopWidth = 'w-[640px]',
}: ResponsiveSheetProps) {
  const isMobile = useIsMobile()
  const initialY = useRef(0)
  const currentY = useRef(0)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120 || info.velocity.y > 600) onClose()
              }}
              className={cn(
                'fixed inset-x-0 bottom-0 z-[61] bg-[#0D0D14] border-t border-[#2A2A3E] rounded-t-3xl shadow-2xl flex flex-col',
                'max-h-[92dvh]',
                className
              )}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing touch-none">
                <div className="w-10 h-1 rounded-full bg-[#2A2A3E]" />
              </div>
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#1E1E2E] shrink-0">
                  <h2 className="text-base font-bold text-white">{title}</h2>
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B80] hover:bg-white/5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="overflow-y-auto flex-1 overscroll-contain">
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

  // Desktop: right-side panel
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed right-0 top-0 bottom-0 z-[61] bg-[#0D0D14] border-l border-[#2A2A3E] shadow-2xl flex flex-col overflow-hidden',
              desktopWidth,
              className
            )}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E2E] shrink-0">
                <h2 className="text-lg font-bold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B80] hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="overflow-y-auto flex-1">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
