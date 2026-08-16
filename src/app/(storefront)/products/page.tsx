/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import React, { useState, useEffect, useMemo, MouseEvent } from 'react';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, Grid, List, X, ChevronDown, ChevronUp, Star, 
  MapPin, Tag, ShoppingCart, HelpCircle, Check, Eye 
} from 'lucide-react';
import { ProductCard } from '@/components/storefront/product-card';
import { getStorefrontProducts } from '@/actions/products/storefront-queries';
import { SkeletonCard } from '@/components/ui/skeletons/index';
import { formatCurrency } from '@/lib/utils/format-currency';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { TIER_ICONS } from '@/lib/mock/sellers';
import { toast } from 'sonner';
import { Product } from '@/types';

const STATES = ['All States', 'Rajasthan', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Bihar', 'Odisha', 'Jammu & Kashmir'];
const SELLER_TIERS = ['gold', 'silver', 'bronze', 'platinum'];

export default function ProductListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Products state from Supabase
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Search state
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Filter states
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [activeRating, setActiveRating] = useState<number | null>(null);
  const [activeSellerTier, setActiveSellerTier] = useState<string>('');
  const [activeState, setActiveState] = useState<string>('');
  const [sortBy, setSortBy] = useState('featured');
  
  // UI states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Collapsible sidebar sections
  const [sectionOpen, setSectionOpen] = useState({
    categories: true,
    price: true,
    rating: true,
    seller: true,
    location: true
  });

  // Fetch products from Supabase on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setFetchLoading(true);
      setFetchError(null);
      const result = await getStorefrontProducts({ limit: 100 });
      if (result.error) {
        setFetchError(result.error);
        setAllProducts([]);
      } else {
        setAllProducts(result.data);
      }
      setFetchLoading(false);
    };
    fetchProducts();
  }, []);

// Moved saveRecentSearch above its usage to avoid hoisting issues
  const saveRecentSearch = (text: string) => {
    if (typeof window !== 'undefined') {
      let saved = recentSearches.filter(s => s.toLowerCase() !== text.toLowerCase());
      saved = [text, ...saved].slice(0, 5);
      setRecentSearches(saved);
      localStorage.setItem('bb-recent-searches', JSON.stringify(saved));
    }
  };

  // Debounce search query
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      if (searchQuery.trim()) {
        saveRecentSearch(searchQuery);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Loading simulation
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, [activeCategory, debouncedSearch, minPrice, maxPrice, activeRating, activeSellerTier, activeState, sortBy]);

  // Read recent searches from localStorage
// eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bb-recent-searches');
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecentSearches(JSON.parse(saved));
      }
    }
  }, []);



  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('bb-recent-searches');
  };

  const toggleSection = (key: keyof typeof sectionOpen) => {
    setSectionOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter calculations
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (activeCategory && product.category !== activeCategory) return false;
      if (debouncedSearch && !product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) && !product.description?.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      if (product.price < minPrice || product.price > maxPrice) return false;
      if (activeRating && product.rating < activeRating) return false;
      if (activeSellerTier && product.seller.tier !== activeSellerTier) return false;
      if (activeState && activeState !== 'All States' && !product.seller.location.toLowerCase().includes(activeState.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'new') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // featured
    });
  }, [allProducts, activeCategory, debouncedSearch, minPrice, maxPrice, activeRating, activeSellerTier, activeState, sortBy]);

  const clearAllFilters = () => {
    setActiveCategory('');
    setMinPrice(0);
    setMaxPrice(15000);
    setActiveRating(null);
    setActiveSellerTier('');
    setActiveState('');
    setSearchQuery('');
    setSortBy('featured');
    toast.info('All filters cleared!');
  };

  const hasActiveFilters = activeCategory || debouncedSearch || minPrice > 0 || maxPrice < 15000 || activeRating || activeSellerTier || activeState;

  // Cart Add support
  const addItem = useCartStore((state) => state.addItem);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});





  const handleQuickAdd = (e: MouseEvent<HTMLButtonElement>, product: Product) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Active Search & Filters Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1A1A1A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Artisan Catalog
            </h1>
            <p className="text-xs text-[#8C8B80] mt-1">
              Showing {filteredProducts.length} unique handcrafted creations
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input Box */}
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8B80]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sarees, jewelry, decor..."
                className="w-full h-11 pl-10 pr-8 rounded-xl border border-[#E5E4DE] bg-white text-xs font-semibold outline-none focus:border-[#FF7A00]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8B80] hover:text-[#FF7A00]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Layout Toggles */}
            <div className="flex items-center border border-[#E5E4DE] rounded-xl bg-white p-0.5">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#FFF8F0] text-[#FF7A00]' : 'text-[#8C8B80]'}`}
              >
                <Grid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[#FFF8F0] text-[#FF7A00]' : 'text-[#8C8B80]'}`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Sorting Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 px-3 rounded-xl border border-[#E5E4DE] bg-white text-xs font-bold text-[#1C1B14] outline-none cursor-pointer focus:border-[#FF7A00]"
            >
              <option value="featured">Featured Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Star Rating</option>
              <option value="new">Newest Arrivals</option>
            </select>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 h-11 px-4 rounded-xl border border-[#E5E4DE] bg-white text-xs font-bold text-[#555449]"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
        </div>

        {/* Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-3 rounded-2xl border border-[#E5E4DE] shadow-sm">
            <span className="text-[10px] font-bold text-[#8C8B80] uppercase tracking-wider pl-1 mr-1">Active:</span>
            {activeCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8F0] text-[#FF7A00]">
                {activeCategory.replace('-', ' ')}
                <X size={12} className="cursor-pointer" onClick={() => setActiveCategory('')} />
              </span>
            )}
            {debouncedSearch && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8F0] text-[#FF7A00]">
                Query: &quot;{debouncedSearch}&quot;
                <X size={12} className="cursor-pointer" onClick={() => setSearchQuery('')} />
              </span>
            )}
            {(minPrice > 0 || maxPrice < 15000) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8F0] text-[#FF7A00]">
                ₹{minPrice} - ₹{maxPrice}
                <X size={12} className="cursor-pointer" onClick={() => { setMinPrice(0); setMaxPrice(15000); }} />
              </span>
            )}
            {activeRating && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8F0] text-[#FF7A00]">
                {activeRating}★ & above
                <X size={12} className="cursor-pointer" onClick={() => setActiveRating(null)} />
              </span>
            )}
            {activeSellerTier && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8F0] text-[#FF7A00]">
                Tier: {activeSellerTier}
                <X size={12} className="cursor-pointer" onClick={() => setActiveSellerTier('')} />
              </span>
            )}
            {activeState && activeState !== 'All States' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8F0] text-[#FF7A00]">
                State: {activeState}
                <X size={12} className="cursor-pointer" onClick={() => setActiveState('')} />
              </span>
            )}
            <button 
              onClick={clearAllFilters}
              className="text-xs font-bold text-red-500 hover:text-red-700 ml-auto pl-2 border-l border-[#E5E4DE]"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E5E4DE] shadow-sm p-6 space-y-6 sticky top-24">
              
              {/* Category Filter */}
              <div className="space-y-3">
                <button 
                  onClick={() => toggleSection('categories')}
                  className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#1A1A1A] outline-none"
                >
                  <span>Craft Categories</span>
                  {sectionOpen.categories ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {sectionOpen.categories && (
                  <div className="space-y-1.5 pt-2">
                    {[
                      { label: 'Handloom & Textiles', slug: 'handloom-textiles' },
                      { label: 'Pottery & Ceramics', slug: 'pottery-ceramics' },
                      { label: 'Organic Food', slug: 'organic-food' },
                      { label: 'Paintings & Art', slug: 'paintings-art' },
                      { label: 'Jewelry', slug: 'jewelry' },
                      { label: 'Home Décor', slug: 'home-decor' }
                    ].map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => setActiveCategory(activeCategory === cat.slug ? '' : cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors font-medium ${
                          activeCategory === cat.slug 
                            ? 'bg-[#FFF8F0] text-[#FF7A00] font-bold' 
                            : 'text-[#555449] hover:bg-[#FAFAF8] hover:text-[#1A1A1A]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="space-y-3 border-t border-[#E5E4DE]/50 pt-4">
                <button 
                  onClick={() => toggleSection('price')}
                  className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#1A1A1A] outline-none"
                >
                  <span>Price Range</span>
                  {sectionOpen.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {sectionOpen.price && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={minPrice} 
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        className="w-full h-9 rounded-lg border border-[#E5E4DE] text-center text-xs outline-none focus:border-[#FF7A00]" 
                        placeholder="Min"
                      />
                      <span className="text-[#8C8B80]">-</span>
                      <input 
                        type="number" 
                        value={maxPrice} 
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full h-9 rounded-lg border border-[#E5E4DE] text-center text-xs outline-none focus:border-[#FF7A00]" 
                        placeholder="Max"
                      />
                    </div>
                    {/* Presets */}
                    <div className="flex flex-wrap gap-1.5">
                      {['0-500', '500-1500', '1500-5000', '5000-15000'].map(range => {
                        const [min, max] = range.split('-').map(Number);
                        const isSelected = minPrice === min && maxPrice === max;
                        return (
                          <button
                            key={range}
                            onClick={() => { setMinPrice(min); setMaxPrice(max); }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                              isSelected 
                                ? 'border-[#FF7A00] text-[#FF7A00] bg-[#FFF8F0]' 
                                : 'border-[#E5E4DE] text-[#555449] hover:bg-[#FAFAF8]'
                            }`}
                          >
                            ₹{min === 0 ? '' : min} - {max}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Rating Filter */}
              <div className="space-y-3 border-t border-[#E5E4DE]/50 pt-4">
                <button 
                  onClick={() => toggleSection('rating')}
                  className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#1A1A1A] outline-none"
                >
                  <span>Customer Rating</span>
                  {sectionOpen.rating ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {sectionOpen.rating && (
                  <div className="space-y-1.5 pt-2">
                    {[5, 4, 3, 2].map((num) => (
                      <button
                        key={num}
                        onClick={() => setActiveRating(activeRating === num ? null : num)}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-colors font-medium ${
                          activeRating === num 
                            ? 'bg-[#FFF8F0] text-[#FF7A00] font-bold' 
                            : 'text-[#555449] hover:bg-[#FAFAF8] hover:text-[#1A1A1A]'
                        }`}
                      >
                        <div className="flex items-center gap-0.5 text-[#FFB800]">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star 
                              key={idx} 
                              size={11} 
                              className={idx < num ? 'fill-[#FFB800] stroke-[#FFB800]' : 'stroke-[#D4D3CB] fill-transparent'} 
                            />
                          ))}
                        </div>
                        <span>& Above</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Seller Tier */}
              <div className="space-y-3 border-t border-[#E5E4DE]/50 pt-4">
                <button 
                  onClick={() => toggleSection('seller')}
                  className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#1A1A1A] outline-none"
                >
                  <span>Seller Tier</span>
                  {sectionOpen.seller ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {sectionOpen.seller && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {SELLER_TIERS.map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setActiveSellerTier(activeSellerTier === tier ? '' : tier)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          activeSellerTier === tier 
                            ? 'border-[#FF7A00] text-[#FF7A00] bg-[#FFF8F0]' 
                            : 'border-[#E5E4DE] text-[#555449] hover:border-[#FF7A00]/40'
                        }`}
                      >
                        {tier.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="space-y-3 border-t border-[#E5E4DE]/50 pt-4">
                <button 
                  onClick={() => toggleSection('location')}
                  className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#1A1A1A] outline-none"
                >
                  <span>Artisan Origin</span>
                  {sectionOpen.location ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {sectionOpen.location && (
                  <div className="pt-2">
                    <select
                      value={activeState}
                      onChange={(e) => setActiveState(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E4DE] bg-[#FAFAF8] text-xs font-semibold text-[#1C1B14] outline-none"
                    >
                      {STATES.map(s => <option key={s} value={s === 'All States' ? '' : s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>

            </div>
          </aside>

          {/* Main Grid Content */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonCard key={i} variant="product" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#E5E4DE] shadow-sm p-8 max-w-lg mx-auto">
                <div className="text-6xl mb-4 select-none">🔍</div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  No crafts found
                </h3>
                <p className="text-xs text-[#8C8B80] max-w-xs mx-auto mb-6 leading-relaxed">
                  We couldn&apos;t find any products matching your specific active filters. Try resetting sliders or search queries.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FF7A00] to-[#FF4500] cursor-pointer shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              // List View Layout
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-4 border border-[#E5E4DE] shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row gap-5 cursor-pointer"
                    onClick={() => router.push(`/products/${product.slug}`)}
                  >
                    <div className="w-full sm:w-44 aspect-square bg-[#FAFAF8] rounded-2xl overflow-hidden shrink-0 relative">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      {product.discount > 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-red-500">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-[11px] text-[#8C8B80]">
                          <span>{product.seller.name}</span>
                          <span>{TIER_ICONS[product.seller.tier]}</span>
                          <span className="mx-1.5">•</span>
                          <div className="flex items-center gap-0.5 text-[#B0AFA5]">
                            <MapPin size={10} /> {product.seller.location.split(',')[0]}
                          </div>
                        </div>
                        <h3 className="text-base font-bold text-[#1A1A1A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#8C8B80] line-clamp-2 leading-relaxed">
                          {product.description || 'Authentic regional handicraft item sourced directly from rural cooperatives.'}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-[#E5E4DE]/50">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-[#1A1A1A]">{formatCurrency(product.price)}</span>
                          {product.mrp > product.price && (
                            <span className="text-xs text-[#B0AFA5] line-through font-semibold">{formatCurrency(product.mrp)}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/products/${product.slug}`);
                            }}
                            className="h-10 px-4 rounded-xl text-xs font-bold border border-[#E5E4DE] text-[#555449] hover:bg-[#FAFAF8] cursor-pointer"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => handleQuickAdd(e, product)}
                            disabled={!product.inStock}
                            className={`h-10 px-4 rounded-xl text-xs font-bold text-white cursor-pointer ${
                              addedItems[product.id] ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500]'
                            }`}
                          >
                            {addedItems[product.id] ? 'Added! ✓' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl border-t border-[#E5E4DE] max-h-[85vh] overflow-y-auto p-6 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#E5E4DE]/50 pb-4">
                <h3 className="font-extrabold text-sm text-[#1A1A1A] uppercase tracking-wide">Filters</h3>
                <button 
                  onClick={() => setMobileFilterOpen(false)} 
                  className="p-1 rounded-lg hover:bg-[#FAFAF8] text-[#8C8B80]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Filter content wrapper (Price, Rating, Category select boxes) */}
              <div className="space-y-6 pb-12">
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase text-[#8C8B80]">Category</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Handloom & Textiles', slug: 'handloom-textiles' },
                      { label: 'Pottery & Ceramics', slug: 'pottery-ceramics' },
                      { label: 'Organic Food', slug: 'organic-food' },
                      { label: 'Paintings & Art', slug: 'paintings-art' },
                      { label: 'Jewelry', slug: 'jewelry' },
                      { label: 'Home Décor', slug: 'home-decor' }
                    ].map(c => (
                      <button
                        key={c.slug}
                        onClick={() => {
                          setActiveCategory(activeCategory === c.slug ? '' : c.slug);
                        }}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center ${
                          activeCategory === c.slug ? 'border-[#FF7A00] text-[#FF7A00] bg-[#FFF8F0]' : 'border-[#E5E4DE]'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 border-t border-[#E5E4DE]/50 pt-4">
                  <h4 className="font-bold text-xs uppercase text-[#8C8B80]">Price presets</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['0-500', '500-1500', '1500-5000', '5000-15000'].map(range => {
                      const [min, max] = range.split('-').map(Number);
                      const isSelected = minPrice === min && maxPrice === max;
                      return (
                        <button
                          key={range}
                          onClick={() => { setMinPrice(min); setMaxPrice(max); }}
                          className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                            isSelected 
                              ? 'border-[#FF7A00] text-[#FF7A00] bg-[#FFF8F0]' 
                              : 'border-[#E5E4DE] text-[#555449]'
                          }`}
                        >
                          ₹{min === 0 ? '' : min} - {max}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 border-t border-[#E5E4DE]/50 pt-4">
                  <h4 className="font-bold text-xs uppercase text-[#8C8B80]">Origin state</h4>
                  <select
                    value={activeState}
                    onChange={(e) => setActiveState(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#E5E4DE] bg-[#FAFAF8] text-xs font-semibold"
                  >
                    {STATES.map(s => <option key={s} value={s === 'All States' ? '' : s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E5E4DE] flex gap-3 z-50">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 h-11 rounded-xl text-xs font-bold border border-[#E5E4DE] text-[#555449]"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 h-11 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FF7A00] to-[#FF4500]"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
