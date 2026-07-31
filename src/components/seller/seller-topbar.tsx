'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronDown, ExternalLink, Settings, LogOut, User, BarChart3 } from 'lucide-react';
import { useSellerStore } from '@/lib/store/seller-store';
import { toast } from 'sonner';

const TIER_BADGE: Record<string, string> = {
  bronze: '🥉 Bronze',
  silver: '🥈 Silver',
  gold: '🥇 Gold',
  platinum: '💎 Platinum',
};

export function SellerTopbar() {
  const router = useRouter();
  const { seller, logout, unreadNotifCount, orders, notifications } = useSellerStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    router.push('/seller-login');
  };

  const todayOrders = orders.filter(o => {
    const d = new Date(o.placedAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const unread = unreadNotifCount();

  if (!seller) return null;

  return (
    <header className="h-16 bg-white border-b border-[#F0EDE8] fixed top-0 left-[260px] right-0 z-20 flex items-center px-6 gap-4">
      {/* Shop name */}
      <div className="flex items-center gap-2 mr-auto">
        <div className="h-5 w-px bg-[#F0EDE8]" />
        <span className="text-sm font-bold text-[#1A1A1A] truncate max-w-[200px]">{seller.shopName}</span>
        {/* Status badge */}
        {seller.status === 'approved' ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Shop Live
          </span>
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            {seller.status}
          </span>
        )}
      </div>

      {/* Today stats */}
      <div className="hidden lg:flex items-center gap-1 bg-[#FFF7ED] rounded-xl px-3 py-1.5 border border-orange-100">
        <BarChart3 size={13} className="text-[#FF7A00]" />
        <span className="text-[11px] font-medium text-[#FF7A00]">
          Today: <strong>{todayOrders.length} orders</strong>
          {todayRevenue > 0 && <> / <strong>₹{todayRevenue.toLocaleString('en-IN')}</strong></>}
        </span>
      </div>

      {/* Notifications */}
      <Link
        href="/seller-notifications"
        className="relative w-9 h-9 rounded-xl border border-[#F0EDE8] flex items-center justify-center text-[#9B8F84] hover:bg-[#FFF7ED] hover:text-[#FF7A00] hover:border-orange-200 transition-all"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF4500] text-white text-[9px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Link>

      {/* Avatar dropdown */}
      <div ref={dropRef} className="relative">
        <button
          onClick={() => setDropdownOpen(v => !v)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#F0EDE8] hover:bg-[#FFF7ED] transition-all"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white text-xs font-bold">
            {seller.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[12px] font-bold text-[#1A1A1A] leading-none">{seller.displayName}</p>
            <p className="text-[10px] text-[#9B8F84]">{TIER_BADGE[seller.tier]}</p>
          </div>
          <ChevronDown size={14} className={`text-[#9B8F84] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-[#F0EDE8] overflow-hidden z-50"
            >
              <div className="p-3 bg-[#FFF7ED] border-b border-orange-100">
                <p className="text-[13px] font-bold text-[#1A1A1A]">{seller.shopName}</p>
                <p className="text-[11px] text-[#9B8F84] font-mono">{seller.sellerId}</p>
              </div>
              <div className="p-2 space-y-0.5">
                <Link href="/seller-profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#4A4540] hover:bg-[#FFF7ED] hover:text-[#FF7A00] transition-all">
                  <User size={15} /> Profile & KYC
                </Link>
                <Link href="/seller-settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#4A4540] hover:bg-[#FFF7ED] hover:text-[#FF7A00] transition-all">
                  <Settings size={15} /> Settings
                </Link>
                <a href="/" target="_blank" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#4A4540] hover:bg-[#FFF7ED] hover:text-[#FF7A00] transition-all">
                  <ExternalLink size={15} /> View Storefront
                </a>
              </div>
              <div className="p-2 border-t border-[#F0EDE8]">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 w-full transition-all"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
