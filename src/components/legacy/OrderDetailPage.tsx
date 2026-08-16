'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from "framer-motion";
import { ArrowLeft, Package, MapPin, Phone, Download, MessageCircle, RotateCcw, Star } from "lucide-react";

const ORDER = {
  id: "ORD-2024-001234",
  date: "Nov 28, 2024",
  status: "IN_TRANSIT",
  estimatedDelivery: "Dec 1, 2024",
  paymentMethod: "UPI · Google Pay",
  paymentStatus: "PAID",
  items: [
    { id: "1", name: "Handwoven Bandhani Silk Saree - Royal Blue", qty: 1, price: 2499, img: "https://images.unsplash.com/photo-1569909115134-a0426936c879?w=200&auto=format&fit=crop", seller: "Meena Handicrafts" },
    { id: "2", name: "Block Print Cotton Dupatta - Mustard", qty: 2, price: 699, img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&auto=format&fit=crop", seller: "Meena Handicrafts" },
  ],
  address: {
    name: "Priya Sharma",
    phone: "+91 98765 43210",
    line1: "Flat 302, Sunrise Apartments",
    line2: "MG Road, Koramangala",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560034",
  },
  tracking: [
    { status: "Order Placed", desc: "Your order has been placed successfully", time: "Nov 28, 2024 • 2:34 PM", done: true },
    { status: "Payment Confirmed", desc: "₹3,897 paid via Google Pay", time: "Nov 28, 2024 • 2:35 PM", done: true },
    { status: "Seller Confirmed", desc: "Meena Handicrafts accepted your order", time: "Nov 28, 2024 • 5:10 PM", done: true },
    { status: "Packed & Ready", desc: "Package is packed and awaiting pickup", time: "Nov 29, 2024 • 11:00 AM", done: true },
    { status: "Picked Up", desc: "Package picked up by Delhivery courier", time: "Nov 29, 2024 • 3:45 PM", done: true },
    { status: "In Transit", desc: "Package is on its way to you · Currently in Jaipur hub", time: "Nov 30, 2024 • 8:00 AM", done: true, active: true },
    { status: "Out for Delivery", desc: "Our delivery partner will arrive soon", time: "Dec 1, 2024 (Expected)", done: false },
    { status: "Delivered", desc: "Package delivered successfully", time: "Dec 1, 2024 (Expected)", done: false },
  ],
  subtotal: 3897,
  shipping: 0,
  discount: 100,
  total: 3797,
};

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  IN_TRANSIT: { bg: "#EFF6FF", text: "#2563EB", label: "In Transit 🚚" },
  DELIVERED: { bg: "#F0FDF4", text: "#1A9E4E", label: "Delivered ✓" },
  PROCESSING: { bg: "#FFF8F0", text: "#FF7A00", label: "Processing ⏳" },
  CANCELLED: { bg: "#FEF2F2", text: "#DC2626", label: "Cancelled ✕" },
};

