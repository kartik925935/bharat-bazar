import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MOCK_ROLES,
  MOCK_ADMIN_CATEGORIES,
  MOCK_ADMIN_ORDERS,
  MOCK_CUSTOMERS,
  MOCK_COMMISSION_RATES,
  MOCK_PLATFORM_SETTINGS,
  MOCK_ADMINS
} from '@/lib/mock/super-admin';

export interface PartnerApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
}

interface SuperAdminState {
  roles: typeof MOCK_ROLES;
  categories: typeof MOCK_ADMIN_CATEGORIES;
  orders: typeof MOCK_ADMIN_ORDERS;
  customers: typeof MOCK_CUSTOMERS;
  admins: typeof MOCK_ADMINS;
  commissionRates: typeof MOCK_COMMISSION_RATES;
  platformSettings: typeof MOCK_PLATFORM_SETTINGS;
  partnerApis: PartnerApiKey[];
  
  // Actions
  addRole: (role: any) => void;
  updateRole: (id: string, role: any) => void;
  addCategory: (category: any) => void;
  updateCategory: (id: string, category: any) => void;
  updateCommissionRates: (rates: any) => void;
  updatePlatformSettings: (settings: any) => void;
  generatePartnerApiKey: (name: string) => void;
  revokePartnerApiKey: (id: string) => void;
  resetToDefaults: () => void;
}

export const useSuperAdminStore = create<SuperAdminState>()(
  persist(
    (set) => ({
      roles: MOCK_ROLES,
      categories: MOCK_ADMIN_CATEGORIES,
      orders: MOCK_ADMIN_ORDERS,
      customers: MOCK_CUSTOMERS,
      admins: MOCK_ADMINS,
      commissionRates: MOCK_COMMISSION_RATES,
      platformSettings: MOCK_PLATFORM_SETTINGS,
      partnerApis: [],

      addRole: (role) => set((state) => ({ roles: [role, ...state.roles] })),
      updateRole: (id, role) => set((state) => ({
        roles: state.roles.map(r => r.id === id ? { ...r, ...role } : r)
      })),
      
      addCategory: (category) => set((state) => ({ categories: [category, ...state.categories] })),
      updateCategory: (id, category) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...category } : c)
      })),

      updateCommissionRates: (rates) => set({ commissionRates: rates }),
      
      updatePlatformSettings: (settings) => set((state) => ({
        platformSettings: { ...state.platformSettings, ...settings }
      })),

      generatePartnerApiKey: (name) => set((state) => {
        const newKey: PartnerApiKey = {
          id: `pk_${Math.random().toString(36).substr(2, 9)}`,
          name,
          key: `bb_live_${Math.random().toString(36).substr(2, 24)}`,
          createdAt: new Date().toISOString().split('T')[0],
          lastUsed: 'Never',
        };
        return { partnerApis: [newKey, ...state.partnerApis] };
      }),
      
      revokePartnerApiKey: (id) => set((state) => ({
        partnerApis: state.partnerApis.filter(k => k.id !== id)
      })),

      resetToDefaults: () => set({
        roles: MOCK_ROLES,
        categories: MOCK_ADMIN_CATEGORIES,
        orders: MOCK_ADMIN_ORDERS,
        customers: MOCK_CUSTOMERS,
        admins: MOCK_ADMINS,
        commissionRates: MOCK_COMMISSION_RATES,
        platformSettings: MOCK_PLATFORM_SETTINGS,
      })
    }),
    {
      name: 'bb-super-admin-state-v2',
      // only persist specific fields to avoid huge localStorage if orders grow
      partialize: (state) => ({
        roles: state.roles,
        categories: state.categories,
        commissionRates: state.commissionRates,
        platformSettings: state.platformSettings,
        partnerApis: state.partnerApis,
      }),
    }
  )
);
