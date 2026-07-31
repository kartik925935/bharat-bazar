'use client';

import { useState } from 'react';
import { ShieldCheck, Plus, Search, Edit2, Key, Trash2, Download } from 'lucide-react';
import { useSuperAdminStore } from '@/lib/store/super-admin-store';
import { exportToCsv } from '@/lib/utils/export-csv';
import { toast } from 'sonner';

export default function AdminsPage() {
  const { admins, roles } = useSuperAdminStore();
  const [search, setSearch] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Admin' });

  const filtered = admins.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.email.toLowerCase().includes(search.toLowerCase()) || 
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email) return toast.error('Name and email are required');
    
    // In a real app we'd dispatch this to backend and store, but we're mocking it loosely
    toast.success('Admin invited successfully');
    setIsInviteOpen(false);
    setNewAdmin({ name: '', email: '', role: 'Admin' });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            🛡️ Platform Administrators
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Manage administrative access and team members</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => exportToCsv('admins', admins)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] text-xs font-bold hover:text-[#F0F0F8] transition-colors cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={() => setIsInviteOpen(true)} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold hover:opacity-90 cursor-pointer shadow-lg"
          >
            <Plus size={14} /> Invite Admin
          </button>
        </div>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C78]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or role..."
          className="w-full h-11 pl-10 pr-4 bg-[#111118] border border-[#1E1E2E] rounded-xl text-sm text-[#F0F0F8] outline-none focus:border-[#FF7A00]/50 placeholder-[#5C5C78]" />
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#9898B0]">
            <thead className="bg-[#111118] text-[#5C5C78] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-4">Administrator</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">2FA Status</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Last Login</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E2E]">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-[#1C1C28]">
                  <td className="px-5 py-4">
                    <p className="font-bold text-[#F0F0F8]">{a.name}</p>
                    <p className="text-[10px] text-[#5C5C78]">{a.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 rounded bg-[#111118] border border-[#1E1E2E] text-[#FF7A00] font-mono capitalize text-[10px]">
                      {a.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {a.twoFaEnabled ? (
                      <span className="text-[#22C55E] flex items-center gap-1"><ShieldCheck size={12}/> Enabled</span>
                    ) : (
                      <span className="text-[#EF4444]">Disabled</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      a.status === 'active' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[10px]">{a.lastLogin}</td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button className="p-1.5 text-[#5C5C78] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded transition-colors cursor-pointer" title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button className="p-1.5 text-[#5C5C78] hover:text-[#A855F7] hover:bg-[#A855F7]/10 rounded transition-colors cursor-pointer" title="Reset Password">
                      <Key size={14} />
                    </button>
                    {a.role !== 'Super Admin' && (
                      <button className="p-1.5 text-[#5C5C78] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors cursor-pointer" title="Revoke Access">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#16161F] border border-[#1E1E2E] p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-white mb-4">Invite Administrator</h2>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#9898B0] uppercase block mb-1">Name</label>
                <input 
                  type="text" 
                  value={newAdmin.name} 
                  onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                  className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF7A00]" 
                  placeholder="e.g. John Doe" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#9898B0] uppercase block mb-1">Email</label>
                <input 
                  type="email" 
                  value={newAdmin.email} 
                  onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF7A00]" 
                  placeholder="admin@bharatbazaar.in" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#9898B0] uppercase block mb-1">Role</label>
                <select 
                  value={newAdmin.role} 
                  onChange={e => setNewAdmin({...newAdmin, role: e.target.value})}
                  className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF7A00]"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsInviteOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-[#1E1E2E] text-[#9898B0] text-sm font-bold hover:bg-[#111118] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold hover:opacity-90 transition-colors"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
