'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronDown, CheckCircle2, Clock, Truck, XCircle,
  ShoppingCart, RotateCcw, Package, MapPin, Phone, Mail,
  MessageSquare, ArrowRight, X, ChevronRight
} from 'lucide-react';
import { useSellerStore, SellerOrder } from '@/lib/store/seller-store';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

type StatusFilter = 'all' | SellerOrder['status'];

const ALL_STATUSES: { key: SellerOrder['status']; label: string; cls: string; dot: string; icon: React.ReactNode }[] = [
  { key: 'paid', label: 'New Order', cls: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500', icon: <ShoppingCart size={12} /> },
  { key: 'confirmed', label: 'Confirmed', cls: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', icon: <CheckCircle2 size={12} /> },
  { key: 'processing', label: 'Processing', cls: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', icon: <Clock size={12} /> },
  { key: 'ready_for_pickup', label: 'Ready', cls: 'bg-teal-50 text-teal-700 border-teal-200', dot: 'bg-teal-500', icon: <Package size={12} /> },
  { key: 'picked_up', label: 'Picked Up', cls: 'bg-cyan-50 text-cyan-700 border-cyan-200', dot: 'bg-cyan-500', icon: <Truck size={12} /> },
  { key: 'in_transit', label: 'In Transit', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500', icon: <Truck size={12} /> },
  { key: 'out_for_delivery', label: 'Out for Del.', cls: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500', icon: <Truck size={12} /> },
  { key: 'delivered', label: 'Delivered', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: <CheckCircle2 size={12} /> },
  { key: 'cancelled', label: 'Cancelled', cls: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', icon: <XCircle size={12} /> },
  { key: 'return_requested', label: 'Return Req.', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', icon: <RotateCcw size={12} /> },
  { key: 'returned', label: 'Returned', cls: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400', icon: <RotateCcw size={12} /> },
];

const NEXT_ACTIONS: Partial<Record<SellerOrder['status'], { label: string; next: SellerOrder['status'] }[]>> = {
  paid: [{ label: 'Confirm Order', next: 'confirmed' }],
  confirmed: [{ label: 'Start Processing', next: 'processing' }],
  processing: [{ label: 'Ready for Pickup', next: 'ready_for_pickup' }],
  ready_for_pickup: [{ label: 'Mark Picked Up', next: 'picked_up' }],
  picked_up: [{ label: 'In Transit', next: 'in_transit' }],
  in_transit: [{ label: 'Out for Delivery', next: 'out_for_delivery' }],
  out_for_delivery: [{ label: 'Mark Delivered', next: 'delivered' }],
};

function getStatusStyle(status: string) {
  return ALL_STATUSES.find(s => s.key === status) || { label: status, cls: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400', icon: null };
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function OrderDetailModal({ order, onClose, onUpdateStatus }: { order: SellerOrder; onClose: () => void; onUpdateStatus: (id: string, status: SellerOrder['status'], note?: string) => void }) {
  const [note, setNote] = useState(order.sellerNote || '');
  const { setSellerNote } = useSellerStore();
  const stl = getStatusStyle(order.status);
  const nextActions = NEXT_ACTIONS[order.status] || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30 }}
          className="w-full max-w-lg bg-white h-full overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#F0EDE8] p-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-base font-black text-[#1A1A1A]">{order.orderNumber}</h2>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${stl.cls}`}>
                {stl.icon}{stl.label}
              </span>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-xl border border-[#F0EDE8] flex items-center justify-center text-[#9B8F84] hover:bg-[#FAFAF8]">
              <X size={16} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Next actions */}
            {nextActions.length > 0 && (
              <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FFF3E0] rounded-2xl p-4 border border-orange-100">
                <p className="text-xs font-black text-[#9B8F84] mb-2 uppercase tracking-wide">Quick Actions</p>
                <div className="flex gap-2 flex-wrap">
                  {nextActions.map(a => (
                    <button
                      key={a.next}
                      onClick={() => { onUpdateStatus(order.id, a.next); toast.success(`Order ${a.label}`); onClose(); }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 hover:-translate-y-0.5 transition-all"
                    >
                      {a.label} <ArrowRight size={13} />
                    </button>
                  ))}
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button
                      onClick={() => { if (confirm('Cancel this order?')) { onUpdateStatus(order.id, 'cancelled'); toast.error('Order cancelled'); onClose(); } }}
                      className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-all"
                    >
                      <XCircle size={13} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Customer */}
            <div className="bg-white rounded-2xl border border-[#F0EDE8] p-4">
              <p className="text-xs font-black text-[#9B8F84] mb-3 uppercase tracking-wide">Customer</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF4500]/10 flex items-center justify-center text-[#FF7A00] font-bold text-sm">
                  {order.customerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1A1A1A]">{order.customerName}</p>
                  <p className="text-xs text-[#9B8F84]">{order.customerEmail}</p>
                </div>
              </div>
              <div className="flex gap-2 text-xs text-[#4A4540]">
                <Phone size={13} className="text-[#9B8F84]" /> {order.customerPhone}
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl border border-[#F0EDE8] p-4">
              <p className="text-xs font-black text-[#9B8F84] mb-3 uppercase tracking-wide">Order Items</p>
              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.productImage} alt={item.productName} className="w-12 h-12 rounded-xl object-cover border border-[#F0EDE8]" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#1A1A1A]">{item.productName}</p>
                      {item.variantName && <p className="text-xs text-[#9B8F84]">{item.variantName}</p>}
                      <p className="text-xs text-[#9B8F84]">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                    <p className="text-sm font-black text-[#1A1A1A]">{formatCurrency(item.total)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#F0EDE8] mt-3 pt-3 space-y-1">
                <div className="flex justify-between text-xs text-[#9B8F84]"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-xs text-emerald-600"><span>Discount</span><span>−{formatCurrency(order.discount)}</span></div>}
                <div className="flex justify-between text-xs text-[#9B8F84]"><span>Delivery</span><span>{order.deliveryCharge > 0 ? formatCurrency(order.deliveryCharge) : 'Free'}</span></div>
                <div className="flex justify-between text-sm font-black text-[#1A1A1A]"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-2xl border border-[#F0EDE8] p-4">
              <p className="text-xs font-black text-[#9B8F84] mb-3 uppercase tracking-wide">Delivery Address</p>
              <div className="flex gap-2 text-sm text-[#4A4540]">
                <MapPin size={15} className="text-[#9B8F84] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold">{order.deliveryAddress.name}</p>
                  <p className="text-xs text-[#9B8F84]">{order.deliveryAddress.line1}{order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : ''}</p>
                  <p className="text-xs text-[#9B8F84]">{order.deliveryAddress.city}, {order.deliveryAddress.state} – {order.deliveryAddress.pincode}</p>
                </div>
              </div>
              {order.trackingId && (
                <div className="mt-3 bg-[#FAFAF8] rounded-xl p-2.5 text-xs">
                  <span className="text-[#9B8F84]">Tracking: </span>
                  <span className="font-mono font-bold text-[#1A1A1A]">{order.trackingId}</span>
                </div>
              )}
            </div>

            {/* Seller note */}
            <div className="bg-white rounded-2xl border border-[#F0EDE8] p-4">
              <p className="text-xs font-black text-[#9B8F84] mb-2 uppercase tracking-wide">Your Note</p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a private note for this order..."
                rows={3}
                className="w-full border border-[#F0EDE8] rounded-xl p-3 text-sm resize-none outline-none focus:border-[#FF7A00] transition-colors"
              />
              <button
                onClick={() => { setSellerNote(order.id, note); toast.success('Note saved!'); }}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold rounded-xl"
              >
                Save Note
              </button>
            </div>

            {/* Status history */}
            <div className="bg-white rounded-2xl border border-[#F0EDE8] p-4">
              <p className="text-xs font-black text-[#9B8F84] mb-3 uppercase tracking-wide">Status History</p>
              <div className="space-y-2">
                {[...order.statusHistory].reverse().map((ev, i) => {
                  const s = getStatusStyle(ev.status);
                  return (
                    <div key={i} className="flex items-start gap-2.5 text-xs">
                      <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${s.dot}`} />
                      <div>
                        <p className="font-bold text-[#1A1A1A]">{s.label}</p>
                        <p className="text-[#9B8F84]">{new Date(ev.timestamp).toLocaleString('en-IN')}</p>
                        {ev.note && <p className="text-[#4A4540]">{ev.note}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function SellerOrdersPage() {
  const { orders, updateOrderStatus } = useSellerStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);

  const filtered = useMemo(() => {
    let list = [...orders].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
    if (search) list = list.filter(o => o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [orders, statusFilter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    ALL_STATUSES.forEach(s => { c[s.key] = orders.filter(o => o.status === s.key).length; });
    return c;
  }, [orders]);

  const quickFilterTabs = [
    { key: 'all' as StatusFilter, label: `All (${counts.all})` },
    { key: 'paid' as StatusFilter, label: `New (${counts.paid || 0})` },
    { key: 'confirmed' as StatusFilter, label: `Confirmed (${counts.confirmed || 0})` },
    { key: 'processing' as StatusFilter, label: `Processing (${counts.processing || 0})` },
    { key: 'in_transit' as StatusFilter, label: `In Transit (${counts.in_transit || 0})` },
    { key: 'delivered' as StatusFilter, label: `Delivered (${counts.delivered || 0})` },
    { key: 'cancelled' as StatusFilter, label: `Cancelled (${counts.cancelled || 0})` },
  ];

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#1A1A1A]">Orders</h1>
        <p className="text-sm text-[#9B8F84]">{orders.length} total orders</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {quickFilterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
              statusFilter === tab.key
                ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white shadow-md'
                : 'bg-white border border-[#F0EDE8] text-[#4A4540] hover:border-orange-200 hover:text-[#FF7A00]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4B8AF]" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by order # or customer..."
          className="w-full h-10 pl-9 pr-4 bg-white border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]"
        />
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#F0EDE8] p-12 text-center">
            <ShoppingCart size={40} className="text-[#D4C9BF] mx-auto mb-3" />
            <p className="text-base font-bold text-[#1A1A1A]">No orders found</p>
          </div>
        ) : filtered.map(order => {
          const stl = getStatusStyle(order.status);
          const nextActions = NEXT_ACTIONS[order.status] || [];
          return (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-[#F0EDE8] p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00]/15 to-[#FF4500]/10 flex items-center justify-center">
                    <ShoppingCart size={16} className="text-[#FF7A00]" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#1A1A1A]">{order.orderNumber}</p>
                    <p className="text-xs text-[#9B8F84]">{order.customerName} · {timeAgo(order.placedAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-[#1A1A1A]">{formatCurrency(order.total)}</p>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${stl.cls}`}>
                    {stl.icon}{stl.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-2 bg-[#FAFAF8] rounded-xl px-2.5 py-1.5">
                    <img src={item.productImage} alt={item.productName} className="w-6 h-6 rounded-lg object-cover" />
                    <span className="text-xs text-[#4A4540] truncate max-w-[120px]">{item.productName}</span>
                    <span className="text-[10px] text-[#9B8F84]">×{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {nextActions.slice(0, 1).map(a => (
                  <button
                    key={a.next}
                    onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, a.next); toast.success(`Order ${a.label}!`); }}
                    className="flex items-center gap-1.5 px-3 h-8 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold rounded-xl shadow-sm"
                  >
                    {a.label} <ArrowRight size={11} />
                  </button>
                ))}
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex items-center gap-1.5 px-3 h-8 border border-[#F0EDE8] text-xs font-medium text-[#4A4540] rounded-xl hover:bg-[#FFF7ED] hover:text-[#FF7A00] hover:border-orange-200 transition-all"
                >
                  View Details <ChevronRight size={11} />
                </button>
                <span className="ml-auto text-[10px] text-[#C4B8AF]">via {order.paymentMethod}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Order detail drawer */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  );
}
