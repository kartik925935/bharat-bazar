'use client';

import { useState } from 'react';
import { Package, AlertTriangle, ArrowRight, Search, Plus } from 'lucide-react';
import { useSellerStore } from '@/lib/store/seller-store';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SellerInventoryPage() {
  const { products, updateStock } = useSellerStore();
  const [search, setSearch] = useState('');

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const outOfStock = products.filter(p => p.stock === 0);

  const handleStockUpdate = (id: string, newStock: number) => {
    updateStock(id, newStock);
    toast.success('Stock updated');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A]">Inventory Management</h1>
          <p className="text-sm text-[#9B8F84]">Keep track of your product stock levels.</p>
        </div>
        <Link href="/seller-products/add" className="flex items-center gap-2 h-10 px-4 bg-[#1A1A1A] text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 transition-all">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {(outOfStock.length > 0 || lowStock.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {outOfStock.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600"><AlertTriangle size={24}/></div>
              <div>
                <h3 className="text-base font-black text-red-800">{outOfStock.length} Out of Stock</h3>
                <p className="text-xs text-red-600">These products cannot be purchased.</p>
              </div>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><AlertTriangle size={24}/></div>
              <div>
                <h3 className="text-base font-black text-amber-800">{lowStock.length} Low Stock</h3>
                <p className="text-xs text-amber-600">Running out soon. Replenish stock.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-[#F0EDE8] overflow-hidden">
        <div className="p-4 border-b border-[#F0EDE8]">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4B8AF]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="w-full h-10 pl-9 pr-4 bg-[#FAFAF8] border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]"
            />
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-[#FAFAF8] border-b border-[#F0EDE8]">
            <tr>
              <th className="text-left py-3 px-4 text-[11px] font-black text-[#9B8F84] tracking-wider uppercase">Product</th>
              <th className="text-left py-3 px-4 text-[11px] font-black text-[#9B8F84] tracking-wider uppercase">SKU</th>
              <th className="text-left py-3 px-4 text-[11px] font-black text-[#9B8F84] tracking-wider uppercase">Price</th>
              <th className="text-left py-3 px-4 text-[11px] font-black text-[#9B8F84] tracking-wider uppercase">Available Stock</th>
              <th className="text-left py-3 px-4 text-[11px] font-black text-[#9B8F84] tracking-wider uppercase">Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product.id} className="border-b border-[#F0EDE8] hover:bg-[#FAFAF8]">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={product.images[0]?.url || 'https://via.placeholder.com/40'} alt={product.name} className="w-10 h-10 rounded-xl object-cover border border-[#F0EDE8]" />
                    <p className="text-sm font-bold text-[#1A1A1A] line-clamp-1">{product.name}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-[#4A4540]">{product.sku}</td>
                <td className="py-3 px-4 text-sm font-bold text-[#1A1A1A]">{formatCurrency(product.sellingPrice)}</td>
                <td className="py-3 px-4">
                  <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${product.stock === 0 ? 'bg-red-50 text-red-600' : product.stock <= product.lowStockThreshold ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      defaultValue={product.stock}
                      onBlur={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val !== product.stock) handleStockUpdate(product.id, val);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = parseInt(e.currentTarget.value);
                          if (!isNaN(val) && val !== product.stock) handleStockUpdate(product.id, val);
                          e.currentTarget.blur();
                        }
                      }}
                      className="w-20 h-9 px-2 bg-white border border-[#F0EDE8] rounded-lg text-sm outline-none focus:border-[#FF7A00]"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[#9B8F84]">No products found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
