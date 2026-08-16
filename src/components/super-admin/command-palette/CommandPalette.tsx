'use client'
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Search, Command, Box, Users, ShoppingBag, Store, UserPlus,
  ShieldCheck, Download, AlertTriangle, FileText, Clock, Scale,
  Keyboard, LayoutGrid, LogOut, Ticket
} from 'lucide-react'
import { useSAUIStore } from '@/lib/store/sa-ui-store'
import { cn } from '@/lib/utils'

// Mock Data Imports for fuzzy search
import { MOCK_SA_ORDERS } from '@/lib/mock/sa-orders.mock'
import { MOCK_SA_SELLERS } from '@/lib/mock/sa-sellers.mock'
import { MOCK_SA_PRODUCTS } from '@/lib/mock/sa-products.mock'
import { MOCK_SA_CUSTOMERS } from '@/lib/mock/sa-customers.mock'
import { MOCK_TICKETS } from '@/lib/mock/sa-support.mock'
import { MOCK_ADMINS } from '@/lib/mock/sa-admins.mock'

interface CommandSearchResult {
  id: string
  type: 'order' | 'seller' | 'product' | 'customer' | 'ticket' | 'admin'
  title: string
  subtitle: string
  route: string
  icon: any
}

interface CommandAction {
  id: string
  label: string
  keywords: string[]
  icon: any
  shortcut?: string
  action: () => void
}

const TYPE_ICONS = {
  order: Box,
  seller: Store,
  product: ShoppingBag,
  customer: Users,
  ticket: Ticket,
  admin: ShieldCheck,
}

