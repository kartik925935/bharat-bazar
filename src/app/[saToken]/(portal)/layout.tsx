'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useSAAuthStore } from '@/lib/store/sa-auth-store';
import { SA_THEME } from '@/styles/super-admin-theme';
import { SessionBar } from '@/components/super-admin/layout/SessionBar';
import { Sidebar } from '@/components/super-admin/layout/Sidebar';
import { Topbar } from '@/components/super-admin/layout/Topbar';

export default function SuperAdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const saToken = params.saToken as string;
  const { isAuthenticated, user } = useSAAuthStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) {
      router.replace(`/${saToken}/secure-access`);
    }
  }, [isAuthenticated, router, saToken]);

  if (!isMounted || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: SA_THEME.bg.page }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: SA_THEME.gold[500], borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: SA_THEME.bg.page, color: SA_THEME.text.primary }}>
      <SessionBar />
      
      <div className="flex flex-1 pt-[32px] overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/80 lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
          user={user}
        />

        <div className="flex-1 flex flex-col min-w-0 h-[calc(100vh-32px)] overflow-hidden">
          <Topbar onOpenSidebar={() => setIsSidebarOpen(true)} user={user} />
          
          <main className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ backgroundColor: SA_THEME.bg.page }}>
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
