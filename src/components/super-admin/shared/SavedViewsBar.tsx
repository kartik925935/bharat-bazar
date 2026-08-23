'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, MoreHorizontal, Pencil, Trash2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSAUIStore } from '@/lib/store/sa-ui-store'

interface SavedView {
  id: string
  label: string
  state: Record<string, unknown>
  createdAt: string
}

interface SavedViewsBarProps {
  pageKey: string                       // unique per page, e.g. 'customers'
  currentState: Record<string, unknown> // current search/filter/sort state to save
  onSelectView: (state: Record<string, unknown>) => void
  className?: string
}

export function SavedViewsBar({ pageKey, currentState, onSelectView, className }: SavedViewsBarProps) {
  const { savedViews, addSavedView, removeSavedView, renameSavedView } = useSAUIStore()
  const [activeViewId, setActiveViewId] = useState<string | null>(null)
  const [renaming, setRenaming] = useState<{ id: string; label: string } | null>(null)
  const [showNameInput, setShowNameInput] = useState(false)
  const [newName, setNewName] = useState('')
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const pageViews: SavedView[] = (savedViews[pageKey] as SavedView[] | undefined) ?? []

  const handleSelect = (view: SavedView | null) => {
    if (!view) {
      setActiveViewId(null)
      onSelectView({})
    } else {
      setActiveViewId(view.id)
      onSelectView(view.state)
    }
  }

  const handleSave = () => {
    if (!newName.trim()) return
    const id = Math.random().toString(36).slice(2, 9)
    const view: SavedView = {
      id,
      label: newName.trim(),
      state: currentState,
      createdAt: new Date().toISOString(),
    }
    addSavedView(pageKey, view)
    setActiveViewId(id)
    setNewName('')
    setShowNameInput(false)
  }

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setContextMenu({ id, x: e.clientX, y: e.clientY })
  }

  const handleRename = (id: string) => {
    const view = pageViews.find((v) => v.id === id)
    if (!view) return
    setRenaming({ id, label: view.label })
    setContextMenu(null)
  }

  const commitRename = () => {
    if (!renaming) return
    renameSavedView(pageKey, renaming.id, renaming.label)
    setRenaming(null)
  }

  return (
    <>
      <div className={cn('flex items-center gap-2 overflow-x-auto scrollbar-none pb-1', className)}>
        {/* "All" pill */}
        <button
          onClick={() => handleSelect(null)}
          className={cn(
            'shrink-0 h-7 px-3 rounded-full text-xs font-bold border transition-all',
            activeViewId === null
              ? 'bg-[#FF7A00] text-white border-[#FF7A00]'
              : 'bg-[#111118] text-[#6B6B80] border-[#2A2A3E] hover:border-[#3A3A50] hover:text-white'
          )}
        >
          All
        </button>

        {/* Saved view pills */}
        <AnimatePresence>
          {pageViews.map((view) => (
            <motion.div
              key={view.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="shrink-0"
            >
              {renaming?.id === view.id ? (
                <div className="flex items-center gap-1 h-7 px-2 rounded-full border border-[#FF7A00] bg-[#FF7A00]/5">
                  <input
                    value={renaming.label}
                    onChange={(e) => setRenaming({ ...renaming, label: e.target.value })}
                    onBlur={commitRename}
                    onKeyDown={(e) => e.key === 'Enter' && commitRename()}
                    autoFocus
                    className="bg-transparent text-xs font-bold text-white outline-none w-24"
                  />
                  <button onClick={commitRename}>
                    <Check className="w-3 h-3 text-[#22C55E]" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleSelect(view)}
                  onContextMenu={(e) => handleContextMenu(e, view.id)}
                  className={cn(
                    'flex items-center gap-1 h-7 px-3 rounded-full text-xs font-bold border transition-all',
                    activeViewId === view.id
                      ? 'bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/30'
                      : 'bg-[#111118] text-[#6B6B80] border-[#2A2A3E] hover:border-[#3A3A50] hover:text-white'
                  )}
                >
                  {view.label}
                  {activeViewId === view.id && (
                    <X
                      className="w-3 h-3 opacity-60 hover:opacity-100"
                      onClick={(e) => { e.stopPropagation(); handleSelect(null) }}
                    />
                  )}
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Save current view */}
        {showNameInput ? (
          <div className="flex items-center gap-1 shrink-0">
            <input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setShowNameInput(false) }}
              placeholder="View name…"
              autoFocus
              className="h-7 px-2 rounded-lg border border-[#FF7A00]/40 bg-[#FF7A00]/5 text-xs text-white outline-none placeholder:text-[#5A5A70] w-32"
            />
            <button
              onClick={handleSave}
              disabled={!newName.trim()}
              className="h-7 px-2 rounded-lg bg-[#FF7A00] text-white text-xs font-bold disabled:opacity-40"
            >
              Save
            </button>
            <button onClick={() => setShowNameInput(false)} className="h-7 w-7 rounded-lg border border-[#2A2A3E] flex items-center justify-center text-[#6B6B80]">
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setShowNameInput(true); setTimeout(() => inputRef.current?.focus(), 50) }}
            className="shrink-0 flex items-center gap-1 h-7 px-3 rounded-full text-xs font-bold border border-dashed border-[#2A2A3E] text-[#6B6B80] hover:text-white hover:border-[#3A3A50] transition-all"
          >
            <Plus className="w-3 h-3" />
            Save View
          </button>
        )}
      </div>

      {/* Context menu */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <div className="fixed inset-0 z-50" onClick={() => setContextMenu(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ top: contextMenu.y, left: contextMenu.x }}
              className="fixed z-50 bg-[#111118] border border-[#1E1E2E] rounded-xl shadow-2xl overflow-hidden min-w-[140px]"
            >
              <button
                onClick={() => handleRename(contextMenu.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#D0D0E0] hover:bg-white/5 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Rename
              </button>
              <button
                onClick={() => { removeSavedView(pageKey, contextMenu.id); setContextMenu(null); if (activeViewId === contextMenu.id) setActiveViewId(null) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete View
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
