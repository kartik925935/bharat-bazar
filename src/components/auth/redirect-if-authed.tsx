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

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
export default RedirectIfAuthed;
