import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface BrowsingState {
  recentlyViewed: Product[];
  searchHistory: string[];
  addRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
  addSearchQuery: (query: string) => void;
  removeSearchQuery: (query: string) => void;
  clearSearchHistory: () => void;
}

export const useBrowsingStore = create<BrowsingState>()(
  persist(
    (set) => ({
      recentlyViewed: [],
      searchHistory: [],

      addRecentlyViewed: (product) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((p) => p.id !== product.id);
          return { recentlyViewed: [product, ...filtered].slice(0, 12) };
        }),

      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      addSearchQuery: (query) =>
        set((state) => {
          const q = query.trim();
          if (!q) return state;
          const filtered = state.searchHistory.filter((s) => s !== q);
          return { searchHistory: [q, ...filtered].slice(0, 5) };
        }),

      removeSearchQuery: (query) =>
        set((state) => ({
          searchHistory: state.searchHistory.filter((s) => s !== query),
        })),

      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    { name: 'bb-browsing' }
  )
);
