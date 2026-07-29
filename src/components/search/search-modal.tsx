'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockProducts } from '@/lib/mock/products';
import { useBrowsingStore } from '@/lib/store/browsing-store';
import { formatCurrency } from '@/lib/utils/format-currency';

const POPULAR_SEARCHES = [
  'Madhubani Painting', 'Pashmina Shawl', 'Blue Pottery',
  'Silver Jewelry', 'Handloom Saree', 'Brass Decor',
  'Organic Saffron', 'Tribal Art',
];

const CATEGORIES = [
  { name: 'Handloom & Textiles', slug: 'handloom-textiles', icon: '🧵' },
  { name: 'Pottery & Ceramics', slug: 'pottery-ceramics', icon: '🏺' },
  { name: 'Paintings & Art', slug: 'paintings-art', icon: '🎨' },
  { name: 'Jewelry & Silver', slug: 'jewelry', icon: '💍' },
  { name: 'Organic Food', slug: 'organic-food', icon: '🌿' },
  { name: 'Home Decor', slug: 'home-decor', icon: '🏠' },
];

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { searchHistory, addSearchQuery, removeSearchQuery } = useBrowsingStore();

  // Auto-focus
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [open]);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Search results
  const results = debouncedQuery.trim()
    ? mockProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(debouncedQuery.toLowerCase())) ||
            p.category.toLowerCase().includes(debouncedQuery.toLowerCase())
        )
        .slice(0, 4)
    : [];

  const matchedCategories = debouncedQuery.trim()
    ? CATEGORIES.filter((c) => c.name.toLowerCase().includes(debouncedQuery.toLowerCase())).slice(0, 3)
    : [];

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return;
      addSearchQuery(searchQuery);
      onClose();
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    },
    [addSearchQuery, onClose, router]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[500]"
            onClick={onClose}
          />

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[501] w-full max-w-2xl mx-4"
            style={{ maxWidth: 'calc(100vw - 2rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-[#E8E4DE] overflow-hidden">
              {/* Search Input */}
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E8E4DE]">
                  <Search size={20} className="text-[#8C7B6E] shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for crafts, artisans, states..."
                    className="flex-1 text-base text-[#1A0A00] placeholder-[#B5A99A] outline-none bg-transparent"
                  />
                  {query && (
                    <button type="button" onClick={() => setQuery('')} className="text-[#8C7B6E] hover:text-[#1A0A00] cursor-pointer">
                      <X size={18} />
                    </button>
                  )}
                  <button type="button" onClick={onClose} className="text-xs font-medium text-[#8C7B6E] hover:text-[#1A0A00] cursor-pointer px-2 py-1 rounded-lg hover:bg-[#F5F4F0] transition-colors">
                    ESC
                  </button>
                </div>
              </form>

              {/* Content */}
              <div className="max-h-[70vh] overflow-y-auto">
                {debouncedQuery.trim() === '' ? (
                  /* Empty state — history + popular */
                  <div className="p-4 space-y-5">
                    {searchHistory.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-[#8C7B6E] uppercase tracking-wider mb-2">
                          Recent Searches
                        </p>
                        <div className="space-y-1">
                          {searchHistory.map((q) => (
                            <div key={q} className="flex items-center gap-2 group">
                              <button
                                onClick={() => handleSearch(q)}
                                className="flex-1 flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F5F4F0] transition-colors text-left cursor-pointer"
                              >
                                <Clock size={13} className="text-[#B5A99A] shrink-0" />
                                <span className="text-sm text-[#4A3728]">{q}</span>
                              </button>
                              <button
                                onClick={() => removeSearchQuery(q)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded text-[#B5A99A] hover:text-[#4A3728] transition-all cursor-pointer"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-[11px] font-bold text-[#8C7B6E] uppercase tracking-wider mb-2">
                        Popular Searches
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_SEARCHES.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSearch(s)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#FFF3E8] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white transition-colors cursor-pointer border border-[#FFE4CC]"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-[#8C7B6E] uppercase tracking-wider mb-2">
                        Browse Categories
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/products?category=${cat.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#F5F4F0] transition-colors"
                          >
                            <span className="text-base">{cat.icon}</span>
                            <span className="text-sm text-[#4A3728] font-medium">{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Search results */
                  <div className="p-4 space-y-4">
                    {/* Category matches */}
                    {matchedCategories.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-[#8C7B6E] uppercase tracking-wider mb-2">Categories</p>
                        {matchedCategories.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/products?category=${cat.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#F5F4F0] transition-colors"
                          >
                            <span>{cat.icon}</span>
                            <span className="text-sm text-[#4A3728]">{cat.name}</span>
                            <ArrowRight size={13} className="ml-auto text-[#B5A99A]" />
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Product results */}
                    {results.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-[#8C7B6E] uppercase tracking-wider mb-2">Products</p>
                        <div className="space-y-2">
                          {results.map((p) => (
                            <Link
                              key={p.id}
                              href={`/products/${p.slug}`}
                              onClick={onClose}
                              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F5F4F0] transition-colors group"
                            >
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F4F0] shrink-0">
                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#1A0A00] line-clamp-1">{p.name}</p>
                                <p className="text-xs text-[#8C7B6E]">{p.seller.name}</p>
                              </div>
                              <span className="text-sm font-bold text-[#FF7A00] shrink-0">{formatCurrency(p.price)}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* See all results */}
                    <button
                      onClick={() => handleSearch(debouncedQuery)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FFF3E8] text-[#FF7A00] text-sm font-bold hover:bg-[#FF7A00] hover:text-white transition-colors cursor-pointer"
                    >
                      <TrendingUp size={15} />
                      See all results for "{debouncedQuery}"
                    </button>

                    {results.length === 0 && matchedCategories.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-[#8C7B6E] text-sm">No results found for "{debouncedQuery}"</p>
                        <p className="text-xs text-[#B5A99A] mt-1">Try a different search term</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
