'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Plus, Edit3, Trash2, Check, X, ChevronRight, Search, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { useStorefrontStore } from '@/lib/store/storefront-store'
import { saShippingZoneSchema, type SAShippingZoneInput } from '@/lib/validators/sa-storefront.validators'
import type { SAShippingZone } from '@/lib/mock/sa-storefront.mock'
import { ResponsiveSheet } from '@/components/ui/responsive-sheet'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

function ZoneCard({ zone, onEdit, onDelete }: {
  zone: SAShippingZone
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className={cn(
      'bg-[#111118] border rounded-2xl p-4 transition-all',
      zone.isActive ? 'border-[#2A2A3E]' : 'border-[#1E1E2E] opacity-60'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-[#FF7A00]" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{zone.name}</p>
            <p className="text-xs text-[#6B6B80]">{zone.states.length} state{zone.states.length !== 1 ? 's' : ''} · {zone.estimatedDaysMin}–{zone.estimatedDaysMax} days</p>
          </div>
        </div>
        <span className={cn('px-2 py-0.5 text-[10px] font-bold rounded-full', zone.isActive ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#3A3A50]/20 text-[#6B6B80]')}>
          {zone.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Rates */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Base Rate', value: `₹${zone.baseRate}` },
          { label: 'Per Kg', value: `₹${zone.perKgRate}` },
          { label: 'Free Above', value: `₹${zone.freeShippingThreshold}` },
        ].map(({ label, value }) => (
          <div key={label} className="p-2 bg-[#1A1A26] rounded-lg text-center">
            <p className="text-[10px] text-[#6B6B80] mb-0.5">{label}</p>
            <p className="text-sm font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* States preview */}
      <div className="flex flex-wrap gap-1 mb-3">
        {zone.states.slice(0, 4).map(s => (
          <span key={s} className="px-2 py-0.5 bg-[#1E1E2E] text-[#A0A0B8] rounded-full text-[10px]">{s}</span>
        ))}
        {zone.states.length > 4 && (
          <span className="px-2 py-0.5 bg-[#1E1E2E] text-[#6B6B80] rounded-full text-[10px]">+{zone.states.length - 4} more</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={onEdit} className="flex-1 h-9 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
          <Edit3 className="w-3.5 h-3.5" /> Edit Zone
        </button>
        <button onClick={onDelete} className="h-9 px-3 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] rounded-xl transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

function ZoneForm({
  defaultValues,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<SAShippingZoneInput>
  onSubmit: (data: SAShippingZoneInput) => Promise<void>
  onCancel: () => void
}) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SAShippingZoneInput>({
    resolver: zodResolver(saShippingZoneSchema),
    defaultValues: { ...defaultValues, states: defaultValues?.states ?? [] }
  })
  const [saving, setSaving] = useState(false)
  const selectedStates = watch('states') ?? []

  const toggleState = (state: string) => {
    setValue('states', selectedStates.includes(state)
      ? selectedStates.filter(s => s !== state)
      : [...selectedStates, state]
    )
  }

  const handleFormSubmit = async (data: SAShippingZoneInput) => {
    setSaving(true)
    await onSubmit(data)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-5 space-y-5">
      {/* Name */}
      <div>
        <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">Zone Name <span className="text-[#EF4444]">*</span></label>
        <input {...register('name')} placeholder="e.g. Metro Cities" className="w-full h-11 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none" />
        {errors.name && <p className="text-[#EF4444] text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* Rates */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { field: 'baseRate' as const, label: 'Base Rate (₹)' },
          { field: 'perKgRate' as const, label: 'Per Kg (₹)' },
          { field: 'freeShippingThreshold' as const, label: 'Free Above (₹)' },
        ].map(({ field, label }) => (
          <div key={field}>
            <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">{label}</label>
            <input {...register(field)} type="number" min={0} className="w-full h-11 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none" />
            {errors[field] && <p className="text-[#EF4444] text-[10px] mt-1">{errors[field]?.message}</p>}
          </div>
        ))}
      </div>

      {/* Delivery days */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { field: 'estimatedDaysMin' as const, label: 'Min Days' },
          { field: 'estimatedDaysMax' as const, label: 'Max Days' },
        ].map(({ field, label }) => (
          <div key={field}>
            <label className="text-xs font-semibold text-[#A0A0B8] block mb-1.5">{label}</label>
            <input {...register(field)} type="number" min={1} className="w-full h-11 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none" />
            {errors[field] && <p className="text-[#EF4444] text-[10px] mt-1">{errors[field]?.message}</p>}
          </div>
        ))}
      </div>

      {/* States selection */}
      <div>
        <label className="text-xs font-semibold text-[#A0A0B8] block mb-2">
          States <span className="text-[#EF4444]">*</span>
          <span className="ml-2 text-[#6B6B80] font-normal">{selectedStates.length} selected</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
          {INDIAN_STATES.map(state => (
            <button
              key={state}
              type="button"
              onClick={() => toggleState(state)}
              className={cn(
                'text-left px-2.5 py-1.5 rounded-lg text-xs transition-all font-medium',
                selectedStates.includes(state)
                  ? 'bg-[#FF7A00] text-white'
                  : 'bg-[#1A1A26] text-[#A0A0B8] hover:bg-[#2A2A3E] hover:text-white border border-[#2A2A3E]'
              )}
            >
              {state}
            </button>
          ))}
        </div>
        {errors.states && <p className="text-[#EF4444] text-xs mt-1">{errors.states.message}</p>}
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving} className="flex-1 h-11 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-500/20">
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Zone'}
        </button>
        <button type="button" onClick={onCancel} className="h-11 px-4 bg-[#1E1E2E] text-[#A0A0B8] rounded-xl text-sm font-semibold">Cancel</button>
      </div>
    </form>
  )
}

export default function ShippingZonesPage() {
  const { shippingZones, addShippingZone, updateShippingZone, deleteShippingZone, checkPincodeServiceability } = useStorefrontStore()
  const [editingZone, setEditingZone] = useState<SAShippingZone | null>(null)
  const [addingZone, setAddingZone] = useState(false)
  const [pincodeQuery, setPincodeQuery] = useState('')
  const [pincodeResult, setPincodeResult] = useState<ReturnType<typeof checkPincodeServiceability> | null>(null)

  const handleCheckPincode = () => {
    if (pincodeQuery.length !== 6) { toast.error('Enter a valid 6-digit PIN code'); return }
    const result = checkPincodeServiceability(pincodeQuery)
    setPincodeResult(result)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0F766E] flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Shipping Zones</h1>
            <p className="text-sm text-[#6B6B80]">{shippingZones.filter(z => z.isActive).length} active zones</p>
          </div>
        </div>
        <button
          onClick={() => setAddingZone(true)}
          className="flex items-center gap-2 h-10 px-4 bg-[#FF7A00] hover:bg-[#FF9A40] text-white rounded-xl text-sm font-bold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Zone
        </button>
      </div>

      {/* Pincode lookup */}
      <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl p-4">
        <p className="text-sm font-bold text-white mb-3">Pincode Serviceability Lookup</p>
        <div className="flex gap-2">
          <input
            value={pincodeQuery}
            onChange={e => { setPincodeQuery(e.target.value.replace(/\D/g,'').slice(0,6)); setPincodeResult(null) }}
            onKeyDown={e => e.key === 'Enter' && handleCheckPincode()}
            placeholder="Enter 6-digit PIN code (e.g. 110001)"
            maxLength={6}
            className="flex-1 h-11 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white font-mono focus:border-[#FF7A00] outline-none"
          />
          <button onClick={handleCheckPincode} className="h-11 px-4 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors">
            <Search className="w-4 h-4 text-[#FF7A00]" /> Check
          </button>
        </div>
        {pincodeResult !== undefined && (
          <div className={cn('mt-3 p-3 rounded-xl border flex items-start gap-3', pincodeResult ? 'bg-[#22C55E]/5 border-[#22C55E]/20' : 'bg-[#EF4444]/5 border-[#EF4444]/20')}>
            {pincodeResult ? (
              <>
                <CheckCircle className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#22C55E]">Serviceable: {pincodeResult.city}</p>
                  <p className="text-xs text-[#6B6B80] mt-0.5">
                    Zone: {shippingZones.find(z => z.id === pincodeResult.zoneId)?.name ?? pincodeResult.zoneId}
                    {' · '}COD: {pincodeResult.codAvailable ? '✓ Available' : '✗ Not available'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#EF4444]">Not serviceable</p>
                  <p className="text-xs text-[#6B6B80] mt-0.5">PIN code {pincodeQuery} is not in any shipping zone.</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Zone cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shippingZones.map(zone => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            onEdit={() => setEditingZone(zone)}
            onDelete={async () => { await deleteShippingZone(zone.id); toast.success('Zone deleted') }}
          />
        ))}
      </div>

      {/* Edit / Add Sheet */}
      <ResponsiveSheet
        isOpen={!!editingZone || addingZone}
        onClose={() => { setEditingZone(null); setAddingZone(false) }}
        title={editingZone ? `Edit: ${editingZone.name}` : 'New Shipping Zone'}
        desktopWidth="w-[580px]"
      >
        <ZoneForm
          defaultValues={editingZone ?? undefined}
          onSubmit={async (data) => {
            if (editingZone) {
              await updateShippingZone(editingZone.id, data)
            } else {
              await addShippingZone({ ...data, isActive: true })
              toast.success('Zone created')
            }
            setEditingZone(null)
            setAddingZone(false)
          }}
          onCancel={() => { setEditingZone(null); setAddingZone(false) }}
        />
      </ResponsiveSheet>
    </div>
  )
}
