'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, TrendingUp, ShieldCheck, Users, Store, UserCheck,
  Package, Tags, ShoppingCart, CreditCard, Truck, CheckCircle2,
  Percent, Landmark, FileText, Ticket, Gift, Bell, AlertTriangle,
  FileSpreadsheet, Settings, Search, Command, ChevronLeft, ChevronRight,
  LogOut, Lock, User, RefreshCw, X, ArrowUpRight, Check, Sparkles
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/protected-route';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';
import { MOCK_ALERTS, MOCK_LAYOUT_LIVE_STATS } from '@/lib/mock/super-admin';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: { text: string; color: 'orange' | 'red' };
}

interface NavSection {
  header: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    header: 'OVERVIEW',
    items: [
      { name: 'Dashboard', href: '/super-admin/dashboard', icon: LayoutDashboard },
      { name: 'Analytics Hub', href: '/super-admin/analytics', icon: TrendingUp },
    ],
  },
  {
    header: 'USER MANAGEMENT',
    items: [
      { name: 'Admin Management', href: '/super-admin/admins', icon: ShieldCheck },
      { name: 'Roles & Permissions', href: '/super-admin/roles', icon: UserCheck },
      { name: 'Sellers', href: '/super-admin/sellers', icon: Store, badge: { text: '12 pending', color: 'orange' } },
      { name: 'Customers', href: '/super-admin/customers', icon: Users },
    ],
  },
  {
    header: 'CATALOG',
    items: [
      { name: 'Products', href: '/super-admin/products', icon: Package, badge: { text: '5 flagged', color: 'red' } },
      { name: 'Categories', href: '/super-admin/categories', icon: Tags },
    ],
  },
  {
    header: 'OPERATIONS',
    items: [
      { name: 'Orders', href: '/super-admin/orders', icon: ShoppingCart },
      { name: 'Payments', href: '/super-admin/payments', icon: CreditCard },
      { name: 'Delivery', href: '/super-admin/delivery', icon: Truck },
      { name: 'KYC Verification', href: '/super-admin/kyc', icon: CheckCircle2, badge: { text: '8 pending', color: 'orange' } },
    ],
  },
  {
    header: 'FINANCIALS',
    items: [
      { name: 'Commissions', href: '/super-admin/commissions', icon: Percent },
      { name: 'Settlements', href: '/super-admin/settlements', icon: Landmark },
      { name: 'Reports', href: '/super-admin/reports', icon: FileText },
    ],
  },
  {
    header: 'MARKETING',
    items: [
      { name: 'Coupons', href: '/super-admin/coupons', icon: Ticket },
      { name: 'Offers & Campaigns', href: '/super-admin/offers', icon: Gift },
      { name: 'Broadcast Notifications', href: '/super-admin/notifications', icon: Bell },
    ],
  },
  {
    header: 'COMPLIANCE',
    items: [
      { name: 'Complaints', href: '/super-admin/complaints', icon: AlertTriangle, badge: { text: '3 urgent', color: 'red' } },
      { name: 'Audit Logs', href: '/super-admin/audit-logs', icon: FileSpreadsheet },
    ],
  },
  {
    header: 'SYSTEM',
    items: [
      { name: 'Platform Settings', href: '/super-admin/platform-settings', icon: Settings },
    ],
  },
];

