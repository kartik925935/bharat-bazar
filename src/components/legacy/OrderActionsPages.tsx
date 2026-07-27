'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, Package, Truck, MapPin, Phone, Star,
  Camera, ChevronRight, Search, Clock, AlertTriangle, X
} from "lucide-react";
import { CustomerAccountLayout } from "./CustomerDashboard";

// ─── Cancel Order ─────────────────────────────────────────
const CANCEL_REASONS = [
  "I want to change my delivery address",
  "I ordered the wrong product / size / colour",
  "I found a better price elsewhere",
  "Delivery is taking too long",
  "I no longer need this item",
  "Duplicate order placed by mistake",
  "Other reason",
];

export function CancelOrderPage() {
  const { orderId } = useParams();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [step, setStep] = useState<"select" | "confirm" | "done">("select");

  return (
    <CustomerAccountLayout title="Cancel Order">
      <div className="max-w-lg">
        <div className="flex items-center gap-3 mb-6">
          <div>
            <h2 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Cancel Order</h2>
            <p className="text-xs text-[#8C8B80] font-mono">#{orderId || "ORD-2024-001234"}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === "select" && (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">Once cancelled, a refund will be initiated to your original payment method within 5–7 business days.</p>
              </div>

              <div className="bg-white rounded-2xl border border-black/5 p-5">
                <div className="font-semibold text-[#1C1B14] text-sm mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Reason for Cancellation</div>
                <div className="space-y-2">
                  {CANCEL_REASONS.map(r => (
                    <button key={r} onClick={() => setReason(r)}
                      className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-all ${reason === r ? "border-[#FF7A00] bg-[#FFF8F0] text-[#1C1B14]" : "border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00]/40"}`}>
                      {r}
                    </button>
                  ))}
                </div>
                {reason === "Other reason" && (
                  <textarea rows={3} value={details} onChange={e => setDetails(e.target.value)}
                    placeholder="Please describe your reason..."
                    className="w-full mt-3 px-3 py-2.5 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm resize-none" />
                )}
              </div>

              <motion.button whileTap={{ scale: 0.97 }} onClick={() => reason && setStep("confirm")}
                className="w-full h-12 rounded-xl font-semibold text-sm border-2 border-red-400 text-red-600 hover:bg-red-50 transition-all disabled:opacity-40"
                disabled={!reason}>
                Continue to Cancel
              </motion.button>
              <Link href="/orders" className="block text-center text-sm text-[#8C8B80] hover:text-[#FF7A00] transition-colors">
                Keep Order
              </Link>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="bg-white rounded-2xl border border-black/5 p-5">
                <div className="font-semibold text-[#1C1B14] mb-4 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Order Summary</div>
                <div className="flex gap-3 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-[#F5F4F0] flex items-center justify-center shrink-0">
                    <Package size={24} className="text-[#B0AFA5]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#1C1B14]">Handwoven Bandhani Saree</div>
                    <div className="text-xs text-[#8C8B80]">Royal Blue · Size: Free Size</div>
                    <div className="text-sm font-bold text-[#1C1B14] mt-1">₹1,299</div>
                  </div>
                </div>
                <div className="text-xs text-[#8C8B80] border-t border-[#F5F4F0] pt-3">
                  Cancellation Reason: <span className="text-[#555449] font-medium">{reason}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
                <strong className="block mb-1">Refund Policy</strong>
                Refund of ₹1,299 will be credited to your original payment method within 5–7 business days.
              </div>

              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep("done")}
                className="w-full h-12 rounded-xl font-semibold text-sm text-white" style={{ background: "#DC2626" }}>
                Confirm Cancellation
              </motion.button>
              <button onClick={() => setStep("select")} className="w-full text-sm text-[#8C8B80] hover:text-[#1C1B14] transition-colors">
                Go Back
              </button>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-black/5 p-8 text-center">
              <CheckCircle size={48} className="text-[#1A9E4E] mx-auto mb-4" />
              <h3 className="font-bold text-xl text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Order Cancelled</h3>
              <p className="text-sm text-[#8C8B80] mb-2">Your order has been successfully cancelled.</p>
              <p className="text-sm text-[#555449] mb-8">Refund of <strong>₹1,299</strong> will be processed within 5–7 business days.</p>
              <Link href="/orders" className="inline-flex items-center justify-center w-full h-11 rounded-xl text-white font-semibold text-sm"
                style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
                View My Orders
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CustomerAccountLayout>
  );
}

// ─── Order Help ────────────────────────────────────────────
const HELP_CATEGORIES = [
  { icon: "📦", title: "Item not received", desc: "Package not delivered or lost in transit" },
  { icon: "🔄", title: "Wrong item received", desc: "Got a different product than ordered" },
  { icon: "💔", title: "Damaged product", desc: "Item arrived broken or defective" },
  { icon: "💸", title: "Refund not received", desc: "Payment refunded but not yet credited" },
  { icon: "📄", title: "Invoice issue", desc: "Need GST invoice or billing correction" },
  { icon: "❓", title: "Other issue", desc: "Any other concern about your order" },
];

export function OrderHelpPage() {
  const { orderId } = useParams();
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <CustomerAccountLayout title="Order Help">
      <div className="max-w-lg">
        <h2 className="font-bold text-xl text-[#1C1B14] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Order Help</h2>
        <p className="text-xs text-[#8C8B80] font-mono mb-6">#{orderId || "ORD-2024-001234"}</p>

        {!submitted ? (
          <>
            <div className="bg-white rounded-2xl border border-black/5 p-5 mb-4">
              <div className="font-semibold text-[#1C1B14] text-sm mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>What's the issue?</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HELP_CATEGORIES.map(c => (
                  <button key={c.title} onClick={() => setSelected(c.title)}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${selected === c.title ? "border-[#FF7A00] bg-[#FFF8F0]" : "border-[#D4D3CB] hover:border-[#FF7A00]/40"}`}>
                    <div className="text-lg mb-1">{c.icon}</div>
                    <div className="text-sm font-medium text-[#1C1B14]">{c.title}</div>
                    <div className="text-xs text-[#8C8B80]">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {selected && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-black/5 p-5 mb-4">
                <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Describe your issue</label>
                <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Please provide more details so we can help you faster..."
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm resize-none mb-3" />
                <div className="flex items-center gap-2 text-xs text-[#8C8B80]">
                  <Camera size={14} />
                  <span>You can attach photos after submitting</span>
                </div>
              </motion.div>
            )}

            <motion.button whileTap={{ scale: 0.97 }} onClick={() => selected && setSubmitted(true)}
              className="w-full h-12 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
              Submit Request
            </motion.button>
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-black/5 p-8 text-center">
            <CheckCircle size={40} className="text-[#1A9E4E] mx-auto mb-4" />
            <h3 className="font-bold text-lg text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Request Submitted!</h3>
            <p className="text-sm text-[#8C8B80] mb-2">Ticket ID: <span className="font-mono font-bold text-[#1C1B14]">#SUP-{Math.floor(Math.random() * 90000) + 10000}</span></p>
            <p className="text-sm text-[#8C8B80] mb-6">Our support team will respond within 24 hours via email.</p>
            <div className="flex flex-col gap-2">
              <Link href="/support" className="flex items-center justify-center h-11 rounded-xl text-white font-semibold text-sm"
                style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
                View Support Tickets
              </Link>
              <Link href="/orders" className="flex items-center justify-center h-11 rounded-xl border-2 border-[#D4D3CB] text-sm font-semibold text-[#555449]">
                Back to Orders
              </Link>
            </div>
          </div>
        )}
      </div>
    </CustomerAccountLayout>
  );
}

