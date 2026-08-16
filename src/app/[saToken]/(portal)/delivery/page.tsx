'use client'
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Truck, Star, Package, CheckCircle, XCircle, Clock,
  AlertTriangle, AlertCircle, Phone, Mail, MapPin, Search, Filter,
  TrendingUp, RefreshCw, ChevronRight, Bike, User, Plus, X
} from 'lucide-react'
import { MOCK_SA_DELIVERY } from '@/lib/mock/sa-delivery.mock'
import type { SADeliveryPartner, DeliveryPartnerStatus } from '@/types/super-admin.types'
import { ResponsiveSheet } from '@/components/ui/responsive-sheet'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const STATUS_CONFIG: Record<DeliveryPartnerStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  active:      { label: 'Active',      color: '#22C55E', bg: '#22C55E15', icon: CheckCircle },
  on_delivery: { label: 'On Delivery', color: '#3B82F6', bg: '#3B82F615', icon: Truck },
  inactive:    { label: 'Inactive',    color: '#6B7280', bg: '#6B728015', icon: Clock },
  suspended:   { label: 'Suspended',   color: '#EF4444', bg: '#EF444415', icon: AlertTriangle },
}

const VEHICLE_ICON: Record<string, string> = {
  bike: '🏍️', scooter: '🛵', cycle: '🚲', van: '🚐'
}

function StatusBadge({ status }: { status: DeliveryPartnerStatus }) {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
      <span className="text-sm font-bold text-white">{rating.toFixed(1)}</span>
    </div>
  )
}

