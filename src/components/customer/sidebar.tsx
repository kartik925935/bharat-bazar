'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Heart, User, MapPin, Wallet,
  Star, RotateCcw, Bell, Settings, HelpCircle, LogOut,
  ChevronRight, Home,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useNotificationStore } from '@/lib/store/notification-store';
import { mockOrders } from '@/lib/mock/orders';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';
import { Navbar } from '@/components/layout/navbar/navbar';

const NAV_GROUPS = [
  {
    label: 'My Account',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard',    href: '/dashboard' },
      { icon: Package,         label: 'My Orders',    href: '/orders' },
      { icon: Heart,           label: 'Wishlist',     href: '/wishlist' },
      { icon: User,            label: 'My Profile',   href: '/profile' },
    ],
  },
  {
    label: 'Shopping',
    items: [
      { icon: MapPin,  label: 'Addresses',      href: '/addresses' },
      { icon: Wallet,  label: 'Wallet & Credits', href: '/wallet' },
      { icon: Star,    label: 'My Reviews',     href: '/my-reviews' },
    ],
  },
  {
    label: 'Support',
    items: [
      { icon: RotateCcw, label: 'Returns & Refunds', href: '/returns',       badge: 'returns' },
      { icon: Bell,      label: 'Notifications',     href: '/notifications',  badge: 'notif' },
      { icon: Settings,  label: 'Settings',          href: '/settings' },
      { icon: HelpCircle, label: 'Help Center',       href: '/help' },
    ],
  },
];

const BOTTOM_TABS = [
  { icon: Home,    label: 'Home',    href: '/dashboard' },
  { icon: Package, label: 'Orders',  href: '/orders',       badge: 'orders' },
  { icon: Heart,   label: 'Saved',   href: '/wishlist' },
  { icon: Bell,    label: 'Alerts',  href: '/notifications', badge: 'notif' },
  { icon: User,    label: 'Profile', href: '/profile' },
];

function ProfileCompletion({ user }: { user: { name: string; email: string; phone?: string; avatar?: string; createdAt: string } }) {
  // Calculate mock completion %
  let pct = 40;
  if (user.name) pct += 20;
  if (user.email) pct += 20;
  if (user.phone) pct += 10;
  if (user.avatar) pct += 10;
  pct = Math.min(100, pct);

  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="p-4 border-b border-[#E8E4DE]">
      <Link href="/profile" className="block group">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#FF7A00]/20" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#22C55E] border-2 border-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#1A0A00] truncate group-hover:text-[#FF7A00] transition-colors">
              {user.name}
            </p>
            <p className="text-[11px] text-[#8C7B6E] truncate">{user.email}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">🥇 Gold Member</span>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8C7B6E]">Profile {pct}% complete</span>
            <span className="text-[11px] font-semibold text-[#FF7A00]">Complete →</span>
          </div>
          <div className="h-1.5 bg-[#F0EDE8] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF4500]"
            />
          </div>
        </div>
      </Link>
    </div>
  );
}

function NavItem({
  icon: Icon, label, href, badge, isActive, notifCount, ordersCount,
}: {
  icon: React.ElementType; label: string; href: string; badge?: string;
  isActive: boolean; notifCount?: number; ordersCount?: number;
}) {
  const count = badge === 'notif' ? notifCount : badge === 'orders' ? ordersCount : 0;

  return (
    <Link href={href}>
      <motion.div
        className={cn(
          'relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors',
          isActive
            ? 'bg-[#FFF3E8] text-[#FF7A00]'
            : 'text-[#4A3728] hover:bg-[#FFF7ED] hover:text-[#FF7A00]'
        )}
      >
        {isActive && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[#FF7A00]"
          />
        )}
        <Icon size={18} className={cn('shrink-0', isActive ? 'text-[#FF7A00]' : 'text-[#8C7B6E]')} />
        <span className={cn('text-sm flex-1', isActive ? 'font-semibold' : 'font-medium')}>{label}</span>
        {count && count > 0 ? (
          <span className="min-w-[20px] h-5 rounded-full bg-[#FF7A00] text-white text-[10px] font-bold flex items-center justify-center px-1">
            {count > 9 ? '9+' : count}
          </span>
        ) : !isActive ? (
          <ChevronRight size={14} className="text-[#C8C4BE] group-hover:text-[#FF7A00]" />
        ) : null}
      </motion.div>
    </Link>
  );
}

export function CustomerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const activeOrders = mockOrders.filter((o) =>
    ['confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery'].includes(o.status)
  ).length;

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out. Come back soon! 🙏');
    router.replace('/');
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <ProfileCompletion user={user} />

      <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-bold text-[#B5A99A] uppercase tracking-widest px-3 mb-1">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item, idx) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <NavItem
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    badge={(item as Record<string, string>).badge}
                    isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                    notifCount={unreadCount}
                    ordersCount={activeOrders}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="p-3 border-t border-[#E8E4DE]">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
        <p className="text-center text-[10px] text-[#C8C4BE] mt-2">Bharat Bazaar v2.0</p>
      </div>
    </div>
  );
}

export function MobileBottomTabs() {
  const pathname = usePathname();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const activeOrders = mockOrders.filter((o) =>
    ['confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery'].includes(o.status)
  ).length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] lg:hidden bg-white border-t border-[#E8E4DE] safe-area-pb">
      <div className="flex items-center justify-around px-2 pt-2 pb-3">
        {BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          const count = tab.badge === 'notif' ? unreadCount : tab.badge === 'orders' ? activeOrders : 0;

          return (
            <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-1 min-w-[56px] relative cursor-pointer">
              {isActive && (
                <motion.div
                  layoutId="bottom-tab-dot"
                  className="absolute -top-2 w-6 h-1 rounded-full bg-[#FF7A00]"
                />
              )}
              <div className="relative">
                <Icon
                  size={22}
                  className={cn(
                    'transition-colors',
                    isActive ? 'text-[#FF7A00]' : 'text-[#8C7B6E]'
                  )}
                />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </div>
              <span className={cn('text-[10px] font-semibold', isActive ? 'text-[#FF7A00]' : 'text-[#8C7B6E]')}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