export function OrderDetailPage() {
  const { orderId } = useParams();
  const order = ORDER;
  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.PROCESSING;
  const doneSteps = order.tracking.filter(t => t.done).length;
  const progress = (doneSteps / order.tracking.length) * 100;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20 lg:pb-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back + Header */}
        <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-[#8C8B80] hover:text-[#FF7A00] mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to Orders
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[#1C1B14] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.5rem", fontWeight: 800 }}>
              Order <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#FF7A00" }}>{order.id}</span>
            </h1>
            <p className="text-sm text-[#8C8B80]">Placed on {order.date} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="inline-flex px-3 py-1.5 rounded-full text-sm font-semibold" style={{ background: statusStyle.bg, color: statusStyle.text }}>
              {statusStyle.label}
            </span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm border border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00] transition-all">
              <Download size={14} /> Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Tracking + Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Tracking Card */}
            <div className="bg-white rounded-3xl border border-black/5 p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Live Tracking</h2>
                <span className="text-xs text-[#1A9E4E] font-semibold bg-[#F0FDF4] px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A9E4E] animate-pulse inline-block" />
                  Live
                </span>
              </div>
              <p className="text-sm text-[#8C8B80] mb-4">Expected delivery: <strong className="text-[#1C1B14]">{order.estimatedDelivery}</strong></p>

              {/* Progress Bar */}
              <div className="h-2 bg-[#F5F4F0] rounded-full mb-6 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #FF7A00, #FF4500)" }}
                />
              </div>

              {/* Timeline */}
              <div className="space-y-0">
                {order.tracking.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${step.done ? (step.active ? "text-white shadow-lg" : "bg-[#F0FDF4] text-[#1A9E4E]") : "bg-[#F5F4F0] text-[#B0AFA5]"}`}
                        style={step.active ? { background: "linear-gradient(135deg, #FF7A00, #FF4500)" } : {}}
                      >
                        {step.done ? (step.active ? "📍" : "✓") : "○"}
                      </motion.div>
                      {i < order.tracking.length - 1 && (
                        <div className={`w-0.5 h-10 mt-1 mb-1 rounded-full ${step.done ? "bg-[#1A9E4E]" : "bg-[#E5E4DE]"}`} />
                      )}
                    </div>
                    <div className={`pb-1 ${i < order.tracking.length - 1 ? "mb-1" : ""}`}>
                      <div className={`text-sm font-semibold mb-0.5 ${step.active ? "text-[#FF7A00]" : step.done ? "text-[#1C1B14]" : "text-[#B0AFA5]"}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {step.status}
                      </div>
                      <div className={`text-xs ${step.done ? "text-[#555449]" : "text-[#B0AFA5]"}`}>{step.desc}</div>
                      <div className="text-xs text-[#B0AFA5] mt-0.5">{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-3xl border border-black/5 p-6">
              <h2 className="font-bold text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Items in This Order</h2>
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <Link href={`/products/${item.id}`}>
                      <img src={item.img} alt={item.name} className="w-20 h-20 rounded-2xl object-cover border border-black/5 hover:opacity-90 transition-all" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#8C8B80] mb-1">{item.seller}</div>
                      <Link href={`/products/${item.id}`}>
                        <p className="text-sm font-semibold text-[#1C1B14] line-clamp-2 hover:text-[#FF7A00] transition-colors mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.name}</p>
                      </Link>
                      <p className="text-xs text-[#8C8B80] mb-1">Qty: {item.qty}</p>
                      <p className="font-semibold text-[#1C1B14] text-sm">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs border border-[#D4D3CB] text-[#555449] hover:border-amber-400 transition-all whitespace-nowrap">
                        <Star size={11} /> Review
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs border border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00] transition-all whitespace-nowrap">
                        <RotateCcw size={11} /> Return
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary + Address */}
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <h3 className="font-bold text-[#1C1B14] mb-4 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#555449]">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#555449]">
                  <span>Shipping</span>
                  <span className="text-[#1A9E4E] font-medium">FREE</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-[#1A9E4E]">
                    <span>Discount</span>
                    <span>- ₹{order.discount}</span>
                  </div>
                )}
                <div className="border-t border-[#E5E4DE] pt-2 flex justify-between font-bold text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <span>Total Paid</span>
                  <span>₹{order.total.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#E5E4DE] flex justify-between text-xs text-[#8C8B80]">
                <span>Payment</span>
                <span className="font-medium text-[#555449]">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-xs text-[#8C8B80]">
                <span>Status</span>
                <span className="font-medium text-[#1A9E4E]">{order.paymentStatus}</span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <h3 className="font-bold text-[#1C1B14] mb-3 text-sm flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <MapPin size={14} style={{ color: "#FF7A00" }} /> Delivery Address
              </h3>
              <div className="text-sm text-[#555449] leading-relaxed">
                <p className="font-semibold text-[#1C1B14]">{order.address.name}</p>
                <p className="flex items-center gap-1 text-xs text-[#8C8B80] mb-1"><Phone size={10} /> {order.address.phone}</p>
                <p>{order.address.line1}</p>
                {order.address.line2 && <p>{order.address.line2}</p>}
                <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
              </div>
            </div>

            {/* Help */}
            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <h3 className="font-bold text-[#1C1B14] mb-3 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Need Help?</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#555449] border border-[#D4D3CB] hover:border-[#FF7A00] hover:text-[#FF7A00] transition-all">
                  <MessageCircle size={15} /> Chat with Support
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#555449] border border-[#D4D3CB] hover:border-red-300 hover:text-red-500 transition-all">
                  <RotateCcw size={15} /> Request Return/Refund
                </button>
                <Link href={`/contact`} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#555449] border border-[#D4D3CB] hover:border-[#FF7A00] transition-all">
                  <Package size={15} /> Report an Issue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
