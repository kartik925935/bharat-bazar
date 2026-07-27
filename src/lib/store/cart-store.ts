'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  savedForLater: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  clearCart: () => void;
  subtotal: () => number;
  totalItems: () => number;
  totalDiscount: () => number;
  finalTotal: () => number;
}

const VALID_COUPONS: Record<string, number> = {
  'WELCOME100': 100, // ₹100 flat off
  'VILLAGE20': 20,   // 20% off
  'ARTISAN50': 50,   // ₹50 flat off
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      savedForLater: [],
      couponCode: null,
      couponDiscount: 0,

      addItem: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id
                  ? { ...i, quantity: Math.min(10, i.quantity + qty) }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { id: product.id, product, quantity: qty }],
          };
        });
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        })),

      updateQuantity: (productId, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === productId ? { ...i, quantity: Math.max(1, Math.min(10, qty)) } : i
          ),
        })),

      saveForLater: (productId) =>
        set((state) => {
          const item = state.items.find((i) => i.id === productId);
          if (!item) return state;
          return {
            items: state.items.filter((i) => i.id !== productId),
            savedForLater: [...state.savedForLater, { ...item, savedForLater: true }],
          };
        }),

      moveToCart: (productId) =>
        set((state) => {
          const item = state.savedForLater.find((i) => i.id === productId);
          if (!item) return state;
          return {
            savedForLater: state.savedForLater.filter((i) => i.id !== productId),
            items: [...state.items, { ...item, savedForLater: false }],
          };
        }),

      applyCoupon: async (code) => {
        const discount = VALID_COUPONS[code.toUpperCase()];
        if (discount) {
          set({ couponCode: code.toUpperCase(), couponDiscount: discount });
          return true;
        }
        return false;
      },

      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalDiscount: () => {
        const { couponDiscount } = get();
        const sub = get().subtotal();
        if (couponDiscount <= 100) {
          return couponDiscount;
        }
        return Math.round((sub * couponDiscount) / 100);
      },

      finalTotal: () => {
        const sub = get().subtotal();
        const disc = get().totalDiscount();
        return Math.max(0, sub - disc);
      },
    }),
    { name: 'bharat-bazaar-cart' }
  )
);
