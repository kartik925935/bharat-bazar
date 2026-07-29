'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight, X, Share2, TrendingDown, Bell, AlertCircle } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { useCartStore } from '@/lib/store/cart-store';
import { mockProducts } from '@/lib/mock/products';
import { formatCurrency } from '@/lib/utils/format-currency';
import { ProductCard } from '@/components/storefront/product-card';
import { toast } from 'sonner';
import { Product } from '@/types';

type SortKey = 'newest' | 'price_asc' | 'price_desc' | 'name';
type FilterKey = 'all' | 'in_stock' | 'out_of_stock';

function WishlistSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-6 animate-pulse">
      <div className="h-8 w-40 rounded skeleton" />
      <div className="h-12 rounded-2xl skeleton" />
      <div className="flex gap-2">
        {[0,1,2,3].map(i=><div key={i} className="h-9 w-24 rounded-full skeleton"/>)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({length:8}).map((_,i)=>(
          <div key={i} className="rounded-2xl overflow-hidden border border-[#E8E4DE]">
            <div className="aspect-square skeleton"/>
            <div className="p-3 space-y-2">
              <div className="h-4 w-4/5 rounded skeleton"/>
              <div className="h-3 w-3/5 rounded skeleton"/>
              <div className="h-6 w-2/5 rounded skeleton"/>
              <div className="h-10 w-full rounded-xl skeleton"/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { items: wishlistProducts, removeFromWishlist } = useWishlistStore();
  const addItem = useCartStore(s => s.addItem);
  const [sort, setSort]       = useState<SortKey>('newest');
  const [filter, setFilter]   = useState<FilterKey>('all');
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sort
  const sorted = [...wishlistProducts].sort((a, b) => {
    if (sort === 'price_asc')  return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'name')       return a.name.localeCompare(b.name);
    return 0;
  });

  // Filter
  const filtered = sorted.filter(p => {
    if (filter === 'in_stock')     return p.inStock;
    if (filter === 'out_of_stock') return !p.inStock;
    return true;
  });

  const priceDrop = wishlistProducts.filter(p => p.mrp > p.price);
  const outOfStock = wishlistProducts.filter(p => !p.inStock);

  const handleMoveAllToCart = () => {
    const inStock = wishlistProducts.filter(p => p.inStock);
    inStock.forEach(p => addItem(p));
    toast.success(`${inStock.length} item${inStock.length > 1 ? 's' : ''} added to cart!`);
  };

  const handleRemove = (id: string, name: string) => {
    removeFromWishlist(id);
    toast.success(`Removed from wishlist`);
  };

  const handleAddToCart = (p: typeof mockProducts[0]) => {
    if (!p.inStock) { toast.error('This item is out of stock'); return; }
    addItem(p);
    toast.success('Added to cart!');
  };

  const recommendations = mockProducts.filter(p => !wishlistProducts.some(w => w.id === p.id)).slice(0, 4);

  // Empty state
  if (wishlistProducts.length === 0) {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-black text-[#1A0A00] mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          My Wishlist
        </h1>
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-12 text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#FEF2F2] flex items-center justify-center mb-4">
            <Heart size={40} className="text-[#FDA4AF]" />
          </div>
          <h2 className="text-xl font-black text-[#1A0A00] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your wishlist is empty
          </h2>
          <p className="text-sm text-[#8C7B6E] mb-6">Save items you love and come back to them anytime</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white font-bold text-sm shadow-[0_8px_24px_rgba(255,122,0,0.3)]">
            Explore Products <ArrowRight size={16} />
          </Link>
        </div>

        {recommendations.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-black text-[#1A0A00] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Trending Right Now
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendations.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
            My Wishlist
          </h1>
          <p className="text-sm text-[#8C7B6E] mt-0.5">{wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toast.info('Share link copied!')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E8E4DE] text-xs font-semibold text-[#4A3728] hover:border-[#FF7A00]/30 transition-colors cursor-pointer"
          >
            <Share2 size={13} /> Share
          </button>
          <button
            onClick={handleMoveAllToCart}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold cursor-pointer"
          >
            <ShoppingCart size={13} /> Move All to Cart
          </button>
        </div>
      </div>

      {/* Price Drop Alert */}
      <AnimatePresence>
        {priceDrop.length > 0 && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between bg-gradient-to-r from-[#FF7A00] to-[#FF4500] rounded-2xl px-4 py-3 text-white"
          >
            <div className="flex items-center gap-2">
              <TrendingDown size={18} />
              <div>
                <p className="text-sm font-bold">🎉 {priceDrop.length} item{priceDrop.length > 1 ? 's have' : ' has'} dropped in price!</p>
                <p className="text-xs text-white/80">
                  Save up to {formatCurrency(Math.max(...priceDrop.map(p => p.mrp - p.price)))} today
                </p>
              </div>
            </div>
            <button onClick={() => setDismissed(true)} className="text-white/70 hover:text-white cursor-pointer">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort + Filter */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {([['all','All'],['in_stock','In Stock'],['out_of_stock','Out of Stock']] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all shrink-0 ${
                filter === k
                  ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white'
                  : 'bg-white border border-[#E8E4DE] text-[#4A3728] hover:border-[#FF7A00]/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          className="h-9 px-3 rounded-xl border border-[#E8E4DE] text-xs font-semibold text-[#4A3728] bg-white outline-none cursor-pointer focus:border-[#FF7A00]"
        >
          <option value="newest">Date Added</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        layout
      >
        <AnimatePresence>
          {filtered.map((product, idx) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-white rounded-2xl border border-[#E8E4DE] overflow-hidden group hover:shadow-[0_8px_32px_rgba(255,122,0,0.1)] hover:border-[#FF7A00]/20 hover:-translate-y-1 transition-all"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-[#F5F4F0]">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={`object-cover group-hover:scale-105 transition-transform duration-500 ${!product.inStock ? 'grayscale opacity-60' : ''}`}
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {!product.inStock && (
                    <span className="text-[10px] font-bold bg-[#374151] text-white px-2 py-0.5 rounded-full">Out of Stock</span>
                  )}
                  {product.mrp > product.price && product.inStock && (
                    <span className="text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <TrendingDown size={8} />↓ {formatCurrency(product.mrp - product.price)} off
                    </span>
                  )}
                </div>

                {/* Remove heart */}
                <button
                  onClick={() => handleRemove(product.id, product.name)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#EF4444] hover:bg-white shadow-sm cursor-pointer transition-colors"
                >
                  <Heart size={14} fill="#EF4444" />
                </button>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-[10px] font-bold text-[#FF7A00] uppercase tracking-wide mb-1">{product.seller.name}</p>
                <Link href={`/products/${product.slug}`}>
                  <p className="text-sm font-semibold text-[#1A0A00] line-clamp-2 leading-snug hover:text-[#FF7A00] transition-colors">
                    {product.name}
                  </p>
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-base font-black text-[#1A0A00]">{formatCurrency(product.price)}</span>
                  {product.mrp > product.price && (
                    <span className="text-xs text-[#B5A99A] line-through">{formatCurrency(product.mrp)}</span>
                  )}
                </div>

                {product.inStock ? (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full h-9 mt-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <ShoppingCart size={13} /> Add to Cart
                  </button>
                ) : (
                  <button
                    onClick={() => toast.success('We\'ll notify you when it\'s back in stock!')}
                    className="w-full h-9 mt-2.5 rounded-xl bg-[#F5F4F0] text-[#4A3728] border border-[#E8E4DE] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#EDE9E3] transition-colors"
                  >
                    <Bell size={13} /> Notify Me
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle size={40} className="text-[#E8E4DE] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#4A3728]">No items match your filter</p>
          <button onClick={() => setFilter('all')} className="mt-2 text-xs font-bold text-[#FF7A00] hover:underline cursor-pointer">
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
}
