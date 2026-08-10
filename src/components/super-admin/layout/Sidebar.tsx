'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SA_THEME } from '@/styles/super-admin-theme';
import { SuperAdminUser } from '@/lib/store/sa-auth-store';
import {
  LayoutDashboard, Activity, BarChart3, FileSearch, 
  Users, Store, Truck, Shield, 
  Package, Tag, ShoppingCart, Globe, 
  CreditCard, RefreshCw, Banknote, Percent, 
  RotateCcw, Star, MessageSquare, HelpCircle, 
  Ticket, Zap, Bell, Image, 
  Settings, Key, Database, Webhook,
  ChevronLeft, Crown
} from 'lucide-react';
import { useSuperAdminStore } from '@/lib/store/super-admin-store';

const SUPER_ADMIN_NAV = [
  {
    section: "COMMAND CENTER",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "dashboard", badge: null },
      { icon: Activity, label: "Live Monitor", href: "live", badge: "LIVE" },
      { icon: BarChart3, label: "Analytics", href: "analytics", badge: null },
      { icon: FileSearch, label: "Audit Logs", href: "audit-logs", badge: null },
    ]
  },
  {
    section: "PEOPLE CONTROL",
    items: [
      { icon: Users, label: "Customers", href: "customers", badge: null },
      { icon: Store, label: "Sellers", href: "sellers", badge: 'dynamic' },
      { icon: Truck, label: "Delivery Fleet", href: "delivery-fleet", badge: null },
      { icon: Shield, label: "Admin Control", href: "admin-control", badge: 'dynamic' },
    ]
  },
  {
    section: "MARKETPLACE",
    items: [
      { icon: Package, label: "Products", href: "products", badge: 'dynamic' },
      { icon: Tag, label: "Categories", href: "categories", badge: null },
      { icon: ShoppingCart, label: "All Orders", href: "orders", badge: null },
      { icon: Globe, label: "Storefront", href: "storefront", badge: null },
    ]
  },
  {
    section: "FINANCIAL HUB",
    items: [
      { icon: CreditCard, label: "Payments", href: "payments", badge: null },
      { icon: RefreshCw, label: "Refunds", href: "refunds", badge: 'dynamic' },
      { icon: Banknote, label: "Settlements", href: "settlements", badge: 'dynamic' },
      { icon: Percent, label: "Commission", href: "commission", badge: null },
    ]
  },
  {
    section: "POST-PURCHASE",
    items: [
      { icon: RotateCcw, label: "Returns", href: "returns", badge: 'dynamic' },
      { icon: Star, label: "Reviews", href: "reviews", badge: 'dynamic' },
      { icon: MessageSquare, label: "Complaints", href: "complaints", badge: 'dynamic' },
      { icon: HelpCircle, label: "Support Tickets", href: "support", badge: 'dynamic' },
    ]
  },
  {
    section: "PROMOTIONS",
    items: [
      { icon: Ticket, label: "Coupons", href: "coupons", badge: null },
      { icon: Zap, label: "Offers & Sales", href: "offers", badge: null },
      { icon: Bell, label: "Notifications", href: "notifications", badge: 'dynamic' },
      { icon: Image, label: "Banners & Media", href: "banners", badge: null },
    ]
  },
  {
    section: "SYSTEM CONTROL",
    items: [
      { icon: Settings, label: "Platform Settings", href: "platform-settings", badge: null },
      { icon: Key, label: "Roles & Panels", href: "roles-panels", badge: 'dynamic' },
      { icon: Database, label: "Data Management", href: "data", badge: null },
      { icon: Shield, label: "Security Center", href: "security", badge: 'dynamic' },
      { icon: Webhook, label: "Integrations", href: "integrations", badge: null },
    ]
  },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  user: SuperAdminUser;
}

