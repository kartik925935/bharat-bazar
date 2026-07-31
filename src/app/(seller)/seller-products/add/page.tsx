'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { useSellerStore } from '@/lib/store/seller-store';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SellerAddProductPage() {
  const router = useRouter();
  const { createProduct, seller } = useSellerStore();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    mrp: '',
    sellingPrice: '',
    stock: '',
    sku: '',
    categoryId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seller) return;
    setLoading(true);
    
    setTimeout(() => {
      createProduct({
        sellerId: seller.id,
        name: form.name,
        description: form.description,
        mrp: Number(form.mrp),
        sellingPrice: Number(form.sellingPrice),
        stock: Number(form.stock),
        sku: form.sku,
        categoryId: form.categoryId,
        subcategoryId: null,
        tags: [],
        images: [{ id: '1', url: 'https://images.unsplash.com/photo-1605814541738-9cbce314b92b?w=500&q=80', isPrimary: true, altText: '' }],
        discount: form.mrp && form.sellingPrice ? Math.round(((Number(form.mrp) - Number(form.sellingPrice)) / Number(form.mrp)) * 100) : 0,
        status: 'pending_review',
        lowStockThreshold: 5,
        giTagged: false,
        slug: form.name.toLowerCase().replace(/\s+/g, '-'),
        story: null,
        weight: 0,
        specifications: [],
        hasVariants: false,
        variants: [],
        freeShipping: false,
        shippingCharge: 0,
        handmade: true,
        rejectionReason: null,
        featuredByAdmin: false
      });
      toast.success('Product added successfully!');
      router.push('/seller-products');
    }, 500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/seller-products" className="w-10 h-10 rounded-xl border border-[#F0EDE8] flex items-center justify-center text-[#9B8F84] hover:bg-[#FAFAF8] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A]">Add New Product</h1>
          <p className="text-sm text-[#9B8F84]">List a new handcrafted item to your catalog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl border border-[#F0EDE8] p-6">
          <h2 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wide mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Product Name *</label>
              <input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" placeholder="e.g. Handwoven Silk Saree" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Category *</label>
              <select required value={form.categoryId} onChange={e=>setForm({...form, categoryId: e.target.value})} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00] bg-white">
                <option value="">Select Category</option>
                <option value="Handlooms">Handlooms</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Art">Art & Paintings</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Description *</label>
              <textarea required value={form.description} onChange={e=>setForm({...form, description: e.target.value})} rows={4} className="w-full px-3 py-2 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00] resize-none" placeholder="Describe the materials, origin, and craft..." />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#F0EDE8] p-6">
          <h2 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wide mb-4">Pricing & Inventory</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">MRP (₹) *</label>
              <input type="number" required value={form.mrp} onChange={e=>setForm({...form, mrp: e.target.value})} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Selling Price (₹) *</label>
              <input type="number" required value={form.sellingPrice} onChange={e=>setForm({...form, sellingPrice: e.target.value})} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Stock Quantity *</label>
              <input type="number" required value={form.stock} onChange={e=>setForm({...form, stock: e.target.value})} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">SKU *</label>
              <input required value={form.sku} onChange={e=>setForm({...form, sku: e.target.value})} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" placeholder="e.g. SAREE-001" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/seller-products" className="px-6 py-3 border border-[#F0EDE8] text-[#4A4540] text-sm font-bold rounded-xl hover:bg-[#FAFAF8]">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="px-6 py-3 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Save size={16} /> {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
