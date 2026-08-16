'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, ChevronDown, Copy, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { exportToCSV, downloadCSV, exportToJSON, copyToClipboard, generateFilename } from '@/lib/utils/export'

interface ExportButtonProps<T> {
  data: T[]
  filename: string
  columns: { key: string; header: string; accessor: (row: T) => string | number }[]
  visibleData?: T[]   // for "Export Visible Rows Only"
  className?: string
}

export function ExportButton<T>({
  data,
  filename,
  columns,
  visibleData,
  className,
}: ExportButtonProps<T>) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleExportAll = async () => {
    setLoading('csv')
    await new Promise((r) => setTimeout(r, 300))
    const fname = generateFilename(filename)
    const csv = exportToCSV(data, columns, fname)
    downloadCSV(csv, fname)
    toast.success(`Exported ${data.length} rows`, { description: fname })
    setLoading(null)
    setOpen(false)
  }

  const handleExportVisible = async () => {
    const rows = visibleData ?? data
    setLoading('visible')
    await new Promise((r) => setTimeout(r, 200))
    const fname = generateFilename(filename)
    const csv = exportToCSV(rows, columns, fname)
    downloadCSV(csv, fname)
    toast.success(`Exported ${rows.length} visible rows`, { description: fname })
    setLoading(null)
    setOpen(false)
  }

  const handleCopyJSON = async () => {
    setLoading('json')
    const json = JSON.stringify(data, null, 2)
    await copyToClipboard(json)
    toast.success(`${data.length} rows copied as JSON`)
    setLoading(null)
    setOpen(false)
  }

  const options = [
    {
      id: 'csv',
      label: 'Export as CSV',
      description: `${data.length} total rows`,
      icon: FileText,
      action: handleExportAll,
    },
    {
      id: 'visible',
      label: 'Export Visible Rows Only',
      description: `${(visibleData ?? data).length} rows`,
      icon: Download,
      action: handleExportVisible,
    },
    {
      id: 'json',
      label: 'Copy as JSON',
      description: 'To clipboard',
      icon: Copy,
      action: handleCopyJSON,
    },
  ]

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-[#2A2A3E] bg-[#111118] text-xs font-bold text-[#A0A0B8] hover:text-white hover:border-[#3A3A50] transition-all"
      >
        <Download className="w-3.5 h-3.5" />
        Export
        <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1.5 z-50 w-56 bg-[#111118] border border-[#1E1E2E] rounded-xl shadow-2xl overflow-hidden"
          >
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={opt.action}
                disabled={loading !== null}
                className="w-full flex items-start gap-3 px-3.5 py-2.5 text-left hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                {loading === opt.id ? (
                  <Loader2 className="w-4 h-4 text-[#FF7A00] animate-spin mt-0.5 shrink-0" />
                ) : (
                  <opt.icon className="w-4 h-4 text-[#6B6B80] mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold text-white leading-none">{opt.label}</p>
                  <p className="text-[10px] text-[#6B6B80] mt-0.5">{opt.description}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
