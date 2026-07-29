'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Store, Package, Truck, Star, MapPin, 
  CheckCircle, Shield, Heart, HelpCircle, Mail, MessageSquare 
} from 'lucide-react';
import { ProductCard } from '@/components/storefront/product-card';
import { mockProducts } from '@/lib/mock/products';
import { siteConfig } from '@/config/site';
import { toast } from 'sonner';

// Carousel data
const HERO_SLIDES = [
  {
    id: 1,
    title: 'Handwoven Stories',
    subtitle: 'Mithila & Madhubani Canvas Creations',
    desc: 'Each stroke represents ages of heritage passed down through generations of rural Indian families.',
    cta1: 'Explore Paintings',
    cta1Link: '/products?category=paintings-art',
    cta2: 'Meet Artisans',
    cta2Link: '/sellers',
    img: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=1600&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Crafted with Love',
    subtitle: 'Authentic Terracotta Clay Pottery',
    desc: 'Stoneware and blue pottery designed by local potters using natural clay deposits.',
    cta1: 'Browse Pottery',
    cta1Link: '/products?category=pottery-ceramics',
    cta2: 'How It Is Made',
    cta2Link: '/about',
    img: 'https://images.unsplash.com/photo-1536266305399-b367feb671f9?w=1600&auto=format&fit=crop',
  },
  {
    id: 3,
    title: "Wear India's Heritage",
    subtitle: 'Sambhalpuri Ikat & Handloom Weaves',
    desc: 'Pure cotton and silk fabrics hand-spun on traditional wooden looms in native villages.',
    cta1: 'View Textiles',
    cta1Link: '/products?category=handloom-textiles',
    cta2: 'Diwali Specials',
    cta2Link: '/flash-sale',
    img: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=1600&auto=format&fit=crop',
  },
];

const WHY_US_ITEMS = [
  { icon: CheckCircle, title: '100% Authentic', desc: 'Directly sourced from state-certified artisans and weavers.' },
  { icon: Store, title: 'Direct from Artisan', desc: 'No middlemen. The makers receive 100% of the price.' },
  { icon: Truck, title: 'Free Shipping ₹999+', desc: 'Zero delivery fees on orders above ₹999 across India.' },
  { icon: RefreshCwIcon, title: 'Easy Returns', desc: '7-day hassle-free return window on standard items.' },
  { icon: Shield, title: 'Secure Payment', desc: 'UPI, Card payments, and cash on delivery supported securely.' },
  { icon: Heart, title: 'Empowering Communities', desc: 'Every purchase fuels rural economy development directly.' }
];

function RefreshCwIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('Trending');
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  
  // Auto advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch recently viewed products from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const items = localStorage.getItem('bb-recently-viewed');
      if (items) {
        const parsed = JSON.parse(items);
        const resolved = mockProducts.filter(p => parsed.includes(p.id));
        setRecentProducts(resolved.slice(0, 4));
      }
    }
  }, []);

  const filteredProducts = mockProducts.filter(p => {
    if (activeTab === 'New Arrivals') return p.isNew;
    if (activeTab === 'Best Sellers') return p.rating >= 4.7;
    if (activeTab === 'Under ₹500') return p.price < 500;
    return p.discount > 10; // Trending
  }).slice(0, 8);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      localStorage.setItem('bb-newsletter-subscribed', newsletterEmail);
      toast.success('Thank you for subscribing! 🙏 Welcome to the family.');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* SECTION 1: Carousel Hero Section */}
      <div className="relative h-[550px] md:h-[650px] w-full overflow-hidden bg-stone-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-black/45 z-10" />
            <img 
              src={HERO_SLIDES[slide].img} 
              alt={HERO_SLIDES[slide].title} 
              className="w-full h-full object-cover select-none"
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-12 md:px-24 z-20 text-white max-w-4xl space-y-6">
              <motion.span 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#FF7A00] bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm w-fit"
              >
                {HERO_SLIDES[slide].subtitle}
              </motion.span>
              
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-7xl font-extrabold tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.15 }}
              >
                {HERO_SLIDES[slide].title}
              </motion.h1>
              
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm md:text-lg text-white/90 font-medium max-w-xl leading-relaxed"
              >
                {HERO_SLIDES[slide].desc}
              </motion.p>

              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4 flex-wrap"
              >
                <Link 
                  href={HERO_SLIDES[slide].cta1Link} 
                  className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#FF7A00] to-[#FF4500] hover:shadow-lg hover:shadow-orange-500/20 active:scale-98 transition-all"
                >
                  {HERO_SLIDES[slide].cta1}
                </Link>
                <Link 
                  href={HERO_SLIDES[slide].cta2Link} 
                  className="px-8 py-3.5 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/25 active:scale-98 transition-all"
                >
                  {HERO_SLIDES[slide].cta2}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                slide === idx ? 'bg-[#FF7A00] w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Side Controls */}
        <button
          onClick={() => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center text-white z-30 transition-all cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center text-white z-30 transition-all cursor-pointer"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      {/* SECTION 2: Animated Stats Strip */}
      <section className="bg-[#FFF8F0] border-y border-orange-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '10,000+', label: 'Artisans Registered' },
            { value: '50,000+', label: 'Handcrafted Products' },
            { value: '2,00,000+', label: 'Happy Customers' },
            { value: '28', label: 'States Covered' },
          ].map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-1"
            >
              <div className="text-3xl font-black text-[#FF7A00]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {stat.value}
              </div>
              <div className="text-xs font-bold text-[#8C8B80] uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Featured Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Explore Regional Categories
          </h2>
          <p className="text-sm text-[#8C8B80] max-w-md mx-auto">Discover local specialties handcrafted by Indian communities.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Handloom & Fabrics', desc: 'Handwoven cottons, silk sarees, raw textiles', img: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=600&auto=format&fit=crop', link: '/products?category=handloom-textiles' },
            { name: 'Pottery & Ceramics', desc: 'Natural clay items, stoneware bowls, vases', img: 'https://images.unsplash.com/photo-1536266305399-b367feb671f9?w=600&auto=format&fit=crop', link: '/products?category=pottery-ceramics' },
            { name: 'Home & Paintings', desc: 'Madhubani art, woodcarvings, wall hangers', img: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=600&auto=format&fit=crop', link: '/products?category=paintings-art' }
          ].map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative rounded-3xl overflow-hidden aspect-[4/3] group shadow-sm border border-[#E5E4DE] bg-stone-100 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-20 space-y-1">
                <h3 className="text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{cat.name}</h3>
                <p className="text-xs text-white/70">{cat.desc}</p>
                <Link 
                  href={cat.link}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FF7A00] pt-2"
                >
                  Explore Catalog <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Product Showcase Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Handpicked for You
            </h2>
            <p className="text-sm text-[#8C8B80]">Curated items directly from local hubs</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1">
            View All Crafts <ArrowRight size={14} />
          </Link>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex gap-2.5 mb-8 border-b border-[#E5E4DE] pb-px overflow-x-auto">
          {['Trending', 'New Arrivals', 'Best Sellers', 'Under ₹500'].map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3.5 px-2 text-xs font-bold whitespace-nowrap outline-none cursor-pointer relative transition-colors ${
                  isSelected ? 'text-[#FF7A00]' : 'text-[#8C8B80] hover:text-[#1A1A1A]'
                }`}
              >
                {tab}
                {isSelected && (
                  <motion.div 
                    layoutId="home-active-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF7A00]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Staggered Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* SECTION 5: Artisan Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Artisan Stories
          </h2>
          <p className="text-sm text-[#8C8B80] max-w-md mx-auto">Meet the certified craftsmen keeping traditional art forms alive.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Meena Devi', craft: 'Madhubani Painting', loc: 'Madhubani, Bihar', rating: 4.9, count: 42, bio: 'Meena has been painting the Tree of Life for over 25 years. Every piece is colored using natural organic dye extracted from local herbs and flower petals.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop' },
            { name: 'Ram Gopal', craft: 'Blue Pottery', loc: 'Jaipur, Rajasthan', rating: 4.8, count: 31, bio: 'Ram uses traditional wood-fired kilns and quartz clay grids. His designs are hand-painted using cobalt oxides to deliver deep blue hues.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop' },
            { name: 'Bhaskar Patra', craft: 'Pattachitra Scrolls', loc: 'Raghurajpur, Odisha', rating: 5.0, count: 18, bio: 'Bhaskar paints stories of ancient epics on organic cotton canvases prepared with chalk and tamarind seeds.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop' }
          ].map((artisan, idx) => (
            <motion.div
              key={artisan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-[#E5E4DE] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-orange-100">
                    <img src={artisan.avatar} alt={artisan.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1A1A1A]">{artisan.name}</h3>
                    <p className="text-[10px] font-bold text-[#FF7A00] uppercase tracking-wider">{artisan.craft}</p>
                    <div className="flex items-center gap-0.5 text-[10px] text-[#8C8B80] mt-0.5">
                      <MapPin size={10} /> {artisan.loc}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#555449] leading-relaxed italic">
                  "{artisan.bio}"
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[#E5E4DE]/50 mt-6 pt-4">
                <div className="flex items-center gap-1">
                  <Star size={12} className="fill-[#FFB800] stroke-[#FFB800]" />
                  <span className="text-xs font-bold text-[#1A1A1A]">{artisan.rating}</span>
                  <span className="text-[10px] text-[#8C8B80]">({artisan.count} designs)</span>
                </div>
                <Link 
                  href="/sellers"
                  className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold text-[#FF7A00] bg-[#FFF8F0] hover:bg-[#FF7A00] hover:text-white transition-colors"
                >
                  Visit Shop
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 6: Craft Origins Specialties */}
      <section className="bg-white border-y border-[#E5E4DE] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Explore the Craft Map of India
            </h2>
            <p className="text-sm text-[#555449] leading-relaxed">
              Every geographic region of India has a unique artistic heritage molded by local raw resources and tribal histories. Use our curated map directories to shop from their origins.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { state: 'Jaipur Blue Pottery', type: 'Rajasthan' },
                { state: 'Mithila Paintings', type: 'Bihar' },
                { state: 'Kashmiri Pashmina', type: 'J&K' },
                { state: 'Pattachitra Scrolls', type: 'Odisha' }
              ].map(item => (
                <div key={item.state} className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#E5E4DE]">
                  <span className="text-[9px] font-bold text-[#8C8B80] uppercase block">{item.type}</span>
                  <span className="text-xs font-bold text-[#1A1A1A]">{item.state}</span>
                </div>
              ))}
            </div>
            <Link 
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#FF7A00] to-[#FF4500] px-5 py-2.5 rounded-xl"
            >
              Browse Map Directory <ArrowRight size={14} />
            </Link>
          </div>
          <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-orange-50 border border-orange-100 flex items-center justify-center p-8">
            {/* Visual placeholder of India map directory */}
            <div className="text-center space-y-4">
              <span className="text-6xl block select-none">🗺️</span>
              <h3 className="font-bold text-sm text-orange-950">Interactive Map Console</h3>
              <p className="text-xs text-orange-850/80 max-w-xs leading-relaxed">
                Filter products by choosing geographical states from the side options. (Features available on full desktop resolution).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Why Bharat Bazaar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            The Bharat Bazaar Guarantee
          </h2>
          <p className="text-sm text-[#8C8B80]">Building fair trade bridges for Indian craft sectors.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_US_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title} 
                className="bg-white p-6 rounded-3xl border border-[#E5E4DE] shadow-sm flex gap-4 items-start hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFF8F0] flex items-center justify-center text-[#FF7A00] shrink-0">
                  <Icon size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-[#1A1A1A]">{item.title}</h3>
                  <p className="text-xs text-[#8C8B80] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 8: Recently Viewed Products */}
      {recentProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Recently Viewed
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 9: Newsletter Subscription */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="rounded-3xl p-8 md:p-16 text-center text-white space-y-6 shadow-xl border border-black/5"
          style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
        >
          <div className="max-w-xl mx-auto space-y-4">
            <span className="text-4xl block">✉️</span>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Get Exclusive Artisan Stories & Deals
            </h2>
            <p className="text-white/80 text-xs md:text-sm max-w-sm mx-auto leading-relaxed">
              Sign up for our newsletter to get weekly emails on regional weavers, launch notifications, and holiday coupons.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-center">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full h-12 px-4 rounded-xl text-xs outline-none text-[#1C1B14] placeholder-[#8C8B80] bg-white"
            />
            <button
              type="submit"
              className="w-full sm:w-auto h-12 px-6 rounded-xl text-xs font-bold bg-[#1C1B14] text-white hover:bg-black active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>
          <p className="text-[10px] text-white/60">Join 50,000+ craft enthusiasts across the nation.</p>
        </div>
      </section>
    </div>
  );
}
