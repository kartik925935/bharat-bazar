'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initializeUserDatabase, seedUsers } from '../mock/users';
import { useCartStore } from './cart-store';
import { useWishlistStore } from './wishlist-store';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'customer' | 'seller' | 'admin' | 'super_admin' | 'delivery';
  phone?: string;
  createdAt: string;
}

export interface SignUpData {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: 'customer' | 'seller' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Auth Actions
  signIn: (email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean }>;
  resetPassword: (email: string) => Promise<{ success: boolean }>;

  // Internal
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // stays true until initialize() completes
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      clearError: () => set({ error: null }),

      initialize: async () => {
        get().setLoading(true);
        try {
          initializeUserDatabase();
          // Check if user is already authenticated in the store
          const current = get().user;
          if (current) {
            // Validate against the storage list
            const usersListStr = localStorage.getItem('bb-users');
            if (usersListStr) {
              const usersList = JSON.parse(usersListStr);
              const found = usersList.find((u: any) => u.id === current.id);
              if (found) {
                set({ user: found, isAuthenticated: true });
              } else {
                set({ user: null, isAuthenticated: false });
              }
            }
          }
        } catch (e) {
          set({ error: 'Auth initialization failed' });
        } finally {
          get().setLoading(false);
        }
      },

      signIn: async (email, password, role) => {
        get().setLoading(true);
        set({ error: null });
        try {
          initializeUserDatabase();
          const usersListStr = localStorage.getItem('bb-users') || '[]';
          const usersList = JSON.parse(usersListStr);

          // Find user matching email and check password
          const foundUser = usersList.find(
            (u: any) => u.email.toLowerCase() === email.toLowerCase()
          );

          if (!foundUser) {
            set({ error: 'Account does not exist' });
            return { success: false, error: 'Account does not exist' };
          }

          if (foundUser.password !== password) {
            set({ error: 'Invalid password' });
            return { success: false, error: 'Invalid password' };
          }

          // If role is requested (e.g. login role filters)
          if (role && foundUser.role !== role) {
            set({ error: `User is not registered as a ${role}` });
            return { success: false, error: `User is not registered as a ${role}` };
          }

          const userObj: User = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            avatar: foundUser.avatar,
            role: foundUser.role,
            phone: foundUser.phone,
            createdAt: foundUser.createdAt,
          };

          set({ user: userObj, isAuthenticated: true, error: null });
          return { success: true };
        } catch (e) {
          set({ error: 'Authentication failed' });
          return { success: false, error: 'Authentication failed' };
        } finally {
          get().setLoading(false);
        }
      },

      signUp: async (data) => {
        get().setLoading(true);
        set({ error: null });
        try {
          initializeUserDatabase();
          const usersListStr = localStorage.getItem('bb-users') || '[]';
          const usersList = JSON.parse(usersListStr);

          const emailExists = usersList.some(
            (u: any) => u.email.toLowerCase() === data.email.toLowerCase()
          );

          if (emailExists) {
            set({ error: 'Email already registered' });
            return { success: false, error: 'Email already registered' };
          }

          const newId = `${data.role}-${Date.now()}`;
          const newUserRecord = {
            id: newId,
            email: data.email,
            password: data.password || 'Test@123', // Default test password if not provided
            name: data.fullName,
            role: data.role,
            phone: data.phone,
            createdAt: new Date().toISOString().split('T')[0],
          };

          usersList.push(newUserRecord);
          localStorage.setItem('bb-users', JSON.stringify(usersList));

          const userObj: User = {
            id: newUserRecord.id,
            email: newUserRecord.email,
            name: newUserRecord.name,
            role: newUserRecord.role as any,
            phone: newUserRecord.phone,
            createdAt: newUserRecord.createdAt,
          };

          set({ user: userObj, isAuthenticated: true, error: null });
          return { success: true };
        } catch (e) {
          set({ error: 'Sign up failed' });
          return { success: false, error: 'Sign up failed' };
        } finally {
          get().setLoading(false);
        }
      },

      signInWithGoogle: async () => {
        get().setLoading(true);
        try {
          // Simulate Google OAuth
          const googleUser: User = {
            id: 'google-user-' + Date.now(),
            email: 'google.visitor@gmail.com',
            name: 'Google Guest',
            role: 'customer',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
            createdAt: new Date().toISOString().split('T')[0],
          };

          // Save to LocalStorage db list if not existing
          initializeUserDatabase();
          const usersListStr = localStorage.getItem('bb-users') || '[]';
          const usersList = JSON.parse(usersListStr);
          if (!usersList.some((u: any) => u.email === googleUser.email)) {
            usersList.push({
              ...googleUser,
              password: 'Google@123',
            });
            localStorage.setItem('bb-users', JSON.stringify(usersList));
          }

          set({ user: googleUser, isAuthenticated: true, error: null });
          return { success: true };
        } catch (e) {
          return { success: false, error: 'Google login failed' };
        } finally {
          get().setLoading(false);
        }
      },

      signOut: async () => {
        set({ user: null, isAuthenticated: false, error: null });
        // Clear cart
        try {
          useCartStore.getState().clearCart();
        } catch (e) {}
        // Clear wishlist
        try {
          useWishlistStore.getState().clearWishlist();
        } catch (e) {}
      },

      updateProfile: async (profileData) => {
        const currentUser = get().user;
        if (!currentUser) return { success: false };

        try {
          initializeUserDatabase();
          const usersListStr = localStorage.getItem('bb-users') || '[]';
          const usersList = JSON.parse(usersListStr);

          const updatedList = usersList.map((u: any) => {
            if (u.id === currentUser.id) {
              return {
                ...u,
                name: profileData.name || u.name,
                phone: profileData.phone || u.phone,
                avatar: profileData.avatar || u.avatar,
              };
            }
            return u;
          });

          localStorage.setItem('bb-users', JSON.stringify(updatedList));

          const updatedUser: User = {
            ...currentUser,
            name: profileData.name || currentUser.name,
            phone: profileData.phone || currentUser.phone,
            avatar: profileData.avatar || currentUser.avatar,
          };

          set({ user: updatedUser });
          return { success: true };
        } catch (e) {
          return { success: false };
        }
      },

      resetPassword: async (email) => {
        // Mock password reset
        return { success: true };
      },
    }),
    {
      name: 'bharat-bazaar-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
export default useAuthStore;
