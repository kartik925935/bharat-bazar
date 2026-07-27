'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tag, Clock, Heart, ShoppingBag, Star, UserCheck, ChevronRight, Copy, CheckCircle } from "lucide-react";
import { CustomerAccountLayout } from "./CustomerDashboard";

// ─── All Offers ────────────────────────────────────────────
const OFFERS = [
  { id: "o1", title: "Grand Festive Sale", badge: "LIVE", discount: "Up to 50% off", category: "All Categories", ends: "Dec 31, 2024", color: "#FF7A00", emoji: "🪔", products: 240 },
  { id: "o2", title: "Handloom Special", badge: "HOT", discount: "Flat ₹200 off on ₹999+", category: "Textiles", ends: "Dec 15, 2024", color: "#7C3AED", emoji: "🧵", products: 85 },
  { id: "o3", title: "Winter Craft Fair", badge: "NEW", discount: "Up to 30% off", category: "Home Décor", ends: "Jan 5, 2025", color: "#1A9E4E", emoji: "🏡", products: 130 },
  { id: "o4", title: "Artisan Direct Deals", badge: "EXCLUSIVE", discount: "15% extra on app", category: "All Categories", ends: "Ongoing", color: "#2563EB", emoji: "🎨", products: 310 },
  { id: "o5", title: "Flash Sale — 6 PM", badge: "UPCOMING", discount: "Up to 70% off", category: "Jewellery", ends: "Today 6–8 PM", color: "#DC2626", emoji: "⚡", products: 45 },
  { id: "o6", title: "Zero Delivery Charge", badge: "OFFER", discount: "Free delivery on ₹499+", category: "All", ends: "Dec 20, 2024", color: "#FF7A00", emoji: "🚚", products: 0 },
];

