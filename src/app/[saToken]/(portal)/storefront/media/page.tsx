'use client'
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Image as ImageIcon, Upload, Search, X, Trash2,
  Tag, Edit3, Info, AlertTriangle, Check, FileImage,
  Plus
} from 'lucide-react'
import { useStorefrontStore } from '@/lib/store/storefront-store'
import { ResponsiveSheet } from '@/components/ui/responsive-sheet'
import type { SAMediaAsset } from '@/lib/mock/sa-storefront.mock'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from 'sonner'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function AssetCard({ asset, onSelect }: { asset: SAMediaAsset; onSelect: (a: SAMediaAsset) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onSelect(asset)}
      className="group relative aspect-square bg-[#1A1A26] border border-[#2A2A3E] rounded-xl overflow-hidden cursor-pointer hover:border-[#FF7A00]/40 transition-all"
    >
      {/* Image placeholder */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1E1E2E] to-[#0A0A0F]">
        <FileImage className="w-8 h-8 text-[#3A3A50]" />
      </div>
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
        <p className="text-[11px] text-white font-semibold truncate">{asset.filename}</p>
        <p className="text-[10px] text-[#A0A0B8]">{asset.dimensions.width}×{asset.dimensions.height} · {formatBytes(asset.fileSize)}</p>
      </div>
      {/* In-use badge */}
      {asset.usedIn.length > 0 && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#FF7A00] flex items-center justify-center">
          <Info className="w-3 h-3 text-white" />
        </div>
      )}
    </motion.div>
  )
}

