'use client'
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Search, Filter, ChevronRight, Eye,
  Package, Truck, CheckCircle, XCircle, Clock, AlertTriangle,
  RotateCcw, CreditCard, Banknote, Smartphone, Globe,
  MapPin, User, Store, Copy, Check, RefreshCw
} from 'lucide-react'
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import type { SAOrder, OrderStatus } from '@/types/super-admin.types'
import { ResponsiveSheet } from '@/components/ui/responsive-sheet'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from 'sonner'

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending_payment:  { label: 'Pending Payment', color: '#F59E0B', bg: '#F59E0B15', icon: Clock },
  confirmed:        { label: 'Confirmed',        color: '#3B82F6', bg: '#3B82F615', icon: CheckCircle },
  processing:       { label: 'Processing',       color: '#8B5CF6', bg: '#8B5CF615', icon: Package },
  shipped:          { label: 'Shipped',           color: '#06B6D4', bg: '#06B6D415', icon: Truck },
  in_transit:       { label: 'In Transit',        color: '#0EA5E9', bg: '#0EA5E915', icon: Truck },
  out_for_delivery: { label: 'Out for Delivery',  color: '#6366F1', bg: '#6366F115', icon: Truck },
  delivered:        { label: 'Delivered',          color: '#22C55E', bg: '#22C55E15', icon: CheckCircle },
  cancelled:        { label: 'Cancelled',          color: '#EF4444', bg: '#EF444415', icon: XCircle },
  return_requested: { label: 'Return Requested',  color: '#F97316', bg: '#F9731615', icon: RotateCcw },
  returned:         { label: 'Returned',           color: '#6B7280', bg: '#6B728015', icon: RotateCcw },
  refunded:         { label: 'Refunded',           color: '#10B981', bg: '#10B98115', icon: CreditCard },
}

const PAYMENT_ICONS: Record<string, React.ElementType> = {
  UPI: Smartphone,
  'Credit Card': CreditCard,
  'Debit Card': CreditCard,
  'Net Banking': Globe,
  COD: Banknote,
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: '#6B7280', bg: '#6B728015', icon: Clock }
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap" style={{ background: cfg.bg, color: cfg.color }}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}

function PaymentBadge({ method, payStatus }: { method: string; payStatus: string }) {
  const Icon = PAYMENT_ICONS[method] ?? CreditCard
  const color = payStatus === 'paid' ? '#22C55E' : payStatus === 'refunded' ? '#3B82F6' : payStatus === 'failed' ? '#EF4444' : '#F59E0B'
  return (
    <div className="flex items-center gap-1.5 text-xs" style={{ color }}>
      <Icon className="w-3.5 h-3.5" />
      <span className="font-semibold">{method}</span>
      <span className="text-[10px] opacity-70 capitalize">({payStatus})</span>
    </div>
  )
}

// ─── Copy ID button ──────────────────────────────────────────────────────────
function CopyId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(id); setCopied(true); toast.success(`Copied ${id}`); setTimeout(() => setCopied(false), 2000) }}
      className="inline-flex items-center gap-1 text-[#6B6B80] hover:text-[#FF7A00] transition-colors"
    >
      <code className="text-xs font-mono">{id}</code>
      {copied ? <Check className="w-3 h-3 text-[#22C55E]" /> : <Copy className="w-3 h-3" />}
    </button>
  )
}

