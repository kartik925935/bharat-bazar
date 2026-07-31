'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
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
  fetchAndSetUser: (authUser: any) => Promise<void>;
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

      fetchAndSetUser: async (authUser) => {
        try {
          const supabase = createClient();

          // 1. Fetch profile from database
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, phone, avatar_url, created_at')
            .eq('id', authUser.id)
            .maybeSingle();

          if (profileError) {
            console.error('Error fetching user profile:', profileError.message);
          }

          // 2. Fetch role from user_roles database table
          const { data: userRoles, error: rolesError } = await supabase
            .from('user_roles')
            .select('roles(name)')
            .eq('user_id', authUser.id);

          if (rolesError) {
            console.error('Error fetching user roles:', rolesError.message);
          }

          let userRole: any = 'customer';
          if (userRoles && userRoles.length > 0) {
            const roleName = (userRoles[0] as any).roles?.name;
            if (roleName === 'delivery_partner') {
              userRole = 'delivery';
            } else if (roleName) {
              userRole = roleName;
            }
          }

          const userObj: User = {
            id: authUser.id,
            email: authUser.email!,
            name: profile?.full_name || authUser.user_metadata?.first_name || 'User',
            avatar: profile?.avatar_url,
            role: userRole,
            phone: profile?.phone,
            createdAt: profile?.created_at || authUser.created_at,
          };

          set({ user: userObj, isAuthenticated: true, error: null });
        } catch (err: any) {
          console.error('Failed to resolve authenticated user details:', err);
          set({ error: err.message || 'Failed to fetch user data' });
        }
      },

      initialize: async () => {
        get().setLoading(true);
        try {
          const supabase = createClient();

          // 1. Check if we already have an active Supabase session
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (session?.user) {
            await get().fetchAndSetUser(session.user);
          } else {
            set({ user: null, isAuthenticated: false });
          }

          // 2. Listen for auth changes and update state automatically
          supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (currentSession?.user) {
              await get().fetchAndSetUser(currentSession.user);
            } else {
              set({ user: null, isAuthenticated: false });
            }
          });
        } catch (e) {
          set({ error: 'Auth initialization failed', user: null, isAuthenticated: false });
        } finally {
          get().setLoading(false);
        }
      },

      signIn: async (email, password, role) => {
        get().setLoading(true);
        set({ error: null });
        try {
          const supabase = createClient();

          // 1. Sign in with password
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: email.toLowerCase().trim(),
            password,
          });

          if (signInError) {
            set({ error: signInError.message });
            return { success: false, error: signInError.message };
          }

          const authUser = signInData.user;
          if (!authUser) {
            set({ error: 'Sign in succeeded, but no user data was returned.' });
            return { success: false, error: 'Sign in succeeded, but no user data was returned.' };
          }

          // 2. Fetch full profile and role mapping details
          await get().fetchAndSetUser(authUser);

          const resolvedUser = get().user;

          // 3. Optional: Role filter check
          if (role && resolvedUser?.role !== role) {
            await supabase.auth.signOut();
            set({ user: null, isAuthenticated: false, error: `User is not registered as a ${role}` });
            return { success: false, error: `User is not registered as a ${role}` };
          }

          return { success: true };
        } catch (e: any) {
          set({ error: e.message || 'Authentication failed' });
          return { success: false, error: e.message || 'Authentication failed' };
        } finally {
          get().setLoading(false);
        }
      },

      signUp: async (data) => {
        get().setLoading(true);
        set({ error: null });
        try {
          const supabase = createClient();
          const dbRole = data.role;

          // 1. Create auth user in Supabase Auth
          const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: data.email.toLowerCase().trim(),
            password: data.password || 'Test@123',
            options: {
              data: {
                first_name: data.fullName.split(' ')[0],
                last_name: data.fullName.split(' ').slice(1).join(' ') || '',
                role: dbRole,
              },
            },
          });

          if (signUpError) {
            set({ error: signUpError.message });
            return { success: false, error: signUpError.message };
          }

          const authUser = authData.user;
          if (!authUser) {
            set({ error: 'Sign up succeeded, but no user data was returned.' });
            return { success: false, error: 'Sign up succeeded, but no user data was returned.' };
          }

          // 2. Create profile row in public.profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authUser.id,
              full_name: data.fullName,
              phone: data.phone,
              status: 'active',
            });

          if (profileError) {
            set({ error: profileError.message });
            return { success: false, error: profileError.message };
          }

          // 3. Query role record to get the role id
          const { data: roleRecord, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('name', dbRole)
            .maybeSingle();

          if (roleError || !roleRecord) {
            set({ error: `Failed to resolve role ID mapping for ${dbRole}` });
            return { success: false, error: `Failed to resolve role ID mapping for ${dbRole}` };
          }

          // 4. Assign role in public.user_roles table
          const { error: userRoleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: authUser.id,
              role_id: roleRecord.id,
            });

          if (userRoleError) {
            set({ error: userRoleError.message });
            return { success: false, error: userRoleError.message };
          }

          // Set user in state
          const userObj: User = {
            id: authUser.id,
            email: authUser.email!,
            name: data.fullName,
            role: data.role,
            phone: data.phone,
            createdAt: authUser.created_at,
          };

          set({ user: userObj, isAuthenticated: true, error: null });
          return { success: true };
        } catch (e: any) {
          set({ error: e.message || 'Sign up failed' });
          return { success: false, error: e.message || 'Sign up failed' };
        } finally {
          get().setLoading(false);
        }
      },

      signInWithGoogle: async () => {
        get().setLoading(true);
        try {
          const supabase = createClient();
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
              queryParams: {
                prompt: 'select_account',
              },
            },
          });

          if (error) throw error;
          return { success: true };
        } catch (e: any) {
          return { success: false, error: e.message || 'Google login failed' };
        } finally {
          get().setLoading(false);
        }
      },

      signOut: async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch (e) {
          console.error('Error during Supabase signout:', e);
        }

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
          const supabase = createClient();
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              full_name: profileData.name,
              phone: profileData.phone,
              avatar_url: profileData.avatar,
            })
            .eq('id', currentUser.id);

          if (profileError) throw profileError;

          const updatedUser: User = {
            ...currentUser,
            name: profileData.name || currentUser.name,
            phone: profileData.phone || currentUser.phone,
            avatar: profileData.avatar || currentUser.avatar,
          };

          set({ user: updatedUser });
          return { success: true };
        } catch (e) {
          console.error('Failed to update database profile:', e);
          return { success: false };
        }
      },

      resetPassword: async (email) => {
        try {
          const supabase = createClient();
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });
          if (error) throw error;
          return { success: true };
        } catch (e) {
          console.error('Failed to request password reset:', e);
          return { success: false };
        }
      },
    }),
    {
      name: 'bharat-bazaar-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
