'use client';

import { useState } from 'react';
import { ShieldCheck, Plus, Search, Edit2, Key, Trash2, Download, AlertCircle, Loader2 } from 'lucide-react';
import { useSuperAdminStore } from '@/lib/store/super-admin-store';
import { exportToCsv } from '@/lib/utils/export-csv';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

const inviteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  role: z.string().min(1, 'Please select a role'),
});

type InviteFormData = z.infer<typeof inviteSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="flex items-center gap-1 text-[10px] text-red-500 mt-1 font-medium"
    >
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {message}
    </motion.p>
  );
}

export default function AdminsPage() {
  const { admins, roles } = useSuperAdminStore();
  const [search, setSearch] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', role: 'Admin' },
  });

  const filtered = admins.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.email.toLowerCase().includes(search.toLowerCase()) || 
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = async (data: InviteFormData) => {
    await new Promise((r) => setTimeout(r, 600));
    
    // In a real app we'd dispatch this to backend and store, but we're mocking it loosely
    toast.success('Admin invited successfully');
    setIsInviteOpen(false);
    reset();
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
                      {a.role === 'platform_admin' ? 'Super Admin' : a.role}
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
                    {a.role !== 'platform_admin' && (
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#16161F] border border-[#1E1E2E] p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-white mb-4">Invite Administrator</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#9898B0] uppercase block mb-1">Name <span className="text-red-500">*</span></label>
                <input 
                  {...register('name')}
                  className={`w-full bg-[#111118] border rounded-xl px-4 py-2 text-sm text-white focus:outline-none transition-colors ${
                    errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-[#1E1E2E] focus:border-[#FF7A00]'
                  }`} 
                  placeholder="e.g. John Doe" 
                />
                <AnimatePresence mode="wait"><FieldError message={errors.name?.message} /></AnimatePresence>
              </div>
              <div>
                <label className="text-xs font-bold text-[#9898B0] uppercase block mb-1">Email <span className="text-red-500">*</span></label>
                <input 
                  type="email"
                  {...register('email')}
                  className={`w-full bg-[#111118] border rounded-xl px-4 py-2 text-sm text-white focus:outline-none transition-colors ${
                    errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-[#1E1E2E] focus:border-[#FF7A00]'
                  }`} 
                  placeholder="admin@bharatbazaar.in" 
                />
                <AnimatePresence mode="wait"><FieldError message={errors.email?.message} /></AnimatePresence>
              </div>
              <div>
                <label className="text-xs font-bold text-[#9898B0] uppercase block mb-1">Role <span className="text-red-500">*</span></label>
                <select 
                  {...register('role')}
                  className={`w-full bg-[#111118] border rounded-xl px-4 py-2 text-sm text-white focus:outline-none transition-colors ${
                    errors.role ? 'border-red-500/50 focus:border-red-500' : 'border-[#1E1E2E] focus:border-[#FF7A00]'
                  }`}
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
                <AnimatePresence mode="wait"><FieldError message={errors.role?.message} /></AnimatePresence>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => { setIsInviteOpen(false); reset(); }}
                  className="flex-1 py-2.5 rounded-xl border border-[#1E1E2E] text-[#9898B0] text-sm font-bold hover:bg-[#111118] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!isValid || isSubmitting}
                  className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    (!isValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 hover:-translate-y-0.5 shadow-lg shadow-orange-500/20'
                  }`}
                >
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin"/> Sending...</> : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