export function CommandPalette({ saToken }: { saToken: string }) {
  const router = useRouter()
  const { commandPaletteOpen, closeCommandPalette, recentlyViewed, toggleDensity } = useSAUIStore()
  
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Reset state on open
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])

  // Global Shortcut Cmd+K handled in layout, but we also close on Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!commandPaletteOpen) return
      
      if (e.key === 'Escape') {
        e.preventDefault()
        closeCommandPalette()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, closeCommandPalette])

  // Execute Search
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    
    // Command Mode
    if (q.startsWith('>')) {
      const cmdQuery = q.slice(1).trim()
      const COMMAND_ACTIONS: CommandAction[] = [
        { id: 'create-admin', label: 'Create New Admin', keywords: ['admin', 'new', 'invite'], icon: UserPlus, action: () => router.push(`/${saToken}/admin-control?action=create`) },
        { id: 'view-pending-kyc', label: 'Review Pending KYC', keywords: ['kyc', 'verify', 'seller'], icon: ShieldCheck, action: () => router.push(`/${saToken}/sellers?filter=kyc_pending`) },
        { id: 'toggle-maintenance', label: 'Toggle Maintenance Mode', keywords: ['maintenance', 'settings', 'down'], icon: AlertTriangle, action: () => router.push(`/${saToken}/settings`) },
        { id: 'view-audit-logs', label: 'View Audit Logs', keywords: ['audit', 'logs', 'history'], icon: FileText, action: () => router.push(`/${saToken}/audit-logs`) },
        { id: 'view-sla-breaches', label: 'View SLA Breaches', keywords: ['sla', 'breach', 'urgent'], icon: Clock, action: () => router.push(`/${saToken}/orders?filter=sla_breached`) },
        { id: 'view-open-disputes', label: 'View Open Disputes', keywords: ['dispute', 'conflict'], icon: Scale, action: () => router.push(`/${saToken}/orders?filter=disputes`) },
        { id: 'toggle-theme-density', label: 'Toggle Compact Mode', keywords: ['density', 'compact', 'layout'], icon: LayoutGrid, action: () => toggleDensity() },
        { id: 'logout', label: 'Log Out', keywords: ['logout', 'sign out', 'exit'], icon: LogOut, action: () => router.push('/secure-access') },
      ]
      
      if (!cmdQuery) return COMMAND_ACTIONS
      
      return COMMAND_ACTIONS.filter(cmd => 
        cmd.label.toLowerCase().includes(cmdQuery) || 
        cmd.keywords.some(k => k.includes(cmdQuery))
      )
    }

    // Entity Mode
    if (q) {
      const allResults: CommandSearchResult[] = []
      
      // Orders
      ;(MOCK_SA_ORDERS ?? []).forEach(o => {
        const name = o.customerName ?? ''
        if ((o.id ?? '').toLowerCase().includes(q) || name.toLowerCase().includes(q)) {
          allResults.push({
            id: o.id, type: 'order',
            title: `${o.id} — ${name}`,
            subtitle: `₹${o.totalAmount ?? 0} · ${(o.status ?? '').replace(/_/g, ' ')}`,
            route: `/${saToken}/orders?order=${o.id}`,
            icon: TYPE_ICONS.order
          })
        }
      })
      
      // Sellers
      ;(MOCK_SA_SELLERS ?? []).forEach(s => {
        const shopName = s.shopName ?? s.displayName ?? ''
        if ((s.id ?? '').toLowerCase().includes(q) || shopName.toLowerCase().includes(q)) {
          allResults.push({
            id: s.id, type: 'seller',
            title: shopName,
            subtitle: `${(s.tier ?? '').toUpperCase()} Tier · ${s.status ?? ''}`,
            route: `/${saToken}/sellers?seller=${s.id}`,
            icon: TYPE_ICONS.seller
          })
        }
      })
      
      // Products
      ;(MOCK_SA_PRODUCTS ?? []).forEach(p => {
        const title = (p as any).title ?? p.name ?? ''
        if ((p.id ?? '').toLowerCase().includes(q) || title.toLowerCase().includes(q)) {
          allResults.push({
            id: p.id, type: 'product',
            title: title,
            subtitle: `₹${p.price ?? 0} · ${(p.status ?? '').replace(/_/g, ' ')}`,
            route: `/${saToken}/products?product=${p.id}`,
            icon: TYPE_ICONS.product
          })
        }
      })
      
      // Customers
      ;(MOCK_SA_CUSTOMERS ?? []).forEach(c => {
        const cname = c.name ?? (c as any).fullName ?? ''
        const email = c.email ?? ''
        if (cname.toLowerCase().includes(q) || email.toLowerCase().includes(q)) {
          allResults.push({
            id: c.id, type: 'customer',
            title: cname,
            subtitle: `${(c.tier ?? '').toUpperCase()} Tier · ${c.status ?? ''}`,
            route: `/${saToken}/customers?customer=${c.id}`,
            icon: TYPE_ICONS.customer
          })
        }
      })
      
      // Take top 8
      return allResults.slice(0, 8)
    }
    
    return []
  }, [query, router, saToken, toggleDensity])

  const isCommandMode = query.startsWith('>')

  // Keyboard navigation within list
  useEffect(() => {
    if (!commandPaletteOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const selected = results[selectedIndex]
        if (selected) {
          if ('action' in selected) {
            ;(selected as CommandAction).action()
          } else {
            router.push((selected as CommandSearchResult).route)
          }
          closeCommandPalette()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, results, selectedIndex, router, closeCommandPalette])

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  // Announce to screen reader
  useEffect(() => {
    const liveRegion = document.getElementById('a11y-live-region')
    if (liveRegion && commandPaletteOpen) {
      liveRegion.textContent = `${results.length} results found.`
    }
  }, [results, commandPaletteOpen])

  if (!commandPaletteOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#09090B]/80 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
        onClick={closeCommandPalette}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl bg-[#111118] border border-[#2A2A3E] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-label="Command Palette"
        >
          {/* Search Input */}
          <div className="flex items-center px-4 border-b border-[#2A2A3E] shrink-0 relative">
            {isCommandMode ? (
              <Command className="w-5 h-5 text-[#FF7A00] shrink-0" />
            ) : (
              <Search className="w-5 h-5 text-[#6B6B80] shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              placeholder="Search orders, sellers, products, customers, or type '>' for commands..."
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              className="w-full h-14 bg-transparent border-none text-white text-base px-4 focus:outline-none focus:ring-0 placeholder:text-[#4A4A5E]"
            />
            <span className="text-[10px] text-[#4A4A5E] font-bold border border-[#2A2A3E] rounded px-1.5 py-0.5">ESC</span>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-2" ref={listRef} role="listbox">
            {query.trim() === '' ? (
              <div className="p-2 space-y-6">
                {recentlyViewed.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-[#6B6B80] uppercase px-2 mb-2">Recently Viewed</h3>
                    {recentlyViewed.map((item, i) => {
                      const Icon = TYPE_ICONS[item.type as keyof typeof TYPE_ICONS] || Box
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#A0A0B8] hover:bg-[#1E1E2E] hover:text-white cursor-pointer transition-colors"
                          onClick={() => {
                            router.push(`/${saToken}/${item.type}s?${item.type}=${item.id}`)
                            closeCommandPalette()
                          }}
                        >
                          <Icon className="w-4 h-4 text-[#6B6B80]" />
                          <span className="text-sm font-medium">{item.label}</span>
                          <span className="text-xs text-[#4A4A5E] font-mono ml-auto">{item.type}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
                <div>
                  <h3 className="text-xs font-bold text-[#6B6B80] uppercase px-2 mb-2">Suggested</h3>
                  <div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#A0A0B8] hover:bg-[#1E1E2E] hover:text-white cursor-pointer transition-colors"
                    onClick={() => { router.push(`/${saToken}/sellers?filter=kyc_pending`); closeCommandPalette() }}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
                    <span className="text-sm font-medium">Review Pending KYC</span>
                  </div>
                  <div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#A0A0B8] hover:bg-[#1E1E2E] hover:text-white cursor-pointer transition-colors"
                    onClick={() => { router.push(`/${saToken}/orders?filter=sla_breached`); closeCommandPalette() }}
                  >
                    <Clock className="w-4 h-4 text-[#EF4444]" />
                    <span className="text-sm font-medium">View SLA Breaches</span>
                  </div>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="py-14 text-center">
                <Search className="w-8 h-8 text-[#2A2A3E] mx-auto mb-3" />
                <p className="text-sm text-[#A0A0B8] font-medium">No results for "{query}"</p>
                {!isCommandMode && (
                  <p className="text-xs text-[#6B6B80] mt-1">Try typing <span className="font-mono bg-[#1E1E2E] px-1 rounded text-[#A0A0B8]">&gt;</span> to enter command mode</p>
                )}
              </div>
            ) : (
              results.map((item, i) => {
                const isSelected = i === selectedIndex
                
                if (isCommandMode) {
                  const cmd = item as CommandAction
                  return (
                    <div
                      key={cmd.id}
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        "flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-colors",
                        isSelected ? "bg-[#FF7A00] text-white" : "text-[#A0A0B8] hover:bg-[#1E1E2E]"
                      )}
                      onMouseEnter={() => setSelectedIndex(i)}
                      onClick={() => {
                        cmd.action()
                        closeCommandPalette()
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <cmd.icon className={cn("w-5 h-5", isSelected ? "text-white/80" : "text-[#6B6B80]")} />
                        <span className="text-sm font-medium">{cmd.label}</span>
                      </div>
                      {cmd.shortcut && (
                        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", isSelected ? "border-white/30 text-white/80" : "border-[#2A2A3E] text-[#4A4A5E]")}>
                          {cmd.shortcut}
                        </span>
                      )}
                    </div>
                  )
                }
                
                const entity = item as CommandSearchResult
                return (
                  <div
                    key={entity.id}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-colors",
                      isSelected ? "bg-[#FF7A00]/15 border border-[#FF7A00]/30" : "border border-transparent hover:bg-[#1E1E2E]"
                    )}
                    onMouseEnter={() => setSelectedIndex(i)}
                    onClick={() => {
                      router.push(entity.route)
                      closeCommandPalette()
                    }}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        isSelected ? "bg-[#FF7A00] text-white" : "bg-[#1E1E2E] text-[#8B8B9E]"
                      )}>
                        <entity.icon className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <p className={cn("text-sm font-bold truncate", isSelected ? "text-[#FF9A40]" : "text-white")}>{entity.title}</p>
                        <p className={cn("text-[11px] truncate mt-0.5", isSelected ? "text-[#FF7A00]" : "text-[#6B6B80]")}>{entity.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#4A4A5E] uppercase font-bold tracking-wider shrink-0 ml-4">
                      {entity.type}
                    </span>
                  </div>
                )
              })
            )}
          </div>
          
          {/* Footer Hints */}
          <div className="bg-[#0A0A12] border-t border-[#2A2A3E] p-3 flex items-center justify-center gap-6 text-[10px] font-bold text-[#4A4A5E]">
            <span className="flex items-center gap-1.5"><span className="border border-[#2A2A3E] rounded px-1">↑↓</span> Navigate</span>
            <span className="flex items-center gap-1.5"><span className="border border-[#2A2A3E] rounded px-1">↵</span> Select</span>
          </div>
        </motion.div>
        {/* Invisible ARIA live region for screen readers */}
        <div id="a11y-live-region" aria-live="polite" className="sr-only"></div>
      </motion.div>
    </AnimatePresence>
  )
}
