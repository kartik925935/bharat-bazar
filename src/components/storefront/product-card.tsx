'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Eye, MapPin, Check } from 'lucide-react';
import { Product } from '@/types';
import { TIER_ICONS } from '@/lib/mock/sellers';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { formatCurrency } from '@/lib/utils/format-currency';
import { cn } from '@/lib/utils/cn';

export type ProductCardVariant = 'grid' | 'list' | 'mini';

interface ProductCardProps {
  product: Product;
  variant?: ProductCardVariant;
  priority?: boolean;
}

export function ProductCard({ product, variant = 'grid', priority = false }: ProductCardProps) {
  const [hovered, setHovered]     = useState(false);
  const [imgIndex, setImgIndex]   = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const router = useRouter();

  const addItem        = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted   = useWishlistStore((s) => s.isInWishlist(product.id));

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  }, [toggleWishlist, product]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [addItem, product]);

  const navigate = useCallback(() => {
    router.push(`/products/${product.slug}`);
  }, [router, product.slug]);

  const savings = product.mrp - product.price;

  // ── MINI variant ─────────────────────────────────────────────────────────
  if (variant === 'mini') {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E8E4DE] hover:border-[#FF7A00]/30 hover:shadow-md transition-all group"
      >
        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#F5F4F0] shrink-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="56px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#1A0A00] line-clamp-2 leading-snug">
            {product.name}
          </p>
          <p className="text-xs font-bold text-[#FF7A00] mt-0.5">{formatCurrency(product.price)}</p>
        </div>
      </Link>
    );
  }

  // ── LIST variant ─────────────────────────────────────────────────────────
  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl border border-[#E8E4DE] hover:border-[#FF7A00]/20 hover:shadow-[0_8px_32px_rgba(255,122,0,0.08)] transition-all flex gap-4 p-4 group cursor-pointer"
        onClick={navigate}
      >
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#F5F4F0] shrink-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="112px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] text-[#8C7B6E] truncate">{product.seller.name}</span>
            <span className="text-[10px] shrink-0">{(TIER_ICONS as Record<string, React.ReactNode>)[product.seller.tier]}</span>
          </div>
          <h3 className="text-sm font-semibold text-[#1A0A00] line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map((s) => (
              <svg key={s} width="10" height="10" viewBox="0 0 20 20" fill="none">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  fill={s <= Math.round(product.rating ?? 4.5) ? '#F59E0B' : '#E8E4DE'}
                />
              </svg>
            ))}
            <span className="text-[11px] text-[#8C7B6E] ml-0.5">
              {(product.rating ?? 4.5).toFixed(1)} ({(product.reviewCount ?? 0).toLocaleString()})
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#1A0A00]">{formatCurrency(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-xs text-[#B5A99A] line-through">{formatCurrency(product.mrp)}</span>
                <span className="text-xs font-bold text-[#16A34A]">{product.discount}% off</span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <motion.button
            onClick={handleWishlist}
            whileTap={{ scale: 0.85 }}
            className="w-9 h-9 rounded-full border border-[#E8E4DE] flex items-center justify-center hover:border-red-300 transition-colors cursor-pointer"
          >
            <Heart
              size={15}
              className={isWishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-[#8C7B6E]'}
            />
          </motion.button>
          <motion.button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer',
              !product.inStock
                ? 'bg-[#F5F4F0] text-[#B5A99A] cursor-not-allowed'
                : addedToCart
                ? 'bg-[#22C55E] text-white'
                : 'bg-gradient-to-br from-[#FF7A00] to-[#FF4500] text-white hover:shadow-[0_4px_12px_rgba(255,122,0,0.4)]'
            )}
          >
            {addedToCart ? <Check size={15} /> : <ShoppingCart size={15} />}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ── GRID variant (default) ────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => {
        setHovered(true);
        if (product.images.length > 1) setImgIndex(1);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setImgIndex(0);
      }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#E8E4DE] hover:border-[#FF7A00]/25 shadow-sm hover:shadow-[0_20px_60px_rgba(255,122,0,0.12)] transition-all duration-300 cursor-pointer"
      style={{ transform: hovered ? 'translateY(-4px)' : 'translateY(0)' }}
      onClick={navigate}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#F5F4F0]">
        <Image
          key={imgIndex}
          src={product.images[imgIndex] || product.images[0]}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-108"
          style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.5s ease' }}
        />

        {/* Gradient overlay on hover for CTAs */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            />
          )}
        </AnimatePresence>

        {/* Badges — top left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r from-[#EF4444] to-[#B91C1C] shadow-sm">
              {product.discount}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r from-[#22C55E] to-[#15803D] shadow-sm">
              NEW
            </span>
          )}
          {product.inStock && product.discount === 0 && !product.isNew && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-[#C2410C] bg-[#FFF7ED]">
              ✋ Handmade
            </span>
          )}
          {!product.inStock && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-[#6B7280]">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist — top right */}
        <motion.button
          onClick={handleWishlist}
          whileTap={{ scale: 0.75 }}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all cursor-pointer"
        >
          <Heart
            size={15}
            className={cn(
              'transition-all',
              isWishlisted ? 'fill-red-500 stroke-red-500 scale-110' : 'stroke-[#4A3728]'
            )}
          />
        </motion.button>

        {/* Quick action bar — bottom, visible on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 z-10"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/products/${product.slug}`);
                }}
                className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-white/25 backdrop-blur-sm rounded-xl text-white text-xs font-semibold hover:bg-white/40 transition-all cursor-pointer"
              >
                <Eye size={13} /> View
              </button>
              <motion.button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl text-white text-xs font-semibold transition-all cursor-pointer',
                  !product.inStock
                    ? 'bg-white/20 cursor-not-allowed opacity-60'
                    : addedToCart
                    ? 'bg-[#22C55E]'
                    : 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500]'
                )}
              >
                {addedToCart ? <><Check size={13} /> Added!</> : <><ShoppingCart size={13} /> Add</>}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Seller row */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[11px] text-[#8C7B6E] truncate max-w-[120px]">{product.seller.name}</span>
          <span className="text-[11px] shrink-0">{(TIER_ICONS as Record<string, React.ReactNode>)[product.seller.tier]}</span>
          <div className="flex items-center gap-0.5 ml-auto shrink-0">
            <MapPin size={9} className="text-[#B5A99A]" />
            <span className="text-[10px] text-[#B5A99A] max-w-[70px] truncate">
              {product.seller.location.split(',')[0]}
            </span>
          </div>
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold text-[#1A0A00] line-clamp-2 leading-snug mb-2.5"
            style={{ fontFamily: 'Inter, sans-serif' }}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <svg key={s} width="11" height="11" viewBox="0 0 20 20" fill="none">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  fill={s <= Math.round(product.rating ?? 4.5) ? '#F59E0B' : '#E8E4DE'}
                />
              </svg>
            ))}
          </div>
          <span className="text-[11px] font-semibold text-[#1A0A00]">{(product.rating ?? 4.5).toFixed(1)}</span>
          <span className="text-[11px] text-[#B5A99A]">({(product.reviewCount ?? 0).toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="mb-3.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg font-black text-[#1A0A00]">{formatCurrency(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-xs text-[#B5A99A] line-through">{formatCurrency(product.mrp)}</span>
                <span className="text-xs font-bold text-[#16A34A]">{product.discount}% off</span>
              </>
            )}
          </div>
          {savings > 0 && (
            <p className="text-[10px] text-[#16A34A] font-medium mt-0.5">
              You save {formatCurrency(savings)}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          whileTap={product.inStock ? { scale: 0.97 } : {}}
          className={cn(
            'w-full h-10 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer',
            !product.inStock
              ? 'bg-[#F5F4F0] text-[#B5A99A] cursor-not-allowed'
              : addedToCart
              ? 'bg-gradient-to-r from-[#22C55E] to-[#15803D] text-white shadow-[0_4px_16px_rgba(34,197,94,0.3)]'
              : 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white shadow-[0_4px_16px_rgba(255,122,0,0.3)] hover:shadow-[0_8px_24px_rgba(255,122,0,0.4)]'
          )}
        >
          {addedToCart ? (
            <><Check size={15} /> Added to Cart!</>
          ) : !product.inStock ? (
            'Out of Stock'
          ) : (
            <><ShoppingCart size={15} /> Add to Cart</>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
