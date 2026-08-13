import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'platform_admin' | 'finance_admin' | 'support_agent' | 'content_moderator' | 'logistics_admin';
  permissions: string[];
}

interface SAAuthState {
  user: SuperAdminUser | null;
  isAuthenticated: boolean;
  login: (user: SuperAdminUser) => void;
  logout: () => void;
}

export const useSAAuthStore = create<SAAuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'bb-sa-auth-state',
    }
  )
);
