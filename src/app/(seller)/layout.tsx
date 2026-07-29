'use client';

import { Navbar } from '@/components/layout/navbar/navbar';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="seller">
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
        <Navbar />
        {children}
      </div>
    </ProtectedRoute>
  );
}
