'use client';
import Link from 'next/link';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, Eye, TrendingUp, TrendingDown, Upload, X, Package, IndianRupee } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { SellerLayout } from "./SellerSubPages";

import { MOCK_SELLER_PRODUCTS as MOCK_PRODUCTS } from '@/lib/mock/sellers';


const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "#F0FDF4", text: "#1A9E4E", label: "Active" },
  out_of_stock: { bg: "#FEF2F2", text: "#DC2626", label: "Out of Stock" },
  low_stock: { bg: "#FEF3C7", text: "#92400E", label: "Low Stock" },
  draft: { bg: "#F5F4F0", text: "#8C8B80", label: "Draft" },
};

export function SellerProductsPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  return (
    <SellerLayout title="Products">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[#1C1B14] font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>My Products</h1>
          <p className="text-sm text-[#8C8B80]">{products.length} total · {products.filter(p => p.status === "active").length} active</p>
        </div>
        <Link href="/seller/add-product" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
          <Plus size={16} /> Add Product
        </Link>
      </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0AFA5]" />
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="w-full h-10 pl-9 pr-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-10 px-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm bg-white">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="low_stock">Low Stock</option>
          </select>
        </div>


        {/* Product Table */}
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F5F4F0] text-xs text-[#8C8B80] font-semibold">
                  <th className="p-4 text-left w-8">
                    <input type="checkbox" className="rounded" onChange={(e) => setSelectedIds(e.target.checked ? filtered.map(p => p.id) : [])} />
                  </th>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Sales</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, i) => (
                  <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className={`border-b border-[#F5F4F0] hover:bg-[#FAFAF8] transition-colors ${selectedIds.includes(product.id) ? "bg-[#FFF8F0]" : ""}`}>
                    <td className="p-4">
                      <input type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => toggleSelect(product.id)} className="rounded" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.img} alt={product.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <div>
                          <div className="font-medium text-[#1C1B14] line-clamp-1">{product.name}</div>
                          <div className="text-xs text-[#8C8B80]">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-semibold text-[#1C1B14]">₹{product.price.toLocaleString()}</div>
                      <div className="text-xs text-[#B0AFA5] line-through">₹{product.mrp.toLocaleString()}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-medium ${product.stock === 0 ? "text-red-500" : product.stock <= 5 ? "text-amber-600" : "text-[#1C1B14]"}`}>{product.stock}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: STATUS_STYLE[product.status].bg, color: STATUS_STYLE[product.status].text }}>
                        {STATUS_STYLE[product.status].label}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium text-[#1C1B14]">{product.sales}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/products/${product.id}`} className="p-1.5 rounded-lg hover:bg-[#FFF8F0] text-[#B0AFA5] hover:text-[#FF7A00] transition-all"><Eye size={14} /></Link>
                        <Link href={`/seller/edit-product/${product.id}`} className="p-1.5 rounded-lg hover:bg-[#FFF8F0] text-[#B0AFA5] hover:text-[#FF7A00] transition-all"><Edit2 size={14} /></Link>
                        <button onClick={() => deleteProduct(product.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#B0AFA5] hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center"><div className="text-4xl mb-3">📦</div><p className="text-[#8C8B80] text-sm">No products found</p></div>
          )}
        </div>
    </SellerLayout>
  );
}

// ─── Add Product Page ──────────────────────────────────────
const CATEGORIES = ["Handloom & Textiles", "Pottery & Ceramics", "Jewelry", "Food & Spices", "Home Decor", "Art & Paintings", "Leather Crafts", "Others"];

