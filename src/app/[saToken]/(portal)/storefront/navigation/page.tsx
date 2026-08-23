'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Menu, Plus, Edit3, Trash2, Eye, EyeOff,
  ChevronRight, ChevronDown, GripVertical, Save, X
} from 'lucide-react'
import { useStorefrontStore } from '@/lib/store/storefront-store'
import { ResponsiveSheet } from '@/components/ui/responsive-sheet'
import { cn } from '@/lib/utils'
import type { SANavMenuItem } from '@/lib/mock/sa-storefront.mock'
import { toast } from 'sonner'

function NavItemRow({
  item, isChild = false,
  onEdit, onDelete, onToggle
}: {
  item: SANavMenuItem
  isChild?: boolean
  onEdit: (item: SANavMenuItem) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}) {
  return (
    <div className={cn(
      'flex items-center gap-2.5 p-3 rounded-xl border transition-all',
      isChild ? 'ml-6 bg-[#0A0A0F] border-[#1E1E2E]' : 'bg-[#111118] border-[#2A2A3E]',
      !item.isVisible && 'opacity-50'
    )}>
      <GripVertical className="w-3.5 h-3.5 text-[#3A3A50] shrink-0 hidden md:block" />
      <div className="flex-1 min-w-0 flex items-center gap-2">
        {isChild && <ChevronRight className="w-3 h-3 text-[#3A3A50] shrink-0" />}
        <span className="text-sm font-semibold text-white truncate">{item.label}</span>
        {item.badge && (
          <span className="px-1.5 py-0.5 bg-[#FF7A00]/20 text-[#FF7A00] rounded-full text-[10px] font-bold shrink-0">
            {item.badge}
          </span>
        )}
        <span className="text-xs text-[#6B6B80] truncate hidden sm:block">{item.href}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onToggle(item.id)}
          aria-label={item.isVisible ? 'Hide item' : 'Show item'}
          className={cn(
            'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
            item.isVisible ? 'text-[#22C55E] bg-[#22C55E]/10' : 'text-[#6B6B80] bg-[#1E1E2E]'
          )}
        >
          {item.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </button>
        <button
          onClick={() => onEdit(item)}
          aria-label="Edit menu item"
          className="w-7 h-7 rounded-lg bg-[#1E1E2E] hover:bg-[#2A2A3E] flex items-center justify-center text-[#A0A0B8] hover:text-white transition-colors"
        >
          <Edit3 className="w-3 h-3" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          aria-label="Delete menu item"
          className="w-7 h-7 rounded-lg bg-[#EF4444]/10 hover:bg-[#EF4444]/20 flex items-center justify-center text-[#EF4444] transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

function NavPreview({ items, mode }: { items: SANavMenuItem[], mode: 'mobile' | 'desktop' }) {
  const topLevel = items.filter(i => !i.parentId && i.isVisible).sort((a,b) => a.order - b.order)

  if (mode === 'desktop') return (
    <div className="bg-white border-b px-4 py-3 flex items-center gap-6">
      <span className="text-orange-500 font-bold">Bharat Bazaar</span>
      {topLevel.map(item => (
        <div key={item.id} className="flex items-center gap-1 text-sm text-gray-700 cursor-pointer hover:text-orange-500">
          {item.label}
          {item.badge && <span className="text-[10px] bg-orange-100 text-orange-600 px-1 rounded-full">{item.badge}</span>}
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <span className="text-orange-500 font-bold text-sm">Bharat Bazaar</span>
      <div className="flex flex-col gap-0.5">
        <div className="w-4 h-0.5 bg-gray-500" />
        <div className="w-4 h-0.5 bg-gray-500" />
        <div className="w-4 h-0.5 bg-gray-500" />
      </div>
    </div>
  )
}

export default function NavigationPage() {
  const { navMenuItems, addNavMenuItem, updateNavMenuItem, deleteNavMenuItem } = useStorefrontStore()
  const [editingItem, setEditingItem] = useState<SANavMenuItem | null>(null)
  const [addingNew, setAddingNew] = useState(false)
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop')
  const [form, setForm] = useState({ label: '', href: '', badge: '', isVisible: true })
  const [saving, setSaving] = useState(false)
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set())

  const topLevel = navMenuItems.filter(i => !i.parentId).sort((a,b) => a.order - b.order)

  const handleToggle = async (id: string) => {
    const item = navMenuItems.find(i => i.id === id)
    if (item) await updateNavMenuItem(id, { isVisible: !item.isVisible })
  }

  const startEdit = (item: SANavMenuItem) => {
    setEditingItem(item)
    setForm({ label: item.label, href: item.href, badge: item.badge || '', isVisible: item.isVisible })
    setAddingNew(false)
  }

  const handleSave = async () => {
    setSaving(true)
    if (editingItem) {
      await updateNavMenuItem(editingItem.id, form)
      toast.success('Menu item updated')
    } else {
      await addNavMenuItem({ ...form, order: navMenuItems.length + 1 })
      toast.success('Menu item added')
    }
    setEditingItem(null)
    setAddingNew(false)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await deleteNavMenuItem(id)
    toast.success('Menu item removed')
  }

  const isSheetOpen = !!editingItem || addingNew

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center">
            <Menu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Navigation & Menus</h1>
            <p className="text-sm text-[#6B6B80]">{topLevel.filter(i => i.isVisible).length} visible top-level items</p>
          </div>
        </div>
        <button
          onClick={() => { setAddingNew(true); setEditingItem(null); setForm({ label: '', href: '', badge: '', isVisible: true }) }}
          className="flex items-center gap-2 h-10 px-4 bg-[#FF7A00] hover:bg-[#FF9A40] text-white rounded-xl text-sm font-bold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Nav Preview */}
      <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-[#6B6B80] uppercase tracking-wider">Live Preview</span>
          <div className="flex items-center bg-[#1A1A26] border border-[#2A2A3E] rounded-lg p-0.5 gap-0.5 ml-auto">
            {(['desktop', 'mobile'] as const).map(m => (
              <button key={m} onClick={() => setPreviewMode(m)} className={cn('px-3 py-1 rounded-md text-xs font-semibold capitalize transition-colors', previewMode === m ? 'bg-[#FF7A00] text-white' : 'text-[#6B6B80]')}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="border border-[#2A2A3E] rounded-xl overflow-hidden">
          <NavPreview items={navMenuItems} mode={previewMode} />
          {/* Dropdown preview for desktop */}
          {previewMode === 'desktop' && (
            <div className="bg-white px-4 pt-1 pb-2">
              <p className="text-xs text-gray-400 italic">Hover over items to see dropdown sub-menus (rendered in storefront)</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-white">Menu Structure</h2>
        {topLevel.map(item => {
          const children = navMenuItems.filter(i => i.parentId === item.id).sort((a,b) => a.order - b.order)
          const expanded = expandedParents.has(item.id)
          return (
            <div key={item.id}>
              <NavItemRow item={item} onEdit={startEdit} onDelete={handleDelete} onToggle={handleToggle} />
              {children.length > 0 && (
                <>
                  <button
                    onClick={() => {
                      const s = new Set(expandedParents)
                      expanded ? s.delete(item.id) : s.add(item.id)
                      setExpandedParents(s)
                    }}
                    className="ml-6 mt-1 flex items-center gap-1 text-[10px] text-[#6B6B80] hover:text-white transition-colors"
                  >
                    <ChevronDown className={cn('w-3 h-3 transition-transform', expanded && 'rotate-180')} />
                    {children.length} sub-item{children.length !== 1 ? 's' : ''}
                  </button>
                  <AnimatePresence>
                    {expanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-1 space-y-1">
                        {children.map(child => (
                          <NavItemRow key={child.id} item={child} isChild onEdit={startEdit} onDelete={handleDelete} onToggle={handleToggle} />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Edit Sheet */}
      <ResponsiveSheet
        isOpen={isSheetOpen}
        onClose={() => { setEditingItem(null); setAddingNew(false) }}
        title={editingItem ? `Edit: ${editingItem.label}` : 'Add Menu Item'}
        desktopWidth="w-[480px]"
      >
        <div className="p-5 space-y-4">
          {[
            { key: 'label', label: 'Label', placeholder: 'e.g. Shop' },
            { key: 'href', label: 'Link URL', placeholder: 'e.g. /products' },
            { key: 'badge', label: 'Badge (optional)', placeholder: 'e.g. New, Sale' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">{label}</label>
              <input
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full h-11 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none"
              />
            </div>
          ))}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isVisible}
              onChange={e => setForm(f => ({ ...f, isVisible: e.target.checked }))}
              className="rounded border-[#3A3A50] bg-[#111118] text-[#FF7A00] w-4 h-4"
            />
            <span className="text-sm text-[#A0A0B8]">Visible in navigation</span>
          </label>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !form.label || !form.href}
              className="flex-1 h-11 bg-[#FF7A00] hover:bg-[#FF9A40] text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditingItem(null); setAddingNew(false) }} className="h-11 px-4 bg-[#1E1E2E] text-[#A0A0B8] rounded-xl text-sm font-semibold">
              Cancel
            </button>
          </div>
        </div>
      </ResponsiveSheet>
    </div>
  )
}
