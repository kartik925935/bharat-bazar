'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Package, CheckCircle, Share2, Heart, Grid, List } from "lucide-react";

const SELLERS = [
  {
    id: "meena-handicrafts",
    name: "Meena Handicrafts",
    tagline: "Authentic Rajasthani Bandhani & Block Print",
    avatar: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&auto=format&fit=crop",
    location: "Jaipur, Rajasthan",
    since: "2021",
    tier: "Gold",
    rating: 4.8,
    totalReviews: 1284,
    totalSales: 4200,
    responseTime: "< 2 hours",
    bio: "I am Meena Devi, a third-generation Bandhani artisan from Jaipur. My family has practiced this art for over 60 years, passing the craft from mother to daughter. Every piece I make carries the love, precision, and heritage of Rajasthani textile tradition.\n\nI work with a small team of 8 women from my village, all of whom are trained in authentic Bandhani tying techniques. We use only natural dyes sourced from local plants and minerals.",
    specialties: ["Bandhani Sarees", "Block Print Dupattas", "Hand-dyed Lehengas", "Natural Dye Fabrics"],
    certifications: ["GI Tag Holder", "Handloom Mark", "Fair Trade Certified"],
    products: [
      { id: "1", name: "Bandhani Silk Saree - Royal Blue", price: 2499, mrp: 3500, rating: 4.9, reviews: 234, img: "https://images.unsplash.com/photo-1569909115134-a0426936c879?w=400&auto=format&fit=crop", badge: "Bestseller" },
      { id: "2", name: "Block Print Cotton Dupatta", price: 699, mrp: 999, rating: 4.7, reviews: 156, img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&auto=format&fit=crop", badge: "New" },
      { id: "3", name: "Natural Dye Kurta Set", price: 1899, mrp: 2499, rating: 4.8, reviews: 89, img: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&auto=format&fit=crop", badge: "" },
      { id: "4", name: "Bandhani Lehnga Choli", price: 3999, mrp: 5500, rating: 4.9, reviews: 67, img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&auto=format&fit=crop", badge: "Top Rated" },
      { id: "5", name: "Indigo Block Print Saree", price: 1799, mrp: 2400, rating: 4.6, reviews: 112, img: "https://images.unsplash.com/photo-1591291621164-2c6367723315?w=400&auto=format&fit=crop", badge: "" },
      { id: "6", name: "Batik Silk Stole", price: 899, mrp: 1299, rating: 4.7, reviews: 78, img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&auto=format&fit=crop", badge: "" },
    ],
    reviews: [
      { user: "Sneha R.", rating: 5, text: "Absolutely stunning saree! The Bandhani work is so intricate. Meena ji was very helpful and even customized the color for me.", date: "Dec 10, 2024", verified: true },
      { user: "Priya M.", rating: 5, text: "Ordered the dupatta and it arrived beautifully packaged. The colors are vibrant and exactly as shown. Will definitely buy again!", date: "Nov 28, 2024", verified: true },
      { user: "Kavita S.", rating: 4, text: "Great quality, just as described. Shipping took a little longer than expected but the product is worth the wait.", date: "Nov 15, 2024", verified: true },
    ],
  },
];

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Gold: { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
  Platinum: { bg: "#F3E8FF", text: "#5B21B6", border: "#C4B5FD" },
  Silver: { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" },
  Bronze: { bg: "#FEF0E6", text: "#9A3412", border: "#FDBA74" },
};

export function SellerPublicPage() {
  const { sellerId } = useParams();
  const [activeTab, setActiveTab] = useState<"products" | "about" | "reviews">("products");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [followed, setFollowed] = useState(false);

  const seller = SELLERS.find(s => s.id === sellerId) || SELLERS[0];
  const tierColor = TIER_COLORS[seller.tier] || TIER_COLORS.Silver;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20 lg:pb-0">
      {/* Banner */}
      <div className="relative h-52 sm:h-64 overflow-hidden">
        <img src={seller.banner} alt="Shop Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Seller Info Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 mb-8">
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img src={seller.avatar} alt={seller.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md" />
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#1A9E4E] flex items-center justify-center">
                  <CheckCircle size={14} className="text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-3 mb-2">
                  <h1 className="text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.5rem", fontWeight: 800 }}>{seller.name}</h1>
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border" style={{ background: tierColor.bg, color: tierColor.text, borderColor: tierColor.border }}>
                    ⭐ {seller.tier} Seller
                  </span>
                </div>
                <p className="text-[#8C8B80] text-sm mb-3">{seller.tagline}</p>
                <div className="flex flex-wrap gap-4 text-sm text-[#555449] mb-4">
                  <span className="flex items-center gap-1.5"><MapPin size={14} style={{ color: "#FF7A00" }} />{seller.location}</span>
                  <span className="flex items-center gap-1.5"><Package size={14} style={{ color: "#FF7A00" }} />{seller.totalSales.toLocaleString()} sales</span>
                  <span className="flex items-center gap-1.5"><Star size={14} className="fill-amber-400 text-amber-400" />{seller.rating} ({seller.totalReviews.toLocaleString()} reviews)</span>
                  <span className="flex items-center gap-1.5">🕐 Responds in {seller.responseTime}</span>
                  <span className="text-[#B0AFA5]">Member since {seller.since}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {seller.certifications.map(cert => (
                    <span key={cert} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F0FDF4] text-[#1A9E4E] border border-[#BBF7D0]">
                      <CheckCircle size={11} /> {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                <motion.button
                  onClick={() => setFollowed(f => !f)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${followed ? "border-2 border-[#FF7A00] text-[#FF7A00] bg-[#FFF8F0]" : "text-white"}`}
                  style={followed ? {} : { background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  {followed ? "Following ✓" : "Follow Shop"}
                </motion.button>
                <button className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00] transition-all flex items-center gap-2">
                  <Share2 size={14} /> Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { value: seller.totalSales.toLocaleString(), label: "Total Sales" },
            { value: `${seller.rating}★`, label: "Rating" },
            { value: seller.responseTime, label: "Response Time" },
            { value: "99%", label: "On-time Delivery" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 border border-black/5 text-center">
              <div className="font-black text-lg mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#FF7A00" }}>{stat.value}</div>
              <div className="text-xs text-[#8C8B80]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#F5F4F0] p-1 rounded-2xl mb-8 w-fit">
          {(["products", "about", "reviews"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${activeTab === tab ? "bg-white shadow-sm text-[#1C1B14]" : "text-[#8C8B80] hover:text-[#555449]"}`}
            >
              {tab} {tab === "products" ? `(${seller.products.length})` : tab === "reviews" ? `(${seller.reviews.length})` : ""}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#8C8B80]">{seller.products.length} products</p>
              <div className="flex gap-1">
                <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-[#FF7A00] text-white" : "bg-white border border-[#D4D3CB] text-[#555449]"}`}><Grid size={16} /></button>
                <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-[#FF7A00] text-white" : "bg-white border border-[#D4D3CB] text-[#555449]"}`}><List size={16} /></button>
              </div>
            </div>
            <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}>
              {seller.products.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  {viewMode === "grid" ? (
                    <Link href={`/products/${product.id}`} className="block bg-white rounded-2xl overflow-hidden border border-black/5 hover:shadow-md transition-all group">
                      <div className="relative aspect-square overflow-hidden">
                        <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {product.badge && <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[11px] font-bold text-white" style={{ background: "#FF7A00" }}>{product.badge}</span>}
                        <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-50 transition-all">
                          <Heart size={14} className="text-[#B0AFA5]" />
                        </button>
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-semibold text-[#1C1B14] line-clamp-2 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{product.name}</p>
                        <div className="flex items-center gap-1 mb-1">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          <span className="text-xs text-[#555449]">{product.rating} ({product.reviews})</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-[#1C1B14] text-sm">₹{product.price.toLocaleString()}</span>
                          <span className="text-xs text-[#B0AFA5] line-through">₹{product.mrp.toLocaleString()}</span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link href={`/products/${product.id}`} className="flex gap-4 bg-white rounded-2xl p-4 border border-black/5 hover:shadow-sm transition-all group">
                      <img src={product.img} alt={product.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1C1B14] mb-1 group-hover:text-[#FF7A00] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{product.name}</p>
                        <div className="flex items-center gap-1 mb-1">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span className="text-xs text-[#555449]">{product.rating} ({product.reviews} reviews)</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-[#1C1B14]">₹{product.price.toLocaleString()}</span>
                          <span className="text-sm text-[#B0AFA5] line-through">₹{product.mrp.toLocaleString()}</span>
                          <span className="text-xs font-bold text-[#1A9E4E]">{Math.round((1 - product.price / product.mrp) * 100)}% off</span>
                        </div>
                      </div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <h3 className="font-bold text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Our Story</h3>
              {seller.bio.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm text-[#555449] leading-relaxed mb-3">{para}</p>
              ))}
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-black/5 p-6">
                <h3 className="font-bold text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {seller.specialties.map(s => (
                    <span key={s} className="px-3 py-1.5 rounded-xl text-sm font-medium bg-[#FFF8F0] text-[#FF7A00] border border-[#FFD4A8]">{s}</span>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-black/5 p-6">
                <h3 className="font-bold text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Certifications</h3>
                <div className="space-y-2">
                  {seller.certifications.map(cert => (
                    <div key={cert} className="flex items-center gap-3 text-sm text-[#555449]">
                      <div className="w-6 h-6 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                        <CheckCircle size={14} className="text-[#1A9E4E]" />
                      </div>
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div>
            <div className="bg-white rounded-2xl border border-black/5 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-8 items-center">
                <div className="text-center">
                  <div className="text-6xl font-black mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#FF7A00" }}>{seller.rating}</div>
                  <div className="flex gap-0.5 justify-center mb-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={18} className={i < Math.floor(seller.rating) ? "fill-amber-400 text-amber-400" : "text-[#D4D3CB]"} />
                    ))}
                  </div>
                  <div className="text-sm text-[#8C8B80]">{seller.totalReviews.toLocaleString()} reviews</div>
                </div>
                <div className="flex-1 w-full space-y-2">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-xs text-[#555449] w-4">{star}★</span>
                      <div className="flex-1 h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: star === 5 ? "75%" : star === 4 ? "18%" : "4%" }} viewport={{ once: true }} className="h-full rounded-full bg-amber-400" />
                      </div>
                      <span className="text-xs text-[#B0AFA5] w-8">{star === 5 ? "75%" : star === 4 ? "18%" : "4%"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {seller.reviews.map((review, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl border border-black/5 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#1C1B14] text-sm">{review.user}</span>
                        {review.verified && <span className="text-xs text-[#1A9E4E] font-medium bg-[#F0FDF4] px-2 py-0.5 rounded-full">✓ Verified</span>}
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-[#D4D3CB]"} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-[#B0AFA5]">{review.date}</span>
                  </div>
                  <p className="text-sm text-[#555449] leading-relaxed">{review.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="h-10" />
      </div>
    </div>
  );
}


const ALL_SELLERS = [
  { id: "meena-handicrafts", name: "Meena Handicrafts", tagline: "Authentic Rajasthani Bandhani & Block Print", location: "Jaipur, Rajasthan", tier: "Gold", rating: 4.8, reviews: 1284, sales: "4,200+", category: "Handloom & Textiles", avatar: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=200&h=200&fit=crop" },
  { id: "kashmir-harvest", name: "Kashmir Harvest", tagline: "Premium Kashmiri Spices & Dry Fruits", location: "Srinagar, J&K", tier: "Platinum", rating: 4.9, reviews: 3210, sales: "12,000+", category: "Organic Food", avatar: "https://images.unsplash.com/photo-1663325265966-0d17de3e85c5?w=200&h=200&fit=crop" },
  { id: "rajput-pottery", name: "Rajput Pottery Works", tagline: "Hand-painted Blue Pottery from Jaipur", location: "Jaipur, Rajasthan", tier: "Silver", rating: 4.7, reviews: 892, sales: "2,800+", category: "Pottery & Ceramics", avatar: "https://images.unsplash.com/photo-1629218091978-f70a20a43aab?w=200&h=200&fit=crop" },
  { id: "odissi-craft", name: "Odissi Craft House", tagline: "Traditional Odisha Silver & Brass Jewellery", location: "Cuttack, Odisha", tier: "Gold", rating: 4.8, reviews: 1560, sales: "5,100+", category: "Jewelry", avatar: "https://images.unsplash.com/photo-1620619767323-b95a89183081?w=200&h=200&fit=crop" },
  { id: "warli-art-studio", name: "Warli Art Studio", tagline: "Authentic Warli Tribal Paintings & Prints", location: "Palghar, Maharashtra", tier: "Silver", rating: 4.6, reviews: 445, sales: "1,200+", category: "Paintings & Art", avatar: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=200&h=200&fit=crop" },
  { id: "bamboo-craft-assam", name: "Bamboo Craft Assam", tagline: "Eco-friendly Bamboo Home Products", location: "Guwahati, Assam", tier: "Bronze", rating: 4.5, reviews: 312, sales: "980+", category: "Home Décor", avatar: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
  { id: "madhubani-art", name: "Madhubani Art Collective", tagline: "Bihar's Finest Madhubani Paintings", location: "Madhubani, Bihar", tier: "Gold", rating: 4.7, reviews: 723, sales: "2,100+", category: "Paintings & Art", avatar: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=200&h=200&fit=crop" },
  { id: "silk-weavers-varanasi", name: "Silk Weavers Varanasi", tagline: "Handwoven Banarasi Silk Sarees", location: "Varanasi, UP", tier: "Platinum", rating: 4.9, reviews: 4100, sales: "15,000+", category: "Handloom & Textiles", avatar: "https://images.unsplash.com/photo-1591291621164-2c6367723315?w=200&h=200&fit=crop" },
];

const TIER_BADGE: Record<string, { bg: string; text: string; icon: string }> = {
  Platinum: { bg: "#F3E8FF", text: "#5B21B6", icon: "💎" },
  Gold: { bg: "#FEF3C7", text: "#92400E", icon: "🥇" },
  Silver: { bg: "#F1F5F9", text: "#475569", icon: "🥈" },
  Bronze: { bg: "#FEF0E6", text: "#9A3412", icon: "🥉" },
};

export function SellerListingPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categoryTabs = ["All", "Handloom & Textiles", "Organic Food", "Pottery & Ceramics", "Jewelry", "Paintings & Art", "Home Décor"];

  const filtered = ALL_SELLERS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.tagline.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || s.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#1C1B14] to-[#2D2C1E] py-14 px-4 text-center mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-3">🏺</div>
          <h1 className="text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "2rem", fontWeight: 800 }}>
            Meet Our Artisans & Sellers
          </h1>
          <p className="text-[#8C8B80] mb-7 max-w-xl mx-auto text-sm">
            Discover skilled craftspeople from across India — from Rajasthan's weavers to Kashmir's spice farmers. Every purchase directly supports their livelihood.
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="text"
              placeholder="Search sellers by name or specialty…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 h-12 px-4 rounded-xl text-sm outline-none bg-white/10 text-white placeholder-[#8C8B80] border border-white/20 focus:border-[#FF7A00] transition-all"
            />
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {categoryTabs.map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${categoryFilter === cat ? "text-white" : "bg-white text-[#555449] border border-[#D4D3CB] hover:border-[#FF7A00]"}`}
              style={categoryFilter === cat ? { background: "linear-gradient(135deg, #FF7A00, #FF4500)" } : {}}
            >{cat}</button>
          ))}
        </div>

        <p className="text-sm text-[#8C8B80] mb-6">{filtered.length} seller{filtered.length !== 1 ? "s" : ""} found</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((seller, i) => {
            const tier = TIER_BADGE[seller.tier];
            return (
              <motion.div key={seller.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-black/5 overflow-hidden hover:shadow-md transition-all group">
                <div className="h-20 bg-gradient-to-br from-[#FFF8F0] to-[#FFE8D0] relative">
                  <span className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: tier.bg, color: tier.text }}>
                    {tier.icon} {seller.tier}
                  </span>
                </div>
                <div className="-mt-9 px-4 pb-4">
                  <img src={seller.avatar} alt={seller.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md mb-3" />
                  <h3 className="font-bold text-[#1C1B14] mb-0.5 group-hover:text-[#FF7A00] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{seller.name}</h3>
                  <p className="text-xs text-[#8C8B80] mb-2 line-clamp-1">{seller.tagline}</p>
                  <div className="flex items-center gap-1 text-xs text-[#8C8B80] mb-3">
                    <MapPin size={10} /> {seller.location}
                  </div>
                  <div className="flex items-center justify-between text-xs mb-4">
                    <span className="flex items-center gap-0.5 font-semibold text-[#1C1B14]">⭐ {seller.rating} <span className="text-[#B0AFA5] font-normal">({seller.reviews.toLocaleString()})</span></span>
                    <span className="text-[#1A9E4E] font-semibold">{seller.sales} sales</span>
                  </div>
                  <Link href={`/seller/${seller.id}`}
                    className="block w-full h-9 rounded-xl text-sm font-semibold text-white text-center leading-9 transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
                    Visit Shop →
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No sellers found</h3>
            <p className="text-[#8C8B80]">Try a different search term or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
