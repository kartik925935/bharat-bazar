'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Context ──────────────────────────────────────────────────────────────────
const DialogContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({ open: false, onOpenChange: () => {} })

// ── Dialog (root) ─────────────────────────────────────────────────────────────
interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Dialog({ open = false, onOpenChange = () => {}, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

// ── DialogPortal / Overlay / Content ─────────────────────────────────────────
function DialogContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open, onOpenChange } = React.useContext(DialogContext)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl p-6 animate-in fade-in-0 zoom-in-95',
          className
        )}
        {...props}
      >
        {/* Close button */}
        <button
          type="button"
          aria-label="Close dialog"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 rounded-lg p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  )
}

// ── DialogHeader ──────────────────────────────────────────────────────────────
function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1.5 mb-4', className)} {...props} />
  )
}

// ── DialogTitle ───────────────────────────────────────────────────────────────
function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn('text-lg font-semibold text-zinc-900 dark:text-white', className)} {...props} />
  )
}

// ── DialogDescription ─────────────────────────────────────────────────────────
function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-zinc-500 dark:text-zinc-400', className)} {...props} />
  )
}

// ── DialogFooter ──────────────────────────────────────────────────────────────
function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex justify-end gap-2 mt-4', className)} {...props} />
  )
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
