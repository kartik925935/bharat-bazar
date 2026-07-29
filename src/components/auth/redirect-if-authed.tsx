'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import Spinner from '@/components/ui/spinner';

export function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === 'seller') {
        router.replace('/seller-dashboard');
      } else if (user.role === 'admin') {
        router.replace('/admin-dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Still loading auth state — don't flicker the login form
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-4 border-[#E5E4DE] border-t-[#FF7A00] animate-spin absolute" />
          <span className="font-black text-xl text-[#FF7A00]">BB</span>
        </div>
      </div>
    );
  }

  // Already authenticated — redirect in progress, show nothing
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

export default RedirectIfAuthed;
