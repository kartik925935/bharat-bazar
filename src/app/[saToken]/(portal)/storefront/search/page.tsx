'use client'
import React, { useState } from 'react'
import { Search as SearchIcon, Plus, Trash2, Tag, ArrowUp, ArrowDown, Check, Pin, RefreshCw } from 'lucide-react'
import { useStorefrontStore } from '@/lib/store/storefront-store'
import type { SATrendingSearch, SAPinnedProduct, SASearchSynonym } from '@/lib/mock/sa-storefront.mock'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Tab = 'trending' | 'pinned' | 'synonyms'

// ─── Trending Searches Tab ────────────────────────────────────────────────────
function TrendingTab() {
  const { trendingSearches, updateTrendingSearch, reorderTrendingSearches, addTrendingSearch, deleteTrendingSearch } = useStorefrontStore()
  const [newTerm, setNewTerm] = useState('')
  const [adding, setAdding] = useState(false)
  const sorted = [...trendingSearches].sort((a, b) => a.order - b.order)

  const move = (id: string, dir: 'up' | 'down') => {
    const ids = sorted.map(t => t.id)
    const idx = ids.indexOf(id)
    if (dir === 'up' && idx > 0) [ids[idx-1], ids[idx]] = [ids[idx], ids[idx-1]]
    if (dir === 'down' && idx < ids.length-1) [ids[idx+1], ids[idx]] = [ids[idx], ids[idx+1]]
    reorderTrendingSearches(ids)
  }

  const handleAdd = async () => {
    if (!newTerm.trim()) return
    setAdding(true)
    await addTrendingSearch(newTerm.trim())
    setNewTerm('')
    setAdding(false)
    toast.success('Trending search added')
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#6B6B80]">These terms appear as suggestions in the storefront search bar. Drag or use arrows to reorder.</p>
      <div className="space-y-2">
        {sorted.map((term, idx) => (
          <div key={term.id} className={cn('flex items-center gap-3 p-3 rounded-xl border transition-all', term.isActive ? 'bg-[#111118] border-[#2A2A3E]' : 'bg-[#0A0A0F] border-[#1E1E2E] opacity-60')}>
            <span className="w-5 text-center text-xs text-[#3A3A50] font-mono">{idx+1}</span>
            <span className="flex-1 text-sm font-medium text-white">{term.term}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => move(term.id, 'up')} disabled={idx === 0} aria-label="Move up" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B6B80] hover:bg-[#1E1E2E] disabled:opacity-30 transition-colors">
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => move(term.id, 'down')} disabled={idx === sorted.length-1} aria-label="Move down" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B6B80] hover:bg-[#1E1E2E] disabled:opacity-30 transition-colors">
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateTrendingSearch(term.id, { isActive: !term.isActive })}
                className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors', term.isActive ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#1E1E2E] text-[#6B6B80]')}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => deleteTrendingSearch(term.id)} className="w-7 h-7 rounded-lg bg-[#EF4444]/10 hover:bg-[#EF4444]/20 flex items-center justify-center text-[#EF4444] transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newTerm}
          onChange={e => setNewTerm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add new trending search..."
          className="flex-1 h-10 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none"
        />
        <button onClick={handleAdd} disabled={adding || !newTerm.trim()} className="h-10 px-4 bg-[#FF7A00] hover:bg-[#FF9A40] text-white rounded-xl text-sm font-bold disabled:opacity-50 flex items-center gap-2 transition-colors">
          {adding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
        </button>
      </div>
    </div>
  )
}

