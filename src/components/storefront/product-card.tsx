'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye, MapPin } from 'lucide-react';
import { Product } from '@/types';
import { TIER_ICONS } from '@/lib/mock/sellers';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { formatCurrency } from '@/lib/utils/format-currency';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const router = useRouter();

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isWishlisted = useWishlistStore((state) => state.isInWishlist(product.id));

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-black/5 transition-all duration-300 shadow-sm hover:shadow-xl"
      onMouseEnter={() => {
        setHovered(true);
        if (product.images.length > 1) setImgIndex(1);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setImgIndex(0);
      }}
    >
      <div onClick={() => router.push(`/products/${product.slug}`)} className="block cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            key={imgIndex}
            src={product.images[imgIndex] || product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            {product.discount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white bg-red-600">
                {product.discount}% OFF
              </span>
            )}
            {product.isNew && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white bg-[#1A9E4E]">
                NEW
              </span>
            )}
            {!product.inStock && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white bg-gray-500">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm z-10 hover:scale-110 transition-all"
            whileTap={{ scale: 0.85 }}
          >
            <Heart
              size={16}
              className={`transition-colors ${
                isWishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-[#555449]'
              }`}
            />
          </motion.button>

          {/* Quick Actions Overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 z-10 bg-gradient-to-t from-black/70 to-transparent"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/products/${product.slug}`);
                  }}
                  className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-white/20 backdrop-blur rounded-xl text-white text-xs font-semibold hover:bg-white/30 transition-all"
                >
                  <Eye size={13} /> Quick View
                </button>
                <motion.button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl text-white text-xs font-semibold bg-[#FF7A00] transition-all disabled:opacity-50"
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart size={13} /> Add
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs text-[#8C8B80] truncate">{product.seller.name}</span>
            <span className="text-xs shrink-0">{TIER_ICONS[product.seller.tier]}</span>
            <div className="flex items-center gap-0.5 ml-auto shrink-0">
              <MapPin size={10} className="text-[#B0AFA5]" />
              <span className="text-[10px] text-[#B0AFA5] truncate max-w-[80px]">
                {product.seller.location.split(',')[0]}
              </span>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-[#1C1B14] line-clamp-2 mb-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  className={
                    star <= Math.round(product.rating)
                      ? 'fill-[#FFB800] stroke-[#FFB800]'
                      : 'stroke-[#D4D3CB]'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-[#8C8B80]">{product.rating}</span>
            <span className="text-xs text-[#B0AFA5]">({product.reviewCount.toLocaleString()})</span>
          </div>

          {/* Price Row */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-[#1C1B14]">{formatCurrency(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-sm text-[#B0AFA5] line-through">{formatCurrency(product.mrp)}</span>
                <span className="text-xs font-semibold text-[#1A9E4E]">{product.discount}% off</span>
              </>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full h-10 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 text-white ${
              !product.inStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : addedToCart
                ? 'bg-[#1A9E4E]'
                : 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500]'
            }`}
            whileTap={product.inStock ? { scale: 0.97 } : {}}
          >
            <ShoppingCart size={15} />
            {!product.inStock ? 'Out of Stock' : addedToCart ? 'Added! ✓' : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
