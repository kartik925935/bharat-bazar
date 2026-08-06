'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Store, Package, PackagePlus, ClipboardList,
  ShoppingCart, RotateCcw, Star, Tag, Coins, Landmark,
  Bell, Settings, UserCircle, ChevronRight, LogOut,
  TrendingUp, BadgeCheck, AlertCircle, Zap, Pen
} from 'lucide-react';
import { useSellerStore } from '@/lib/store/seller-store';
import { toast } from 'sonner';

const TIER_COLORS = {
  bronze: 'text-amber-600 bg-amber-50 border-amber-200',
  silver: 'text-slate-500 bg-slate-50 border-slate-200',
  gold: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  platinum: 'text-purple-600 bg-purple-50 border-purple-200',
} as const;

const TIER_LABELS = { bronze: '🥉 Bronze', silver: '🥈 Silver', gold: '🥇 Gold', platinum: '💎 Platinum' } as const;

const navGroups = [
  {
    label: 'MAIN',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/seller-dashboard', badge: null },
      { icon: Store, label: 'My Shop', href: '/seller-shop', badge: null },
    ],
  },
  {
    label: 'CATALOG',
    items: [
      { icon: Package, label: 'Products', href: '/seller-products', badge: 'products' },
      { icon: PackagePlus, label: 'Add Product', href: '/seller-products/add', badge: null },
      { icon: ClipboardList, label: 'Inventory', href: '/seller-inventory', badge: null },
    ],
  },
  {
    label: 'SALES',
    items: [
      { icon: ShoppingCart, label: 'Orders', href: '/seller-orders', badge: 'orders' },
      { icon: RotateCcw, label: 'Returns', href: '/seller-returns', badge: null },
      { icon: Star, label: 'Reviews', href: '/seller-reviews', badge: null },
    ],
  },
  {
    label: 'MARKETING',
    items: [
      { icon: Tag, label: 'Coupons', href: '/seller-coupons', badge: null },
      { icon: Pen, label: 'Write Blog', href: '/seller-blog/create', badge: null },
    ],
  },
  {
    label: 'FINANCE',
    items: [
      { icon: Coins, label: 'Earnings & Settlements', href: '/seller-earnings', badge: null },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { icon: Bell, label: 'Notifications', href: '/seller-notifications', badge: 'notifications' },
      { icon: Settings, label: 'Settings', href: '/seller-settings', badge: null },
      { icon: UserCircle, label: 'Profile & KYC', href: '/seller-profile', badge: null },
    ],
  },
];

export function SellerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { seller, logout, unreadNotifCount, pendingOrdersCount, pendingProductsCount } = useSellerStore();

  const getBadge = (key: string | null) => {
    if (!key) return 0;
    if (key === 'notifications') return unreadNotifCount();
    if (key === 'orders') return pendingOrdersCount();
    if (key === 'products') return pendingProductsCount();
    return 0;
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/seller-login');
  };

  if (!seller) return null;

  const hasOrders = seller.totalOrders > 0;
  const orderCompletion = hasOrders ? 100 - seller.cancellationRate : 0;
  const returnRateValue = hasOrders ? 100 - seller.returnRate : 0;

  const score = Math.round(
    (orderCompletion / 100) * 30 +
    (seller.rating / 5) * 25 +
    (seller.onTimeDispatchRate / 100) * 20 +
    (returnRateValue / 100) * 15 +
    (seller.responseRate / 100) * 10
  ) || 0;
  const tier = score >= 90 ? 'platinum' : score >= 70 ? 'gold' : score >= 50 ? 'silver' : 'bronze';

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-[#F0EDE8] flex flex-col fixed top-0 left-0 z-30">
      {/* Brand */}
      <div className="px-4 pt-4 pb-3 border-b border-[#F0EDE8] flex-shrink-0">
        <Link href="/seller-dashboard" className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white font-black text-xs shadow-lg shadow-orange-500/20">
            BB
          </div>
          <div>
            <span className="font-black text-[13px] text-[#1A1A1A]">Bharat Bazaar</span>
            <p className="text-[10px] text-[#9B8F84] font-medium">Seller Portal</p>
          </div>
        </Link>

        {/* Shop card */}
        <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FFF3E0] rounded-2xl p-3 border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
              {seller.shopName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-[#1A1A1A] truncate">{seller.shopName}</p>
              <p className="text-[10px] text-[#9B8F84] font-mono">{seller.sellerId}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TIER_COLORS[tier]}`}>
              {TIER_LABELS[tier]}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {seller.status === 'approved' ? 'Live' : seller.status}
            </div>
          </div>

          {/* Performance bar */}
          <div>
            <div className="flex justify-between text-[10px] text-[#9B8F84] mb-1">
              <span>Performance</span>
              <span className="font-bold text-[#1A1A1A]">{score}/100</span>
            </div>
            <div className="h-1.5 bg-[#F0EDE8] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF4500]"
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="text-[9px] font-black text-[#C4B8AF] tracking-widest mb-1.5 px-2">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = pathname === item.href || (item.href !== '/seller-dashboard' && pathname.startsWith(item.href));
                const badge = getBadge(item.badge);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white shadow-md shadow-orange-500/20'
                        : 'text-[#4A4540] hover:bg-[#FFF7ED] hover:text-[#FF7A00]'
                    }`}
                  >
                    <item.icon size={16} className={isActive ? 'text-white' : 'text-[#9B8F84] group-hover:text-[#FF7A00]'} />
                    <span className="flex-1">{item.label}</span>
                    {badge > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                        isActive ? 'bg-white text-[#FF7A00]' : 'bg-[#FF4500] text-white'
                      }`}>
                        {badge}
                      </span>
                    )}
                    {isActive && <ChevronRight size={12} className="text-white/70" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[#F0EDE8]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all duration-150"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