// ─── Mobile Order Card ────────────────────────────────────────────────────────
function OrderCard({ order, onClick }: { order: SAOrder; onClick: () => void }) {
  return (
    <motion.button
      layout
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl text-left hover:border-[#FF7A00]/30 active:bg-[#1A1A26] transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-bold text-white">{order.orderId}</p>
          <p className="text-xs text-[#6B6B80]">{order.customerName}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <p className="text-xs text-[#A0A0B8] mb-2 truncate">{order.products.join(', ')}</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-bold text-white">₹{order.totalAmount.toLocaleString()}</p>
          <PaymentBadge method={order.paymentMethod} payStatus={order.paymentStatus} />
        </div>
        <div className="text-right">
          <p className="text-xs text-[#6B6B80]">{order.city}, {order.state}</p>
          <p className="text-[10px] text-[#4A4A5E]">{format(new Date(order.createdAt), 'dd MMM yyyy')}</p>
        </div>
      </div>
    </motion.button>
  )
}

// ─── Order Detail Sheet ───────────────────────────────────────────────────────
function OrderDetailSheet({ order, onStatusUpdate }: { order: SAOrder; onStatusUpdate: (id: string, status: OrderStatus) => void }) {
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState<string>(order.status)

  const handleStatusUpdate = async () => {
    if (newStatus === order.status) return
    setUpdating(true)
    await new Promise(r => setTimeout(r, 600))
    onStatusUpdate(order.id, newStatus as OrderStatus)
    toast.success(`Order ${order.orderId} status updated`)
    setUpdating(false)
  }

  const validTransitions: Partial<Record<string, string[]>> = {
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['in_transit', 'delivered'],
    in_transit: ['out_for_delivery', 'delivered'],
    out_for_delivery: ['delivered'],
    return_requested: ['returned', 'delivered'],
    returned: ['refunded'],
  }
  const availableStatuses = validTransitions[order.status] ?? []

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-bold text-white">{order.orderId}</p>
          <p className="text-xs text-[#6B6B80]">Placed {format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Products */}
      <div>
        <h4 className="text-xs font-bold text-[#6B6B80] uppercase tracking-wider mb-2">Products</h4>
        <div className="space-y-1.5">
          {order.products.map((p, i) => (
            <div key={i} className="flex items-center gap-2.5 p-2.5 bg-[#1A1A26] rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-[#FF7A00]/10 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-[#FF7A00]" />
              </div>
              <p className="text-sm text-white">{p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div className="p-4 bg-[#FF7A00]/5 border border-[#FF7A00]/20 rounded-xl">
        <div className="flex justify-between items-center">
          <p className="text-sm text-[#A0A0B8]">Order Total</p>
          <p className="text-2xl font-extrabold text-white">₹{order.totalAmount.toLocaleString()}</p>
        </div>
        <div className="mt-1">
          <PaymentBadge method={order.paymentMethod} payStatus={order.paymentStatus} />
        </div>
      </div>

      {/* People */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-3.5 h-3.5 text-[#3B82F6]" />
            <p className="text-[10px] text-[#6B6B80] uppercase tracking-wide">Customer</p>
          </div>
          <p className="text-sm font-semibold text-white">{order.customerName}</p>
          <CopyId id={order.customerId} />
        </div>
        <div className="p-3 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <p className="text-[10px] text-[#6B6B80] uppercase tracking-wide">Seller</p>
          </div>
          <p className="text-sm font-semibold text-white">{order.sellerName}</p>
          <CopyId id={order.sellerId} />
        </div>
      </div>

      {/* Delivery */}
      <div className="p-3 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl space-y-1.5">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-3.5 h-3.5 text-[#EF4444]" />
          <p className="text-[10px] text-[#6B6B80] uppercase tracking-wide">Delivery Address</p>
        </div>
        <p className="text-sm text-white">{order.address}</p>
        <p className="text-xs text-[#6B6B80]">{order.city}, {order.state}</p>
        {order.deliveryPartnerName && (
          <div className="flex items-center gap-1.5 pt-1 border-t border-[#2A2A3E]">
            <Truck className="w-3.5 h-3.5 text-[#6B6B80]" />
            <p className="text-xs text-[#A0A0B8]">{order.deliveryPartnerName}</p>
          </div>
        )}
        {order.deliveredAt && (
          <p className="text-xs text-[#22C55E]">✓ Delivered {format(new Date(order.deliveredAt), 'dd MMM yyyy')}</p>
        )}
      </div>

      {/* Status Update */}
      {availableStatuses.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-[#6B6B80] uppercase tracking-wider mb-3">Update Status</h4>
          <div className="flex gap-2">
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              className="flex-1 h-11 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-3 text-sm text-white focus:border-[#FF7A00] outline-none"
            >
              <option value={order.status}>{STATUS_CONFIG[order.status]?.label ?? order.status} (current)</option>
              {availableStatuses.map(s => (
                <option key={s} value={s}>{STATUS_CONFIG[s]?.label ?? s}</option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || newStatus === order.status}
              className="h-11 px-4 bg-[#FF7A00] hover:bg-[#FF9A40] text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              {updating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {updating ? 'Saving...' : 'Update'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const STATUS_FILTER_GROUPS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending_payment' },
  { label: 'Processing', value: 'processing' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'In Transit', value: 'in_transit' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Returns', value: 'return_requested' },
  { label: 'Cancelled', value: 'cancelled' },
]

export default function OrdersPage() {
  const isMobile = useIsMobile()
  const { orders, setOrders } = useSuperAdminStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<SAOrder | null>(null)

  const filtered = useMemo(() => orders.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = !search
      || o.orderId.toLowerCase().includes(q)
      || o.customerName.toLowerCase().includes(q)
      || o.sellerName.toLowerCase().includes(q)
      || o.products.some(p => p.toLowerCase().includes(q))
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  }), [orders, search, statusFilter])

  const stats = useMemo(() => ({
    total: orders.length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    inTransit: orders.filter(o => ['in_transit', 'shipped', 'out_for_delivery'].includes(o.status)).length,
    pending: orders.filter(o => ['pending_payment', 'confirmed', 'processing'].includes(o.status)).length,
    returns: orders.filter(o => ['return_requested', 'returned'].includes(o.status)).length,
    totalGMV: orders.reduce((a, b) => a + b.totalAmount, 0),
  }), [orders])

  const handleStatusUpdate = (id: string, status: OrderStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center shadow-lg shadow-purple-500/20">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Orders</h1>
          <p className="text-sm text-[#6B6B80]">{stats.total} total · GMV ₹{(stats.totalGMV / 100000).toFixed(1)}L</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Delivered', value: stats.delivered, color: '#22C55E' },
          { label: 'In Transit', value: stats.inTransit, color: '#3B82F6' },
          { label: 'Pending', value: stats.pending, color: '#F59E0B' },
          { label: 'Returns', value: stats.returns, color: '#EF4444' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 bg-[#111118] border border-[#2A2A3E] rounded-2xl">
            <p className="text-[10px] text-[#6B6B80] uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B80]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID, customer, seller or product..."
            className="w-full h-11 bg-[#111118] border border-[#2A2A3E] rounded-xl pl-9 pr-4 text-sm text-white focus:border-[#FF7A00] outline-none"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_FILTER_GROUPS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all h-9 shrink-0',
                statusFilter === f.value ? 'bg-[#FF7A00] text-white' : 'bg-[#111118] border border-[#2A2A3E] text-[#6B6B80] hover:text-white'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile cards / Desktop table */}
      {isMobile ? (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map(o => <OrderCard key={o.id} order={o} onClick={() => setSelected(o)} />)}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 text-[#3A3A50] mx-auto mb-3" />
              <p className="text-sm text-[#6B6B80]">No orders match your filters</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E1E2E]">
                {['Order ID', 'Customer', 'Seller', 'Products', 'Amount', 'Payment', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-[#4A4A5E] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className="border-b border-[#1E1E2E] hover:bg-[#1A1A26] cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-bold text-white">{o.orderId}</p>
                    <p className="text-[10px] text-[#6B6B80]">{o.city}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#A0A0B8] max-w-[120px] truncate">{o.customerName}</td>
                  <td className="px-4 py-3 text-sm text-[#A0A0B8] max-w-[120px] truncate">{o.sellerName}</td>
                  <td className="px-4 py-3 text-xs text-[#6B6B80] max-w-[160px] truncate">{o.products.join(', ')}</td>
                  <td className="px-4 py-3 text-sm font-bold text-white whitespace-nowrap">₹{o.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3"><PaymentBadge method={o.paymentMethod} payStatus={o.paymentStatus} /></td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-xs text-[#6B6B80] whitespace-nowrap">{format(new Date(o.createdAt), 'dd MMM yy')}</td>
                  <td className="px-4 py-3">
                    <ChevronRight className="w-4 h-4 text-[#3A3A50] group-hover:text-[#FF7A00] transition-colors" />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-[#6B6B80]">No orders match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Sheet */}
      <ResponsiveSheet isOpen={!!selected} onClose={() => setSelected(null)} title={`Order ${selected?.orderId ?? ''}`} desktopWidth="w-[580px]">
        {selected && <OrderDetailSheet order={selected} onStatusUpdate={handleStatusUpdate} />}
      </ResponsiveSheet>
    </div>
  )
}