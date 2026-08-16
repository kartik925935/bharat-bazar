'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Home, Search, Package, MessageCircle, ArrowRight, Mail, Phone, MapPin, Users, Globe, Award, Heart, AlertTriangle, RefreshCw, Wifi, Clock, XCircle } from "lucide-react";
import { CustomerAccountLayout } from "./CustomerDashboard";

// ============================================================
// About Page
// ============================================================
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);

  if (start && !hasStarted.current) {
    hasStarted.current = true;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  return count;
}

export function AboutPage() {
  const impactRef = useRef<HTMLDivElement>(null);
  const inView = useInView(impactRef, { once: true });
  const sellers = useCountUp(50000, 2000, inView);
  const customers = useCountUp(500000, 2000, inView);
  const states = useCountUp(28, 1500, inView);
  const gmv = useCountUp(12, 1500, inView);

  const team = [
    { name: "Rajan Mehta", role: "Co-Founder & CEO", bio: "IIT Bombay alumnus, ex-Flipkart", emoji: "👨‍💼" },
    { name: "Priya Sharma", role: "Co-Founder & CTO", bio: "Ex-Google India, Stanford MBA", emoji: "👩‍💻" },
    { name: "Anita Devi", role: "Head of Artisan Relations", bio: "20 years in social entrepreneurship", emoji: "👩‍🎨" },
    { name: "Suresh Kumar", role: "VP Operations", bio: "Ex-Amazon, supply chain expert", emoji: "👨‍🔧" },
  ];

  const timeline = [
    { year: "2022", event: "Founded in Bangalore with a vision to empower artisans" },
    { year: "2023", event: "1,000 sellers joined. ₹1 Crore GMV milestone" },
    { year: "2024", event: "₹12 Crore GMV. Expanded to 28 states" },
    { year: "2025", event: "Pan-India presence. 50,000+ sellers" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-16 lg:pb-0">
      {/* Hero */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #FFFAF5, #FFF5E8)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6" style={{ borderColor: "rgba(255,122,0,0.2)", background: "#FFF8F0" }}>
              <span style={{ color: "#FF7A00" }}>🇮🇳</span>
              <span className="text-sm font-semibold" style={{ color: "#FF7A00" }}>Made with ❤️ in India</span>
            </div>
            <h1 className="text-[#1C1B14] mb-6 max-w-3xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900 }}>
              Connecting India's Artisans to the World
            </h1>
            <p className="text-lg text-[#8C8B80] max-w-2xl mx-auto mb-10">
              Founded in 2022 with a mission to empower grassroots sellers and preserve India's rich craft heritage through technology.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: `${sellers.toLocaleString()}+`, label: "Sellers" },
              { value: `₹${gmv}+ Cr`, label: "GMV Generated" },
              { value: `${states}`, label: "States Covered" },
              { value: `${(customers / 1000).toFixed(0)}K+`, label: "Happy Customers" },
            ].map((stat) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 border border-black/5">
                <div className="text-3xl font-black mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#FF7A00" }}>{stat.value}</div>
                <div className="text-sm text-[#8C8B80]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Numbers (for count-up) */}
      <div ref={impactRef} />

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-[#1C1B14] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Our Mission</h2>
            <p className="text-[#8C8B80] max-w-2xl mx-auto">Every purchase on Bharat Bazaar creates a ripple of positive change</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: "🤝", title: "Empowerment", desc: "Providing digital access to artisans who've never sold online, giving them tools to reach customers nationwide" },
              { icon: "🌿", title: "Sustainability", desc: "Promoting traditional crafts that use natural materials and time-tested sustainable practices" },
              { icon: "🇮🇳", title: "Made in India", desc: "Celebrating India's incredible diversity of crafts, cultures, and communities across 28 states" },
            ].map((item) => (
              <div key={item.title} className="text-center p-8 rounded-2xl border border-black/5 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-[#1C1B14] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title}</h3>
                <p className="text-sm text-[#8C8B80] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-[#1C1B14] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Meet the Team</h2>
            <p className="text-[#8C8B80]">The people building India's artisan economy</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 text-center border border-black/5 hover:shadow-md transition-all">
                <div className="text-6xl mb-4">{member.emoji}</div>
                <div className="font-semibold text-[#1C1B14] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{member.name}</div>
                <div className="text-xs font-semibold mb-2" style={{ color: "#FF7A00" }}>{member.role}</div>
                <div className="text-xs text-[#8C8B80]">{member.bio}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[#1C1B14] mb-14 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Our Journey</h2>
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <motion.div key={item.year} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex gap-6 items-start pb-10 relative">
                <div className="w-20 text-right shrink-0">
                  <span className="font-black text-lg" style={{ color: "#FF7A00", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.year}</span>
                </div>
                <div className="relative">
                  <div className="w-4 h-4 rounded-full border-4 border-[#FF7A00] bg-white shrink-0" />
                  {i < timeline.length - 1 && <div className="absolute top-4 left-1.5 w-0.5 h-[calc(100%+0.5rem)] bg-[#FFD4A8]" />}
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-[#555449] leading-relaxed">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Join the Movement</h2>
          <p className="text-white/80 mb-8">Whether you're a buyer or a seller, you're part of India's artisan revolution</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/products" className="px-8 py-4 bg-white rounded-2xl font-semibold hover:scale-105 transition-all" style={{ color: "#FF7A00" }}>
              Start Shopping
            </Link>
            <Link href="/seller-register" className="px-8 py-4 bg-white/20 text-white rounded-2xl font-semibold hover:bg-white/30 transition-all border border-white/30">
              Start Selling
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// Contact Page
// ============================================================
export function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", topic: "", message: "", orderId: "" });
  const [submitted, setSubmitted] = useState(false);

  const popularTopics = [
    { icon: "📦", label: "Track Order", href: "/orders" },
    { icon: "↩️", label: "Returns", href: "/returns" },
    { icon: "💳", label: "Payments", href: "/payment-help" },
    { icon: "🏪", label: "Become Seller", href: "/seller-register" },
    { icon: "🔐", label: "Account", href: "/profile" },
    { icon: "🚚", label: "Delivery", href: "/shipping" },
    { icon: "🎟️", label: "Coupons", href: "/offers" },
    { icon: "💬", label: "Complaints", href: "/complaints" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-16 lg:pb-0">
      {/* Hero */}
      <section className="py-16 bg-white border-b border-black/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            How can we help you? 🙏
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#B0AFA5]" />
            <input type="text" placeholder="Search for answers..." className="w-full h-14 pl-12 pr-5 rounded-2xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-[#1C1B14] shadow-sm" />
          </motion.div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-semibold text-[#1C1B14] mb-6 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Popular Topics</h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {popularTopics.map((topic) => (
              <Link key={topic.label} href={topic.href} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#FAFAF8] hover:bg-[#FFF8F0] hover:text-[#FF7A00] transition-all text-[#555449] text-center group">
                <span className="text-3xl">{topic.icon}</span>
                <span className="text-xs font-medium">{topic.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl border border-black/5 p-8">
              <h3 className="font-semibold text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Send us a Message</h3>
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <h4 className="font-semibold text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Message Sent!</h4>
                  <p className="text-[#8C8B80] text-sm">We'll get back to you within 24 hours</p>
                </motion.div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                  {[
                    { field: "name", label: "Your Name", placeholder: "Priya Sharma", type: "text" },
                    { field: "email", label: "Email Address", placeholder: "priya@example.com", type: "email" },
                  ].map(({ field, label, placeholder, type }) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">{label}</label>
                      <input type={type} placeholder={placeholder} value={formData[field as keyof typeof formData]} onChange={(e) => setFormData(p => ({ ...p, [field]: e.target.value }))} className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Topic</label>
                    <select className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm bg-white" value={formData.topic} onChange={(e) => setFormData(p => ({ ...p, topic: e.target.value }))}>
                      <option value="">Select a topic</option>
                      {["Order Issue", "Return Request", "Payment Problem", "Account Issue", "Seller Support", "Other"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Order ID (Optional)</label>
                    <input type="text" placeholder="ORD-2024-001234" className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Message</label>
                    <textarea rows={4} placeholder="Describe your issue..." value={formData.message} onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))} className="w-full px-4 py-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm resize-none" />
                  </div>
                  <motion.button type="submit" className="w-full h-12 rounded-xl text-white font-semibold" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }} whileTap={{ scale: 0.98 }}>
                    Send Message
                  </motion.button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <div className="bg-white rounded-2xl border border-black/5 p-8 mb-6">
                <h3 className="font-semibold text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Get in Touch</h3>
                <div className="space-y-5">
                  {[
                    { icon: Mail, title: "Email Support", value: "support@bharatbazaar.com", sub: "Reply within 24 hours" },
                    { icon: MessageCircle, title: "Live Chat", value: "Chat with us", sub: "Available 9AM - 9PM IST" },
                    { icon: Phone, title: "Phone", value: "1800-XXX-XXXX", sub: "Toll free, 9AM - 9PM" },
                    { icon: MapPin, title: "Office", value: "Bangalore, Karnataka", sub: "India 🇮🇳" },
                  ].map(({ icon: Icon, title, value, sub }) => (
                    <div key={title} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FFF8F0" }}>
                        <Icon size={18} style={{ color: "#FF7A00" }} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#1C1B14]">{title}</div>
                        <div className="text-sm text-[#555449]">{value}</div>
                        <div className="text-xs text-[#B0AFA5]">{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1A9E4E] rounded-2xl p-6 text-white">
                <div className="text-2xl mb-3">💬</div>
                <h4 className="font-semibold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>WhatsApp Support</h4>
                <p className="text-white/70 text-sm mb-4">For quick help, reach us on WhatsApp</p>
                <button className="w-full h-10 bg-white rounded-xl text-sm font-semibold hover:scale-105 transition-all" style={{ color: "#1A9E4E" }}>
                  Open WhatsApp Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// Not Found (404) Page
// ============================================================
export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 flex items-center justify-center pb-16 lg:pb-0">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Visual */}
          <div className="relative mb-8 inline-block">
            <div
              className="text-[160px] font-black leading-none select-none"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "linear-gradient(135deg, #FF7A00, #FF4500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: 0.2 }}
            >
              404
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center text-8xl"
            >
              🧺
            </motion.div>
          </div>

          <h2 className="text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Oops! This page went on a vacation 🌴
          </h2>
          <p className="text-[#8C8B80] mb-10 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Home, label: "Go Home", href: "/", primary: true },
              { icon: Search, label: "Search", href: "/search" },
              { icon: Package, label: "My Orders", href: "/orders" },
              { icon: MessageCircle, label: "Support", href: "/contact" },
            ].map(({ icon: Icon, label, href, primary }) => (
              <Link key={label}
                href={href}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl font-semibold text-sm transition-all hover:-translate-y-1 ${primary ? "text-white" : "bg-white border border-black/5 text-[#555449] hover:border-[#FF7A00]"}`}
                style={primary ? { background: "linear-gradient(135deg, #FF7A00, #FF4500)" } : {}}
              >
                <Icon size={24} />
                {label}
              </Link>
            ))}
          </div>

          <div className="max-w-sm mx-auto">
            <p className="text-sm text-[#8C8B80] mb-3">Or try searching:</p>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0AFA5]" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full h-12 pl-10 pr-4 rounded-2xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================
// Wishlist Page
// ============================================================
export function WishlistPage() {
  const [wishlist, setWishlist] = useState([
    { id: "1", name: "Handwoven Bandhani Saree", price: 1299, mrp: 1999, discount: 35, img: "https://images.unsplash.com/photo-1569909115134-a0426936c879?w=400&auto=format&fit=crop", seller: "Meena Handicrafts", inStock: true },
    { id: "2", name: "Blue Pottery Vase", price: 849, mrp: 1200, discount: 29, img: "https://images.unsplash.com/photo-1629218091978-f70a20a43aab?w=400&auto=format&fit=crop", seller: "Rajput Pottery Works", inStock: true },
    { id: "3", name: "Kashmiri Saffron 2g", price: 299, mrp: 450, discount: 34, img: "https://images.unsplash.com/photo-1663325265966-0d17de3e85c5?w=400&auto=format&fit=crop", seller: "Kashmir Harvest", inStock: false },
    { id: "4", name: "Silver Filigree Earrings", price: 1799, mrp: 2400, discount: 25, img: "https://images.unsplash.com/photo-1620619767323-b95a89183081?w=400&auto=format&fit=crop", seller: "Odissi Craft House", inStock: true },
  ]);
  const [cartToast, setCartToast] = useState<string | null>(null);
  const [allAddedToCart, setAllAddedToCart] = useState(false);

  const removeItem = (id: string) => setWishlist(prev => prev.filter(item => item.id !== id));

  const addToCart = (name: string) => {
    setCartToast(name);
    setTimeout(() => setCartToast(null), 2500);
  };

  const moveAllToCart = () => {
    setAllAddedToCart(true);
    setTimeout(() => setAllAddedToCart(false), 2500);
  };

  if (wishlist.length === 0) {
    return (
      <CustomerAccountLayout title="Wishlist">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-8xl mb-6">❤️</div>
          <h2 className="text-[#1C1B14] mb-3 text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your wishlist is empty</h2>
          <p className="text-[#8C8B80] mb-8">Save products you love for later</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </CustomerAccountLayout>
    );
  }

  return (
    <CustomerAccountLayout title="My Wishlist">
      {cartToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A9E4E] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium flex items-center gap-2">
          🛒 <span className="truncate max-w-[200px]">{cartToast}</span> added to cart!
        </div>
      )}
      {allAddedToCart && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A9E4E] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium">
          🛒 All in-stock items moved to cart!
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#1C1B14] text-xl font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>My Wishlist ❤️</h1>
          <p className="text-sm text-[#8C8B80]">{wishlist.length} items saved</p>
        </div>
        <button onClick={moveAllToCart} className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
          {allAddedToCart ? "✓ All in Cart!" : "Move All to Cart"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {wishlist.map((item) => (
          <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl overflow-hidden border border-black/5 group hover:shadow-md transition-all">
            <div className="relative aspect-square">
              <Link href={`/products/${item.id}`}>
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
              {!item.inStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-[#1C1B14]">Out of Stock</span>
                </div>
              )}
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-all"
              >
                ✕
              </button>
              {item.discount > 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[11px] font-bold text-white" style={{ background: "#DC2626" }}>
                  {item.discount}% OFF
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="text-xs text-[#8C8B80] mb-1">{item.seller}</div>
              <Link href={`/products/${item.id}`}>
                <h4 className="text-sm font-semibold text-[#1C1B14] line-clamp-2 mb-2 hover:text-[#FF7A00] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.name}</h4>
              </Link>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-bold text-[#1C1B14]">₹{item.price.toLocaleString()}</span>
                <span className="text-xs text-[#B0AFA5] line-through">₹{item.mrp.toLocaleString()}</span>
              </div>
              {item.inStock ? (
                <button onClick={() => addToCart(item.name)} className="w-full h-9 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
                  Add to Cart
                </button>
              ) : (
                <button className="w-full h-9 rounded-xl text-sm font-semibold border border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00] transition-all">
                  Notify Me
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </CustomerAccountLayout>
  );
}

// ============================================================
// Notifications Page
// ============================================================
export function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: "1", type: "order", icon: "📦", title: "Your order has been shipped!", body: "ORD-2024-001234 is now in transit. Expected delivery: Dec 1", time: "2 hours ago", unread: true },
    { id: "2", type: "payment", icon: "💳", title: "Payment Confirmed", body: "₹1,299 payment received for your order", time: "5 hours ago", unread: true },
    { id: "3", type: "offer", icon: "🎟️", title: "Flash Sale starts in 1 hour!", body: "Up to 70% off on handloom textiles. Don't miss out!", time: "1 day ago", unread: false },
    { id: "4", type: "review", icon: "⭐", title: "Rate your purchase", body: "How was the Bandhani Saree? Your review helps others", time: "2 days ago", unread: false },
    { id: "5", type: "system", icon: "🔔", title: "New sellers in your wishlist", body: "Meena Handicrafts has added 5 new products", time: "3 days ago", unread: false },
  ]);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));

  const typeColors: Record<string, string> = {
    order: "#FF7A00",
    payment: "#1A9E4E",
    shipping: "#2563EB",
    return: "#D97706",
    review: "#7C3AED",
    offer: "#E91E8C",
    system: "#8C8B80",
  };

  return (
    <CustomerAccountLayout title="Notifications">
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[#1C1B14] text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notifications 🔔</h1>
          <button onClick={markAllRead} className="text-sm font-medium hover:opacity-80" style={{ color: "#FF7A00" }}>Mark All Read</button>
        </div>

        <div className="space-y-2">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              layout
              onClick={() => markRead(notif.id)}
              className={`flex gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-sm ${notif.unread ? "bg-[#FFF8F0] border border-[#FFD4A8]" : "bg-white border border-black/5"}`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ background: `${typeColors[notif.type]}15` }}
              >
                {notif.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#1C1B14] mb-0.5">{notif.title}</div>
                    <div className="text-sm text-[#8C8B80] line-clamp-2">{notif.body}</div>
                  </div>
                  {notif.unread && <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: "#FF7A00" }} />}
                </div>
                <div className="text-xs text-[#B0AFA5] mt-1.5">{notif.time}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CustomerAccountLayout>
  );
}

// ─── Payment Failed ───────────────────────────────────────
export function PaymentFailedPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-16 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
          <XCircle size={40} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Payment Failed</h1>
        <p className="text-[#8C8B80] mb-2">Your payment could not be processed. No amount has been deducted.</p>
        <p className="text-sm text-[#B0AFA5] mb-8">If your bank shows a deduction, it will be automatically reversed within 5–7 business days.</p>
        <div className="flex flex-col gap-3">
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push("/checkout")}
            className="flex items-center justify-center gap-2 h-12 rounded-xl text-white font-semibold text-sm"
            style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
            <RefreshCw size={16} /> Retry Payment
          </motion.button>
          <Link href="/cart" className="flex items-center justify-center h-12 rounded-xl border-2 border-[#D4D3CB] text-sm font-semibold text-[#555449]">
            Back to Cart
          </Link>
          <Link href="/support/new" className="text-sm text-[#8C8B80] hover:text-[#FF7A00] transition-colors">Contact Support</Link>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Payment Timeout ──────────────────────────────────────
export function PaymentTimeoutPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-16 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
          <Clock size={40} className="text-amber-500" />
        </div>
        <h1 className="text-2xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Payment Timed Out</h1>
        <p className="text-[#8C8B80] mb-2">Your payment session expired. Your cart has been saved.</p>
        <p className="text-sm text-[#B0AFA5] mb-8">If any amount was deducted, it will be auto-refunded within 5–7 business days.</p>
        <div className="flex flex-col gap-3">
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push("/checkout")}
            className="flex items-center justify-center gap-2 h-12 rounded-xl text-white font-semibold text-sm"
            style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
            <RefreshCw size={16} /> Try Again
          </motion.button>
          <Link href="/orders" className="flex items-center justify-center h-12 rounded-xl border-2 border-[#D4D3CB] text-sm font-semibold text-[#555449]">
            Check My Orders
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ─── 403 Forbidden ───────────────────────────────────────
export function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-16 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center">
        <div className="text-7xl font-black text-[#F5F4F0] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>403</div>
        <h1 className="text-2xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Access Denied</h1>
        <p className="text-[#8C8B80] mb-8">You don't have permission to view this page. Please login or contact support if you think this is an error.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="px-6 py-3 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>Login</Link>
          <Link href="/" className="px-6 py-3 rounded-xl border-2 border-[#D4D3CB] text-sm font-semibold text-[#555449]">Go Home</Link>
        </div>
      </motion.div>
    </div>
  );
}

// ─── 500 Server Error ─────────────────────────────────────
export function ServerErrorPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-16 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center">
        <div className="text-7xl font-black text-[#F5F4F0] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>500</div>
        <h1 className="text-2xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Server Error</h1>
        <p className="text-[#8C8B80] mb-8">Something went wrong on our end. Our team has been notified and is working on a fix. Please try again in a few minutes.</p>
        <div className="flex gap-3 justify-center">
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
            <RefreshCw size={15} /> Retry
          </motion.button>
          <Link href="/" className="px-6 py-3 rounded-xl border-2 border-[#D4D3CB] text-sm font-semibold text-[#555449]">Go Home</Link>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Maintenance ──────────────────────────────────────────
export function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#1C1B14] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center">
        <div className="text-5xl mb-5">🔧</div>
        <h1 className="text-3xl font-black text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>We'll be back soon!</h1>
        <p className="text-white/60 mb-2">Bharat Bazaar is undergoing scheduled maintenance to bring you a better experience.</p>
        <p className="text-white/40 text-sm mb-8">Expected downtime: 2–4 hours · Started: 2:00 AM IST</p>
        <div className="bg-white/5 rounded-2xl p-5 text-left">
          <div className="text-xs font-semibold text-white/60 mb-3 uppercase tracking-wider">While you wait</div>
          <div className="space-y-2 text-sm text-white/70">
            <div>📦 Your existing orders are safe and will be processed normally</div>
            <div>💰 No payments are affected during maintenance</div>
            <div>📧 Follow us on social media for live updates</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Session Expired ──────────────────────────────────────
export function SessionExpiredPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-16 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={36} className="text-amber-500" />
        </div>
        <h1 className="text-2xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Session Expired</h1>
        <p className="text-[#8C8B80] mb-8">Your session has timed out for security. Please log in again to continue.</p>
        <Link href="/login" className="inline-flex items-center justify-center w-full h-12 rounded-xl text-white font-semibold text-sm"
          style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
          Log In Again
        </Link>
      </motion.div>
    </div>
  );
}

// ─── Offline Page ─────────────────────────────────────────
export function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-[#F5F4F0] flex items-center justify-center mx-auto mb-5">
          <Wifi size={36} className="text-[#B0AFA5]" />
        </div>
        <h1 className="text-2xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No Internet Connection</h1>
        <p className="text-[#8C8B80] mb-8">Please check your connection and try again.</p>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 w-full h-12 rounded-xl text-white font-semibold text-sm"
          style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
          <RefreshCw size={16} /> Try Again
        </motion.button>
      </motion.div>
    </div>
  );
}
