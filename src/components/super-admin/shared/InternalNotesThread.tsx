'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pin, Trash2, Plus, Loader2, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useSAStore } from '@/lib/store/super-admin-store'
import { formatRelativeTime } from '@/lib/utils/formatters'
import type { SANote } from '@/types/super-admin.types'

interface InternalNotesThreadProps {
  entityType: SANote['entityType']
  entityId: string
  isSuperAdmin?: boolean
}

export function InternalNotesThread({ entityType, entityId, isSuperAdmin = true }: InternalNotesThreadProps) {
  const [content, setContent] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { addNote, togglePinNote, deleteNote, getNotesForEntity } = useSAStore()
  const notes = getNotesForEntity(entityType, entityId)

  // Pinned first, then newest
  const sorted = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const handleAdd = async () => {
    if (!content.trim()) return
    setIsAdding(true)
    await addNote(entityType, entityId, content.trim())
    setContent('')
    setIsAdding(false)
    toast.success('Note added')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleTogglePin = async (noteId: string) => {
    setTogglingId(noteId)
    await togglePinNote(noteId)
    setTogglingId(null)
  }

  const handleDelete = async (noteId: string) => {
    setDeletingId(noteId)
    await deleteNote(noteId)
    setDeletingId(null)
    toast.success('Note deleted')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Composer */}
      <div className="space-y-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="Add internal context for your team... (Cmd+Enter to submit)"
          className="w-full bg-[#1A1A26] border border-[#2A2A3E] focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none transition-all placeholder:text-[#5A5A70] resize-none"
        />
        <button
          onClick={handleAdd}
          disabled={!content.trim() || isAdding}
          className="flex items-center gap-2 h-9 px-4 rounded-xl text-xs font-bold bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/20 hover:bg-[#FF7A00]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          {isAdding ? 'Adding...' : 'Add Note'}
        </button>
      </div>

      {/* Notes list */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MessageSquare className="w-8 h-8 text-[#3A3A50] mb-3" />
          <p className="text-sm font-semibold text-[#6B6B80]">No internal notes yet</p>
          <p className="text-xs text-[#5A5A70] mt-1">Add context for your team above</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider">
            {sorted.length} Note{sorted.length !== 1 ? 's' : ''}
          </p>
          <AnimatePresence initial={false}>
            {sorted.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'group relative rounded-xl p-3.5 border transition-colors',
                  note.isPinned
                    ? 'bg-[#F5C842]/5 border-[#F5C842]/20'
                    : 'bg-[#111118] border-[#1E1E2E]'
                )}
              >
                {/* Pin badge */}
                {note.isPinned && (
                  <span className="absolute -top-2 left-3 flex items-center gap-1 text-[9px] font-bold text-[#F5C842] bg-[#F5C842]/10 border border-[#F5C842]/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    <Pin className="w-2.5 h-2.5" /> Pinned
                  </span>
                )}

                {/* Header row */}
                <div className="flex items-start gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2A2A3E] to-[#1A1A26] flex items-center justify-center text-xs font-bold text-[#A0A0B8] border border-[#2A2A3E] shrink-0">
                    {note.authorName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white leading-none">{note.authorName}</p>
                    <p className="text-[10px] text-[#6B6B80] mt-0.5">{formatRelativeTime(note.createdAt)}</p>
                  </div>
                  {/* Actions (visible on hover) */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleTogglePin(note.id)}
                      disabled={togglingId === note.id}
                      title={note.isPinned ? 'Unpin' : 'Pin'}
                      className={cn(
                        'w-6 h-6 rounded-lg flex items-center justify-center transition-colors',
                        note.isPinned
                          ? 'text-[#F5C842] hover:bg-[#F5C842]/10'
                          : 'text-[#6B6B80] hover:text-[#F5C842] hover:bg-[#F5C842]/10'
                      )}
                    >
                      {togglingId === note.id
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <Pin className="w-3 h-3" />
                      }
                    </button>
                    {isSuperAdmin && (
                      <button
                        onClick={() => handleDelete(note.id)}
                        disabled={deletingId === note.id}
                        title="Delete note"
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-[#6B6B80] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        {deletingId === note.id
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <Trash2 className="w-3 h-3" />
                        }
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm text-[#D0D0E0] leading-relaxed whitespace-pre-wrap">{note.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
