'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  LayoutDashboard, Users, ShoppingBag, Package, CreditCard, ShieldCheck, 
  Menu, ChevronLeft, LogOut, Settings, BarChart2, Tag, Truck, RefreshCw 
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuthStore } from '@/lib/store/auth-store';

const adminLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin-dashboard' },
  { label: 'Sellers Queue', icon: ShoppingBag, href: '/admin-sellers', badge: 3 },
  { label: 'Product Moderation', icon: Package, href: '/admin-products', badge: 12 },
  { label: 'KYC Verification', icon: ShieldCheck, href: '/admin-kyc' },
  { label: 'Orders Control', icon: CreditCard, href: '/admin-orders' },
  { label: 'Users Base', icon: Users, href: '/admin-users' },
  { label: 'Returns & Refunds', icon: RefreshCw, href: '/admin-returns' },
  { label: 'Delivery Logistics', icon: Truck, href: '/admin-delivery' },
  { label: 'Platform Coupons', icon: Tag, href: '/admin-coupons' },
  { label: 'Insights & Reports', icon: BarChart2, href: '/admin-reports' },
  { label: 'System Settings', icon: Settings, href: '/admin-settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen flex bg-[#FAFAF8]">
        {/* Sidebar */}
        <aside 
          className={`bg-[#1C1B14] text-white flex flex-col p-4 shrink-0 transition-all duration-300 ${
            collapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="flex items-center justify-between mb-8 px-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FF4500] text-white font-black text-xs flex items-center justify-center shrink-0">
                BB
              </div>
              {!collapsed && (
                <span className="font-black text-sm bg-gradient-to-r from-[#FF7A00] to-[#FF4500] bg-clip-text text-transparent transition-all">
                  Admin Central
                </span>
              )}
            </Link>
            <button 
              onClick={() => setCollapsed(!collapsed)} 
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white"
            >
              <ChevronLeft size={16} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <link.icon size={16} className="shrink-0" />
                  {!collapsed && <span className="flex-1">{link.label}</span>}
                  {!collapsed && link.badge && (
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-[9px] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
            >
              <LogOut size={16} className="shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden min-w-0">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
