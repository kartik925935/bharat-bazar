'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Check, Home, Briefcase, Star, RotateCcw, Tag, Copy } from "lucide-react";
import { CustomerAccountLayout } from "./CustomerDashboard";

// ============================================================
// Address Book Page
// ============================================================
const INITIAL_ADDRESSES = [
  { id: "a1", label: "Home", name: "Priya Sharma", phone: "+91 98765 43210", line1: "Flat 302, Sunrise Apartments", line2: "MG Road, Koramangala", city: "Bangalore", state: "Karnataka", pincode: "560034", isDefault: true },
  { id: "a2", label: "Office", name: "Priya Sharma", phone: "+91 98765 43210", line1: "WeWork, 3rd Floor, Embassy Golf Links", line2: "Intermediate Ring Road", city: "Bangalore", state: "Karnataka", pincode: "560071", isDefault: false },
];

export function AddressBookPage() {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ label: "Home", name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });

  const setDefault = (id: string) => setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  const deleteAddr = (id: string) => setAddresses(prev => prev.filter(a => a.id !== id));

  const submitForm = () => {
    if (editingId) {
      setAddresses(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : a));
      setEditingId(null);
    } else {
      setAddresses(prev => [...prev, { ...form, id: Date.now().toString(), isDefault: false }]);
    }
    setForm({ label: "Home", name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
    setShowForm(false);
  };

  const startEdit = (addr: typeof INITIAL_ADDRESSES[0]) => {
    setForm({ label: addr.label, name: addr.name, phone: addr.phone, line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, pincode: addr.pincode });
    setEditingId(addr.id);
    setShowForm(true);
  };

  return (
    <CustomerAccountLayout title="Address Book">
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[#1C1B14] text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Address Book 📍</h1>
            <p className="text-sm text-[#8C8B80] mt-1">{addresses.length} saved address{addresses.length !== 1 ? "es" : ""}</p>
          </div>
          <motion.button
            onClick={() => { setShowForm(true); setEditingId(null); setForm({ label: "Home", name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" }); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus size={16} /> Add New
          </motion.button>
        </div>

        <div className="space-y-4 mb-6">
          {addresses.map((addr, i) => (
            <motion.div key={addr.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl border p-5 transition-all ${addr.isDefault ? "border-[#FF7A00] shadow-sm" : "border-black/5"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: addr.isDefault ? "#FFF8F0" : "#FAFAF8" }}>
                    {addr.label === "Home" ? <Home size={18} style={{ color: addr.isDefault ? "#FF7A00" : "#8C8B80" }} /> : <Briefcase size={18} style={{ color: addr.isDefault ? "#FF7A00" : "#8C8B80" }} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#1C1B14] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{addr.label}</span>
                      {addr.isDefault && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#FFF8F0", color: "#FF7A00" }}>Default</span>}
                    </div>
                    <p className="font-medium text-[#1C1B14] text-sm">{addr.name}</p>
                    <p className="text-xs text-[#8C8B80]">{addr.phone}</p>
                    <p className="text-sm text-[#555449] mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                    <p className="text-sm text-[#555449]">{addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => startEdit(addr)} className="p-2 rounded-lg bg-[#FAFAF8] hover:bg-[#FFF8F0] text-[#555449] hover:text-[#FF7A00] transition-all"><Edit2 size={14} /></button>
                  {!addr.isDefault && <button onClick={() => deleteAddr(addr.id)} className="p-2 rounded-lg bg-[#FAFAF8] hover:bg-red-50 text-[#555449] hover:text-red-500 transition-all"><Trash2 size={14} /></button>}
                </div>
              </div>
              {!addr.isDefault && (
                <button onClick={() => setDefault(addr.id)} className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#8C8B80] hover:text-[#FF7A00] transition-colors">
                  <Check size={12} /> Set as Default
                </button>
              )}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="bg-white rounded-2xl border border-[#FF7A00]/30 p-6">
                <h3 className="font-bold text-[#1C1B14] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{editingId ? "Edit Address" : "Add New Address"}</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {(["Home", "Office", "Other"] as const).map(type => (
                    <button key={type} onClick={() => setForm(p => ({ ...p, label: type }))} className={`py-2 rounded-xl text-sm font-medium border-2 transition-all ${form.label === type ? "border-[#FF7A00] text-[#FF7A00] bg-[#FFF8F0]" : "border-[#D4D3CB] text-[#555449]"}`}>{type}</button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { field: "name", label: "Full Name", placeholder: "As on Aadhaar" },
                    { field: "phone", label: "Phone", placeholder: "+91 XXXXX XXXXX" },
                    { field: "line1", label: "Address Line 1", placeholder: "House/Flat No., Building" },
                    { field: "line2", label: "Address Line 2 (Optional)", placeholder: "Area, Landmark" },
                    { field: "city", label: "City", placeholder: "City" },
                    { field: "state", label: "State", placeholder: "State" },
                    { field: "pincode", label: "Pincode", placeholder: "6-digit pincode" },
                  ].map(({ field, label, placeholder }) => (
                    <div key={field} className={field === "line1" || field === "line2" ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">{label}</label>
                      <input placeholder={placeholder} value={form[field as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                        className="w-full h-10 px-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-5">
                  <motion.button onClick={submitForm} className="flex-1 h-10 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }} whileTap={{ scale: 0.97 }}>
                    {editingId ? "Save Changes" : "Add Address"}
                  </motion.button>
                  <button onClick={() => setShowForm(false)} className="px-5 h-10 rounded-xl text-sm border border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00] transition-all">Cancel</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CustomerAccountLayout>
  );
}

// ============================================================
// My Reviews Page
// ============================================================
const PENDING_REVIEWS = [
  { orderId: "ORD-2024-001234", product: "Bandhani Silk Saree - Royal Blue", img: "https://images.unsplash.com/photo-1569909115134-a0426936c879?w=200&auto=format&fit=crop", seller: "Meena Handicrafts", purchaseDate: "Nov 28, 2024" },
];
const PAST_REVIEWS = [
  { id: "r1", product: "Blue Pottery Vase", img: "https://images.unsplash.com/photo-1629218091978-f70a20a43aab?w=200&auto=format&fit=crop", seller: "Rajput Pottery Works", rating: 5, review: "Absolutely beautiful! The craftsmanship is incredible. Arrived safely packaged. Would buy again.", date: "Oct 15, 2024", helpful: 12 },
  { id: "r2", product: "Kashmiri Saffron 2g", img: "https://images.unsplash.com/photo-1663325265966-0d17de3e85c5?w=200&auto=format&fit=crop", seller: "Kashmir Harvest", rating: 4, review: "Genuine saffron with great aroma. Slightly expensive but worth it for the quality.", date: "Sep 20, 2024", helpful: 8 },
];

export function MyReviewsPage() {
  const [tab, setTab] = useState<"pending" | "written">("pending");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { setSelectedProduct(null); setRating(0); setReviewText(""); setSubmitted(false); }, 1500);
  };

  return (
    <CustomerAccountLayout title="My Reviews">
      <div className="max-w-2xl">
        <h1 className="text-[#1C1B14] text-xl font-bold mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>My Reviews ⭐</h1>
        <div className="flex gap-1 bg-[#F5F4F0] p-1 rounded-2xl mb-6 w-fit">
          {([["pending", `Pending (${PENDING_REVIEWS.length})`], ["written", `Written (${PAST_REVIEWS.length})`]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === key ? "bg-white shadow-sm text-[#1C1B14]" : "text-[#8C8B80] hover:text-[#555449]"}`}>{label}</button>
          ))}
        </div>

        {tab === "pending" && (
          <div className="space-y-4">
            {PENDING_REVIEWS.length === 0 ? (
              <div className="text-center py-16"><div className="text-5xl mb-4">🎉</div><p className="text-[#8C8B80]">No pending reviews! You're all caught up.</p></div>
            ) : PENDING_REVIEWS.map(item => (
              <div key={item.orderId}>
                <div className="bg-white rounded-2xl border border-black/5 p-5">
                  <div className="flex gap-4 items-start">
                    <img src={item.img} alt={item.product} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#8C8B80] mb-1">{item.seller}</p>
                      <p className="font-semibold text-[#1C1B14] text-sm line-clamp-2 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.product}</p>
                      <p className="text-xs text-[#B0AFA5]">Purchased {item.purchaseDate}</p>
                    </div>
                    <button onClick={() => setSelectedProduct(item.orderId)} className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
                      Write Review
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {selectedProduct === item.orderId && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="bg-[#FFF8F0] border border-[#FFD4A8] rounded-b-2xl p-5 mt-1">
                        {submitted ? (
                          <div className="text-center py-4"><div className="text-4xl mb-2">🎉</div><p className="font-semibold text-[#1A9E4E]">Review submitted! Thank you.</p></div>
                        ) : (
                          <>
                            <p className="font-semibold text-[#1C1B14] text-sm mb-3">Rate your experience</p>
                            <div className="flex gap-2 mb-4">
                              {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(s)} className="text-3xl transition-transform hover:scale-110">
                                  <Star size={32} className={(hoverRating || rating) >= s ? "fill-amber-400 text-amber-400" : "text-[#D4D3CB]"} />
                                </button>
                              ))}
                              <span className="ml-2 text-sm text-[#8C8B80] self-center">{rating > 0 ? ["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating] : "Tap to rate"}</span>
                            </div>
                            <textarea rows={4} placeholder="Share your experience — what did you love? What could be better?" value={reviewText} onChange={e => setReviewText(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm resize-none mb-3" />
                            <div className="flex gap-2">
                              <button onClick={handleSubmit} disabled={rating === 0} className="px-6 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>Submit Review</button>
                              <button onClick={() => setSelectedProduct(null)} className="px-4 py-2 rounded-xl text-sm border border-[#D4D3CB] text-[#555449]">Cancel</button>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {tab === "written" && (
          <div className="space-y-4">
            {PAST_REVIEWS.map((review, i) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl border border-black/5 p-5">
                <div className="flex gap-4">
                  <img src={review.img} alt={review.product} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#8C8B80] mb-0.5">{review.seller}</p>
                    <p className="font-semibold text-[#1C1B14] text-sm line-clamp-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{review.product}</p>
                    <div className="flex gap-0.5 my-1.5">
                      {Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-[#D4D3CB]"} />)}
                    </div>
                    <p className="text-sm text-[#555449] leading-relaxed">{review.review}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#B0AFA5]">
                      <span>{review.date}</span>
                      <span>·</span>
                      <span>👍 {review.helpful} found helpful</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </CustomerAccountLayout>
  );
}

// ============================================================
// Profile Settings Page
// ============================================================
export function ProfileSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({ name: "Priya Sharma", email: "priya.sharma@gmail.com", phone: "+91 98765 43210", dob: "1992-05-15", gender: "Female", language: "English" });
  const [prefs, setPrefs] = useState({ orderUpdates: true, promotions: false, newsletter: true, whatsapp: true });
  const [activeSection, setActiveSection] = useState<string>("profile");
  const router = useRouter();

  const sections = [
    { id: "profile", label: "Personal Info", icon: "👤" },
    { id: "preferences", label: "Notifications", icon: "🔔" },
    { id: "security", label: "Security", icon: "🔒" },
  ];

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <CustomerAccountLayout title="Profile Settings">
      <div className="max-w-2xl">
        <h1 className="text-[#1C1B14] text-xl font-bold mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Profile Settings ⚙️</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeSection === s.id ? "text-white" : "bg-white border border-black/10 text-[#555449] hover:border-[#FF7A00]"}`}
              style={activeSection === s.id ? { background: "linear-gradient(135deg, #FF7A00, #FF4500)" } : {}}
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        {activeSection === "profile" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-2xl border border-black/5 p-6 mb-4">
              <div className="flex items-center gap-5 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>👩</div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#1C1B14] flex items-center justify-center text-white text-xs hover:bg-[#FF7A00] transition-all">
                    <Edit2 size={12} />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{profile.name}</h3>
                  <p className="text-sm text-[#8C8B80]">Customer since Jan 2023</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">Gold Member</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { field: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                  { field: "phone", label: "Phone Number", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                  { field: "email", label: "Email Address", type: "email", placeholder: "your@email.com" },
                  { field: "dob", label: "Date of Birth", type: "date", placeholder: "" },
                ].map(({ field, label, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">{label}</label>
                    <input type={type} placeholder={placeholder} value={profile[field as keyof typeof profile]} onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Gender</label>
                  <select value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))} className="w-full h-10 px-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm bg-white">
                    {["Male", "Female", "Non-binary", "Prefer not to say"].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Language</label>
                  <select value={profile.language} onChange={e => setProfile(p => ({ ...p, language: e.target.value }))} className="w-full h-10 px-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm bg-white">
                    {["English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati"].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <motion.button onClick={handleSave} className="px-8 py-3 rounded-2xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }} whileTap={{ scale: 0.97 }}>
              {saved ? "✓ Saved!" : "Save Changes"}
            </motion.button>
          </motion.div>
        )}

        {activeSection === "preferences" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-black/5 p-6">
            <h3 className="font-bold text-[#1C1B14] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { key: "orderUpdates", label: "Order Updates", desc: "Shipping, delivery, and status updates" },
                { key: "promotions", label: "Promotions & Offers", desc: "Sale alerts, coupon codes, and special deals" },
                { key: "newsletter", label: "Newsletter", desc: "Craft stories, artisan spotlights, and blog posts" },
                { key: "whatsapp", label: "WhatsApp Messages", desc: "Get updates on WhatsApp instead of SMS" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-[#1C1B14]">{label}</div>
                    <div className="text-xs text-[#8C8B80]">{desc}</div>
                  </div>
                  <button onClick={() => setPrefs(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                    className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${prefs[key as keyof typeof prefs] ? "bg-[#1A9E4E]" : "bg-[#D4D3CB]"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${prefs[key as keyof typeof prefs] ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === "security" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {[
              { title: "Change Password", desc: "Last changed 3 months ago", action: "Change", onClick: () => router.push("/change-password") },
              { title: "Two-Factor Authentication", desc: "Add an extra layer of security", action: "Enable", onClick: () => router.push("/security") },
              { title: "Linked Accounts", desc: "Google account linked", action: "Manage", onClick: () => router.push("/security") },
              { title: "Active Sessions", desc: "2 devices logged in", action: "View", onClick: () => router.push("/sessions") },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl border border-black/5 p-5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title}</div>
                  <div className="text-xs text-[#8C8B80]">{item.desc}</div>
                </div>
                <button onClick={item.onClick} className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00] hover:text-[#FF7A00] transition-all">{item.action}</button>
              </div>
            ))}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm text-red-700">Delete Account</div>
                <div className="text-xs text-red-500">This action cannot be undone</div>
              </div>
              <button onClick={() => router.push("/delete-account")} className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition-all">Delete</button>
            </div>
          </motion.div>
        )}
      </div>
    </CustomerAccountLayout>
  );
}

// ============================================================
// Coupons Page
// ============================================================
const COUPONS = [
  { code: "WELCOME100", discount: "₹100 off", minOrder: "₹500", expiry: "Dec 31, 2024", category: "All", used: false, desc: "Welcome discount for new users" },
  { code: "VILLAGE20", discount: "20% off", minOrder: "₹1,000", expiry: "Dec 15, 2024", category: "Handloom", used: false, desc: "Special discount on village handloom products" },
  { code: "DIWALI50", discount: "₹50 off", minOrder: "₹300", expiry: "Nov 12, 2024", category: "All", used: true, desc: "Diwali festive offer" },
  { code: "FIRSTBUY", discount: "15% off", minOrder: "₹200", expiry: "Jan 31, 2025", category: "All", used: false, desc: "Your first purchase reward" },
  { code: "SAFFRON10", discount: "10% off", minOrder: "₹500", expiry: "Jan 15, 2025", category: "Food & Spices", used: false, desc: "Exclusive on spices & organic food" },
];

export function CouponsPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "used">("active");

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  const filtered = COUPONS.filter(c => filter === "all" ? true : filter === "active" ? !c.used : c.used);

  return (
    <CustomerAccountLayout title="My Coupons">
      <div className="max-w-2xl">
        <h1 className="text-[#1C1B14] text-xl font-bold mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>My Coupons 🎟️</h1>

        <div className="flex gap-1 bg-[#F5F4F0] p-1 rounded-2xl mb-6 w-fit">
          {(["active", "all", "used"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filter === f ? "bg-white shadow-sm text-[#1C1B14]" : "text-[#8C8B80] hover:text-[#555449]"}`}>{f}</button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-5 mb-6 flex gap-3">
          <input type="text" placeholder="Enter coupon code..." className="flex-1 h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
          <button className="px-5 h-11 rounded-xl text-sm font-semibold text-white whitespace-nowrap" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>Apply</button>
        </div>

        <div className="space-y-3">
          {filtered.map((coupon, i) => (
            <motion.div key={coupon.code} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl border p-5 transition-all ${coupon.used ? "opacity-60 border-black/5" : "border-[#FFD4A8]"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-base tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#FF7A00" }}>{coupon.code}</span>
                    {coupon.used && <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F4F0] text-[#B0AFA5] font-medium">Used</span>}
                  </div>
                  <p className="font-semibold text-[#1C1B14] text-sm mb-1">{coupon.discount} · {coupon.desc}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-[#8C8B80]">
                    <span>Min order: {coupon.minOrder}</span>
                    <span>·</span>
                    <span>Valid till {coupon.expiry}</span>
                    <span>·</span>
                    <span className="text-[#1A9E4E] font-medium">{coupon.category}</span>
                  </div>
                </div>
                {!coupon.used && (
                  <button onClick={() => copyCode(coupon.code)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap" style={copied === coupon.code ? { background: "#F0FDF4", color: "#1A9E4E", borderColor: "#BBF7D0" } : { borderColor: "#FFD4A8", color: "#FF7A00", background: "#FFF8F0" }}>
                    {copied === coupon.code ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CustomerAccountLayout>
  );
}

// ============================================================
// Return & Refund Page
// ============================================================
const RETURNABLE_ITEMS = [
  { id: "ret1", orderId: "ORD-2024-001234", product: "Bandhani Silk Saree - Royal Blue", price: 2499, img: "https://images.unsplash.com/photo-1569909115134-a0426936c879?w=200&auto=format&fit=crop", seller: "Meena Handicrafts", deliveredOn: "Nov 30, 2024", returnBy: "Dec 10, 2024", status: "eligible" },
  { id: "ret2", orderId: "ORD-2024-000998", product: "Blue Pottery Vase", price: 849, img: "https://images.unsplash.com/photo-1629218091978-f70a20a43aab?w=200&auto=format&fit=crop", seller: "Rajput Pottery Works", deliveredOn: "Nov 10, 2024", returnBy: "Nov 20, 2024", status: "expired" },
];

export function ReturnsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => { setSubmitted(true); setTimeout(() => { setSelected(null); setSubmitted(false); setReason(""); }, 1500); };

  return (
    <CustomerAccountLayout title="Returns & Refunds">
      <div className="max-w-2xl">
        <h1 className="text-[#1C1B14] text-xl font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Returns & Refunds ↩️</h1>
        <p className="text-sm text-[#8C8B80] mb-6">Easy 10-day return policy on all eligible items</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: "📦", title: "Easy Returns", desc: "10-day return window" },
            { icon: "💰", title: "Quick Refund", desc: "3-5 business days" },
            { icon: "🚚", title: "Free Pickup", desc: "We collect from your door" },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl border border-black/5 p-4 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-xs font-semibold text-[#1C1B14]">{item.title}</div>
              <div className="text-xs text-[#8C8B80]">{item.desc}</div>
            </div>
          ))}
        </div>

        <h3 className="font-bold text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Orders</h3>
        <div className="space-y-4">
          {RETURNABLE_ITEMS.map((item, i) => (
            <div key={item.id}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-2xl border p-5 ${item.status === "expired" ? "opacity-70 border-black/5" : "border-[#D4D3CB]"}`}>
                <div className="flex gap-4 items-start">
                  <img src={item.img} alt={item.product} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#8C8B80] mb-0.5">{item.seller} · {item.orderId}</p>
                    <p className="font-semibold text-[#1C1B14] text-sm line-clamp-2 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.product}</p>
                    <p className="text-sm font-bold text-[#1C1B14] mb-1">₹{item.price.toLocaleString()}</p>
                    <p className="text-xs text-[#8C8B80]">Delivered {item.deliveredOn}</p>
                    {item.status === "eligible" ? (
                      <p className="text-xs font-medium text-[#1A9E4E]">Return by {item.returnBy}</p>
                    ) : (
                      <p className="text-xs text-red-500">Return window expired {item.returnBy}</p>
                    )}
                  </div>
                  {item.status === "eligible" && (
                    <button onClick={() => setSelected(selected === item.id ? null : item.id)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00] hover:text-[#FF7A00] transition-all">
                      <RotateCcw size={12} /> Return
                    </button>
                  )}
                </div>
              </motion.div>

              <AnimatePresence>
                {selected === item.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="bg-[#FFF8F0] border border-[#FFD4A8] rounded-b-2xl p-5 mt-1">
                      {submitted ? (
                        <div className="text-center py-4"><div className="text-3xl mb-2">✅</div><p className="font-semibold text-[#1A9E4E]">Return request submitted! We'll pick it up in 2-3 days.</p></div>
                      ) : (
                        <>
                          <p className="font-semibold text-[#1C1B14] text-sm mb-3">Why are you returning this?</p>
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {["Wrong size/fit", "Damaged product", "Not as described", "Changed my mind", "Quality issue", "Wrong item sent"].map(r => (
                              <button key={r} onClick={() => setReason(r)} className={`py-2 px-3 rounded-xl text-xs font-medium border-2 text-left transition-all ${reason === r ? "border-[#FF7A00] text-[#FF7A00] bg-[#FFF8F0]" : "border-[#D4D3CB] text-[#555449]"}`}>{r}</button>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={handleSubmit} disabled={!reason} className="px-6 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>Submit Return</button>
                            <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-xl text-sm border border-[#D4D3CB] text-[#555449]">Cancel</button>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </CustomerAccountLayout>
  );
}
