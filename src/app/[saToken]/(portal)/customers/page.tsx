'use client';

import { useState } from 'react';
import { SA_THEME } from '@/styles/super-admin-theme';
import { SA_MOCK_DATA } from '@/lib/mock/super-admin';
import { cn } from '@/lib/utils';
import { 
  Users, Search, Filter, MoreVertical, 
  Wallet, Ban, Trash2, Eye, Mail, RefreshCw, Download, MonitorSmartphone, ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const customers = SA_MOCK_DATA.customers;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2" style={{ color: SA_THEME.text.primary }}>
            <Users className="w-6 h-6" style={{ color: SA_THEME.gold[500] }} />
            Customer Management
          </h1>
          <p className="text-sm mt-1" style={{ color: SA_THEME.text.secondary }}>
            God-mode control over all customer profiles, history, and actions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 rounded-xl flex items-center justify-center font-medium transition-colors border text-sm"
            style={{ borderColor: SA_THEME.border.primary, color: SA_THEME.text.primary, backgroundColor: SA_THEME.bg.card }}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border" style={{ backgroundColor: SA_THEME.bg.card, borderColor: SA_THEME.border.primary }}>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A5A80]" />
          <input 
            type="text"
            placeholder="Search by name, email, or phone..."
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
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 h-10 px-3 rounded-xl border text-sm" style={{ borderColor: SA_THEME.border.primary, color: SA_THEME.text.secondary }}>
            <Filter className="w-4 h-4" /> Status <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-2 h-10 px-3 rounded-xl border text-sm" style={{ borderColor: SA_THEME.border.primary, color: SA_THEME.text.secondary }}>
            Spent <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: SA_THEME.bg.card, borderColor: SA_THEME.border.primary }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b bg-black/20" style={{ borderColor: SA_THEME.border.primary }}>
              <tr>
                <th className="px-6 py-4 font-medium" style={{ color: SA_THEME.text.muted }}>Customer</th>
                <th className="px-6 py-4 font-medium" style={{ color: SA_THEME.text.muted }}>Contact</th>
                <th className="px-6 py-4 font-medium" style={{ color: SA_THEME.text.muted }}>Orders</th>
                <th className="px-6 py-4 font-medium" style={{ color: SA_THEME.text.muted }}>Total Spent</th>
                <th className="px-6 py-4 font-medium" style={{ color: SA_THEME.text.muted }}>Status</th>
                <th className="px-6 py-4 font-medium" style={{ color: SA_THEME.text.muted }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E35]">
              {customers.map((customer: any) => (
                <tr key={customer.id} className="transition-colors hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={customer.avatarUrl} alt={customer.fullName} className="w-10 h-10 rounded-full object-cover border" style={{ borderColor: SA_THEME.border.secondary }} />
                      <div>
                        <p className="font-medium text-white">{customer.fullName}</p>
                        <p className="text-xs" style={{ color: SA_THEME.text.secondary }}>ID: {customer.id.split('-')[0]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white">{customer.email}</p>
                    <p className="text-xs" style={{ color: SA_THEME.text.secondary }}>{customer.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-mono text-white">{customer.orderCount}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-mono text-white">₹{customer.totalSpent.toLocaleString('en-IN')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      customer.status === 'active' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      customer.status === 'suspended' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                      "bg-gray-500/10 text-gray-400 border-gray-500/20"
                    )}>
                      {customer.status.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 rounded-lg hover:bg-white/10 transition-colors outline-none" style={{ color: SA_THEME.text.secondary }}>
                        <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56" style={{ backgroundColor: SA_THEME.bg.dropdown, borderColor: SA_THEME.border.primary }}>
                        <DropdownMenuLabel style={{ color: SA_THEME.text.muted }}>Customer Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="text-white focus:bg-white/10 cursor-pointer">
                          <Eye className="w-4 h-4 mr-2" /> View Full Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white focus:bg-white/10 cursor-pointer">
                          <MonitorSmartphone className="w-4 h-4 mr-2" /> Impersonate (View Only)
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white focus:bg-white/10 cursor-pointer">
                          <Mail className="w-4 h-4 mr-2" /> Send Notification
                        </DropdownMenuItem>
                        <DropdownMenuSeparator style={{ backgroundColor: SA_THEME.border.primary }} />
                        <DropdownMenuItem className="text-[#F5C842] focus:bg-[#F5C842]/10 cursor-pointer">
                          <Wallet className="w-4 h-4 mr-2" /> Manage Wallet
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[#F5C842] focus:bg-[#F5C842]/10 cursor-pointer">
                          <RefreshCw className="w-4 h-4 mr-2" /> Manual Refund
                        </DropdownMenuItem>
                        <DropdownMenuSeparator style={{ backgroundColor: SA_THEME.border.primary }} />
                        {customer.status === 'active' ? (
                          <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 cursor-pointer">
                            <Ban className="w-4 h-4 mr-2" /> Suspend Account
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-500 focus:bg-green-500/10 cursor-pointer">
                            <ShieldAlert className="w-4 h-4 mr-2" /> Unsuspend Account
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 cursor-pointer">
                          <Trash2 className="w-4 h-4 mr-2" /> Permanently Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
