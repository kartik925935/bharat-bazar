'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Package, Camera, ChevronRight, ArrowLeft, Clock, AlertTriangle, IndianRupee } from "lucide-react";
import { CustomerAccountLayout } from "./CustomerDashboard";

// ─── Initiate Return ───────────────────────────────────────
const RETURN_REASONS = [
  "Wrong item received",
  "Item is damaged / defective",
  "Item not as described",
  "Missing parts or accessories",
  "Size / fit issue",
  "Changed my mind",
  "Other",
];

export function InitiateReturnPage() {
  const [step, setStep] = useState(0);
  const [reason, setReason] = useState("");
  const [desc, setDesc] = useState("");

  const steps = ["Select Item", "Select Reason", "Add Details", "Review & Submit"];

  return (
    <CustomerAccountLayout title="Return Request">
      <div className="max-w-lg">
        <h2 className="font-bold text-xl text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Initiate Return</h2>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex flex-col items-center flex-1 ${i < steps.length - 1 ? "" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i <= step ? "text-white" : "bg-[#F5F4F0] text-[#B0AFA5]"}`}
                  style={i <= step ? { background: "linear-gradient(135deg, #FF7A00, #FF4500)" } : {}}>
                  {i < step ? <CheckCircle size={14} /> : i + 1}
                </div>
                <div className={`text-[9px] mt-1 text-center ${i <= step ? "text-[#FF7A00] font-semibold" : "text-[#B0AFA5]"}`}>{s}</div>
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 flex-1 mb-4 ${i < step ? "bg-[#FF7A00]" : "bg-[#F5F4F0]"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white rounded-2xl border border-black/5 p-5 mb-4">
                <div className="font-semibold text-sm text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Select item to return</div>
                {[
                  { name: "Handwoven Bandhani Saree", price: "₹1,299", order: "ORD-2024-001234", date: "Nov 28, 2024" },
                  { name: "Block Print Cotton Dupatta", price: "₹699", order: "ORD-2024-001230", date: "Nov 22, 2024" },
                ].map((item) => (
                  <button key={item.order} onClick={() => setStep(1)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-[#D4D3CB] hover:border-[#FF7A00] transition-all mb-2 text-left">
                    <div className="w-12 h-12 rounded-lg bg-[#FFF8F0] flex items-center justify-center shrink-0">
                      <Package size={18} style={{ color: "#FF7A00" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#1C1B14] truncate">{item.name}</div>
                      <div className="text-xs text-[#8C8B80]">{item.order} · {item.date}</div>
                    </div>
                    <div className="text-sm font-bold text-[#1C1B14] shrink-0">{item.price}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white rounded-2xl border border-black/5 p-5 mb-4">
                <div className="font-semibold text-sm text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Why are you returning this?</div>
                <div className="space-y-2">
                  {RETURN_REASONS.map(r => (
                    <button key={r} onClick={() => setReason(r)}
                      className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-all ${reason === r ? "border-[#FF7A00] bg-[#FFF8F0] text-[#1C1B14]" : "border-[#D4D3CB] text-[#555449]"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 h-11 rounded-xl border-2 border-[#D4D3CB] text-sm font-semibold text-[#555449]">Back</button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => reason && setStep(2)}
                  className="flex-1 h-11 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
                  Next
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white rounded-2xl border border-black/5 p-5 mb-4 space-y-4">
                <div className="font-semibold text-sm text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add details</div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Describe the issue</label>
                  <textarea rows={4} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Please explain the issue in detail..."
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B14] mb-2">Upload photos (optional)</label>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-20 h-20 rounded-xl border-2 border-dashed border-[#D4D3CB] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#FF7A00] text-[#B0AFA5] hover:text-[#FF7A00] transition-colors">
                        <Camera size={18} />
                        <span className="text-[10px]">Add</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 h-11 rounded-xl border-2 border-[#D4D3CB] text-sm font-semibold text-[#555449]">Back</button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(3)}
                  className="flex-1 h-11 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
                  Review
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white rounded-2xl border border-black/5 p-5 mb-4 space-y-3">
                <div className="font-semibold text-sm text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Review your return request</div>
                {[
                  { label: "Item", value: "Handwoven Bandhani Saree" },
                  { label: "Reason", value: reason },
                  { label: "Refund Amount", value: "₹1,299" },
                  { label: "Refund To", value: "Original payment method" },
                  { label: "Est. Pickup", value: "Within 2–3 business days" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm py-2 border-b border-[#F5F4F0] last:border-0">
                    <span className="text-[#8C8B80]">{label}</span>
                    <span className="font-medium text-[#1C1B14] text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 h-11 rounded-xl border-2 border-[#D4D3CB] text-sm font-semibold text-[#555449]">Back</button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(4)}
                  className="flex-1 h-11 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
                  Submit Return
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-white rounded-2xl border border-black/5 p-8 text-center">
                <CheckCircle size={48} className="text-[#1A9E4E] mx-auto mb-4" />
                <h3 className="font-bold text-xl text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Return Requested!</h3>
                <p className="text-sm text-[#8C8B80] mb-1">Return ID: <span className="font-mono font-bold text-[#1C1B14]">RET-{Math.floor(Math.random() * 9000) + 1000}</span></p>
                <p className="text-sm text-[#8C8B80] mb-6">A pickup will be scheduled within 2–3 business days. Refund of <strong>₹1,299</strong> will be processed after quality check.</p>
                <Link href="/returns" className="inline-flex items-center justify-center w-full h-11 rounded-xl text-white font-semibold text-sm"
                  style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
                  View My Returns
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CustomerAccountLayout>
  );
}

// ─── Return Detail ─────────────────────────────────────────
const RETURN_STATUSES = [
  { key: "REQUESTED", label: "Return Requested", done: true, time: "Nov 29, 2024 · 2:10 PM", desc: "Your return request has been received" },
  { key: "UNDER_REVIEW", label: "Under Review", done: true, time: "Nov 29, 2024 · 4:30 PM", desc: "Seller is reviewing your request" },
  { key: "APPROVED", label: "Approved", done: true, time: "Nov 30, 2024 · 10:00 AM", desc: "Return approved. Pickup scheduled." },
  { key: "PICKUP_SCHEDULED", label: "Pickup Scheduled", done: false, time: "Dec 2, 2024 (estimated)", desc: "Courier will pick up between 9 AM – 6 PM" },
  { key: "QUALITY_CHECK", label: "Quality Check", done: false, time: "—", desc: "" },
  { key: "COMPLETED", label: "Refund Issued", done: false, time: "—", desc: "" },
];

export function ReturnDetailPage() {
  const { id } = useParams();

  return (
    <CustomerAccountLayout title="Return Details">
      <div className="max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Return Request</h2>
            <p className="text-xs text-[#8C8B80] font-mono">#{id || "RET-0042"}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF8F0] text-[#FF7A00] border border-[#FFD4A8]">Pickup Scheduled</span>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-4 mb-4 flex gap-3">
          <div className="w-16 h-16 rounded-xl bg-[#F5F4F0] flex items-center justify-center shrink-0">
            <Package size={22} className="text-[#B0AFA5]" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm text-[#1C1B14]">Handwoven Bandhani Saree</div>
            <div className="text-xs text-[#8C8B80]">Reason: Item not as described</div>
            <div className="text-sm font-bold text-[#1C1B14] mt-1">Refund: ₹1,299</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-5 mb-4">
          <div className="font-semibold text-sm text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Return Status</div>
          {RETURN_STATUSES.map((s, i) => (
            <div key={s.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${s.done ? "bg-[#1A9E4E] text-white" : "bg-[#F5F4F0] text-[#B0AFA5]"}`}>
                  {s.done ? <CheckCircle size={14} /> : <Clock size={12} />}
                </div>
                {i < RETURN_STATUSES.length - 1 && <div className={`w-0.5 h-8 mt-1 ${s.done ? "bg-[#1A9E4E]" : "bg-[#F5F4F0]"}`} />}
              </div>
              <div className="pb-4">
                <div className={`text-sm font-semibold ${s.done ? "text-[#1C1B14]" : "text-[#B0AFA5]"}`}>{s.label}</div>
                <div className="text-xs text-[#8C8B80]">{s.time}</div>
                {s.desc && <div className="text-xs text-[#8C8B80]">{s.desc}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
          <strong className="block mb-1">Refund Policy</strong>
          Once the item is picked up and passes quality check, ₹1,299 will be refunded to your original payment method within 5–7 business days.
        </div>
      </div>
    </CustomerAccountLayout>
  );
}

// ─── Refund History ────────────────────────────────────────
const MOCK_REFUNDS = [
  { id: "REF-1001", orderId: "ORD-2024-001210", item: "Block Print Dupatta", amount: 699, status: "SUCCESS", date: "Nov 25, 2024", method: "UPI · priya@upi" },
  { id: "REF-1000", orderId: "ORD-2024-001190", item: "Kashmiri Saffron (10g)", amount: 299, status: "PROCESSING", date: "Nov 20, 2024", method: "Credit Card ···4242" },
  { id: "REF-0998", orderId: "ORD-2024-001150", item: "Madhubani Painting (A4)", amount: 1299, status: "INITIATED", date: "Nov 10, 2024", method: "Paytm Wallet" },
  { id: "REF-0990", orderId: "ORD-2024-001100", item: "Phulkari Dupatta", amount: 849, status: "SUCCESS", date: "Oct 28, 2024", method: "UPI · priya@upi" },
];

const REFUND_STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  SUCCESS: { bg: "#F0FDF4", text: "#1A9E4E", label: "✓ Refunded" },
  PROCESSING: { bg: "#EFF6FF", text: "#2563EB", label: "Processing" },
  INITIATED: { bg: "#FFF8F0", text: "#FF7A00", label: "Initiated" },
  FAILED: { bg: "#FEF2F2", text: "#DC2626", label: "Failed" },
};

export function RefundHistoryPage() {
  return (
    <CustomerAccountLayout title="Refund History">
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Refund History</h2>
          <div className="text-sm text-[#8C8B80]">{MOCK_REFUNDS.length} refunds</div>
        </div>

        <div className="space-y-3">
          {MOCK_REFUNDS.map((r, i) => {
            const st = REFUND_STATUS_STYLE[r.status];
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/refunds/${r.id}`} className="block bg-white rounded-2xl border border-black/5 p-4 hover:shadow-sm transition-all hover:border-[#FFD4A8]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-[#8C8B80]">{r.id}</span>
                        <span className="text-xs text-[#B0AFA5]">·</span>
                        <span className="text-xs text-[#8C8B80]">{r.date}</span>
                      </div>
                      <div className="text-sm font-medium text-[#1C1B14] truncate">{r.item}</div>
                      <div className="text-xs text-[#8C8B80] mt-0.5">To: {r.method}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base font-bold text-[#1C1B14]">₹{r.amount}</div>
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1" style={{ background: st.bg, color: st.text }}>{st.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F5F4F0]">
                    <span className="text-xs text-[#8C8B80]">Order: {r.orderId}</span>
                    <ChevronRight size={14} className="text-[#B0AFA5]" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {MOCK_REFUNDS.length === 0 && (
          <div className="text-center py-16 text-[#8C8B80]">
            <IndianRupee size={40} className="mx-auto mb-3 text-[#D4D3CB]" />
            <div className="font-medium">No refunds yet</div>
          </div>
        )}
      </div>
    </CustomerAccountLayout>
  );
}

// ─── Refund Detail ─────────────────────────────────────────
export function RefundDetailPage() {
  const { id } = useParams();
  const refund = MOCK_REFUNDS.find(r => r.id === id) || MOCK_REFUNDS[0];
  const st = REFUND_STATUS_STYLE[refund.status];

  const timeline = [
    { label: "Refund Initiated", time: "Nov 20, 2024 · 3:00 PM", done: true },
    { label: "Processing by Bank", time: "Nov 21, 2024 · 9:00 AM", done: refund.status !== "INITIATED" },
    { label: "Refund Credited", time: refund.status === "SUCCESS" ? "Nov 25, 2024 · 11:30 AM" : "Pending", done: refund.status === "SUCCESS" },
  ];

  return (
    <CustomerAccountLayout title="Refund Details">
      <div className="max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Refund Details</h2>
            <p className="text-xs text-[#8C8B80] font-mono">#{refund.id}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: st.bg, color: st.text }}>{st.label}</span>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-5 mb-4 space-y-3">
          {[
            { label: "Item", value: refund.item },
            { label: "Refund Amount", value: `₹${refund.amount}` },
            { label: "Refund Method", value: refund.method },
            { label: "Order ID", value: refund.orderId },
            { label: "Initiated On", value: refund.date },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm py-2 border-b border-[#F5F4F0] last:border-0">
              <span className="text-[#8C8B80]">{label}</span>
              <span className="font-medium text-[#1C1B14]">{value}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-5">
          <div className="font-semibold text-sm text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Refund Timeline</div>
          {timeline.map((t, i) => (
            <div key={t.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${t.done ? "bg-[#1A9E4E] text-white" : "bg-[#F5F4F0] text-[#B0AFA5]"}`}>
                  {t.done ? <CheckCircle size={12} /> : <Clock size={10} />}
                </div>
                {i < timeline.length - 1 && <div className={`w-0.5 h-6 mt-1 ${t.done ? "bg-[#1A9E4E]" : "bg-[#F5F4F0]"}`} />}
              </div>
              <div className="pb-4">
                <div className={`text-sm font-medium ${t.done ? "text-[#1C1B14]" : "text-[#B0AFA5]"}`}>{t.label}</div>
                <div className="text-xs text-[#8C8B80]">{t.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link href="/support/new" className="text-sm font-semibold" style={{ color: "#FF7A00" }}>Having an issue? Contact Support →</Link>
        </div>
      </div>
    </CustomerAccountLayout>
  );
}
