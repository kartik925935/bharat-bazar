'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { Search, X, LayoutDashboard, ArrowRight, SearchX } from 'lucide-react'
import { getSANavigation } from '@/lib/constants/sa-navigation'
import { useSAUIStore } from '@/lib/store/sa-ui-store'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  type: 'page' | 'action'
  label: string
  description: string
  href?: string
  icon: React.ElementType
}

export function SACommandPalette() {
  const router = useRouter()
  const params = useParams()
  const saToken = params.saToken as string
  const { commandPaletteOpen, closeCommandPalette } = useSAUIStore()
  
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Build searchable items from navigation
  const navSections = getSANavigation(saToken)
  const pageItems: CommandItem[] = navSections.flatMap((section) =>
    section.items.map((item) => ({
      id: item.href,
      type: 'page' as const,
      label: item.label,
      description: item.description,
      href: item.href,
      icon: item.icon,
    }))
  )

  const quickActions: CommandItem[] = [
    { id: 'create-admin', type: 'action', label: 'Create Admin', description: 'Add a new sub-admin to the portal', href: `/${saToken}/admin-control`, icon: LayoutDashboard },
    { id: 'view-panel-requests', type: 'action', label: 'View Panel Requests', description: 'Review access requests', href: `/${saToken}/panel-requests`, icon: LayoutDashboard },
    { id: 'add-coupon', type: 'action', label: 'Add Coupon', description: 'Create a new discount coupon', href: `/${saToken}/coupons`, icon: LayoutDashboard },
    { id: 'kyc-review', type: 'action', label: 'Review KYC', description: 'Pending seller verifications', href: `/${saToken}/kyc-verification`, icon: LayoutDashboard },
    { id: 'view-audit', type: 'action', label: 'View Audit Log', description: 'Full security activity trail', href: `/${saToken}/audit-logs`, icon: LayoutDashboard },
  ]

  const allItems = [...pageItems, ...quickActions]

  const filtered = query.trim()
    ? allItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
    : allItems

  const groupedFiltered = {
    pages: filtered.filter((i) => i.type === 'page'),
    actions: filtered.filter((i) => i.type === 'action'),
  }

  const flatFiltered = [...groupedFiltered.pages, ...groupedFiltered.actions]

  const handleSelect = useCallback((item: CommandItem) => {
    if (item.href) router.push(item.href)
    closeCommandPalette()
    setQuery('')
  }, [router, closeCommandPalette])

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('')
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])

  useEffect(() => {
    setSelectedIdx(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx((i) => Math.min(i + 1, flatFiltered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && flatFiltered[selectedIdx]) {
      handleSelect(flatFiltered[selectedIdx])
    } else if (e.key === 'Escape') {
      closeCommandPalette()
    }
  }

  const renderGroup = (title: string, items: CommandItem[], offset: number) => {
    if (items.length === 0) return null
    return (
      <div key={title}>
        <p className="px-3 py-1.5 text-[10px] font-bold text-[#4A4A5E] uppercase tracking-widest">{title}</p>
        {items.map((item, i) => {
          const globalIdx = offset + i
          const Icon = item.icon
          const isSelected = selectedIdx === globalIdx
          return (
            <motion.div
              key={item.id}
              onClick={() => handleSelect(item)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl cursor-pointer transition-colors',
                isSelected ? 'bg-[#FF7A00]/10 border border-[#FF7A00]/20' : 'hover:bg-white/[0.04] border border-transparent'
              )}
            >
              <div className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center border shrink-0',
                isSelected ? 'bg-[#FF7A00]/10 border-[#FF7A00]/20' : 'bg-[#1A1A26] border-[#2A2A3E]'
              )}>
                <Icon className={cn('w-4 h-4', isSelected ? 'text-[#FF7A00]' : 'text-[#6B6B80]')} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium', isSelected ? 'text-white' : 'text-[#D0D0E0]')}>{item.label}</p>
                <p className="text-xs text-[#6B6B80] truncate">{item.description}</p>
              </div>
              {isSelected && <ArrowRight className="w-4 h-4 text-[#FF7A00] shrink-0" />}
            </motion.div>
          )
        })}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={closeCommandPalette}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="relative w-full max-w-[640px] bg-[#111118] border border-[#2A2A3E] rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.6)] overflow-hidden z-10"
            onKeyDown={handleKeyDown}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-[#1E1E2E]">
              <Search className="w-5 h-5 text-[#6B6B80] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything..."
                className="flex-1 bg-transparent text-white text-base outline-none placeholder:text-[#4A4A5E] font-medium"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-[#6B6B80] hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="px-2 py-1 bg-[#1A1A26] border border-[#2A2A3E] rounded-lg text-[10px] font-mono text-[#6B6B80]">Esc</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[480px] overflow-y-auto py-2">
              {flatFiltered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <SearchX className="w-8 h-8 text-[#3A3A50] mb-3" />
                  <p className="text-sm text-[#6B6B80] font-medium">No results for "{query}"</p>
                  <p className="text-xs text-[#4A4A5E] mt-1">Try a different term</p>
                </div>
              ) : (
                <>
                  {renderGroup('Pages', groupedFiltered.pages, 0)}
                  {renderGroup('Quick Actions', groupedFiltered.actions, groupedFiltered.pages.length)}
                </>
              )}
            </div>

            {/* Footer hints */}
            <div className="flex items-center gap-4 px-4 py-3 border-t border-[#1E1E2E] bg-[#0E0E16]">
              {[['↑↓', 'Navigate'], ['↵', 'Select'], ['Esc', 'Close']].map(([key, desc]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-[#1A1A26] border border-[#2A2A3E] rounded text-[10px] font-mono text-[#A0A0B8]">{key}</kbd>
                  <span className="text-[10px] text-[#6B6B80]">{desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
