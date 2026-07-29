'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);
  const [initDone, setInitDone] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      await initialize();
      // Short pleasant loader feel
      setTimeout(() => setInitDone(true), 600);
    };
    initAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bharat-bazaar-auth') {
        initialize();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initialize]);

  if (!initDone) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAFAF8]">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-[#E5E4DE] border-t-[#FF7A00] animate-spin absolute" />
          <span className="font-black text-2xl text-[#FF7A00] animate-pulse" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>BB</span>
        </div>
        <p className="text-sm font-semibold text-[#8C8B80] mt-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Loading Bharat Bazaar...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
export default AuthProvider;
