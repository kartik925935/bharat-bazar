'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, RotateCcw, Star, Tag,
  TrendingUp, DollarSign, Bell, Settings, LogOut, Menu, X,
  Search, Filter, Plus, Edit2, Eye, Check, AlertTriangle,
  ChevronDown, Upload, Truck, CheckCircle, Clock, XCircle,
  Store, ImageIcon, Globe, Phone, Mail, MapPin, Shield
} from "lucide-react";
import { SellerLayout } from './SellerSubPages';

import {
  INVENTORY,
  MOCK_SELLER_RETURNS_LIST as RETURN_REQUESTS,
  MOCK_SELLER_REVIEWS_LIST as SELLER_REVIEWS,
  MOCK_SELLER_COUPONS_LIST as SELLER_COUPONS,
  MOCK_SELLER_EARNINGS as PERF_DATA
} from '@/lib/mock/sellers';


export function SellerInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]) /* INVENTORY */;
  const [editing, setEditing] = useState<string | null>(null);
  const [editQty, setEditQty] = useState("");

  const updateStock = (id: string) => {
    const qty = parseInt(editQty);
    if (isNaN(qty) || qty < 0) return;
    setInventory(prev => prev.map(p => {
      if (p.id !== id) return p;
      const status = qty === 0 ? "out_of_stock" : qty <= p.lowAlert ? "low_stock" : "in_stock";
      return { ...p, stock: qty, status };
    }));
    setEditing(null);
    setEditQty("");
  };

  const lowStockItems = inventory.filter(p => p.status === "low_stock" || p.status === "out_of_stock");

  return (
    <SellerLayout title="Inventory">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Inventory</h1>
          <p className="text-sm text-[#8C8B80]">Track and update your stock levels</p>
        </div>
        <Link href="/seller/add-product" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
          <Plus size={15} /> Add Product
        </Link>
      </div>

      {lowStockItems.length > 0 && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-amber-800 mb-1">⚠️ {lowStockItems.length} item{lowStockItems.length > 1 ? "s" : ""} need restocking</div>
            <div className="text-xs text-amber-700">{lowStockItems.map(p => p.name).join(", ")}</div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#F5F4F0] text-xs text-[#8C8B80] font-semibold">
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Stock</th>
              <th className="p-4 text-center">Update</th>
            </tr></thead>
            <tbody>
              {inventory.map((item, i) => (
                <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-[#F5F4F0] hover:bg-[#FAFAF8] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={item.img} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <span className="font-medium text-[#1C1B14] line-clamp-1 text-sm">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs text-[#8C8B80]">{item.sku}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${item.status === "in_stock" ? "bg-[#F0FDF4] text-[#1A9E4E]" : item.status === "low_stock" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"}`}>
                      {item.status === "in_stock" ? "In Stock" : item.status === "low_stock" ? "Low Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {editing === item.id ? (
                      <div className="flex items-center gap-1 justify-center">
                        <input type="number" value={editQty} onChange={e => setEditQty(e.target.value)} className="w-20 h-8 px-2 rounded-lg border-2 border-[#FF7A00] outline-none text-sm text-center" autoFocus />
                        <button onClick={() => updateStock(item.id)} className="p-1.5 rounded-lg bg-[#FF7A00] text-white"><Check size={12} /></button>
                        <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg bg-[#F5F4F0] text-[#555449]"><X size={12} /></button>
                      </div>
                    ) : (
                      <span className={`font-bold text-lg ${item.stock === 0 ? "text-red-500" : item.stock <= item.lowAlert ? "text-amber-600" : "text-[#1C1B14]"}`}>{item.stock}</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {editing !== item.id && (
                      <button onClick={() => { setEditing(item.id); setEditQty(String(item.stock)); }} className="p-2 rounded-lg hover:bg-[#FFF8F0] text-[#B0AFA5] hover:text-[#FF7A00] transition-all">
                        <Edit2 size={14} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SellerLayout>
  );
}



export function SellerReturnsPage() {
  const [requests, setRequests] = useState<any[]>([]) /* RETURN_REQUESTS */;

  const update = (id: string, status: string) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  return (
    <SellerLayout title="Returns">
      <div className="mb-6">
        <h1 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Return Requests</h1>
        <p className="text-sm text-[#8C8B80]">{requests.filter(r => r.status === "PENDING").length} pending reviews</p>
      </div>

      <div className="space-y-4">
        {requests.map((req, i) => (
          <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl border border-black/5 p-5">
            <div className="flex gap-4 items-start">
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">📦</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="font-mono text-xs text-[#8C8B80]">{req.id}</span>
                    <span className="mx-2 text-[#D4D3CB]">·</span>
                    <span className="font-mono text-xs text-[#8C8B80]">{req.orderId}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${req.status === "PENDING" ? "bg-amber-50 text-amber-700" : req.status === "APPROVED" ? "bg-[#F0FDF4] text-[#1A9E4E]" : "bg-red-50 text-red-600"}`}>
                    {req.status}
                  </span>
                </div>
                <div className="font-semibold text-[#1C1B14] text-sm mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{req.product}</div>
                <div className="text-xs text-[#8C8B80] mb-1">Customer: {req.customer}</div>
                <div className="text-xs text-[#555449]">Reason: <strong>{req.reason}</strong></div>
                <div className="text-sm font-bold text-[#1C1B14] mt-1">₹{req.amount.toLocaleString()}</div>
              </div>
              {req.status === "PENDING" && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => update(req.id, "APPROVED")} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F0FDF4] text-[#1A9E4E] border border-[#BBF7D0] hover:bg-[#1A9E4E] hover:text-white transition-all">Approve</button>
                  <button onClick={() => update(req.id, "REJECTED")} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white transition-all">Reject</button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </SellerLayout>
  );
}



export function SellerReviewsPage() {
  const [reviews, setReviews] = useState(SELLER_REVIEWS.map(r => ({ ...r, replyText: "" })));
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const submitReply = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, replied: true, reply: r.replyText } : r));
    setReplyingTo(null);
  };

  const avgRating = (SELLER_REVIEWS.reduce((s, r) => s + r.rating, 0) / SELLER_REVIEWS.length).toFixed(1);

  return (
    <SellerLayout title="Reviews">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Customer Reviews</h1>
          <p className="text-sm text-[#8C8B80]">{SELLER_REVIEWS.length} reviews · {avgRating}★ average</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-5 mb-5 flex flex-wrap gap-6 items-center">
        <div className="text-center">
          <div className="text-5xl font-black" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#FF7A00" }}>{avgRating}</div>
          <div className="flex gap-0.5 justify-center my-1">
            {Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} className={i < Math.floor(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-[#D4D3CB]"} />)}
          </div>
          <div className="text-xs text-[#8C8B80]">{SELLER_REVIEWS.length} reviews</div>
        </div>
        <div className="flex-1 min-w-40 space-y-1.5">
          {[5, 4, 3, 2, 1].map(s => {
            const count = SELLER_REVIEWS.filter(r => r.rating === s).length;
            return (
              <div key={s} className="flex items-center gap-2 text-xs">
                <span className="text-[#555449] w-4">{s}★</span>
                <div className="flex-1 h-1.5 bg-[#F5F4F0] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(count / SELLER_REVIEWS.length) * 100}%` }} />
                </div>
                <span className="text-[#B0AFA5] w-4">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review, i) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl border border-black/5 p-5">
            <div className="flex gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-[#FF7A00] shrink-0 font-bold">
                {review.customer.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-[#1C1B14]">{review.customer}</span>
                  <span className="text-xs text-[#8C8B80]">on <em>{review.product}</em></span>
                </div>
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: 5 }, (_, i) => <Star key={i} size={12} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-[#D4D3CB]"} />)}
                </div>
              </div>
            </div>
            <p className="text-sm text-[#555449] leading-relaxed mb-3">{review.comment}</p>

            {review.replied && (
              <div className="ml-3 pl-3 border-l-2 border-[#FF7A00]/30 bg-[#FFF8F0] rounded-r-xl p-3 text-sm text-[#555449]">
                <span className="font-semibold text-[#FF7A00] text-xs block mb-0.5">Your Reply:</span>
                Thank you for your feedback! We're glad you liked the product.
              </div>
            )}

            {!review.replied && (
              replyingTo === review.id ? (
                <div className="mt-2">
                  <textarea rows={2} value={review.replyText} onChange={e => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, replyText: e.target.value } : r))}
                    placeholder="Write a reply..." className="w-full px-3 py-2 rounded-xl border-2 border-[#FF7A00]/30 focus:border-[#FF7A00] outline-none text-sm resize-none mb-2" />
                  <div className="flex gap-2">
                    <button onClick={() => submitReply(review.id)} className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white" style={{ background: "#FF7A00" }}>Post Reply</button>
                    <button onClick={() => setReplyingTo(null)} className="px-4 py-1.5 rounded-xl text-xs border border-[#D4D3CB] text-[#555449]">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setReplyingTo(review.id)} className="text-xs text-[#FF7A00] font-medium hover:underline">Reply to review →</button>
              )
            )}
          </motion.div>
        ))}
      </div>
    </SellerLayout>
  );
}



export function SellerCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]) /* SELLER_COUPONS */;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiry: "" });

  const toggleActive = (code: string) => setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: !c.active } : c));

  return (
    <SellerLayout title="Coupons & Offers">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Coupons & Offers</h1>
          <p className="text-sm text-[#8C8B80]">Create discount codes for your customers</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
          <Plus size={15} /> New Coupon
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-5">
            <div className="bg-white rounded-2xl border border-[#FF7A00]/30 p-6">
              <h3 className="font-semibold text-[#1C1B14] mb-4 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create New Coupon</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { key: "code", label: "Coupon Code", placeholder: "SAVE20" },
                  { key: "value", label: "Discount Value", placeholder: "10" },
                  { key: "minOrder", label: "Min Order (₹)", placeholder: "500" },
                  { key: "maxUses", label: "Max Uses", placeholder: "100" },
                  { key: "expiry", label: "Expiry Date", placeholder: "2025-01-31" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">{label}</label>
                    <input value={form[key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} className="w-full h-10 px-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Discount Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full h-10 px-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm bg-white">
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => { setCoupons(p => [...p, { code: form.code.toUpperCase(), type: form.type, value: Number(form.value), minOrder: Number(form.minOrder), uses: 0, maxUses: Number(form.maxUses), expiry: form.expiry, active: true }]); setShowForm(false); setForm({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiry: "" }); }}
                  className="px-6 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>Create Coupon</button>
                <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm border border-[#D4D3CB] text-[#555449]">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {coupons.map((coupon, i) => (
          <motion.div key={coupon.code} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`bg-white rounded-2xl border p-5 ${coupon.active ? "border-[#FFD4A8]" : "border-black/5 opacity-70"}`}>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-black tracking-wider text-base" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#FF7A00" }}>{coupon.code}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: coupon.active ? "#F0FDF4" : "#F5F4F0", color: coupon.active ? "#1A9E4E" : "#8C8B80" }}>
                    {coupon.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-[#8C8B80]">
                  <span className="font-semibold text-[#1C1B14]">{coupon.type === "percentage" ? `${coupon.value}% off` : `₹${coupon.value} off`}</span>
                  <span>Min ₹{coupon.minOrder}</span>
                  <span>·</span>
                  <span>{coupon.uses}/{coupon.maxUses} used</span>
                  <span>·</span>
                  <span>Expires {coupon.expiry}</span>
                </div>
                <div className="mt-2 h-1.5 bg-[#F5F4F0] rounded-full overflow-hidden max-w-48">
                  <div className="h-full rounded-full" style={{ width: `${(coupon.uses / coupon.maxUses) * 100}%`, background: "#FF7A00" }} />
                </div>
              </div>
              <button onClick={() => toggleActive(coupon.code)}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${coupon.active ? "bg-[#1A9E4E]" : "bg-[#D4D3CB]"}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${coupon.active ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </SellerLayout>
  );
}


