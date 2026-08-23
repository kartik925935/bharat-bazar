'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard, X } from 'lucide-react'
import { SHORTCUT_GROUPS } from '@/lib/constants/shortcuts'

export function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Shift + ? -> toggle shortcuts modal
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // Only if not focused on an input
        const tag = (e.target as HTMLElement).tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
          e.preventDefault()
          setIsOpen((prev) => !prev)
        }
      }
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const shortcuts = [
    { label: 'Command Palette', keys: ['⌘', 'K'] },
    { label: 'Show/Hide Keyboard Shortcuts', keys: ['Shift', '?'] },
    { label: 'Close Overlays', keys: ['Esc'] },
    { label: 'Toggle Sidebar (Desktop)', keys: ['⌘', '\\'] },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            className="relative w-full max-w-md bg-[#111118] border border-[#1E1E2E] rounded-2xl shadow-2xl p-6 z-10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-lg bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00]">
                  <Keyboard className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B80] hover:bg-white/5 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {SHORTCUT_GROUPS.map((group, groupIdx) => (
                <div key={groupIdx}>
                  <h3 className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider mb-2">{group.group}</h3>
                  <div className="space-y-1">
                    {group.shortcuts.map((sc, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5">
                        <span className="text-xs text-[#A0A0B8]">{sc.description}</span>
                        <div className="flex items-center gap-1">
                          {sc.keys.map((k, j) => (
                            <kbd
                              key={j}
                              className="h-5 px-1.5 min-w-[20px] flex items-center justify-center bg-[#1A1A26] border border-[#2A2A3E] rounded-md text-[10px] font-mono text-[#D0D0E0] shadow-sm uppercase"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