// ─── Write Review ──────────────────────────────────────────
export function WriteReviewPage() {
  const { orderId } = useParams();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const QUALITY_TAGS = ["True to description", "Great packaging", "Fast delivery", "Excellent quality", "Would recommend", "Value for money", "Authentic craft"];

  const toggleTag = (t: string) => setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const starLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <CustomerAccountLayout title="Write Review">
      <div className="max-w-lg">
        <h2 className="font-bold text-xl text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Write a Review</h2>

        {!submitted ? (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <div className="flex gap-3 items-center mb-4 pb-4 border-b border-[#F5F4F0]">
                <div className="w-14 h-14 rounded-xl bg-[#F5F4F0] flex items-center justify-center shrink-0">
                  <Package size={22} className="text-[#B0AFA5]" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#1C1B14]">Handwoven Bandhani Saree</div>
                  <div className="text-xs text-[#8C8B80]">Purchased from Meena Handicrafts</div>
                  <div className="text-xs font-mono text-[#B0AFA5]">Order #{orderId || "ORD-2024-001234"}</div>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="text-xs font-semibold text-[#8C8B80] mb-3">How would you rate this product?</div>
                <div className="flex justify-center gap-2 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(s)}>
                      <Star size={36} className={`transition-colors ${s <= (hovered || rating) ? "fill-amber-400 text-amber-400" : "text-[#D4D3CB]"}`} />
                    </button>
                  ))}
                </div>
                {(hovered || rating) > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold" style={{ color: "#FF7A00" }}>
                    {starLabels[hovered || rating]}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <label className="block text-xs font-semibold text-[#1C1B14] mb-3">Select highlights</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {QUALITY_TAGS.map(t => (
                  <button key={t} onClick={() => toggleTag(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${tags.includes(t) ? "border-[#FF7A00] bg-[#FFF8F0] text-[#FF7A00]" : "border-[#D4D3CB] text-[#555449]"}`}>
                    {t}
                  </button>
                ))}
              </div>
              <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Your Review</label>
              <textarea rows={4} value={review} onChange={e => setReview(e.target.value)}
                placeholder="Tell others about your experience with this product..."
                className="w-full px-3 py-2.5 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm resize-none" />
              <div className="text-right text-xs text-[#B0AFA5] mt-1">{review.length}/500</div>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <label className="block text-xs font-semibold text-[#1C1B14] mb-3">Add Photos (optional)</label>
              <div className="flex gap-3 flex-wrap">
                {[0,1,2].map(i => (
                  <div key={i} className="w-20 h-20 rounded-xl border-2 border-dashed border-[#D4D3CB] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#FF7A00] transition-colors text-[#B0AFA5] hover:text-[#FF7A00]">
                    <Camera size={20} />
                    <span className="text-[10px]">Add</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={() => rating && setSubmitted(true)}
              className="w-full h-12 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
              Submit Review
            </motion.button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-black/5 p-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
              <CheckCircle size={48} className="text-[#1A9E4E] mx-auto mb-4" />
            </motion.div>
            <h3 className="font-bold text-xl text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Review Submitted! 🎉</h3>
            <p className="text-sm text-[#8C8B80] mb-6">Thank you for your feedback. It helps other shoppers and artisans alike.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/my-reviews" className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
                My Reviews
              </Link>
              <Link href="/orders" className="px-6 py-2.5 rounded-xl border-2 border-[#D4D3CB] text-sm font-semibold text-[#555449]">
                Orders
              </Link>
            </div>
          </div>
        )}
      </div>
    </CustomerAccountLayout>
  );
}

// ─── Order Tracking ────────────────────────────────────────
const TRACKING_STEPS = [
  { key: "ordered", label: "Order Placed", time: "Nov 28, 2024 · 10:42 AM", done: true, desc: "Your order has been confirmed" },
  { key: "confirmed", label: "Order Confirmed", time: "Nov 28, 2024 · 11:05 AM", done: true, desc: "Seller confirmed and started processing" },
  { key: "shipped", label: "Shipped", time: "Nov 29, 2024 · 2:30 PM", done: true, desc: "Package handed to BlueDart — AWB: BD1234567890" },
  { key: "in_transit", label: "In Transit", time: "Nov 30, 2024 · 8:15 AM", done: true, desc: "Package in transit via Delhi Hub" },
  { key: "out_for_delivery", label: "Out for Delivery", time: "Dec 1, 2024 · 9:00 AM", done: false, desc: "Estimated delivery today by 8 PM" },
  { key: "delivered", label: "Delivered", time: "—", done: false, desc: "" },
];

export function TrackOrderPage() {
  const { orderId } = useParams();

  return (
    <CustomerAccountLayout title="Track Order">
      <div className="max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Track Order</h2>
            <p className="text-xs text-[#8C8B80] font-mono">#{orderId || "ORD-2024-001234"}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#2563EB]">In Transit</span>
        </div>

        {/* Product */}
        <div className="bg-white rounded-2xl border border-black/5 p-4 mb-4 flex gap-3 items-center">
          <div className="w-14 h-14 rounded-xl bg-[#F5F4F0] flex items-center justify-center shrink-0">
            <Package size={22} className="text-[#B0AFA5]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#1C1B14] truncate">Handwoven Bandhani Saree</div>
            <div className="text-xs text-[#8C8B80]">Meena Handicrafts · Qty: 1</div>
          </div>
        </div>

        {/* Delivery info */}
        <div className="bg-[#FFF8F0] border border-[#FFD4A8] rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-2">
            <Truck size={16} style={{ color: "#FF7A00" }} className="mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-[#1C1B14] mb-0.5">Expected Delivery: Today by 8 PM</div>
              <div className="text-xs text-[#8C8B80]">Courier: BlueDart · AWB: BD1234567890</div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-black/5 p-5 mb-4">
          <div className="font-semibold text-sm text-[#1C1B14] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tracking Timeline</div>
          <div className="space-y-0">
            {TRACKING_STEPS.map((step, i) => (
              <div key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-[#1A9E4E] text-white" : "bg-[#F5F4F0] text-[#B0AFA5]"}`}>
                    {step.done ? <CheckCircle size={16} /> : <Clock size={14} />}
                  </div>
                  {i < TRACKING_STEPS.length - 1 && (
                    <div className={`w-0.5 h-8 mt-1 ${step.done ? "bg-[#1A9E4E]" : "bg-[#F5F4F0]"}`} />
                  )}
                </div>
                <div className="pb-5">
                  <div className={`text-sm font-semibold ${step.done ? "text-[#1C1B14]" : "text-[#B0AFA5]"}`}>{step.label}</div>
                  <div className="text-xs text-[#8C8B80] mt-0.5">{step.time}</div>
                  {step.desc && <div className="text-xs text-[#8C8B80] mt-0.5">{step.desc}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery address */}
        <div className="bg-white rounded-2xl border border-black/5 p-4 flex items-start gap-3">
          <MapPin size={16} style={{ color: "#FF7A00" }} className="shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-[#1C1B14] mb-0.5">Delivery Address</div>
            <div className="text-sm text-[#555449]">Priya Sharma, 12/4 MG Road, Bengaluru – 560001, Karnataka</div>
          </div>
        </div>
      </div>
    </CustomerAccountLayout>
  );
}

// ─── Public Track Order (no login required) ────────────────
export function PublicTrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [tracked, setTracked] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20">
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF8F0] flex items-center justify-center mx-auto mb-4">
            <Truck size={28} style={{ color: "#FF7A00" }} />
          </div>
          <h1 className="text-3xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Track Your Order</h1>
          <p className="text-sm text-[#8C8B80]">Enter your order ID or tracking number to see the latest status</p>
        </div>

        <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 mb-6">
          <div className="relative mb-4">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0AFA5]" />
            <input value={orderId} onChange={e => setOrderId(e.target.value)}
              placeholder="e.g. ORD-2024-001234 or BD1234567890"
              className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => orderId && setTracked(true)}
            className="w-full h-12 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
            Track Order
          </motion.button>
        </div>

        {tracked && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-black/5 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-[#1C1B14] text-sm font-mono">{orderId}</div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#2563EB]">In Transit</span>
            </div>
            <div className="text-sm text-[#555449] mb-4">Expected delivery: <strong>Today by 8 PM</strong></div>
            {TRACKING_STEPS.slice(0, 4).map((step, i) => (
              <div key={step.key} className="flex gap-3 mb-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step.done ? "bg-[#1A9E4E]" : "bg-[#F5F4F0]"}`}>
                  {step.done && <CheckCircle size={12} className="text-white" />}
                </div>
                <div>
                  <div className={`text-sm font-medium ${step.done ? "text-[#1C1B14]" : "text-[#B0AFA5]"}`}>{step.label}</div>
                  <div className="text-xs text-[#8C8B80]">{step.time}</div>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-[#F5F4F0] text-center">
              <Link href="/login" className="text-sm font-semibold" style={{ color: "#FF7A00" }}>
                Login for full tracking details →
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