// ─── Desktop Row ─────────────────────────────────────────────────────────────
function PartnerRow({ partner, onClick }: { partner: SADeliveryPartner; onClick: () => void }) {
  return (
    <tr onClick={onClick} className="border-b border-[#1E1E2E] hover:bg-[#1A1A26] cursor-pointer transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E1E2E] to-[#2A2A3E] flex items-center justify-center text-base">
            {VEHICLE_ICON[partner.vehicleType]}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{partner.name}</p>
            <p className="text-xs text-[#6B6B80]">{partner.city}, {partner.state}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><StatusBadge status={partner.status} /></td>
      <td className="px-4 py-3"><RatingStars rating={partner.rating} /></td>
      <td className="px-4 py-3 text-sm text-white font-semibold">{partner.totalDeliveries.toLocaleString()}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="flex-1 h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden w-16">
            <div className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-[#4ADE80]" style={{ width: `${partner.successRate}%` }} />
          </div>
          <span className="text-xs font-semibold text-[#22C55E]">{partner.successRate}%</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-[#6B6B80]">{partner.activeOrders}</td>
      <td className="px-4 py-3">
        <ChevronRight className="w-4 h-4 text-[#3A3A50] group-hover:text-[#FF7A00] transition-colors" />
      </td>
    </tr>
  )
}

// ─── Mobile Card ──────────────────────────────────────────────────────────────
function PartnerCard({ partner, onClick }: { partner: SADeliveryPartner; onClick: () => void }) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className="w-full p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl text-left hover:border-[#FF7A00]/30 active:scale-[0.98] transition-all"
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E1E2E] flex items-center justify-center text-xl">
            {VEHICLE_ICON[partner.vehicleType]}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{partner.name}</p>
            <p className="text-xs text-[#6B6B80]">{partner.city}, {partner.state}</p>
          </div>
        </div>
        <StatusBadge status={partner.status} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-xs text-[#6B6B80]">Deliveries</p>
          <p className="text-sm font-bold text-white">{partner.totalDeliveries.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#6B6B80]">Success</p>
          <p className="text-sm font-bold text-[#22C55E]">{partner.successRate}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#6B6B80]">Rating</p>
          <RatingStars rating={partner.rating} />
        </div>
      </div>
    </motion.button>
  )
}

// ─── Detail Sheet ─────────────────────────────────────────────────────────────
function PartnerDetailSheet({ partner, onClose, onStatusChange }: {
  partner: SADeliveryPartner
  onClose: () => void
  onStatusChange: (id: string, status: DeliveryPartnerStatus) => void
}) {
  const [changingStatus, setChangingStatus] = useState(false)

  const handleStatusChange = async (status: DeliveryPartnerStatus) => {
    setChangingStatus(true)
    await new Promise(r => setTimeout(r, 500))
    onStatusChange(partner.id, status)
    setChangingStatus(false)
    toast.success(`${partner.name} marked as ${STATUS_CONFIG[status].label}`)
  }

  return (
    <div className="p-5 space-y-5">
      {/* Profile */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E1E2E] to-[#2A2A3E] flex items-center justify-center text-3xl">
          {VEHICLE_ICON[partner.vehicleType]}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{partner.name}</h3>
          <StatusBadge status={partner.status} />
          <p className="text-xs text-[#6B6B80] mt-1">Joined {format(new Date(partner.joinedAt), 'MMM yyyy')}</p>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-[#6B6B80] uppercase tracking-wider">Contact</h4>
        {[
          { icon: Phone, label: partner.phone },
          { icon: Mail, label: partner.email },
          { icon: MapPin, label: `${partner.city}, ${partner.state}` },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 p-3 bg-[#1A1A26] rounded-xl">
            <Icon className="w-4 h-4 text-[#FF7A00]" />
            <span className="text-sm text-white">{label}</span>
          </div>
        ))}
      </div>

      {/* Performance stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Deliveries', value: partner.totalDeliveries.toLocaleString(), color: 'text-white' },
          { label: 'Active Orders', value: partner.activeOrders.toString(), color: 'text-[#3B82F6]' },
          { label: 'Success Rate', value: `${partner.successRate}%`, color: 'text-[#22C55E]' },
          { label: 'Rating', value: `${partner.rating} ★`, color: 'text-[#F59E0B]' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-3 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl">
            <p className="text-[10px] text-[#6B6B80] uppercase tracking-wide mb-1">{label}</p>
            <p className={cn('text-lg font-bold', color)}>{value}</p>
          </div>
        ))}
      </div>

      {/* Success rate bar */}
      <div>
        <div className="flex justify-between text-xs text-[#6B6B80] mb-1.5">
          <span>Delivery Success Rate</span>
          <span className="text-[#22C55E] font-bold">{partner.successRate}%</span>
        </div>
        <div className="h-2.5 bg-[#1E1E2E] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-[#4ADE80]" style={{ width: `${partner.successRate}%` }} />
        </div>
      </div>

      {/* Status Actions */}
      <div>
        <h4 className="text-xs font-bold text-[#6B6B80] uppercase tracking-wider mb-3">Change Status</h4>
        <div className="grid grid-cols-2 gap-2">
          {(['active', 'inactive', 'suspended'] as DeliveryPartnerStatus[]).filter(s => s !== partner.status).map(status => {
            const cfg = STATUS_CONFIG[status]
            return (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={changingStatus}
                className="p-3 rounded-xl border text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                style={{ borderColor: `${cfg.color}40`, background: cfg.bg, color: cfg.color }}
              >
                {changingStatus ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : React.createElement(cfg.icon, { className: 'w-3.5 h-3.5' })}
                Mark {cfg.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Create Delivery Partner Modal ───────────────────────────────────────────
const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
]

const partnerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid Indian mobile number required (10 digits, starts with 6-9)'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  vehicleType: z.enum(['bike', 'scooter', 'cycle', 'van']),
})

type NewPartnerForm = z.infer<typeof partnerSchema>

function CreatePartnerModal({ onClose, onCreate }: {
  onClose: () => void
  onCreate: (partner: SADeliveryPartner) => void
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid, touchedFields }
  } = useForm<NewPartnerForm>({
    resolver: zodResolver(partnerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      city: '',
      state: 'Maharashtra',
      vehicleType: 'bike'
    }
  })

  const onSubmit = async (data: NewPartnerForm) => {
    await new Promise(r => setTimeout(r, 800))
    const newPartner: SADeliveryPartner = {
      id: `dp-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone,
      status: 'active',
      totalDeliveries: 0,
      successRate: 100,
      activeOrders: 0,
      rating: 0,
      city: data.city.trim(),
      state: data.state,
      joinedAt: new Date().toISOString(),
      vehicleType: data.vehicleType,
    }
    onCreate(newPartner)
    toast.success(`${data.name} added as a delivery partner!`)
    onClose()
  }

  const Field = ({ id, label, placeholder, type = 'text', registerFn, error, touched }: any) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-[#A0A0B8]">
        {label} <span className="text-red-500 ml-1">*</span>
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={isSubmitting}
          {...registerFn}
          className={cn(
            'w-full h-12 bg-[#1A1A26] border-2 rounded-xl px-3 text-base text-white outline-none transition-all duration-200',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : touched && !error 
                    ? 'border-green-500 focus:border-green-500' 
                    : 'border-[#2A2A3E] focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20'
          )}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-[#0D0D14] border border-[#2A2A3E] rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E2E]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-bold text-white">Add Delivery Partner</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-lg bg-[#1A1A26] hover:bg-[#2A2A3E] flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-[#6B6B80]" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <Field id="name" label="Full Name" placeholder="e.g. Raju Kumar"
            registerFn={register('name')} error={errors.name?.message} touched={touchedFields.name} />
          
          <Field id="email" label="Email Address" placeholder="e.g. raju@delivery.in" type="email"
            registerFn={register('email')} error={errors.email?.message} touched={touchedFields.email} />
          
          <Field id="phone" label="Mobile Number (10 digits)" placeholder="e.g. 9876543210"
            registerFn={register('phone')} error={errors.phone?.message} touched={touchedFields.phone} />

          <div className="grid grid-cols-2 gap-3">
            <Field id="city" label="City" placeholder="e.g. Mumbai"
              registerFn={register('city')} error={errors.city?.message} touched={touchedFields.city} />
            
            <div className="space-y-1.5">
              <label htmlFor="state" className="text-xs font-semibold text-[#A0A0B8]">
                State <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="state"
                disabled={isSubmitting}
                {...register('state')}
                className="w-full h-12 bg-[#1A1A26] border-2 border-[#2A2A3E] focus:border-[#FF7A00] rounded-xl px-3 text-base text-white outline-none transition-all"
              >
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A0A0B8]">
              Vehicle Type <span className="text-red-500 ml-1">*</span>
            </label>
            <Controller
              name="vehicleType"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-4 gap-2">
                  {(['bike', 'scooter', 'cycle', 'van'] as const).map(v => (
                    <button
                      key={v}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => field.onChange(v)}
                      className={cn(
                        'h-14 rounded-xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-all disabled:opacity-50',
                        field.value === v ? 'border-[#FF7A00] bg-[#FF7A00]/10 text-[#FF7A00]' : 'border-[#2A2A3E] text-[#6B6B80] hover:border-[#3A3A5E] hover:text-white'
                      )}
                    >
                      <span className="text-lg">{VEHICLE_ICON[v]}</span>
                      <span className="capitalize">{v}</span>
                    </button>
                  ))}
                </div>
              )}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 px-5 py-4 border-t border-[#1E1E2E]">
          <button onClick={onClose} disabled={isSubmitting} className="flex-1 h-11 bg-[#1A1A26] hover:bg-[#2A2A3E] text-[#A0A0B8] rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting || !isValid} className="flex-1 h-11 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-500/20">
            {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {isSubmitting ? 'Adding...' : 'Add Partner'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DeliveryPartnersPage() {
  const isMobile = useIsMobile()
  const [partners, setPartners] = useState<SADeliveryPartner[]>(MOCK_SA_DELIVERY)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<DeliveryPartnerStatus | 'all'>('all')
  const [selected, setSelected] = useState<SADeliveryPartner | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const filtered = useMemo(() => partners.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  }), [partners, search, statusFilter])

  const stats = useMemo(() => ({
    total: partners.length,
    active: partners.filter(p => p.status === 'active').length,
    onDelivery: partners.filter(p => p.status === 'on_delivery').length,
    suspended: partners.filter(p => p.status === 'suspended').length,
    avgRating: (partners.reduce((a, b) => a + b.rating, 0) / partners.length).toFixed(1),
  }), [partners])

  const handleStatusChange = (id: string, status: DeliveryPartnerStatus) => {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  const handleCreate = (partner: SADeliveryPartner) => {
    setPartners(prev => [partner, ...prev])
  }

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Delivery Partners</h1>
              <p className="text-sm text-[#6B6B80]">{stats.total} total partners</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 h-10 px-4 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Add Partner
          </button>
        </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active', value: stats.active, color: '#22C55E' },
          { label: 'On Delivery', value: stats.onDelivery, color: '#3B82F6' },
          { label: 'Suspended', value: stats.suspended, color: '#EF4444' },
          { label: 'Avg Rating', value: `${stats.avgRating} ★`, color: '#F59E0B' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl">
            <p className="text-[10px] text-[#6B6B80] uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B80]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or city..."
            className="w-full h-11 bg-[#111118] border border-[#2A2A3E] rounded-xl pl-9 pr-4 text-sm text-white focus:border-[#FF7A00] outline-none"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {(['all', 'active', 'on_delivery', 'inactive', 'suspended'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all h-11',
                statusFilter === s
                  ? 'bg-[#FF7A00] text-white'
                  : 'bg-[#111118] border border-[#2A2A3E] text-[#6B6B80] hover:text-white'
              )}
            >
              {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isMobile ? (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map(p => (
              <PartnerCard key={p.id} partner={p} onClick={() => setSelected(p)} />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Truck className="w-12 h-12 text-[#3A3A50] mb-3" />
              <p className="text-sm text-[#6B6B80]">No partners found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E1E2E]">
                {['Partner', 'Status', 'Rating', 'Deliveries', 'Success Rate', 'Active Orders', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => <PartnerRow key={p.id} partner={p} onClick={() => setSelected(p)} />)}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-[#6B6B80]">No partners match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Sheet */}
      <ResponsiveSheet isOpen={!!selected} onClose={() => setSelected(null)} title="Partner Details" desktopWidth="w-[520px]">
        {selected && <PartnerDetailSheet partner={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />}
      </ResponsiveSheet>
    </div>

    {/* Create Modal */}
    <AnimatePresence>
      {showCreate && <CreatePartnerModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </AnimatePresence>
    </>
  )
}