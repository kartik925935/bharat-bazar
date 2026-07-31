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

  const hasCorrectRole = !requiredRole || (user && (user.role === requiredRole || (requiredRole === 'admin' && user.role === 'super_admin')));
  const shouldRedirectToLogin = !isLoading && !isAuthenticated;
  const shouldRedirectRole = !isLoading && isAuthenticated && user && requiredRole && !hasCorrectRole;

  useEffect(() => {
    if (shouldRedirectToLogin) {
      let targetLogin = '/login';
      if (requiredRole === 'seller') targetLogin = '/seller-login';
      if (requiredRole === 'admin') targetLogin = '/super-admin-login';
      router.replace(`${targetLogin}?returnUrl=${encodeURIComponent(pathname)}`);
    } else if (shouldRedirectRole) {
      if (user!.role === 'seller') {
        router.replace('/seller-dashboard');
      } else if (user!.role === 'admin') {
        router.replace('/super-admin/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [shouldRedirectToLogin, shouldRedirectRole, user, requiredRole, router, pathname]);

  // Show loading spinner while auth is being checked
  if (isLoading || shouldRedirectToLogin || shouldRedirectRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8]">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-[#E5E4DE] border-t-[#FF7A00] animate-spin absolute" />
          <span className="font-black text-2xl text-[#FF7A00]">BB</span>
        </div>
        <p className="text-xs text-[#8C8B80] mt-10 font-semibold">
          {shouldRedirectToLogin ? 'Redirecting to login…' : 'Verifying access…'}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