export function AllOffersPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Deals & Offers 🎉
          </h1>
          <p className="text-[#8C8B80]">Exclusive discounts on authentic Indian handicrafts</p>
        </div>

        {/* Hero offer */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-8 mb-8 text-white text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
          <div className="text-5xl mb-3">🪔</div>
          <div className="text-xs font-semibold uppercase tracking-widest mb-2 opacity-80">Grand Festive Sale</div>
          <div className="text-4xl font-black mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Up to 50% OFF</div>
          <div className="text-sm opacity-80 mb-5">On 240+ artisan products · Ends Dec 31, 2024</div>
          <Link href="/products" className="inline-block px-8 py-3 bg-white rounded-xl font-semibold text-sm" style={{ color: "#FF7A00" }}>
            Shop Now →
          </Link>
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {OFFERS.slice(1).map((offer, i) => (
            <motion.div key={offer.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link href="/products" className="block bg-white rounded-2xl border border-black/5 p-5 hover:shadow-md transition-all hover:-translate-y-0.5 h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{offer.emoji}</div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: offer.color }}>
                    {offer.badge}
                  </span>
                </div>
                <div className="font-bold text-[#1C1B14] mb-1 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{offer.title}</div>
                <div className="text-base font-black mb-1" style={{ color: offer.color }}>{offer.discount}</div>
                <div className="text-xs text-[#8C8B80]">{offer.category}</div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F5F4F0]">
                  <span className="text-xs text-[#8C8B80] flex items-center gap-1"><Clock size={11} /> {offer.ends}</span>
                  {offer.products > 0 && <span className="text-xs text-[#8C8B80]">{offer.products} products</span>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/coupons" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#FF7A00] text-sm font-semibold" style={{ color: "#FF7A00" }}>
            <Tag size={15} /> View My Coupons
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Flash Sale ────────────────────────────────────────────
function useCountdown(targetHour: number) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(targetHour, 0, 0, 0);
      if (now >= target) target.setDate(target.getDate() + 1);
      const diff = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
      setTime({ h: Math.floor(diff / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetHour]);
  return time;
}

const FLASH_PRODUCTS = [
  { id: "f1", name: "Bandhani Silk Saree", seller: "Meena Handicrafts", original: 2499, sale: 999, stock: 3, rating: 4.9, img: "https://images.unsplash.com/photo-1569909115134-a0426936c879?w=300&fit=crop" },
  { id: "f2", name: "Blue Pottery Vase", seller: "Jaipur Blue Art", original: 1299, sale: 649, stock: 5, rating: 4.7, img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&fit=crop" },
  { id: "f3", name: "Madhubani Wall Art", seller: "Bihar Craft House", original: 3500, sale: 1499, stock: 2, rating: 4.8, img: "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=300&fit=crop" },
  { id: "f4", name: "Kashmiri Pashmina Shawl", seller: "Kashmir Looms", original: 4999, sale: 2199, stock: 4, rating: 5.0, img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300&fit=crop" },
];

export function FlashSalePage() {
  const time = useCountdown(20);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> FLASH SALE — LIVE NOW
          </div>
          <h1 className="text-4xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            ⚡ Up to 70% Off
          </h1>
          <p className="text-[#8C8B80] mb-6">Hurry! Limited stock available. Sale ends at 8 PM tonight.</p>

          {/* Countdown */}
          <div className="flex justify-center gap-3">
            {[{ label: "Hours", val: time.h }, { label: "Mins", val: time.m }, { label: "Secs", val: time.s }].map(({ label, val }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white" style={{ background: "linear-gradient(135deg, #DC2626, #B91C1C)" }}>
                  {pad(val)}
                </div>
                <span className="text-xs text-[#8C8B80] mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FLASH_PRODUCTS.map((p, i) => {
            const discount = Math.round((1 - p.sale / p.original) * 100);
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link href={`/products/${p.id}`} className="block bg-white rounded-2xl border border-black/5 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="relative">
                    <img src={p.img} alt={p.name} className="w-full h-44 object-cover" />
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">{discount}% OFF</div>
                    {p.stock <= 3 && (
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-lg">Only {p.stock} left!</div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="text-xs text-[#8C8B80] mb-0.5">{p.seller}</div>
                    <div className="text-sm font-semibold text-[#1C1B14] mb-2 line-clamp-2">{p.name}</div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base" style={{ color: "#DC2626" }}>₹{p.sale}</span>
                      <span className="text-xs text-[#B0AFA5] line-through">₹{p.original}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs text-[#8C8B80]">{p.rating}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Coupon Detail ─────────────────────────────────────────
const MOCK_COUPONS_DETAIL: Record<string, { code: string; title: string; discount: string; minOrder: number; expiry: string; desc: string; terms: string[] }> = {
  "MEENA10": { code: "MEENA10", title: "10% off on Meena Handicrafts", discount: "10% off", minOrder: 500, expiry: "Dec 31, 2024", desc: "Get 10% off on all products from Meena Handicrafts store. Great for Bandhani sarees and block print textiles.", terms: ["Valid only on Meena Handicrafts products", "Minimum order value ₹500", "Maximum discount ₹200", "Cannot be combined with other offers", "Valid till Dec 31, 2024"] },
  "FLAT100": { code: "FLAT100", title: "Flat ₹100 off on ₹799+", discount: "₹100 off", minOrder: 799, expiry: "Dec 20, 2024", desc: "Save ₹100 instantly on your purchase above ₹799 from any seller on Bharat Bazaar.", terms: ["Valid on all categories", "Minimum order value ₹799", "One-time use per account", "Cannot be combined with flash sale prices", "Valid till Dec 20, 2024"] },
};

export function CouponDetailPage() {
  const params = useParams();
  const codeStr = Array.isArray(params?.code) ? params.code[0] : params?.code;
  const coupon = MOCK_COUPONS_DETAIL[(codeStr || "MEENA10") as keyof typeof MOCK_COUPONS_DETAIL] || MOCK_COUPONS_DETAIL["MEENA10"];
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CustomerAccountLayout title="Coupon Details">
      <div className="max-w-lg">
        <h2 className="font-bold text-xl text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Coupon Details</h2>

        <div className="bg-white rounded-2xl border-2 border-dashed border-[#FFD4A8] p-6 mb-4">
          <div className="text-center mb-4">
            <div className="text-xs text-[#8C8B80] mb-1 uppercase tracking-wider">Coupon Code</div>
            <div className="text-3xl font-black tracking-widest mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#FF7A00" }}>{coupon.code}</div>
            <div className="text-2xl font-black text-[#1C1B14] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{coupon.discount}</div>
            <div className="text-sm text-[#8C8B80]">on orders above ₹{coupon.minOrder}</div>
          </div>

          <motion.button whileTap={{ scale: 0.97 }} onClick={copy}
            className="w-full h-11 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all"
            style={{ background: copied ? "#1A9E4E" : "linear-gradient(135deg, #FF7A00, #FF4500)", color: "white" }}>
            {copied ? <><CheckCircle size={16} /> Copied!</> : <><Copy size={16} /> Copy Code</>}
          </motion.button>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-5 mb-4">
          <div className="font-semibold text-sm text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>About this coupon</div>
          <p className="text-sm text-[#555449] mb-3">{coupon.desc}</p>
          <div className="flex items-center gap-2 text-xs text-[#8C8B80]">
            <Clock size={12} /> Valid till {coupon.expiry}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-5 mb-4">
          <div className="font-semibold text-sm text-[#1C1B14] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Terms & Conditions</div>
          <ul className="space-y-2">
            {coupon.terms.map(t => (
              <li key={t} className="flex items-start gap-2 text-xs text-[#8C8B80]">
                <span className="text-[#FF7A00] shrink-0 mt-0.5">•</span> {t}
              </li>
            ))}
          </ul>
        </div>

        <Link href="/products" className="flex items-center justify-center w-full h-12 rounded-xl text-white font-semibold text-sm"
          style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
          <ShoppingBag size={16} className="mr-2" /> Shop Now
        </Link>
      </div>
    </CustomerAccountLayout>
  );
}

// ─── Following Sellers ─────────────────────────────────────
const FOLLOWING = [
  { id: "s1", name: "Meena Handicrafts", location: "Jaipur, Rajasthan", specialty: "Bandhani & Block Print", rating: 4.9, reviews: 1284, followers: 3820, badge: "Platinum", avatar: "🧵" },
  { id: "s2", name: "Kashmir Looms", location: "Srinagar, J&K", specialty: "Pashmina & Kashmiri Craft", rating: 4.8, reviews: 892, followers: 2140, badge: "Gold", avatar: "🏔️" },
  { id: "s3", name: "Bihar Craft House", location: "Madhubani, Bihar", specialty: "Madhubani Paintings", rating: 4.7, reviews: 456, followers: 1090, badge: "Silver", avatar: "🎨" },
  { id: "s4", name: "Kondapalli Toys", location: "Vijayawada, Andhra Pradesh", specialty: "Wooden Toys & Crafts", rating: 4.6, reviews: 234, followers: 780, badge: "Silver", avatar: "🪆" },
];

export function FollowingSellersPage() {
  const [following, setFollowing] = useState(FOLLOWING.map(s => ({ ...s, followed: true })));
  const toggle = (id: string) => setFollowing(prev => prev.map(s => s.id === id ? { ...s, followed: !s.followed } : s));

  return (
    <CustomerAccountLayout title="Sellers I Follow">
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sellers I Follow</h2>
          <div className="text-sm text-[#8C8B80]">{following.filter(s => s.followed).length} sellers</div>
        </div>

        {following.filter(s => s.followed).length === 0 ? (
          <div className="text-center py-16">
            <UserCheck size={40} className="mx-auto mb-3 text-[#D4D3CB]" />
            <div className="font-semibold text-[#1C1B14] mb-1">Not following anyone yet</div>
            <p className="text-sm text-[#8C8B80] mb-5">Follow sellers to get updates on new products and offers</p>
            <Link href="/products" className="inline-block px-6 py-2.5 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
              Discover Sellers
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {following.filter(s => s.followed).map((seller, i) => (
              <motion.div key={seller.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-black/5 p-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF8F0] flex items-center justify-center text-3xl shrink-0">{seller.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-[#1C1B14] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{seller.name}</div>
                        <div className="text-xs text-[#8C8B80]">{seller.location}</div>
                        <div className="text-xs text-[#555449] mt-0.5">{seller.specialty}</div>
                      </div>
                      <button onClick={() => toggle(seller.id)}
                        className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all border-[#D4D3CB] text-[#555449] hover:border-red-400 hover:text-red-500">
                        Unfollow
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#8C8B80]">
                      <span className="flex items-center gap-1"><Star size={11} className="fill-amber-400 text-amber-400" /> {seller.rating}</span>
                      <span>{seller.reviews} reviews</span>
                      <span>{seller.followers.toLocaleString()} followers</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#F5F4F0]">
                  <Link href={`/seller/${seller.id}`} className="text-xs font-semibold flex items-center gap-1" style={{ color: "#FF7A00" }}>
                    Visit Shop <ChevronRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </CustomerAccountLayout>
  );
}
