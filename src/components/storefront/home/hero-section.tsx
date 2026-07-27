'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Shield, RotateCcw, Star, Truck, ChevronDown } from 'lucide-react';

const popularTags = ['Saree', 'Pottery', 'Handloom', 'Organic', 'Jewelry', 'Craft'];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#FFFAF5] via-[#FFF5E8] to-[#FFFAF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF7A00]/20 bg-[#FFF8F0] mb-6"
          >
            <span className="text-sm">🇮🇳</span>
            <span className="text-sm font-semibold text-[#FF7A00]">
              Supporting 50,000+ Indian Artisans
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 leading-tight text-[#1C1B14] text-4xl sm:text-5xl lg:text-6xl font-black"
          >
            Discover the Soul of{' '}
            <span className="bg-gradient-to-r from-[#FF7A00] to-[#E91E8C] bg-clip-text text-transparent">
              Indian Crafts
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg leading-relaxed text-[#8C8B80] mb-8"
          >
            Shop directly from NGOs, village artisans, and grassroots sellers across India.{' '}
            <strong className="text-[#555449]">Every purchase empowers a family.</strong>
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative mb-4"
          >
            <div className="flex items-center bg-white rounded-2xl shadow-lg border-2 border-transparent focus-within:border-[#FF7A00] transition-all overflow-hidden">
              <Search size={20} className="ml-5 text-[#B0AFA5] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sarees, handicrafts, pottery..."
                className="flex-1 h-16 px-4 outline-none text-[#1C1B14] bg-transparent placeholder:text-[#B0AFA5]"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="mr-2 h-11 px-6 rounded-xl text-white font-semibold flex items-center gap-2 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] hover:opacity-90 transition-all"
              >
                <Search size={16} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </motion.div>

          {/* Popular Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            <span className="text-sm text-[#8C8B80]">Popular:</span>
            {popularTags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${tag}`}
                className="px-3 py-1 rounded-full text-sm border border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00] hover:text-[#FF7A00] transition-all"
              >
                #{tag}
              </Link>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            {[
              { icon: Shield, label: 'Secure Payment' },
              { icon: RotateCcw, label: '7-day Returns' },
              { icon: Star, label: 'Verified Sellers' },
              { icon: Truck, label: 'Pan-India Delivery' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs font-medium text-[#555449]">
                <Icon size={14} className="text-[#FF7A00]" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right - Image Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 bg-white rounded-3xl overflow-hidden shadow-2xl max-w-sm mx-auto"
          >
            <div className="relative h-72 w-full">
              <Image
                src="https://images.unsplash.com/photo-1569909115134-a0426936c879?w=720&auto=format&fit=crop"
                alt="Handwoven Bandhani Saree"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FFF8F0] text-[#FF7A00]">
                  💎 Platinum Seller
                </span>
                <div className="flex items-center gap-1">
                  <Star size={12} className="fill-[#FFB800] stroke-[#FFB800]" />
                  <span className="text-xs font-bold">4.9</span>
                </div>
              </div>
              <h3 className="font-semibold text-sm text-[#1C1B14] mb-1">Handwoven Bandhani Saree</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold text-[#1C1B14]">₹1,299</span>
                  <span className="text-xs text-[#B0AFA5] line-through">₹1,999</span>
                </div>
                <Link
                  href="/products/handwoven-rajasthani-bandhani-saree"
                  className="h-8 px-4 rounded-xl text-xs font-semibold text-white bg-[#FF7A00] flex items-center justify-center"
                >
                  View Detail
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8C8B80]"
      >
        <span className="text-xs">Scroll to explore</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
}
