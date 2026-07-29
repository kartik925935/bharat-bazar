'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, ShieldCheck, Truck, RefreshCw,
  Store, Heart, CheckCircle, Star, MapPin, ChevronDown,
} from 'lucide-react';
import { ProductCard } from '@/components/storefront/product-card';
import { mockProducts } from '@/lib/mock/products';
import { useBrowsingStore } from '@/lib/store/browsing-store';
import { toast } from 'sonner';

// ─── Data ────────────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: 1,
    badge: 'Handwoven Heritage',
    title: 'Where Ancient Craft',
    title2: 'Meets Modern World',
    desc: 'Handcrafted by 10,000+ artisans across 28 states of India.',
    cta1: 'Explore Paintings',
    cta1Link: '/products?category=paintings-art',
    cta2: 'Meet Artisans',
    cta2Link: '/sellers',
    img: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=1600&auto=format&fit=crop&q=80',
    color: '#FF7A00',
  },
  {
    id: 2,
    badge: 'Crafted from Earth',
    title: 'Timeless Pottery',
    title2: 'From Village Kilns',
    desc: 'Stoneware and blue pottery designed by local potters using natural clay.',
    cta1: 'Browse Pottery',
    cta1Link: '/products?category=pottery-ceramics',
    cta2: 'How It Is Made',
    cta2Link: '/about',
    img: 'https://images.unsplash.com/photo-1536266305399-b367feb671f9?w=1600&auto=format&fit=crop&q=80',
    color: '#E63900',
  },
  {
    id: 3,
    badge: "Wear India's Heritage",
    title: 'Pure Silk Weaves',
    title2: 'Spun by Tradition',
    desc: 'Pure cotton and silk fabrics hand-spun on traditional wooden looms.',
    cta1: 'View Textiles',
    cta1Link: '/products?category=handloom-textiles',
    cta2: 'Festival Specials',
    cta2Link: '/flash-sale',
    img: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=1600&auto=format&fit=crop&q=80',
    color: '#C42B00',
  },
];

const STATS = [
  { value: 10000, suffix: '+', label: 'Artisans Registered' },
  { value: 50000, suffix: '+', label: 'Handcrafted Products' },
  { value: 200000, suffix: '+', label: 'Happy Customers' },
  { value: 28, suffix: '', label: 'States Covered' },
];

const CATEGORIES = [
  {
    name: 'Handloom & Fabrics',
    desc: 'Sarees, Shawls & Textiles',
    img: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=800&auto=format&fit=crop&q=80',
    link: '/products?category=handloom-textiles',
    count: '2,400+ Products',
    span: 'col-span-1 row-span-2',
  },
  {
    name: 'Pottery & Ceramics',
    desc: 'Blue Pottery, Terracotta',
    img: 'https://images.unsplash.com/photo-1536266305399-b367feb671f9?w=800&auto=format&fit=crop&q=80',
    link: '/products?category=pottery-ceramics',
    count: '1,200+ Products',
    span: 'col-span-1 row-span-1',
  },
  {
    name: 'Paintings & Art',
    desc: 'Madhubani, Pattachitra',
    img: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=800&auto=format&fit=crop&q=80',
    link: '/products?category=paintings-art',
    count: '800+ Products',
    span: 'col-span-1 row-span-1',
  },
  {
    name: 'Jewelry & Silver',
    desc: 'Filigree, Tribal, Kundan',
    img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
    link: '/products?category=jewelry',
    count: '3,100+ Products',
    span: 'col-span-2 row-span-1',
  },
];

const ARTISANS = [
  {
    name: 'Meena Devi',
    craft: 'Madhubani Painting',
    loc: 'Madhubani, Bihar',
    rating: 4.9,
    count: 42,
    bio: 'Meena has been painting the Tree of Life for over 25 years. Every piece uses natural organic dye extracted from local herbs.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop',
    earning: '₹45,000/month',
  },
  {
    name: 'Ram Gopal',
    craft: 'Blue Pottery',
    loc: 'Jaipur, Rajasthan',
    rating: 4.8,
    count: 31,
    bio: 'Ram uses traditional wood-fired kilns and quartz clay. His designs are hand-painted using cobalt oxides to deliver deep blue hues.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop',
    earning: '₹62,000/month',
  },
  {
    name: 'Bhaskar Patra',
    craft: 'Pattachitra Scrolls',
    loc: 'Raghurajpur, Odisha',
    rating: 5.0,
    count: 18,
    bio: 'Bhaskar paints stories of ancient epics on organic cotton canvases prepared with chalk and tamarind seeds.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop',
    earning: '₹38,000/month',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    city: 'Bangalore',
    rating: 5,
    text: 'The Madhubani painting I ordered is absolutely stunning. You can feel the love and heritage in every brush stroke. Delivery was fast and packaging was beautiful.',
    product: 'Madhubani Tree of Life',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop',
  },
  {
    name: 'Arjun Mehta',
    city: 'Mumbai',
    rating: 5,
    text: 'Bought the Bidriware vase as a gift. The silver inlay work is extraordinary — my friends were amazed. Worth every rupee. Will shop again!',
    product: 'Bidriware Vase',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop',
  },
  {
    name: 'Sunita Reddy',
    city: 'Hyderabad',
    rating: 5,
    text: 'Finally found authentic Kashmiri saffron at a reasonable price. The quality is exceptional — lab certified and the aroma is incredible.',
    product: 'Kashmiri Saffron 2g',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop',
  },
];

