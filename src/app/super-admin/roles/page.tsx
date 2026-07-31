'use client';

import { useState } from 'react';
import { Shield, Plus, Edit2, Key, Users, Download } from 'lucide-react';
import { useSuperAdminStore } from '@/lib/store/super-admin-store';
import { exportToCsv } from '@/lib/utils/export-csv';
import { toast } from 'sonner';

export default function RolesPage() {
  const { roles, addRole } = useSuperAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '', permissions: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.name) return toast.error('Role name is required');
    
    addRole({
      id: `r_${Math.random().toString(36).substr(2, 9)}`,
      name: newRole.name,
      description: newRole.description,
      userCount: 0,
      permissions: newRole.permissions.split(',').map(p => p.trim()).filter(Boolean),
    });
    
    toast.success('Role created successfully');
    setIsModalOpen(false);
    setNewRole({ name: '', description: '', permissions: '' });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            🔑 Access & Roles
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Role-Based Access Control (RBAC) configurations</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => exportToCsv('roles', roles)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] text-xs font-bold hover:text-[#F0F0F8] transition-colors cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold hover:opacity-90 cursor-pointer shadow-lg"
          >
            <Plus size={14} /> Create Role
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 space-y-4 shadow-xl hover:border-[#FF7A00]/30 transition-colors">
            <div className="flex justify-between items-start border-b border-[#1E1E2E] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#F0F0F8]">{role.name}</h3>
                <p className="text-[10px] text-[#5C5C78] mt-1 line-clamp-2">{role.description}</p>
              </div>
              <div className="bg-[#111118] border border-[#1E1E2E] p-2 rounded-xl text-[#FF7A00]">
                <Shield size={18} />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9898B0] flex items-center gap-1.5"><Users size={12}/> Assigned Users</span>
                <span className="font-bold text-[#F0F0F8]">{role.userCount}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#5C5C78] block mb-2">Permissions</span>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((p: any) => (
                    <span key={p} className="px-2 py-1 rounded bg-[#111118] border border-[#1E1E2E] text-[9px] font-mono text-[#22C55E] uppercase tracking-wider">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-[#1E1E2E]">
              <button onClick={() => toast.info('Edit role')} className="flex-1 py-2 bg-[#111118] border border-[#1E1E2E] rounded-xl text-[10px] font-bold text-[#9898B0] hover:text-[#F0F0F8] hover:border-[#FF7A00] transition-colors cursor-pointer">
                Edit Configuration
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#16161F] border border-[#1E1E2E] p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-white mb-4">Create New Role</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#9898B0] uppercase block mb-1">Role Name</label>
                <input 
                  type="text" 
                  value={newRole.name} 
                  onChange={e => setNewRole({...newRole, name: e.target.value})}
                  className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF7A00]" 
                  placeholder="e.g. Support Manager" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#9898B0] uppercase block mb-1">Description</label>
                <input 
                  type="text" 
                  value={newRole.description} 
                  onChange={e => setNewRole({...newRole, description: e.target.value})}
                  className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF7A00]" 
                  placeholder="Role description" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#9898B0] uppercase block mb-1">Permissions (Comma Separated)</label>
                <input 
                  type="text" 
                  value={newRole.permissions} 
                  onChange={e => setNewRole({...newRole, permissions: e.target.value})}
                  className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF7A00]" 
                  placeholder="users.read, orders.write" 
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-[#1E1E2E] text-[#9898B0] text-sm font-bold hover:bg-[#111118] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold hover:opacity-90 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