export function AddProductPage() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [product, setProduct] = useState({ name: "", category: "", description: "", price: "", mrp: "", stock: "", weight: "", length: "", width: "", height: "", tags: "" });
  const [saved, setSaved] = useState(false);

  const set = (field: string, value: string) => setProduct(p => ({ ...p, [field]: value }));

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const STEPS = ["Basic Info", "Images", "Pricing & Stock", "Shipping"];

  return (
    <SellerLayout title="Add Product">
        <div className="mb-6">
          <h1 className="text-[#1C1B14] font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add New Product</h1>
          <p className="text-sm text-[#8C8B80]">Fill in the details to list your product</p>
        </div>

        {/* Step tabs */}
        <div className="flex gap-1 mb-6 bg-[#F5F4F0] p-1 rounded-2xl w-fit">
          {STEPS.map((s, i) => (
            <button key={s} onClick={() => setStep(i + 1)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${step === i + 1 ? "bg-white shadow-sm text-[#1C1B14]" : "text-[#8C8B80] hover:text-[#555449]"}`}>{i + 1}. {s}</button>
          ))}
        </div>

        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-2xl border border-black/5 p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Product Name*</label>
                  <input value={product.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Handwoven Bandhani Silk Saree" className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B14] mb-2">Category*</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => set("category", cat)} className={`py-2.5 px-3 rounded-xl text-xs font-medium border-2 text-left transition-all ${product.category === cat ? "border-[#FF7A00] text-[#FF7A00] bg-[#FFF8F0]" : "border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00]/40"}`}>{cat}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Description*</label>
                  <textarea rows={5} value={product.description} onChange={e => set("description", e.target.value)} placeholder="Describe your product — materials, dimensions, care instructions, the story behind it..." className="w-full px-4 py-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Tags (comma separated)</label>
                  <input value={product.tags} onChange={e => set("tags", e.target.value)} placeholder="handmade, rajasthani, bandhani, silk" className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-2xl border border-black/5 p-6">
                <p className="text-xs font-semibold text-[#1C1B14] mb-4">Product Images* (min 3, max 8)</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#D4D3CB]">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">
                        <X size={12} />
                      </button>
                      {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded">Cover</span>}
                    </div>
                  ))}
                  {images.length < 8 && (
                    <button
                      onClick={() => setImages(prev => [...prev, `https://images.unsplash.com/photo-${1569909115134 + prev.length}?w=400&auto=format&fit=crop`])}
                      className="aspect-square rounded-xl border-2 border-dashed border-[#D4D3CB] flex flex-col items-center justify-center gap-2 text-[#B0AFA5] hover:border-[#FF7A00] hover:text-[#FF7A00] transition-all">
                      <Upload size={24} />
                      <span className="text-xs">Add Photo</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#8C8B80]">First image will be the cover. Use natural lighting and plain background for best results.</p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-2xl border border-black/5 p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Selling Price (₹)*</label>
                    <input type="number" value={product.price} onChange={e => set("price", e.target.value)} placeholder="2499" className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">MRP (₹)</label>
                    <input type="number" value={product.mrp} onChange={e => set("mrp", e.target.value)} placeholder="3500" className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
                  </div>
                </div>
                {product.price && product.mrp && Number(product.mrp) > Number(product.price) && (
                  <div className="flex items-center gap-2 text-sm text-[#1A9E4E] bg-[#F0FDF4] px-4 py-2 rounded-xl">
                    <TrendingDown size={16} /> Discount: {Math.round((1 - Number(product.price) / Number(product.mrp)) * 100)}% off MRP
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Stock Quantity*</label>
                  <input type="number" value={product.stock} onChange={e => set("stock", e.target.value)} placeholder="10" className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
                </div>
                <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#D4D3CB]">
                  <p className="text-xs font-semibold text-[#1C1B14] mb-1">Platform Commission: 10%</p>
                  {product.price && <p className="text-xs text-[#8C8B80]">You earn: <strong className="text-[#1A9E4E]">₹{(Number(product.price) * 0.9).toFixed(0)}</strong> per sale</p>}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-2xl border border-black/5 p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Package Weight (grams)*</label>
                  <input type="number" value={product.weight} onChange={e => set("weight", e.target.value)} placeholder="500" className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Dimensions (cm)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[["length", "L"], ["width", "W"], ["height", "H"]].map(([f, label]) => (
                      <div key={f}>
                        <input type="number" value={product[f as keyof typeof product]} onChange={e => set(f, e.target.value)} placeholder={label} className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={{ background: "#F0FDF4" }}>
                  <p className="text-xs font-semibold text-[#1A9E4E] mb-1">🚚 Bharat Bazaar Logistics</p>
                  <p className="text-xs text-[#555449]">We handle all shipping. Our logistics partner will pick up from your location within 24 hours of order confirmation.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-5">
            <button onClick={() => setStep(s => Math.max(1, s - 1))} className={`px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00] transition-all ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}>
              ← Back
            </button>
            <div className="flex gap-3">
              {step < STEPS.length ? (
                <motion.button onClick={() => setStep(s => s + 1)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }} whileTap={{ scale: 0.97 }}>
                  Continue →
                </motion.button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#D4D3CB] text-[#555449]">Save Draft</button>
                  <motion.button onClick={handleSave} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }} whileTap={{ scale: 0.97 }}>
                    {saved ? "✓ Published!" : "Publish Product"}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
    </SellerLayout>
  );
}

// ─── Earnings Page ─────────────────────────────────────────
const EARNINGS_DATA = [
  { month: "Jul", revenue: 18400, orders: 12 },
  { month: "Aug", revenue: 22100, orders: 15 },
  { month: "Sep", revenue: 19800, orders: 13 },
  { month: "Oct", revenue: 31200, orders: 22 },
  { month: "Nov", revenue: 48600, orders: 34 },
  { month: "Dec", revenue: 52300, orders: 38 },
];

const PAYOUTS = [
  { id: "PAY-001", amount: 42380, date: "Nov 30, 2024", status: "paid", orders: 34, utr: "UTR123456789" },
  { id: "PAY-002", amount: 28900, date: "Oct 31, 2024", status: "paid", orders: 22, utr: "UTR987654321" },
  { id: "PAY-003", amount: 17820, date: "Sep 30, 2024", status: "paid", orders: 13, utr: "UTR456123789" },
];

export function SellerEarningsPage() {
  const [period, setPeriod] = useState("6M");
  const totalRevenue = EARNINGS_DATA.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = EARNINGS_DATA.reduce((s, d) => s + d.orders, 0);
  const avgOrder = Math.round(totalRevenue / totalOrders);

  return (
    <SellerLayout title="Earnings">
        <div className="mb-6">
          <h1 className="text-[#1C1B14] font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Earnings & Payouts 💰</h1>
          <p className="text-sm text-[#8C8B80]">Track your revenue, payouts, and growth</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Revenue (6M)", value: `₹${(totalRevenue / 100000).toFixed(2)}L`, trend: "+28%", up: true },
            { label: "Total Orders", value: totalOrders.toString(), trend: "+18%", up: true },
            { label: "Avg Order Value", value: `₹${avgOrder.toLocaleString()}`, trend: "+8%", up: true },
            { label: "Pending Payout", value: "₹9,920", trend: "Due Dec 31", up: null },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-2xl border border-black/5 p-5">
              <div className="text-xs text-[#8C8B80] mb-1">{card.label}</div>
              <div className="font-black text-xl mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1C1B14" }}>{card.value}</div>
              <div className={`text-xs font-medium flex items-center gap-1 ${card.up === true ? "text-[#1A9E4E]" : card.up === false ? "text-red-500" : "text-[#FF7A00]"}`}>
                {card.up === true && <TrendingUp size={11} />}
                {card.up === false && <TrendingDown size={11} />}
                {card.up === null && <IndianRupee size={11} />}
                {card.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-black/5 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Revenue Over Time</h3>
            <div className="flex gap-1">
              {["3M", "6M", "1Y"].map(p => (
                <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${period === p ? "text-white" : "text-[#8C8B80] bg-[#F5F4F0]"}`} style={period === p ? { background: "#FF7A00" } : {}}>{p}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={EARNINGS_DATA}>
              <defs>
                <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF7A00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F4F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8C8B80" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8C8B80" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [`₹${Number(v || 0).toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid #F5F4F0", fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#FF7A00" strokeWidth={2.5} fill="url(#earnGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-white rounded-2xl border border-black/5 p-6 mb-6">
          <h3 className="font-bold text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Monthly Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={EARNINGS_DATA} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F4F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8C8B80" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8C8B80" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
              <Tooltip formatter={(v: any) => [v, "Orders"]} contentStyle={{ borderRadius: 12, border: "1px solid #F5F4F0", fontSize: 12 }} />
              <Bar dataKey="orders" fill="#1A9E4E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-2xl border border-black/5 p-6">
          <h3 className="font-bold text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Payout History</h3>
          <div className="space-y-3">
            {PAYOUTS.map((payout, i) => (
              <motion.div key={payout.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#FAFAF8] border border-[#F5F4F0]">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center shrink-0">
                  <IndianRupee size={18} className="text-[#1A9E4E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1C1B14] text-sm">{payout.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#1A9E4E] font-medium">Paid</span>
                  </div>
                  <div className="text-xs text-[#8C8B80]">{payout.date} · {payout.orders} orders · UTR: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{payout.utr}</span></div>
                </div>
                <div className="font-bold text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>₹{payout.amount.toLocaleString()}</div>
              </motion.div>
            ))}
          </div>
        </div>
    </SellerLayout>
  );
}
