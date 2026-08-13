'use client';

import { useState } from 'react';
import { Menu, Search, Bell, Zap, ChevronDown, Settings, LogOut, Shield, Key } from 'lucide-react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { SA_THEME } from '@/styles/super-admin-theme';
import { SuperAdminUser, useSAAuthStore } from '@/lib/store/sa-auth-store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TopbarProps {
  onOpenSidebar: () => void;
  user: SuperAdminUser;
}

export function Topbar({ onOpenSidebar, user }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const saToken = params.saToken as string;
  const { logout } = useSAAuthStore();
  
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentSection = pathSegments[pathSegments.length - 1] || 'Dashboard';
  const formattedSection = currentSection.charAt(0).toUpperCase() + currentSection.slice(1).replace('-', ' ');

  const handleSignOut = () => {
    logout();
    router.replace(`/${saToken}/secure-access`);
  };

  return (
    <header 
      className="sticky top-0 z-30 h-16 w-full border-b flex items-center justify-between px-4 lg:px-6 shrink-0 backdrop-blur-xl"
      style={{ 
        backgroundColor: `${SA_THEME.bg.primary}CC`, // semi-transparent
        borderColor: SA_THEME.border.primary 
      }}
    >
      {/* LEFT: Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          style={{ color: SA_THEME.text.secondary }}
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden lg:flex items-center gap-2 text-sm font-medium">
          <span style={{ color: SA_THEME.text.muted }}>Portal</span>
          <span style={{ color: SA_THEME.text.muted }}>/</span>
          <span style={{ color: SA_THEME.text.primary }}>{formattedSection}</span>
        </div>
      </div>

      {/* CENTER: Search */}
      <div className="hidden lg:flex flex-1 max-w-xl px-8">
        <button 
          className="w-full flex items-center justify-between px-4 py-2 rounded-xl border transition-colors hover:border-white/20"
          style={{ 
            backgroundColor: SA_THEME.bg.input,
            borderColor: SA_THEME.border.primary,
            color: SA_THEME.text.muted
          }}
          onClick={() => alert('Search palette (Cmd+K) coming soon')}
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="text-sm">Search across portal...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/50">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3">
        
        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="p-2 rounded-lg hover:bg-white/5 transition-colors hidden sm:flex items-center justify-center"
              style={{ color: SA_THEME.gold[500] }}
            >
              <Zap className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" style={{ backgroundColor: SA_THEME.bg.dropdown, borderColor: SA_THEME.border.primary }}>
            <DropdownMenuLabel style={{ color: SA_THEME.text.secondary }}>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator style={{ backgroundColor: SA_THEME.border.primary }} />
            <DropdownMenuItem style={{ color: SA_THEME.text.primary }} className="focus:bg-white/5 cursor-pointer">+ Invite Admin</DropdownMenuItem>
            <DropdownMenuItem style={{ color: SA_THEME.text.primary }} className="focus:bg-white/5 cursor-pointer">✓ Approve Seller</DropdownMenuItem>
            <DropdownMenuItem style={{ color: SA_THEME.text.primary }} className="focus:bg-white/5 cursor-pointer">💰 Process Refund</DropdownMenuItem>
            <DropdownMenuItem style={{ color: SA_THEME.text.primary }} className="focus:bg-white/5 cursor-pointer">📢 Send Notification</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <button 
          className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
          style={{ color: SA_THEME.text.secondary }}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2" style={{ borderColor: SA_THEME.bg.primary }} />
        </button>

        {/* Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-2 lg:pl-4 border-l transition-opacity hover:opacity-80 outline-none" style={{ borderColor: SA_THEME.border.primary }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-sm" style={{ background: SA_THEME.gold.gradient }}>
                {user.name.charAt(0)}
              </div>
              <div className="hidden lg:flex flex-col items-start text-left">
                <span className="text-sm font-medium" style={{ color: SA_THEME.text.primary }}>{user.name}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: SA_THEME.gold[500] }}>Super Admin</span>
              </div>
              <ChevronDown className="w-4 h-4 hidden lg:block" style={{ color: SA_THEME.text.muted }} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" style={{ backgroundColor: SA_THEME.bg.dropdown, borderColor: SA_THEME.border.primary }}>
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium" style={{ color: SA_THEME.text.primary }}>{user.name}</p>
              <p className="text-xs truncate" style={{ color: SA_THEME.text.secondary }}>{user.email}</p>
            </div>
            <DropdownMenuSeparator style={{ backgroundColor: SA_THEME.border.primary }} />
            
            <DropdownMenuItem style={{ color: SA_THEME.text.primary }} className="focus:bg-white/5 cursor-pointer">
              <Shield className="w-4 h-4 mr-2" /> Security Settings
            </DropdownMenuItem>
            <DropdownMenuItem style={{ color: SA_THEME.text.primary }} className="focus:bg-white/5 cursor-pointer">
              <Key className="w-4 h-4 mr-2" /> Rotate Secret URL
            </DropdownMenuItem>
            <DropdownMenuItem style={{ color: SA_THEME.text.primary }} className="focus:bg-white/5 cursor-pointer">
              <Settings className="w-4 h-4 mr-2" /> Preferences
            </DropdownMenuItem>
            
            <DropdownMenuSeparator style={{ backgroundColor: SA_THEME.border.primary }} />
            
            <DropdownMenuItem onClick={handleSignOut} style={{ color: SA_THEME.text.error }} className="focus:bg-red-500/10 cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}
