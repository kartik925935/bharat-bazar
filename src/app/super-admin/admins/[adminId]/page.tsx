'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Mail, Calendar, Key, AlertTriangle, Shield } from 'lucide-react';
import { MOCK_ADMINS } from '@/lib/mock/super-admin';
import { toast } from 'sonner';

export default function AdminDetailPage({ params }: { params: Promise<{ adminId: string }> }) {
  const resolvedParams = use(params);
  const admin = MOCK_ADMINS.find(a => a.id === resolvedParams.adminId) || MOCK_ADMINS[0];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/super-admin/admins" className="p-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#F0F0F8]">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-black text-[#F0F0F8]">{admin.name}</h1>
          <p className="text-xs text-[#9898B0]">Administrator Profile</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-black border uppercase ${
          admin.status === 'active' ? 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30' : 
          'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30'
        }`}>
          {admin.status}
        </span>
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] p-6 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-[#F0F0F8] border-b border-[#1E1E2E] pb-2">Profile Details</h2>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#1E1E2E]/50">
            <span className="text-[#9898B0] flex items-center gap-2"><Mail size={14}/> Email Address</span>
            <span className="text-[#F0F0F8]">{admin.email}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-[#1E1E2E]/50">
            <span className="text-[#9898B0] flex items-center gap-2"><Shield size={14}/> Assigned Role</span>
            <span className="text-[#FF7A00] font-bold uppercase tracking-wider bg-[#FF7A00]/10 px-2 py-0.5 rounded">{admin.role.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-[#1E1E2E]/50">
            <span className="text-[#9898B0] flex items-center gap-2"><ShieldCheck size={14}/> 2FA Security</span>
            {admin.twoFaEnabled ? <span className="text-[#22C55E] font-bold">Enabled</span> : <span className="text-[#EF4444] font-bold">Disabled</span>}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#9898B0] flex items-center gap-2"><Calendar size={14}/> Last Login</span>
            <span className="text-[#F0F0F8]">{admin.lastLogin}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => toast.success('Password reset link sent to admin')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#F0F0F8] text-xs font-bold cursor-pointer hover:border-[#FF7A00] transition-colors">
          <Key size={14} /> Send Password Reset
        </button>
        {admin.status === 'active' ? (
          <button onClick={() => toast.error('Administrator suspended')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-bold cursor-pointer hover:bg-[#EF4444]/20 transition-colors">
            <AlertTriangle size={14} /> Suspend Access
          </button>
        ) : (
          <button onClick={() => toast.success('Administrator reactivated')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold cursor-pointer hover:bg-[#22C55E]/20 transition-colors">
            <ShieldCheck size={14} /> Restore Access
          </button>
        )}
      </div>
    </div>
  );
}
