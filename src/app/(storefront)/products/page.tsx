'use client';

import { useState, useEffect, useMemo } from 'react';
import { ProductCard } from '@/components/storefront/product-card';
import { FilterSidebarClient } from '@/components/storefront/listing/filter-sidebar';
import { mockProducts } from '@/lib/mock/products';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductListingPage() {
  const [activeCategory, setActiveCategory] = useState('');
  const [activePrice, setActivePrice] = useState('');
  const [activeRating, setActiveRating] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      if (activeCategory && product.category !== activeCategory) return false;
      if (activePrice) {
        const [min, max] = activePrice.split('-').map(Number);
        if (product.price < min || product.price > max) return false;
      }
      if (activeRating && product.rating < Number(activeRating)) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [activeCategory, activePrice, activeRating, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-black/5 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1C1B14]">Artisan Marketplace</h1>
            <p className="text-sm text-[#8C8B80] mt-1">
              Showing {filteredProducts.length} unique handcrafted products
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#8C8B80]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 rounded-xl border border-black/10 bg-white text-xs font-semibold text-[#1C1B14] outline-none focus:border-[#FF7A00]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex gap-8">
          <FilterSidebarClient
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            activePrice={activePrice}
            onPriceChange={setActivePrice}
            activeRating={activeRating}
            onRatingChange={setActiveRating}
            onClearAll={() => {
              setActiveCategory('');
              setActivePrice('');
              setActiveRating('');
            }}
          />

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-3xl p-4 border border-black/5 shadow-sm">
                    <Skeleton className="w-full aspect-square rounded-2xl mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-black/5">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-[#1C1B14] mb-2">No products match your filters</h3>
                <p className="text-sm text-[#8C8B80] mb-6">Try clearing some filters to explore more items</p>
                <button
                  onClick={() => {
                    setActiveCategory('');
                    setActivePrice('');
                    setActiveRating('');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#FF7A00] text-white text-xs font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
