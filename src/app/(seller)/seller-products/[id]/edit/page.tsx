'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import { useSellerStore } from '@/lib/store/seller-store';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SellerEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { products, updateProduct } = useSellerStore();
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

  useEffect(() => {
    const product = products.find(p => p.id === id);
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        mrp: String(product.mrp),
        sellingPrice: String(product.sellingPrice),
        stock: String(product.stock),
        sku: product.sku,
        categoryId: product.categoryId,
      });
    } else {
      router.push('/seller-products');
    }
  }, [id, products, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      updateProduct(id, {
        name: form.name,
        description: form.description,
        mrp: Number(form.mrp),
        sellingPrice: Number(form.sellingPrice),
        stock: Number(form.stock),
        sku: form.sku,
        categoryId: form.categoryId,
        discount: form.mrp && form.sellingPrice ? Math.round(((Number(form.mrp) - Number(form.sellingPrice)) / Number(form.mrp)) * 100) : 0,
      });
      toast.success('Product updated successfully!');
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
          <h1 className="text-2xl font-black text-[#1A1A1A]">Edit Product</h1>
          <p className="text-sm text-[#9B8F84]">Update product information.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl border border-[#F0EDE8] p-6">
          <h2 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wide mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Product Name *</label>
              <input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
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
              <textarea required value={form.description} onChange={e=>setForm({...form, description: e.target.value})} rows={4} className="w-full px-3 py-2 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00] resize-none" />
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
              <input required value={form.sku} onChange={e=>setForm({...form, sku: e.target.value})} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/seller-products" className="px-6 py-3 border border-[#F0EDE8] text-[#4A4540] text-sm font-bold rounded-xl hover:bg-[#FAFAF8]">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="px-6 py-3 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
