import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MOCK_ROLES,
  MOCK_ADMIN_CATEGORIES,
  MOCK_ADMIN_ORDERS,
  MOCK_CUSTOMERS,
  MOCK_COMMISSION_RATES,
  MOCK_PLATFORM_SETTINGS,
  MOCK_ADMINS,
  MOCK_PANEL_ACCESS,
  MOCK_PANEL_REQUESTS,
  AdminPanelAccess,
  AdminPanelRequest
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
  panelAccess: typeof MOCK_PANEL_ACCESS;
  panelRequests: typeof MOCK_PANEL_REQUESTS;
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
  
  // Admin Permissions
  grantPanelAccess: (access: AdminPanelAccess) => void;
  revokePanelAccess: (id: string) => void;
  updatePanelRequest: (id: string, status: 'approved' | 'denied', note?: string) => void;
  
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
      panelAccess: MOCK_PANEL_ACCESS,
      panelRequests: MOCK_PANEL_REQUESTS,
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

      grantPanelAccess: (access) => set((state) => ({
        panelAccess: [access, ...state.panelAccess]
      })),

      revokePanelAccess: (id) => set((state) => ({
        panelAccess: state.panelAccess.filter(pa => pa.id !== id)
      })),

      updatePanelRequest: (id, status, note) => set((state) => ({
        panelRequests: state.panelRequests.map(pr => pr.id === id ? { ...pr, status, reviewNote: note } : pr)
      })),

      resetToDefaults: () => set({
        roles: MOCK_ROLES,
        categories: MOCK_ADMIN_CATEGORIES,
        orders: MOCK_ADMIN_ORDERS,
        customers: MOCK_CUSTOMERS,
        admins: MOCK_ADMINS,
        panelAccess: MOCK_PANEL_ACCESS,
        panelRequests: MOCK_PANEL_REQUESTS,
        commissionRates: MOCK_COMMISSION_RATES,
        platformSettings: MOCK_PLATFORM_SETTINGS,
      })
    }),
    {
      name: 'bb-super-admin-state-v3',
      // persist new keys as well
      partialize: (state) => ({
        roles: state.roles,
        categories: state.categories,
        commissionRates: state.commissionRates,
        platformSettings: state.platformSettings,
        partnerApis: state.partnerApis,
        panelAccess: state.panelAccess,
        panelRequests: state.panelRequests,
      }),
    }
  )
);
