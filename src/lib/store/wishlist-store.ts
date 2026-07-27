'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface WishlistStore {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  totalWishlistItems: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        set((state) => {
          if (state.items.some((p) => p.id === product.id)) return state;
          return { items: [...state.items, product] };
        });
      },

      removeFromWishlist: (productId) =>
        set((state) => ({
          items: state.items.filter((p) => p.id !== productId),
        })),

      toggleWishlist: (product) => {
        const exists = get().isInWishlist(product.id);
        if (exists) {
          get().removeFromWishlist(product.id);
        } else {
          get().addToWishlist(product);
        }
      },

      isInWishlist: (productId) => get().items.some((p) => p.id === productId),

      clearWishlist: () => set({ items: [] }),

      totalWishlistItems: () => get().items.length,
    }),
    { name: 'bharat-bazaar-wishlist' }
  )
);