// Alerts imported from mock data — see src/lib/mock/super-admin.ts

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const [collapsed, setCollapsed]       = useState(false);
  const [cmdOpen, setCmdOpen]           = useState(false);
  const [alertsOpen, setAlertsOpen]     = useState(false);
  const [profileOpen, setProfileOpen]   = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');

  // Live stats state — initial values from mock data
  const [liveStats, setLiveStats] = useState({ ordersToday: MOCK_LAYOUT_LIVE_STATS.ordersToday, gmv: MOCK_LAYOUT_LIVE_STATS.gmv, activeUsers: MOCK_LAYOUT_LIVE_STATS.activeUsers });
  const [flashStats, setFlashStats] = useState(false);

  // Keyboard shortcut Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        ordersToday: prev.ordersToday + Math.floor(Math.random() * 3),
        gmv: prev.gmv + Math.floor(Math.random() * 1500),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 9 - 4),
      }));
      setFlashStats(true);
      setTimeout(() => setFlashStats(false), 1200);
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    signOut();
    toast.success('Super Admin signed out safely');
    router.push('/login');
  };

  // Breadcrumbs generator
  const pathParts = pathname.split('/').filter(Boolean);
  const currentTitle = pathParts[1]
    ? pathParts[1].replace('-', ' ').toUpperCase()
    : 'DASHBOARD';

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="super-admin font-body text-sm min-h-screen bg-[#0A0A0F] text-[#F0F0F8] antialiased">
        {/* ─── TOP BAR (64px, Fixed) ─── */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-[#1E1E2E] z-50 flex items-center justify-between px-4 sm:px-6">
          {/* Left section: Logo & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <Link href="/super-admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white font-black text-xs shadow-[0_0_16px_rgba(255,122,0,0.4)]">
                BB
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-black text-[#F0F0F8] tracking-tight leading-none">Bharat Bazaar</p>
                <p className="text-[10px] font-bold text-[#FF7A00] uppercase tracking-widest mt-0.5">Super Admin</p>
              </div>
            </Link>

            <div className="h-5 w-[1px] bg-[#1E1E2E] mx-1 hidden sm:block" />

            <div className="hidden md:flex items-center gap-1.5 text-xs text-[#9898B0]">
              <span>Platform</span>
              <span>/</span>
              <span className="text-[#F0F0F8] font-bold capitalize">{currentTitle.toLowerCase()}</span>
            </div>
          </div>

          {/* Center section: Live Stats Bar (Desktop) */}
          <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-full bg-[#111118] border border-[#1E1E2E]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#22C55E]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-sa-pulse" />
              <span>LIVE</span>
            </div>
            <div className="h-3 w-[1px] bg-[#1E1E2E]" />
            <div className="text-xs">
              <span className="text-[#5C5C78]">Orders Today: </span>
              <span className={`font-mono font-bold transition-colors ${flashStats ? 'text-[#FF7A00]' : 'text-[#F0F0F8]'}`}>
                {liveStats.ordersToday}
              </span>
            </div>
            <div className="h-3 w-[1px] bg-[#1E1E2E]" />
            <div className="text-xs">
              <span className="text-[#5C5C78]">GMV: </span>
              <span className={`font-mono font-bold transition-colors ${flashStats ? 'text-[#FF7A00]' : 'text-[#F0F0F8]'}`}>
                ₹{(liveStats.gmv / 100000).toFixed(2)}L
              </span>
            </div>
            <div className="h-3 w-[1px] bg-[#1E1E2E]" />
            <div className="text-xs">
              <span className="text-[#5C5C78]">Active Users: </span>
              <span className="font-mono font-bold text-[#F0F0F8]">{liveStats.activeUsers}</span>
            </div>
          </div>

          {/* Right section: Global Search, Quick Actions, Alerts, Profile */}
          <div className="flex items-center gap-2.5">
            {/* Quick Actions (Cmd+K Button) */}
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111118] border border-[#1E1E2E] text-xs text-[#9898B0] hover:text-[#F0F0F8] hover:border-[#FF7A00]/40 transition-all cursor-pointer"
            >
              <Command size={14} className="text-[#FF7A00]" />
              <span className="hidden sm:inline">Command Palette</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#1C1C28] text-[10px] text-[#5C5C78]">⌘K</kbd>
            </button>

            {/* Alert Bell */}
            <div className="relative">
              <button
                onClick={() => setAlertsOpen((prev) => !prev)}
                className="relative p-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#F0F0F8] hover:border-[#FF7A00]/40 transition-all cursor-pointer"
              >
                <Bell size={16} />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  5
                </span>
              </button>

              {/* Alert Panel Slide-down */}
              <AnimatePresence>
                {alertsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#111118] border border-[#1E1E2E] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.8)] overflow-hidden z-50"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E2E] bg-[#16161F]">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={15} className="text-[#FF7A00]" />
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#F0F0F8]">Critical Alerts</h4>
                      </div>
                      <button
                        onClick={() => toast.success('All alerts marked as read')}
                        className="text-[11px] font-bold text-[#FF7A00] hover:underline cursor-pointer"
                      >
                        Mark All Read
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-[#16161F]">
                      {MOCK_ALERTS.map((alert: any) => (
                        <div
                          key={alert.id}
                          className="p-3.5 hover:bg-[#1C1C28] transition-colors cursor-pointer flex items-start gap-3 border-l-2"
                          style={{
                            borderLeftColor:
                              alert.type === 'critical' ? '#EF4444' : alert.type === 'warning' ? '#F59E0B' : alert.type === 'info' ? '#3B82F6' : '#22C55E',
                          }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-1">
                              <p className="text-xs font-bold text-[#F0F0F8] truncate">{alert.title}</p>
                              <span className="text-[10px] text-[#5C5C78] shrink-0">{alert.time}</span>
                            </div>
                            <p className="text-[11px] text-[#9898B0] mt-0.5 line-clamp-2">{alert.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/super-admin/audit-logs"
                      onClick={() => setAlertsOpen(false)}
                      className="block text-center py-2.5 bg-[#16161F] text-xs font-bold text-[#FF7A00] hover:bg-[#1C1C28] transition-colors"
                    >
                      View System Audit Trail →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Super Admin Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#111118] transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4A017] to-[#F5C842] text-[#0A0A0F] font-black text-xs flex items-center justify-center shadow-[0_0_12px_rgba(212,160,23,0.3)]">
                  SA
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-60 bg-[#111118] border border-[#1E1E2E] rounded-2xl p-3 shadow-2xl z-50 space-y-2"
                  >
                    <div className="px-2 py-1.5 border-b border-[#1E1E2E]">
                      <p className="text-xs font-black text-[#F0F0F8]">{user?.name || 'Super Administrator'}</p>
                      <p className="text-[11px] text-[#5C5C78] truncate">{user?.email || 'super-admin@bharatbazaar.com'}</p>
                      <span className="inline-block text-[9px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full mt-1.5">
                        👑 Super Admin Master Key
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <Link
                        href="/super-admin/platform-settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-[#9898B0] hover:text-[#F0F0F8] hover:bg-[#1C1C28] transition-colors"
                      >
                        <Settings size={14} /> Platform Settings
                      </Link>
                      <Link
                        href="/super-admin/audit-logs"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-[#9898B0] hover:text-[#F0F0F8] hover:bg-[#1C1C28] transition-colors"
                      >
                        <FileSpreadsheet size={14} /> Activity Logs
                      </Link>
                    </div>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-xs font-bold cursor-pointer"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ─── SIDEBAR (280px / 64px, Fixed) ─── */}
        <aside
          className={`fixed left-0 top-16 bottom-0 bg-[#111118] border-r border-[#1E1E2E] transition-all duration-300 z-40 flex flex-col ${
            collapsed ? 'w-16' : 'w-70'
          }`}
        >
          {/* Identity Card */}
          {!collapsed ? (
            <div className="p-4 border-b border-[#1E1E2E] bg-[#16161F]/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FF4500] text-white font-black flex items-center justify-center shadow-lg">
                  SA
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-[#F0F0F8] truncate">{user?.name || 'Super Admin'}</p>
                  <p className="text-[10px] font-semibold text-[#22C55E] flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                    Platform Master Control
                  </p>
                </div>
              </div>
              <div className="bg-[#0A0A0F] rounded-lg p-2 border border-[#1E1E2E] text-[10px]">
                <div className="flex justify-between text-[#9898B0] mb-1">
                  <span>System Health:</span>
                  <span className="text-[#22C55E] font-bold">🟢 99.97% Uptime</span>
                </div>
                <div className="h-1 bg-[#1E1E2E] rounded-full overflow-hidden">
                  <div className="h-full bg-[#22C55E] rounded-full w-[99.97%]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 border-b border-[#1E1E2E] flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF7A00] to-[#FF4500] text-white font-black text-xs flex items-center justify-center">
                SA
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-3 space-y-5">
            {NAV_SECTIONS.map((section) => (
              <div key={section.header}>
                {!collapsed && (
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#5C5C78] px-2 mb-2">
                    {section.header}
                  </p>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/super-admin/dashboard' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        title={collapsed ? item.name : undefined}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                          isActive
                            ? 'bg-[#1C1C28] text-[#FF7A00] border-l-2 border-[#FF7A00] shadow-[0_0_12px_rgba(255,122,0,0.15)]'
                            : 'text-[#9898B0] hover:bg-[#1C1C28] hover:text-[#F0F0F8]'
                        }`}
                      >
                        <Icon size={17} className={isActive ? 'text-[#FF7A00]' : 'text-[#5C5C78] group-hover:text-[#FF7A00] transition-colors'} />
                        {!collapsed && <span className="flex-1 truncate">{item.name}</span>}

                        {!collapsed && item.badge && (
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                              item.badge.color === 'red'
                                ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 animate-pulse'
                                : 'bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30'
                            }`}
                          >
                            {item.badge.text}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer Collapse Toggle */}
          <div className="p-3 border-t border-[#1E1E2E] flex items-center justify-between">
            {!collapsed && <span className="text-[10px] text-[#5C5C78]">v2.0.1 • Build #247</span>}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-xl bg-[#16161F] text-[#9898B0] hover:text-[#F0F0F8] hover:bg-[#1C1C28] transition-colors cursor-pointer mx-auto"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </aside>

        {/* ─── MAIN CONTENT AREA ─── */}
        <main
          className={`pt-16 transition-all duration-300 min-h-screen ${
            collapsed ? 'pl-16' : 'pl-70'
          }`}
        >
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>

        {/* ─── COMMAND PALETTE MODAL (Cmd+K) ─── */}
        <AnimatePresence>
          {cmdOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 p-4"
              onClick={() => setCmdOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: -20 }}
                className="bg-[#111118] border border-[#1E1E2E] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Search Bar */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1E1E2E]">
                  <Search size={18} className="text-[#FF7A00]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type a command or search platform entities..."
                    className="w-full text-sm font-medium bg-transparent text-[#F0F0F8] outline-none placeholder-[#5C5C78]"
                    autoFocus
                  />
                  <kbd className="px-2 py-0.5 rounded bg-[#1C1C28] text-[10px] text-[#5C5C78]">ESC</kbd>
                </div>

                <div className="p-4 max-h-96 overflow-y-auto space-y-4 text-xs">
                  {/* Quick Actions */}
                  <div>
                    <p className="text-[10px] font-black uppercase text-[#5C5C78] tracking-widest mb-2 px-2">Quick Actions</p>
                    <div className="space-y-1">
                      {[
                        { title: 'Approve pending sellers (12 waiting)', href: '/super-admin/sellers', action: () => router.push('/super-admin/sellers') },
                        { title: 'Review flagged products (5 flagged)', href: '/super-admin/products', action: () => router.push('/super-admin/products') },
                        { title: 'Process settlements (₹2.4L due)', href: '/super-admin/settlements', action: () => router.push('/super-admin/settlements') },
                        { title: 'Verify pending KYC documents (8 pending)', href: '/super-admin/kyc', action: () => router.push('/super-admin/kyc') },
                        { title: 'Broadcast push notification', href: '/super-admin/notifications', action: () => router.push('/super-admin/notifications') },
                      ].map((item) => (
                        <button
                          key={item.title}
                          onClick={() => {
                            item.action();
                            setCmdOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#1C1C28] text-[#9898B0] hover:text-[#FF7A00] transition-colors cursor-pointer text-left"
                        >
                          <span className="font-semibold">{item.title}</span>
                          <ArrowUpRight size={14} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Navigation */}
                  <div>
                    <p className="text-[10px] font-black uppercase text-[#5C5C78] tracking-widest mb-2 px-2">Navigate To</p>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { title: 'Dashboard', href: '/super-admin/dashboard' },
                        { title: 'Analytics Hub', href: '/super-admin/analytics' },
                        { title: 'Seller Oversight', href: '/super-admin/sellers' },
                        { title: 'Platform Settings', href: '/super-admin/platform-settings' },
                      ].map((nav) => (
                        <button
                          key={nav.title}
                          onClick={() => {
                            router.push(nav.href);
                            setCmdOpen(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#1C1C28] text-[#9898B0] hover:text-[#F0F0F8] transition-colors text-left"
                        >
                          <Sparkles size={12} className="text-[#FF7A00]" />
                          <span>{nav.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
