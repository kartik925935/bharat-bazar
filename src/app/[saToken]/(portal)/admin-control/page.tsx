'use client';

import { useState } from 'react';
import { SA_THEME } from '@/styles/super-admin-theme';
import { useSuperAdminStore } from '@/lib/store/super-admin-store';
import { SA_MOCK_DATA, SA_ADMIN_PROFILES } from '@/lib/mock/super-admin';
import { cn } from '@/lib/utils';
import { 
  Users, Clock, Lock, Activity, Search, Plus, 
  MoreVertical, Shield, ShieldAlert, CheckCircle, XCircle 
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function AdminControlPage() {
  const [activeTab, setActiveTab] = useState<'admins' | 'requests' | 'matrix' | 'logs'>('admins');
  const { panelRequests, updatePanelRequest, panelAccess } = useSuperAdminStore();
  
  const [searchQuery, setSearchQuery] = useState('');

  const TABS = [
    { id: 'admins', label: 'All Admins', icon: Users, count: SA_ADMIN_PROFILES.length },
    { id: 'requests', label: 'Pending Requests', icon: Clock, count: panelRequests.filter((r: any) => r.status === 'pending').length },
    { id: 'matrix', label: 'Access Matrix', icon: Lock, count: 0 },
    { id: 'logs', label: 'Activity Log', icon: Activity, count: 0 },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: SA_THEME.text.primary }}>
            Admin Control Center
          </h1>
          <p className="text-sm mt-1" style={{ color: SA_THEME.text.secondary }}>
            Manage permission boundaries and access requests across the platform.
          </p>
        </div>
        <button 
          className="h-10 px-4 rounded-xl flex items-center justify-center font-medium text-black transition-all hover:brightness-110 shrink-0 shadow-lg"
          style={{ background: SA_THEME.gold.gradient, boxShadow: SA_THEME.gold.softGlow }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Invite New Admin
        </button>
      </div>

      {/* TABS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: SA_THEME.border.primary }}>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-white/10 text-white" 
                  : "text-[#9090B8] hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={cn(
                  "ml-1.5 px-2 py-0.5 rounded-full text-[10px]",
                  activeTab === tab.id ? "bg-[#F5C842] text-black" : "bg-[#1E1E35] text-white"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A5A80]" />
          <input 
            type="text"
            placeholder="Search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-1"
            style={{ 
              backgroundColor: SA_THEME.bg.input, 
              borderColor: SA_THEME.border.primary,
              color: SA_THEME.text.primary,
            }}
          />
        </div>
      </div>

      {/* TAB CONTENTS */}
      <div className="min-h-[500px]">
        {/* TAB 1: ALL ADMINS */}
        {activeTab === 'admins' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SA_ADMIN_PROFILES.map((admin: any) => {
              const activePanels = panelAccess.filter((a: any) => a.adminId === admin.id && a.isActive).length;
              const isLocked = admin.status === 'locked' || admin.status === 'suspended';

              return (
                <div 
                  key={admin.id} 
                  className="rounded-2xl border p-5 transition-all hover:bg-white/5 group"
                  style={{ backgroundColor: SA_THEME.bg.card, borderColor: SA_THEME.border.primary }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-black border-2" style={{ background: SA_THEME.gold.gradient, borderColor: SA_THEME.border.secondary }}>{admin.avatar}</div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{admin.name}</h3>
                        <p className="text-xs text-[#9090B8]">{admin.email}</p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1.5 rounded-lg hover:bg-white/10 transition-colors outline-none text-[#5A5A80] group-hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48" style={{ backgroundColor: SA_THEME.bg.dropdown, borderColor: SA_THEME.border.primary }}>
                        <DropdownMenuItem className="text-white focus:bg-white/10 cursor-pointer">Manage Panels</DropdownMenuItem>
                        <DropdownMenuItem className="text-white focus:bg-white/10 cursor-pointer">View Activity</DropdownMenuItem>
                        {isLocked ? (
                          <DropdownMenuItem className="text-green-500 focus:bg-green-500/10 cursor-pointer">Restore Access</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 cursor-pointer">Suspend Admin</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#5A5A80]">Role</span>
                      <span className="font-medium text-white">{admin.jobTitle}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#5A5A80]">Department</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#1E1E35] text-[#9090B8]">{admin.department}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#5A5A80]">Active Panels</span>
                      <span className="font-medium text-[#F5C842]">{activePanels} / 12</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: SA_THEME.border.primary }}>
                    <div className="flex items-center gap-1.5 text-xs text-[#5A5A80]">
                      <Clock className="w-3.5 h-3.5" />
                      Active 2h ago
                    </div>
                    <div className={cn(
                      "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md",
                      isLocked ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-green-500/10 text-green-500 border border-green-500/20"
                    )}>
                      {isLocked ? <ShieldAlert className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                      {isLocked ? 'Locked' : 'Active'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: PENDING REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-4 max-w-4xl">
            {panelRequests.filter((r: any) => r.status === 'pending').map((req: any) => {
              const admin = SA_ADMIN_PROFILES.find((a: any) => a.id === req.adminId);
              if (!admin) return null;

              return (
                <div key={req.id} className="rounded-2xl border p-5 flex flex-col sm:flex-row gap-5" style={{ backgroundColor: SA_THEME.bg.card, borderColor: SA_THEME.border.primary }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-black shrink-0" style={{ background: SA_THEME.gold.gradient }}>{admin.avatar}</div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {admin.name} <span className="text-[#9090B8] font-normal">requests access to</span> {req.panelKey}
                        </h3>
                        <p className="text-xs text-[#5A5A80] mt-1">Requested Level: <strong className="text-white uppercase">{req.requestedLevel}</strong></p>
                      </div>
                      <div className={cn(
                        "px-2 py-1 rounded text-xs font-bold self-start",
                        req.urgency === 'critical' ? "bg-red-500/20 text-red-500 border border-red-500/30" :
                        req.urgency === 'high' ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" :
                        "bg-[#1E1E35] text-[#9090B8]"
                      )}>
                        {req.urgency.toUpperCase()} URGENCY
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#08080F] border border-[#1E1E35] text-sm text-[#9090B8]">
                      <span className="text-[#5A5A80] font-medium mr-2">Reason:</span>
                      {req.reason}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button 
                        onClick={() => updatePanelRequest(req.id, 'approved', `Approved to level: ${req.requestedLevel}`)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button 
                        onClick={() => updatePanelRequest(req.id, 'denied', "Denied by Super Admin")}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-transparent border border-red-500/50 hover:bg-red-500/10 text-red-500 text-sm font-medium transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Deny
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {panelRequests.filter((r: any) => r.status === 'pending').length === 0 && (
              <div className="py-20 text-center flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-green-500/50 mb-4" />
                <h3 className="text-lg font-medium text-white">All caught up</h3>
                <p className="text-[#9090B8] mt-2">There are no pending admin access requests.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3 & 4 PLACEHOLDERS */}
        {(activeTab === 'matrix' || activeTab === 'logs') && (
          <div className="flex flex-col items-center justify-center py-20 border rounded-2xl border-dashed" style={{ borderColor: SA_THEME.border.primary }}>
            <Lock className="w-8 h-8 text-[#5A5A80] mb-4" />
            <p className="text-white font-medium">{activeTab === 'matrix' ? 'Access Matrix' : 'Activity Log'} View</p>
            <p className="text-sm text-[#9090B8] mt-2">Implementation available in full desktop view.</p>
          </div>
        )}
      </div>

    </div>
  );
}