function UploadProgress({ progress, filename }: { progress: number; filename: string }) {
  return (
    <div className="p-4 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl">
      <div className="flex items-center gap-3 mb-2">
        <Upload className="w-4 h-4 text-[#FF7A00]" />
        <span className="text-sm text-white truncate">{filename}</span>
        <span className="text-xs text-[#6B6B80] ml-auto">{progress}%</span>
      </div>
      <div className="h-1.5 bg-[#2A2A3E] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FF4500] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}

export default function MediaLibraryPage() {
  const { mediaAssets, deleteMediaAsset, updateMediaMetadata } = useStorefrontStore()
  const [selectedAsset, setSelectedAsset] = useState<SAMediaAsset | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [uploading, setUploading] = useState<{ filename: string; progress: number } | null>(null)
  const [editingMeta, setEditingMeta] = useState(false)
  const [metaForm, setMetaForm] = useState({ altText: '', tags: '' })
  const [savingMeta, setSavingMeta] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // All unique tags
  const allTags = Array.from(new Set(mediaAssets.flatMap(a => a.tags))).sort()

  const filtered = mediaAssets.filter(asset => {
    const matchesSearch = !searchQuery ||
      asset.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.altText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesTag = !activeTag || asset.tags.includes(activeTag)
    return matchesSearch && matchesTag
  })

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading({ filename: file.name, progress: 0 })

    // Simulate upload progress
    for (let p = 0; p <= 100; p += 20) {
      await new Promise(r => setTimeout(r, 150))
      setUploading({ filename: file.name, progress: p })
    }

    // TODO: wire to Supabase Storage bucket upload
    const { addMediaAsset } = useStorefrontStore.getState()
    await addMediaAsset({
      url: URL.createObjectURL(file),
      filename: file.name,
      altText: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      tags: [],
      fileSize: file.size,
      dimensions: { width: 1200, height: 630 },
      uploadedBy: 'Current Admin',
      usedIn: [],
    })

    setUploading(null)
    toast.success(`${file.name} uploaded successfully`)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = async (id: string) => {
    const result = await deleteMediaAsset(id)
    if (!result.blocked) setSelectedAsset(null)
  }

  const openEdit = (asset: SAMediaAsset) => {
    setEditingMeta(true)
    setMetaForm({ altText: asset.altText, tags: asset.tags.join(', ') })
  }

  const handleSaveMeta = async () => {
    if (!selectedAsset) return
    setSavingMeta(true)
    const tags = metaForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    await updateMediaMetadata(selectedAsset.id, metaForm.altText, tags)
    setEditingMeta(false)
    setSavingMeta(false)
    toast.success('Metadata updated')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Media Library</h1>
            <p className="text-sm text-[#6B6B80]">{mediaAssets.length} assets</p>
          </div>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 h-10 px-4 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] hover:opacity-90 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 transition-all"
        >
          <Upload className="w-4 h-4" /> Upload Asset
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B80]" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by filename, alt text, or tag..."
            className="w-full h-10 bg-[#111118] border border-[#2A2A3E] rounded-xl pl-9 pr-3 text-sm text-white focus:border-[#FF7A00] outline-none"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTag(null)}
            className={cn('px-3 py-1.5 rounded-full text-xs font-semibold transition-colors', !activeTag ? 'bg-[#FF7A00] text-white' : 'bg-[#1E1E2E] text-[#6B6B80] hover:text-white')}
          >
            All
          </button>
          {allTags.slice(0, 6).map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={cn('px-3 py-1.5 rounded-full text-xs font-semibold transition-colors', activeTag === tag ? 'bg-[#FF7A00] text-white' : 'bg-[#1E1E2E] text-[#6B6B80] hover:text-white')}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Upload progress */}
      {uploading && <UploadProgress progress={uploading.progress} filename={uploading.filename} />}

      {/* Grid — 2 col mobile, 3 tablet, 4+ desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        <AnimatePresence>
          {filtered.map(asset => (
            <AssetCard key={asset.id} asset={asset} onSelect={setSelectedAsset} />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <ImageIcon className="w-12 h-12 text-[#3A3A50] mb-3" />
            <p className="text-sm font-semibold text-[#6B6B80]">No assets found</p>
            <p className="text-xs text-[#4A4A5E] mt-1">Try adjusting your search or upload a new asset.</p>
          </div>
        )}
      </div>

      {/* Asset Detail Sheet */}
      <ResponsiveSheet
        isOpen={!!selectedAsset}
        onClose={() => { setSelectedAsset(null); setEditingMeta(false) }}
        title="Asset Details"
        desktopWidth="w-[480px]"
      >
        {selectedAsset && (
          <div className="p-5 space-y-5">
            {/* Preview */}
            <div className="aspect-video bg-gradient-to-br from-[#1E1E2E] to-[#0A0A0F] rounded-xl flex items-center justify-center border border-[#2A2A3E]">
              <div className="text-center">
                <FileImage className="w-12 h-12 text-[#3A3A50] mx-auto mb-2" />
                <p className="text-xs text-[#6B6B80]">{selectedAsset.filename}</p>
              </div>
            </div>

            {/* Metadata */}
            {editingMeta ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">Alt Text (for accessibility & SEO)</label>
                  <input
                    value={metaForm.altText}
                    onChange={e => setMetaForm(f => ({ ...f, altText: e.target.value }))}
                    className="w-full h-10 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">Tags (comma-separated)</label>
                  <input
                    value={metaForm.tags}
                    onChange={e => setMetaForm(f => ({ ...f, tags: e.target.value }))}
                    placeholder="hero, sale, festival"
                    className="w-full h-10 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSaveMeta} disabled={savingMeta} className="flex-1 h-10 bg-[#FF7A00] text-white rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> {savingMeta ? 'Saving...' : 'Save Metadata'}
                  </button>
                  <button onClick={() => setEditingMeta(false)} className="h-10 px-3 bg-[#1E1E2E] text-[#A0A0B8] rounded-xl text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#1A1A26] rounded-xl">
                    <p className="text-[10px] text-[#6B6B80] font-semibold uppercase tracking-wide mb-1">Dimensions</p>
                    <p className="text-sm font-semibold text-white">{selectedAsset.dimensions.width}×{selectedAsset.dimensions.height}</p>
                  </div>
                  <div className="p-3 bg-[#1A1A26] rounded-xl">
                    <p className="text-[10px] text-[#6B6B80] font-semibold uppercase tracking-wide mb-1">File Size</p>
                    <p className="text-sm font-semibold text-white">{formatBytes(selectedAsset.fileSize)}</p>
                  </div>
                </div>
                <div className="p-3 bg-[#1A1A26] rounded-xl">
                  <p className="text-[10px] text-[#6B6B80] font-semibold uppercase tracking-wide mb-1">Alt Text</p>
                  <p className="text-sm text-white">{selectedAsset.altText || <span className="text-[#EF4444] italic">Missing! Add alt text for accessibility.</span>}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAsset.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-[#FF7A00]/10 text-[#FF9A40] rounded-full text-xs font-medium">{t}</span>
                  ))}
                  {selectedAsset.tags.length === 0 && <span className="text-xs text-[#6B6B80]">No tags</span>}
                </div>
                <p className="text-[11px] text-[#6B6B80]">Uploaded by {selectedAsset.uploadedBy} · {format(new Date(selectedAsset.uploadedAt), 'MMM d, yyyy')}</p>
              </div>
            )}

            {/* Used In */}
            {selectedAsset.usedIn.length > 0 && (
              <div className="p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <p className="text-xs font-bold text-[#F59E0B]">In use — cannot delete</p>
                </div>
                {selectedAsset.usedIn.map((ref, i) => (
                  <p key={i} className="text-xs text-[#A0A0B8]">→ {ref.label} ({ref.type})</p>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={() => openEdit(selectedAsset)} className="flex-1 h-10 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                <Edit3 className="w-4 h-4" /> Edit Metadata
              </button>
              <button
                onClick={() => handleDelete(selectedAsset.id)}
                disabled={selectedAsset.usedIn.length > 0}
                className="h-10 px-3 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </ResponsiveSheet>
    </div>
  )
}
