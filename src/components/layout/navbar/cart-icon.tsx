'use client';

import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';

export function CartIconClient() {
  const cartCount = useCartStore((state) => state.totalItems());
  const wishlistCount = useWishlistStore((state) => state.totalWishlistItems());

  return (
    <div className="flex items-center gap-2">
      {/* Wishlist Icon */}
      <Link
        href="/wishlist"
        className="relative w-10 h-10 items-center justify-center rounded-full text-[#555449] hover:text-[#FF7A00] hover:bg-[#FFF8F0] transition-all hidden sm:flex"
      >
        <Heart size={20} />
        {wishlistCount > 0 && (
          <motion.span
            key={wishlistCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center bg-[#FF7A00]"
          >
            {wishlistCount}
          </motion.span>
        )}
      </Link>

      {/* Cart Icon */}
      <Link
        href="/cart"
        className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#555449] hover:text-[#FF7A00] hover:bg-[#FFF8F0] transition-all"
      >
        <ShoppingCart size={20} />
        {cartCount > 0 && (
          <motion.span
            key={cartCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center bg-[#FF7A00]"
          >
            {cartCount}
          </motion.span>
        )}
      </Link>
    </div>
  );
}