// ─── Pinned Products Tab ──────────────────────────────────────────────────────
function PinnedTab() {
  const { pinnedProducts, addPinnedProduct, deletePinnedProduct } = useStorefrontStore()
  const [form, setForm] = useState({ searchTerm: '', productId: '', productName: '', pinPosition: 1 })
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    if (!form.searchTerm || !form.productId) return
    setAdding(true)
    await addPinnedProduct(form)
    setForm({ searchTerm: '', productId: '', productName: '', pinPosition: 1 })
    setAdding(false)
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#6B6B80]">Force specific products to rank at a position for a given search term. Useful for campaigns.</p>
      <div className="space-y-2">
        {pinnedProducts.map(pin => (
          <div key={pin.id} className="flex items-center gap-3 p-3 bg-[#111118] border border-[#2A2A3E] rounded-xl">
            <Pin className="w-4 h-4 text-[#FF7A00] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono bg-[#1A1A26] text-[#FF9A40] px-2 py-0.5 rounded-md">"{pin.searchTerm}"</span>
                <span className="text-xs text-[#6B6B80]">→</span>
                <span className="text-sm font-semibold text-white truncate">{pin.productName}</span>
              </div>
              <p className="text-[10px] text-[#6B6B80] mt-0.5">Position #{pin.pinPosition} · ID: {pin.productId}</p>
            </div>
            <button onClick={() => deletePinnedProduct(pin.id)} className="w-7 h-7 rounded-lg bg-[#EF4444]/10 hover:bg-[#EF4444]/20 flex items-center justify-center text-[#EF4444] transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {pinnedProducts.length === 0 && <p className="text-sm text-[#6B6B80] text-center py-6">No pinned products yet</p>}
      </div>
      <div className="p-4 bg-[#111118] border border-[#2A2A3E] rounded-xl space-y-3">
        <p className="text-xs font-semibold text-[#A0A0B8]">Add Pin</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={form.searchTerm} onChange={e => setForm(f => ({ ...f, searchTerm: e.target.value }))} placeholder='Search term (e.g. "diwali")' className="h-10 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none" />
          <input value={form.productName} onChange={e => setForm(f => ({ ...f, productName: e.target.value, productId: 'prod_' + e.target.value.toLowerCase().replace(/\s+/g, '_') }))} placeholder="Product name" className="h-10 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none" />
          <input value={form.pinPosition} onChange={e => setForm(f => ({ ...f, pinPosition: Number(e.target.value) }))} type="number" min={1} max={10} placeholder="Position" className="h-10 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none" />
          <button onClick={handleAdd} disabled={adding || !form.searchTerm || !form.productName} className="h-10 bg-[#FF7A00] hover:bg-[#FF9A40] text-white rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
            {adding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Pin Product
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Synonyms Tab ─────────────────────────────────────────────────────────────
function SynonymsTab() {
  const { searchSynonyms, addSearchSynonym, updateSearchSynonym, deleteSearchSynonym } = useStorefrontStore()
  const [newTerm, setNewTerm] = useState('')
  const [newSynonyms, setNewSynonyms] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editSynonyms, setEditSynonyms] = useState('')

  const handleAdd = async () => {
    const synonymList = newSynonyms.split(',').map(s => s.trim()).filter(Boolean)
    if (!newTerm.trim() || synonymList.length === 0) return
    setAdding(true)
    await addSearchSynonym(newTerm.trim(), synonymList)
    setNewTerm(''); setNewSynonyms('')
    setAdding(false)
  }

  const handleEditSave = async (id: string) => {
    const synonyms = editSynonyms.split(',').map(s => s.trim()).filter(Boolean)
    await updateSearchSynonym(id, synonyms)
    setEditingId(null)
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#6B6B80]">When a customer searches for a term, it will also match its synonyms, improving search recall.</p>
      <div className="space-y-2">
        {searchSynonyms.map(syn => (
          <div key={syn.id} className="p-3 bg-[#111118] border border-[#2A2A3E] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white font-mono">{syn.term}</span>
              <div className="flex gap-1">
                <button onClick={() => { setEditingId(syn.id); setEditSynonyms(syn.synonyms.join(', ')) }} className="text-xs text-[#FF7A00] hover:underline">Edit</button>
                <button onClick={() => deleteSearchSynonym(syn.id)} className="text-xs text-[#EF4444] hover:underline ml-2">Delete</button>
              </div>
            </div>
            {editingId === syn.id ? (
              <div className="flex gap-2 mt-2">
                <input value={editSynonyms} onChange={e => setEditSynonyms(e.target.value)} className="flex-1 h-9 bg-[#1A1A26] border border-[#2A2A3E] rounded-lg px-3 text-xs text-white focus:border-[#FF7A00] outline-none" />
                <button onClick={() => handleEditSave(syn.id)} className="h-9 px-3 bg-[#FF7A00] text-white rounded-lg text-xs font-bold"><Check className="w-3.5 h-3.5" /></button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {syn.synonyms.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-[#1E1E2E] text-[#A0A0B8] rounded-full text-xs">{s}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 bg-[#111118] border border-[#2A2A3E] rounded-xl space-y-3">
        <p className="text-xs font-semibold text-[#A0A0B8]">Add Synonym Group</p>
        <input value={newTerm} onChange={e => setNewTerm(e.target.value)} placeholder="Term (e.g. diya)" className="w-full h-10 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none" />
        <input value={newSynonyms} onChange={e => setNewSynonyms(e.target.value)} placeholder="Synonyms (comma-separated): deepak, oil lamp..." className="w-full h-10 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none" />
        <button onClick={handleAdd} disabled={adding || !newTerm || !newSynonyms} className="w-full h-10 bg-[#FF7A00] hover:bg-[#FF9A40] text-white rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
          {adding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Group
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SearchMerchandisingPage() {
  const [activeTab, setActiveTab] = useState<Tab>('trending')
  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'trending', label: 'Trending Searches', icon: SearchIcon },
    { id: 'pinned', label: 'Pinned Results', icon: Pin },
    { id: 'synonyms', label: 'Synonyms', icon: Tag },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#BE185D] flex items-center justify-center">
          <SearchIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Search & Merchandising</h1>
          <p className="text-sm text-[#6B6B80]">Control search suggestions, rankings & synonyms</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#111118] border border-[#2A2A3E] rounded-xl overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex-1 justify-center',
                activeTab === tab.id ? 'bg-[#FF7A00] text-white' : 'text-[#6B6B80] hover:text-white hover:bg-[#1E1E2E]'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5">
        {activeTab === 'trending' && <TrendingTab />}
        {activeTab === 'pinned' && <PinnedTab />}
        {activeTab === 'synonyms' && <SynonymsTab />}
      </div>
    </div>
  )
}
