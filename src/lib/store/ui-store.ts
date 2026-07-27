'use client';

import { create } from 'zustand';

interface UIStore {
  isSearchOpen: boolean;
  isMobileNavOpen: boolean;
  isCartDrawerOpen: boolean;
  searchQuery: string;
  setSearchOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setCartDrawerOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isSearchOpen: false,
  isMobileNavOpen: false,
  isCartDrawerOpen: false,
  searchQuery: '',
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
