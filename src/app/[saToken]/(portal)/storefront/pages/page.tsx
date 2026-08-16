'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FileText, Eye, Edit3, Globe, Save, Clock,
  ToggleLeft, ToggleRight, ChevronRight, History
} from 'lucide-react'
import { useStorefrontStore } from '@/lib/store/storefront-store'
import type { SAStaticPage } from '@/lib/mock/sa-storefront.mock'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from 'sonner'

// Tiny markdown → html for preview (inline, no deps)
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 style="font-weight:600;font-size:1.1rem;margin:1rem 0 0.5rem">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-weight:700;font-size:1.25rem;margin:1.25rem 0 0.5rem">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-weight:800;font-size:1.5rem;margin:1.5rem 0 0.75rem">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:#f1f5f9;padding:0.15rem 0.4rem;border-radius:4px;font-size:0.875rem">$1</code>')
    .replace(/^- (.+)$/gm, '<li style="margin:0.25rem 0;padding-left:0.5rem">$1</li>')
    .replace(/(<li[\s\S]*?<\/li>)/, '<ul style="list-style:disc;padding-left:1.5rem;margin:0.5rem 0">$1</ul>')
    .replace(/\n\n/g, '</p><p style="margin:0.75rem 0">')
    .replace(/^(?!<[hul])/gm, '')
}

function PageEditor({
  page,
  onClose,
}: {
  page: SAStaticPage
  onClose: () => void
}) {
  const { updateStaticPage, publishStaticPage } = useStorefrontStore()
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [content, setContent] = useState(page.contentMarkdown)
  const [versionNote, setVersionNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const handleSave = async () => {
    if (!versionNote.trim() || versionNote.length < 5) {
      toast.error('Add a version note (min 5 chars)')
      return
    }
    setSaving(true)
    await updateStaticPage(page.id, { contentMarkdown: content })
    setSaving(false)
    setVersionNote('')
  }

  const handlePublish = async () => {
    setPublishing(true)
    await publishStaticPage(page.id)
    setPublishing(false)
    onClose()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-5 pt-4 shrink-0">
        {(['edit', 'preview'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors',
              activeTab === tab ? 'bg-[#FF7A00] text-white' : 'text-[#6B6B80] hover:text-white hover:bg-[#1E1E2E]'
            )}
          >
            {tab === 'edit' ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {tab}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-[#6B6B80]">v{page.version}</span>
          {page.isPublished ? (
            <span className="px-2 py-0.5 bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-bold rounded-full">Published</span>
          ) : (
            <span className="px-2 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-bold rounded-full">Draft</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden px-5 pt-3">
        {activeTab === 'edit' ? (
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full h-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl p-4 text-sm text-white font-mono leading-relaxed focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none resize-none"
            placeholder="Write your content in Markdown..."
          />
        ) : (
          <div
            className="w-full h-full overflow-y-auto bg-white rounded-xl p-6 text-gray-800 text-sm leading-relaxed font-sans"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        )}
      </div>

      {/* Sticky action bar */}
      <div className="shrink-0 px-5 py-4 border-t border-[#1E1E2E] bg-[#0D0D14] space-y-3">
        <div>
          <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">
            Version note <span className="text-[#EF4444]">*</span>
            <span className="font-normal text-[#6B6B80] ml-1">(required to save)</span>
          </label>
          <input
            value={versionNote}
            onChange={e => setVersionNote(e.target.value)}
            placeholder="e.g. Updated refund policy section..."
            className="w-full h-10 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-11 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex-1 h-11 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] hover:opacity-90 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            <Globe className="w-4 h-4" /> {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StaticPagesPage() {
  const { staticPages } = useStorefrontStore()
  const [editingPage, setEditingPage] = useState<SAStaticPage | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Static Pages</h1>
          <p className="text-sm text-[#6B6B80]">{staticPages.filter(p => p.isPublished).length} published · {staticPages.filter(p => !p.isPublished).length} drafts</p>
        </div>
      </div>

      {/* Pages list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {staticPages.map(page => (
          <button
            key={page.id}
            onClick={() => setEditingPage(page)}
            className="p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl text-left hover:border-[#FF7A00]/40 hover:bg-[#1A1A26] transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center group-hover:bg-[#FF7A00]/10 transition-colors">
                <FileText className="w-4 h-4 text-[#0EA5E9] group-hover:text-[#FF7A00] transition-colors" />
              </div>
              <span className={cn(
                'px-2 py-0.5 text-[10px] font-bold rounded-full',
                page.isPublished ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
              )}>
                {page.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">{page.title}</h3>
            <p className="text-xs text-[#6B6B80] font-mono mb-2">{page.slug}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-[#6B6B80]">
                <History className="w-3 h-3" /> v{page.version}
                <span className="mx-1">·</span>
                <Clock className="w-3 h-3" />
                {format(new Date(page.lastEditedAt), 'MMM d')}
              </div>
              <div className="flex items-center gap-1 text-xs text-[#FF7A00] opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit3 className="w-3 h-3" /> Edit <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Editor Sheet */}
      <AnimatePresence>
        {editingPage && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setEditingPage(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 z-[61] w-full max-w-2xl bg-[#0D0D14] border-l border-[#2A2A3E] flex flex-col"
            >
              {/* Sheet header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E2E] shrink-0">
                <div>
                  <h2 className="text-base font-bold text-white">{editingPage.title}</h2>
                  <p className="text-xs text-[#6B6B80] font-mono">{editingPage.slug}</p>
                </div>
                <button onClick={() => setEditingPage(null)} aria-label="Close editor" className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B80] hover:bg-white/5 hover:text-white transition-colors">
                  ×
                </button>
              </div>
              <PageEditor page={editingPage} onClose={() => setEditingPage(null)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