export function Sidebar({ isOpen, setIsOpen, user }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const saToken = params.saToken as string;
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Mock store connection for dynamic badges
  const mockDynamicCounts: Record<string, number> = {
    'sellers': 3,
    'admin-control': 2,
    'products': 14,
    'refunds': 5,
    'settlements': 2,
    'returns': 8,
    'complaints': 4,
    'support': 12,
  };

  const renderBadge = (badgeType: string | null, href: string) => {
    if (!badgeType) return null;
    
    if (badgeType === 'LIVE') {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {!isCollapsed && "LIVE"}
        </div>
      );
    }
    
    if (badgeType === 'dynamic') {
      const count = mockDynamicCounts[href] || 0;
      if (count === 0) return null;
      
      return (
        <div 
          className={cn(
            "flex items-center justify-center rounded-full font-medium text-[10px]",
            isCollapsed ? "absolute -top-1 -right-1 w-4 h-4 bg-[#F5C842] text-black" : "px-2 py-0.5 bg-[#F5C842]/10 text-[#F5C842] border border-[#F5C842]/20"
          )}
        >
          {count > 99 ? '99+' : count}
        </div>
      );
    }
    return null;
  };

  return (
    <aside
      className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 h-[calc(100vh-32px)] flex flex-col border-r transition-all duration-300 ease-in-out shrink-0",
        isCollapsed ? "w-[72px]" : "w-[280px]",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
      style={{ 
        backgroundColor: SA_THEME.bg.sidebar, 
        borderColor: SA_THEME.border.primary 
      }}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center shrink-0 px-4 border-b" style={{ borderColor: SA_THEME.border.primary }}>
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center w-full")}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 relative" style={{ backgroundColor: 'rgba(245, 200, 66, 0.1)' }}>
            <Crown className="w-4 h-4" style={{ color: SA_THEME.gold[500] }} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate" style={{ background: SA_THEME.gold.gradient, WebkitBackgroundClip: 'text', color: 'transparent' }}>
                BHARAT BAZAAR
              </span>
              <span className="text-[9px] tracking-widest uppercase truncate" style={{ color: SA_THEME.text.muted }}>
                Super Admin
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#1E1E35] scrollbar-track-transparent py-4">
        {SUPER_ADMIN_NAV.map((group, idx) => (
          <div key={idx} className="mb-6 px-3">
            {!isCollapsed && (
              <div 
                className="px-3 mb-2 text-[10px] font-bold tracking-[0.15em] uppercase"
                style={{ color: SA_THEME.text.muted }}
              >
                {group.section}
              </div>
            )}
            
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname.includes(`/${saToken}/${item.href}`);
                const Icon = item.icon;
                
                return (
                  <li key={item.href}>
                    <Link 
                      href={`/${saToken}/${item.href}`}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all group overflow-hidden",
                        isCollapsed ? "justify-center" : "",
                        isActive ? "bg-white/5" : "hover:bg-white/5"
                      )}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div 
                          layoutId="active-nav-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full"
                          style={{ backgroundColor: SA_THEME.gold[500] }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      <div className="relative shrink-0">
                        <Icon 
                          className={cn("w-5 h-5 transition-colors")} 
                          style={{ color: isActive ? SA_THEME.gold[500] : SA_THEME.text.secondary }}
                        />
                        {isCollapsed && renderBadge(item.badge, item.href)}
                      </div>
                      
                      {!isCollapsed && (
                        <>
                          <span 
                            className="flex-1 text-sm truncate transition-colors"
                            style={{ color: isActive ? SA_THEME.gold[500] : SA_THEME.text.secondary }}
                          >
                            {item.label}
                          </span>
                          {renderBadge(item.badge, item.href)}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer & Collapse Toggle */}
      <div className="p-3 border-t flex items-center justify-between shrink-0" style={{ borderColor: SA_THEME.border.primary }}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden px-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
            <span className="text-xs truncate text-[#5A5A80]">Session Secure</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-2 rounded-lg transition-colors hover:bg-white/5",
            isCollapsed && "mx-auto"
          )}
          style={{ color: SA_THEME.text.muted }}
        >
          <ChevronLeft className={cn("w-5 h-5 transition-transform", isCollapsed && "rotate-180")} />
        </button>
      </div>
    </aside>
  );
}
