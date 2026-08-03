'use client';

import { useState } from 'react';
import { Search, Plus, Edit2, Archive, Activity, AlertCircle, Loader2 } from 'lucide-react';
import { useSuperAdminStore } from '@/lib/store/super-admin-store';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug cannot exceed 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  commissionRate: z
    .number({ invalid_type_error: 'Commission must be a number' })
    .min(0, 'Commission cannot be negative')
    .max(100, 'Commission cannot exceed 100%'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

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

export default function CategoriesPage() {
  const { categories, addCategory } = useSuperAdminStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    mode: 'onChange',
    defaultValues: { name: '', slug: '', commissionRate: 10 },
  });

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = async (data: CategoryFormData) => {
    await new Promise((r) => setTimeout(r, 600));
    
    addCategory({
      id: `cat_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      slug: data.slug,
      status: 'active',
      commission: data.commissionRate,
      products: 0,
      sellers: 0,
      gmv: 0
    });
    
    toast.success('Category created successfully');
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            📂 Taxonomy & Categories
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Manage product taxonomy and category commission rates</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold hover:opacity-90 cursor-pointer shadow-lg">
          <Plus size={14} /> New Category
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C78]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories..."
          className="w-full h-11 pl-10 pr-4 bg-[#111118] border border-[#1E1E2E] rounded-xl text-sm text-[#F0F0F8] outline-none focus:border-[#FF7A00]/50 placeholder-[#5C5C78]" />
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#9898B0]">
            <thead className="bg-[#111118] text-[#5C5C78] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-4">Category Name</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Commission Rate</th>
                <th className="px-5 py-4 text-right">Products</th>
                <th className="px-5 py-4 text-right">Active Sellers</th>
                <th className="px-5 py-4 text-right">Total GMV</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E2E]">
              {filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#1C1C28]">
                  <td className="px-5 py-4">
                    <p className="font-bold text-[#F0F0F8] text-sm">{cat.name}</p>
                    <p className="text-[10px] text-[#5C5C78] font-mono">/{cat.slug}</p>
                    {cat.parent && <span className="text-[9px] uppercase font-bold text-[#9898B0] mt-1 inline-block border border-[#1E1E2E] bg-[#111118] px-1.5 py-0.5 rounded">Parent: {cat.parent}</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-max ${
                      cat.status === 'active' ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30' : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30'
                    }`}>
                      {cat.status === 'active' ? <Activity size={10} /> : <Archive size={10} />}
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-mono font-bold text-[#FF7A00]">
                    {cat.commission}%
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-[#F0F0F8]">{cat.products.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right font-bold text-[#F0F0F8]">{cat.sellers}</td>
                  <td className="px-5 py-4 text-right font-mono text-[#F0F0F8]">{formatCurrency(cat.gmv)}</td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button onClick={() => toast.info('Edit category')} className="p-1.5 text-[#5C5C78] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded transition-colors cursor-pointer" title="Edit">
                      <Edit2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#16161F] border border-[#1E1E2E] p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-white mb-4">Add New Category</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#9898B0] uppercase block mb-1">Name <span className="text-red-500">*</span></label>
                <input 
                  {...register('name')}
                  className={`w-full bg-[#111118] border rounded-xl px-4 py-2 text-sm text-white focus:outline-none transition-colors ${
                    errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-[#1E1E2E] focus:border-[#FF7A00]'
                  }`} 
                  placeholder="e.g. Handlooms" 
                />
                <AnimatePresence mode="wait"><FieldError message={errors.name?.message} /></AnimatePresence>
              </div>
              <div>
                <label className="text-xs font-bold text-[#9898B0] uppercase block mb-1">Slug <span className="text-red-500">*</span></label>
                <input 
                  {...register('slug')}
                  className={`w-full bg-[#111118] border rounded-xl px-4 py-2 text-sm text-white focus:outline-none transition-colors ${
                    errors.slug ? 'border-red-500/50 focus:border-red-500' : 'border-[#1E1E2E] focus:border-[#FF7A00]'
                  }`} 
                  placeholder="e.g. handlooms-textiles" 
                />
                <AnimatePresence mode="wait"><FieldError message={errors.slug?.message} /></AnimatePresence>
              </div>
              <div>
                <label className="text-xs font-bold text-[#9898B0] uppercase block mb-1">Commission Rate (%) <span className="text-red-500">*</span></label>
                <input 
                  type="number"
                  {...register('commissionRate', { valueAsNumber: true })}
                  className={`w-full bg-[#111118] border rounded-xl px-4 py-2 text-sm text-white focus:outline-none transition-colors ${
                    errors.commissionRate ? 'border-red-500/50 focus:border-red-500' : 'border-[#1E1E2E] focus:border-[#FF7A00]'
                  }`} 
                />
                <AnimatePresence mode="wait"><FieldError message={errors.commissionRate?.message} /></AnimatePresence>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(false); reset(); }}
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
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin"/> Saving...</> : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
