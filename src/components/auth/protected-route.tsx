'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import Spinner from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'seller' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to appropriate login page based on required role
        const targetLogin = requiredRole === 'seller' ? '/seller-login' : '/login';
        router.replace(`${targetLogin}?returnUrl=${encodeURIComponent(pathname)}`);
      } else if (user && requiredRole && user.role !== requiredRole) {
        // Authenticated but incorrect role. Send to correct dashboard
        if (user.role === 'seller') {
          router.replace('/seller-dashboard');
        } else if (user.role === 'admin') {
          router.replace('/admin-dashboard');
        } else {
          router.replace('/dashboard');
        }
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router, pathname]);

  if (isLoading || !isAuthenticated || (user && requiredRole && user.role !== requiredRole)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8]">
        <Spinner size="lg" />
        <p className="text-xs text-[#8C8B80] mt-4 font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Verifying security credentials...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
export default ProtectedRoute;