const CRAFT_REGIONS = [
  { craft: 'Pashmina Shawl', state: 'Kashmir' },
  { craft: 'Blue Pottery', state: 'Rajasthan' },
  { craft: 'Kantha Stitch', state: 'Bengal' },
  { craft: 'Madhubani Art', state: 'Bihar' },
  { craft: 'Pattachitra', state: 'Odisha' },
  { craft: 'Bidriware', state: 'Karnataka' },
  { craft: 'Kondapalli Toys', state: 'Andhra' },
  { craft: 'Warli Painting', state: 'Maharashtra' },
];

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  const formatted = count >= 1000
    ? count >= 100000
      ? `${(count / 100000).toFixed(0)} Lakh`
      : `${(count / 1000).toFixed(0)},000`
    : count.toString();

  return (
    <div ref={ref} className="text-4xl font-black text-white">
      {formatted}{suffix}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [slide, setSlide]             = useState(0);
  const [activeTab, setActiveTab]     = useState('Trending');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [scrolled, setScrolled]       = useState(false);

  const { recentlyViewed } = useBrowsingStore();

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  // Auto-advance testimonial
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx((s) => (s + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Show scroll indicator
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const filteredProducts = mockProducts.filter((p) => {
    if (activeTab === 'New Arrivals')  return p.isNew;
    if (activeTab === 'Best Sellers')  return p.rating >= 4.7;
    if (activeTab === 'Under ₹500')   return p.price < 500;
    if (activeTab === 'Staff Picks')   return p.freeDelivery && p.rating >= 4.5;
    return p.discount > 10; // Trending
  }).slice(0, 8);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      toast.success('Thank you for subscribing! 🙏 Welcome to our craft family.');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-0">

      {/* ─── SECTION 1: HERO ─────────────────────────────────────────────── */}
      <section className="relative h-[580px] md:h-[680px] w-full overflow-hidden bg-[#1A0A00]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0"
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms]"
              style={{ backgroundImage: `url(${HERO_SLIDES[slide].img})` }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Decorative mandala */}
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.04] pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_30s_linear_infinite]" fill="white">
                <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="0.5" fill="none" />
                <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="0.5" fill="none" />
                <circle cx="100" cy="100" r="50" stroke="white" strokeWidth="0.5" fill="none" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i / 12) * 2 * Math.PI;
                  const x1 = 100 + 50 * Math.cos(angle);
                  const y1 = 100 + 50 * Math.sin(angle);
                  const x2 = 100 + 90 * Math.cos(angle);
                  const y2 = 100 + 90 * Math.sin(angle);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.5" />;
                })}
              </svg>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-5xl space-y-6">
              {/* Badge */}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/90 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit border border-white/20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-pulse" />
                {HERO_SLIDES[slide].badge}
              </motion.span>

              {/* Heading */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {HERO_SLIDES[slide].title}
                </motion.h1>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    background: 'linear-gradient(135deg, #FF7A00, #FFB347)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {HERO_SLIDES[slide].title2}
                </motion.h1>
              </div>

              {/* Desc */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base md:text-lg text-white/80 font-medium max-w-lg leading-relaxed"
              >
                {HERO_SLIDES[slide].desc}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-3"
              >
                <Link
                  href={HERO_SLIDES[slide].cta1Link}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white shadow-[0_8px_24px_rgba(255,122,0,0.35)] hover:shadow-[0_12px_36px_rgba(255,122,0,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
                >
                  {HERO_SLIDES[slide].cta1} <ArrowRight size={16} />
                </Link>
                <Link
                  href={HERO_SLIDES[slide].cta2Link}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-white/10 backdrop-blur-md border border-white/25 hover:bg-white/20 transition-all"
                >
                  {HERO_SLIDES[slide].cta2}
                </Link>
              </motion.div>

              {/* Trust strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-4 text-[11px] text-white/60 font-medium"
              >
                <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-[#22C55E]" /> Secure Payment</span>
                <span className="flex items-center gap-1.5"><Truck size={12} className="text-[#22C55E]" /> Free Delivery ₹999+</span>
                <span className="flex items-center gap-1.5"><RefreshCw size={12} className="text-[#22C55E]" /> Easy Returns</span>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`rounded-full transition-all cursor-pointer ${i === slide ? 'w-8 h-2 bg-[#FF7A00]' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={() => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/25 hover:bg-black/45 backdrop-blur-sm flex items-center justify-center text-white z-20 transition-all cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/25 hover:bg-black/45 backdrop-blur-sm flex items-center justify-center text-white z-20 transition-all cursor-pointer"
        >
          <ArrowRight size={18} />
        </button>

        {/* Scroll indicator */}
        <AnimatePresence>
          {!scrolled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/50"
            >
              <span className="text-[10px] tracking-widest uppercase">Scroll</span>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ChevronDown size={16} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ─── SECTION 2: STATS STRIP ───────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #FF7A00, #E63900)' }} className="py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-1.5"
            >
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 3: CATEGORY MOSAIC ──────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#FF7A00] bg-[#FFF3E8] px-3 py-1 rounded-full mb-3">
            Shop by Craft
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#1A0A00] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Every Tradition, Every State
          </h2>
          <p className="text-sm text-[#8C7B6E] max-w-md mx-auto">
            From Pashmina of Kashmir to Kondapalli of Andhra Pradesh
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[220px]">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${i === 0 ? 'lg:row-span-2' : ''}`}
            >
              <Link href={cat.link} className="absolute inset-0">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${cat.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">{cat.count}</span>
                  <h3 className="text-lg font-black text-white leading-tight"
                      style={{ fontFamily: "'Playfair Display', serif" }}>
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/70 mt-0.5 mb-3">{cat.desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF7A00] group-hover:gap-2 transition-all">
                    Explore <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 4: PRODUCT TABS ──────────────────────────────────────── */}
      <section className="bg-[#F5F4F0] py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#FF7A00] bg-[#FFF3E8] px-3 py-1 rounded-full mb-2">
                Handpicked for You
              </span>
              <h2 className="text-3xl font-black text-[#1A0A00]"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                Artisan Bestsellers
              </h2>
            </div>
            <Link href="/products" className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1">
              View All Crafts <ArrowRight size={13} />
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 overflow-x-auto pb-1">
            {['Trending', 'New Arrivals', 'Best Sellers', 'Under ₹500', 'Staff Picks'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white shadow-[0_4px_12px_rgba(255,122,0,0.3)]'
                    : 'bg-white text-[#8C7B6E] hover:text-[#FF7A00] hover:bg-[#FFF3E8] border border-[#E8E4DE]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Products grid */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {filteredProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 5: ARTISAN SPOTLIGHT ────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#FF7A00] bg-[#FFF3E8] px-3 py-1 rounded-full mb-3">
            Meet the Makers
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#1A0A00]"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Artisan Stories
          </h2>
          <p className="text-sm text-[#8C7B6E] max-w-md mx-auto mt-2">
            Certified craftsmen keeping traditional art forms alive for generations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTISANS.map((artisan, idx) => (
            <motion.div
              key={artisan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-[#E8E4DE] p-6 hover:shadow-[0_8px_32px_rgba(255,122,0,0.1)] hover:border-[#FF7A00]/20 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#FF7A00]/20 shrink-0">
                  <img src={artisan.avatar} alt={artisan.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A0A00]">{artisan.name}</h3>
                  <p className="text-xs font-bold text-[#FF7A00]">{artisan.craft}</p>
                  <div className="flex items-center gap-0.5 text-[10px] text-[#8C7B6E] mt-0.5">
                    <MapPin size={9} /> {artisan.loc}
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#4A3728] leading-relaxed italic mb-4">
                "{artisan.bio}"
              </p>
              <div className="flex items-center justify-between border-t border-[#E8E4DE]/60 pt-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    <Star size={11} className="fill-[#F59E0B] stroke-[#F59E0B]" />
                    <span className="text-xs font-bold text-[#1A0A00]">{artisan.rating}</span>
                  </div>
                  <span className="text-[10px] text-[#8C7B6E]">({artisan.count} designs)</span>
                  <span className="text-[10px] font-bold text-[#16A34A] bg-[#F0FDF4] px-1.5 py-0.5 rounded-full ml-1">
                    {artisan.earning}
                  </span>
                </div>
                <Link
                  href="/sellers"
                  className="text-[11px] font-bold text-[#FF7A00] bg-[#FFF3E8] hover:bg-[#FF7A00] hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  Visit Shop
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 6: CRAFT REGIONS STRIP ──────────────────────────────── */}
      <section className="bg-[#1A0A00] py-10 overflow-hidden">
        <div className="flex gap-6 animate-[marquee_20s_linear_infinite]" style={{ width: 'max-content' }}>
          {[...CRAFT_REGIONS, ...CRAFT_REGIONS].map((item, i) => (
            <Link
              key={i}
              href={`/products?region=${item.state.toLowerCase()}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-[#FF7A00]/60 transition-colors shrink-0"
            >
              <span className="text-xs font-bold text-white">{item.craft}</span>
              <span className="text-[10px] text-white/50">— {item.state}</span>
            </Link>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ─── SECTION 7: HOW IT WORKS ─────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-[#1A0A00]"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            How Bharat Bazaar Works
          </h2>
          <p className="text-sm text-[#8C7B6E] mt-2">
            From artisan hands directly to your home
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-[#FF7A00]/30 via-[#FF7A00] to-[#FF7A00]/30" />

          {[
            { icon: '🔍', step: '01', title: 'Discover', desc: 'Browse 50,000+ authentic handcrafted products across categories and Indian states.' },
            { icon: '🤝', step: '02', title: 'Support', desc: 'Your purchase goes directly to the artisan family — no middlemen, full transparency.' },
            { icon: '📦', step: '03', title: 'Receive', desc: 'Fast delivery with love-packed eco-friendly packaging. Easy returns within 7 days.' },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl shadow-[0_8px_24px_rgba(255,122,0,0.2)]"
                   style={{ background: 'linear-gradient(135deg, #FFF3E8, #FFE4CC)' }}>
                {s.icon}
              </div>
              <span className="text-xs font-black text-[#FF7A00] tracking-wider">{s.step}</span>
              <h3 className="text-lg font-black text-[#1A0A00] mt-1 mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                {s.title}
              </h3>
              <p className="text-sm text-[#8C7B6E] leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 8: TESTIMONIALS ─────────────────────────────────────── */}
      <section className="bg-[#F5F4F0] py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#FF7A00] bg-[#FFF3E8] px-3 py-1 rounded-full mb-3">
              Loved by Customers
            </span>
            <h2 className="text-3xl font-black text-[#1A0A00]"
                style={{ fontFamily: "'Playfair Display', serif" }}>
              What Craft Lovers Say
            </h2>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={14} className="fill-[#F59E0B] stroke-[#F59E0B]" />
              ))}
              <span className="text-sm font-bold text-[#1A0A00] ml-1">4.9</span>
              <span className="text-sm text-[#8C7B6E]">from 50,000+ reviews</span>
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl p-8 border border-[#E8E4DE] shadow-sm max-w-2xl mx-auto"
              >
                {/* Quote mark */}
                <div className="text-6xl leading-none text-[#FF7A00]/20 font-serif mb-2">"</div>
                <div className="flex items-center gap-0.5 mb-3">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={14} className="fill-[#F59E0B] stroke-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-[#4A3728] text-base leading-relaxed italic mb-6">
                  {TESTIMONIALS[testimonialIdx].text}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={TESTIMONIALS[testimonialIdx].avatar}
                    alt={TESTIMONIALS[testimonialIdx].name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FF7A00]/20"
                  />
                  <div>
                    <p className="font-bold text-[#1A0A00]">{TESTIMONIALS[testimonialIdx].name}</p>
                    <p className="text-xs text-[#8C7B6E]">{TESTIMONIALS[testimonialIdx].city} · Purchased: {TESTIMONIALS[testimonialIdx].product}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`rounded-full transition-all cursor-pointer ${i === testimonialIdx ? 'w-6 h-2 bg-[#FF7A00]' : 'w-2 h-2 bg-[#E8E4DE] hover:bg-[#FF7A00]/50'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 9: SELLER CTA ────────────────────────────────────────── */}
      <section className="bg-[#1A0A00] py-16 relative overflow-hidden">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJ3aGl0ZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-40" />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#FF7A00] bg-[#FF7A00]/10 px-3 py-1 rounded-full">
                For Artisans
              </span>
              <h2 className="text-4xl font-black text-white leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                Sell to 2 Lakh+<br />Customers Across India
              </h2>
              <ul className="space-y-3">
                {[
                  'Zero commission for your first month',
                  'Simple KYC — approve in 24 hours',
                  'Weekly payments directly to your bank',
                  'Free seller training & craft photography',
                  'Dedicated relationship manager',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle size={16} className="text-[#FF7A00] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/seller/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white shadow-[0_8px_24px_rgba(255,122,0,0.35)] hover:shadow-[0_12px_36px_rgba(255,122,0,0.5)] hover:-translate-y-0.5 transition-all"
                style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
              >
                Start Selling Today <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {ARTISANS.map((a, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                  <img src={a.avatar} alt={a.name} className="w-10 h-10 rounded-full object-cover mb-3 border border-[#FF7A00]/30" />
                  <p className="text-xs font-bold text-white">{a.name}</p>
                  <p className="text-[10px] text-white/60 mb-2">{a.craft}</p>
                  <span className="text-xs font-black text-[#FF7A00]">{a.earning}</span>
                </div>
              ))}
              <div className="bg-gradient-to-br from-[#FF7A00]/20 to-[#FF4500]/10 border border-[#FF7A00]/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <p className="text-2xl font-black text-[#FF7A00]">10,000+</p>
                <p className="text-[10px] text-white/60 mt-1">Artisans already earning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 10: WHY BHARAT BAZAAR ───────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#1A0A00]"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            The Bharat Bazaar Guarantee
          </h2>
          <p className="text-sm text-[#8C7B6E] mt-2">Building fair trade bridges for Indian craft sectors.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: CheckCircle, title: '100% Authentic', desc: 'Directly sourced from state-certified artisans and cooperatives.', color: '#FF7A00' },
            { icon: Store,       title: 'Zero Middlemen', desc: 'The maker receives 100% of your payment — no hidden cuts.', color: '#FF7A00' },
            { icon: Truck,       title: 'Free Shipping ₹999+', desc: 'Zero delivery fees on orders above ₹999 across India.', color: '#FF7A00' },
            { icon: RefreshCw,   title: 'Easy Returns', desc: '7-day hassle-free returns on all standard items.', color: '#FF7A00' },
            { icon: ShieldCheck, title: 'Secure Payment', desc: 'UPI, Card, Net Banking & COD — 256-bit SSL secured.', color: '#FF7A00' },
            { icon: Heart,       title: 'Craft Community', desc: 'Every purchase directly funds rural artisan families.', color: '#FF7A00' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
                className="bg-white p-6 rounded-2xl border border-[#E8E4DE] hover:shadow-[0_8px_32px_rgba(255,122,0,0.08)] hover:border-[#FF7A00]/20 transition-all flex gap-4 items-start group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFF3E8] flex items-center justify-center shrink-0 group-hover:bg-[#FF7A00] transition-colors">
                  <Icon size={18} className="text-[#FF7A00] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1A0A00] mb-1">{item.title}</h3>
                  <p className="text-xs text-[#8C7B6E] leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── SECTION 11: RECENTLY VIEWED ─────────────────────────────────── */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2 className="text-2xl font-black text-[#1A0A00] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Continue Shopping
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {recentlyViewed.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ─── SECTION 12: NEWSLETTER ──────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16" style={{ background: 'linear-gradient(135deg, #FF7A00, #E63900)' }}>
        {/* Mandala pattern */}
        <div className="absolute right-0 top-0 w-64 h-64 opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="white">
            <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="0.5" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * 2 * Math.PI;
              return <line key={i} x1={100} y1={100} x2={100 + 90 * Math.cos(a)} y2={100 + 90 * Math.sin(a)} stroke="white" strokeWidth="0.5" />;
            })}
          </svg>
        </div>

        <div className="max-w-2xl mx-auto px-6 text-center text-white relative">
          <h2 className="text-3xl md:text-4xl font-black mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Exclusive Artisan Stories & Early Sale Access
          </h2>
          <p className="text-white/75 text-sm mb-6">
            Join 50,000 craft enthusiasts — no spam, ever.
          </p>

          {/* Benefit pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['Art Stories', 'Early Sales', 'Exclusive Deals'].map((b) => (
              <span key={b} className="text-xs font-semibold bg-white/15 px-3 py-1.5 rounded-full border border-white/20">
                {b}
              </span>
            ))}
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 h-12 px-5 rounded-xl text-sm outline-none text-[#1A0A00] placeholder-[#8C7B6E] bg-white focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="h-12 px-6 rounded-xl text-sm font-bold bg-[#1A0A00] text-white hover:bg-black transition-colors whitespace-nowrap cursor-pointer"
            >
              Subscribe Now
            </button>
          </form>
          <p className="text-[10px] text-white/50 mt-3">Unsubscribe anytime. No spam, ever.</p>
        </div>
      </section>
    </div>
  );
}
