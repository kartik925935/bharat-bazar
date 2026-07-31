'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, LayoutGrid, List, Edit3, Trash2, Eye,
  AlertTriangle, CheckCircle2, Clock, Archive, XCircle, Package,
  TrendingUp, Star
} from 'lucide-react';
import { useSellerStore, SellerProduct } from '@/lib/store/seller-store';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

type StatusFilter = 'all' | 'approved' | 'pending_review' | 'draft' | 'rejected' | 'out_of_stock' | 'archived';
type ViewMode = 'grid' | 'table';

const STATUS_STYLES: Record<string, { label: string; cls: string; dot: string }> = {
  approved: { label: 'Live', cls: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  pending_review: { label: 'Pending', cls: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  draft: { label: 'Draft', cls: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
  rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700', dot: 'bg-red-500' },
  out_of_stock: { label: 'Out of Stock', cls: 'bg-orange-50 text-orange-700', dot: 'bg-orange-500' },
  archived: { label: 'Archived', cls: 'bg-purple-50 text-purple-700', dot: 'bg-purple-400' },
};

function ProductCard({ product, onDelete, onStockChange }: { product: SellerProduct; onDelete: (id: string) => void; onStockChange: (id: string, stock: number) => void }) {
  const stl = STATUS_STYLES[product.status] || STATUS_STYLES.draft;
  const [editing, setEditing] = useState(false);
  const [stockVal, setStockVal] = useState(String(product.stock));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-2xl border border-[#F0EDE8] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="relative">
        <img
          src={product.images[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.name}
          className="w-full h-44 object-cover"
        />
        <div className="absolute top-2 left-2">
          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${stl.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${stl.dot}`} />
            {stl.label}
          </span>
        </div>
        {product.giTagged && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">GI Tagged</div>
        )}
        {product.featuredByAdmin && (
          <div className="absolute bottom-2 left-2 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">⭐ Featured</div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-bold text-[#1A1A1A] mb-1 line-clamp-2 leading-snug">{product.name}</h3>
        <p className="text-[10px] text-[#9B8F84] mb-2">SKU: {product.sku}</p>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-base font-black text-[#1A1A1A]">{formatCurrency(product.sellingPrice)}</span>
          {product.mrp > product.sellingPrice && (
            <>
              <span className="text-xs text-[#C4B8AF] line-through">{formatCurrency(product.mrp)}</span>
              <span className="text-[10px] font-bold text-emerald-600">{product.discount}% off</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#9B8F84] mb-3">
          <span className={`font-bold ${product.stock === 0 ? 'text-red-500' : product.stock <= product.lowStockThreshold ? 'text-amber-500' : 'text-emerald-600'}`}>
            {product.stock === 0 ? '⚠ Out of stock' : product.stock <= product.lowStockThreshold ? `⚠ Low: ${product.stock} left` : `✓ Stock: ${product.stock}`}
          </span>
          <span className="flex items-center gap-0.5">
            <Star size={9} className="text-yellow-400 fill-yellow-400" />
            {product.rating > 0 ? product.rating.toFixed(1) : '–'} ({product.reviewCount})
          </span>
        </div>

        {/* Quick stock edit */}
        {editing ? (
          <div className="flex gap-1.5 mb-2">
            <input
              type="number"
              value={stockVal}
              onChange={e => setStockVal(e.target.value)}
              className="flex-1 h-8 border border-[#F0EDE8] rounded-lg px-2 text-xs outline-none focus:border-[#FF7A00]"
              min="0"
            />
            <button
              onClick={() => { onStockChange(product.id, parseInt(stockVal) || 0); setEditing(false); toast.success('Stock updated!'); }}
              className="px-3 h-8 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold rounded-lg"
            >
              Save
            </button>
            <button onClick={() => setEditing(false)} className="w-8 h-8 border border-[#F0EDE8] rounded-lg text-[#9B8F84] text-xs">✕</button>
          </div>
        ) : null}

        <div className="flex gap-1.5">
          <button
            onClick={() => setEditing(e => !e)}
            className="flex-1 h-8 border border-[#F0EDE8] rounded-lg text-xs font-medium text-[#4A4540] hover:bg-[#FFF7ED] hover:text-[#FF7A00] hover:border-orange-200 transition-all flex items-center justify-center gap-1"
          >
            <Package size={12} /> Stock
          </button>
          <Link href={`/seller-products/${product.id}/edit`} className="flex-1 h-8 border border-[#F0EDE8] rounded-lg text-xs font-medium text-[#4A4540] hover:bg-[#FFF7ED] hover:text-[#FF7A00] hover:border-orange-200 transition-all flex items-center justify-center gap-1">
            <Edit3 size={12} /> Edit
          </Link>
          <button
            onClick={() => {
              if (confirm('Delete this product?')) { onDelete(product.id); toast.success('Product deleted'); }
            }}
            className="w-8 h-8 border border-[#F0EDE8] rounded-lg text-xs text-red-400 hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductRow({ product, onDelete, onStockChange }: { product: SellerProduct; onDelete: (id: string) => void; onStockChange: (id: string, stock: number) => void }) {
  const stl = STATUS_STYLES[product.status] || STATUS_STYLES.draft;
  return (
    <tr className="border-b border-[#F0EDE8] hover:bg-[#FAFAF8] transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <img src={product.images[0]?.url || 'https://via.placeholder.com/40'} alt={product.name} className="w-10 h-10 rounded-xl object-cover border border-[#F0EDE8] flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#1A1A1A] line-clamp-1">{product.name}</p>
            <p className="text-[10px] text-[#9B8F84]">SKU: {product.sku}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4"><span className="text-sm font-bold">{formatCurrency(product.sellingPrice)}</span></td>
      <td className="py-3 px-4">
        <span className={`text-xs font-bold ${product.stock === 0 ? 'text-red-500' : product.stock <= product.lowStockThreshold ? 'text-amber-500' : 'text-emerald-600'}`}>
          {product.stock}
        </span>
      </td>
      <td className="py-3 px-4"><span className="text-sm">{product.totalSold}</span></td>
      <td className="py-3 px-4">
        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${stl.cls}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${stl.dot}`} />
          {stl.label}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5">
          <Link href={`/seller-products/${product.id}/edit`} className="w-7 h-7 rounded-lg border border-[#F0EDE8] flex items-center justify-center text-[#9B8F84] hover:text-[#FF7A00] hover:border-orange-200 transition-all">
            <Edit3 size={13} />
          </Link>
          <button onClick={() => { if (confirm('Delete?')) { onDelete(product.id); toast.success('Product deleted'); } }} className="w-7 h-7 rounded-lg border border-[#F0EDE8] flex items-center justify-center text-[#9B8F84] hover:text-red-500 hover:border-red-200 transition-all">
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function SellerProductsPage() {
  const { products, deleteProduct, updateStock } = useSellerStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [view, setView] = useState<ViewMode>('grid');

  const filtered = useMemo(() => {
    let list = products;
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter);
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [products, statusFilter, search]);

  const counts = useMemo(() => ({
    all: products.length,
    approved: products.filter(p => p.status === 'approved').length,
    pending_review: products.filter(p => p.status === 'pending_review').length,
    draft: products.filter(p => p.status === 'draft').length,
    rejected: products.filter(p => p.status === 'rejected').length,
    out_of_stock: products.filter(p => p.status === 'out_of_stock').length,
    archived: products.filter(p => p.status === 'archived').length,
  }), [products]);

  const STATUS_TABS: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'approved', label: `Live (${counts.approved})` },
    { key: 'pending_review', label: `Pending (${counts.pending_review})` },
    { key: 'draft', label: `Drafts (${counts.draft})` },
    { key: 'rejected', label: `Rejected (${counts.rejected})` },
    { key: 'out_of_stock', label: `Out of Stock (${counts.out_of_stock})` },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A]">My Products</h1>
          <p className="text-sm text-[#9B8F84] mt-0.5">{products.length} total · {counts.approved} live · {counts.pending_review} pending · {counts.draft} draft</p>
        </div>
        <Link
          href="/seller-products/add"
          className="flex items-center gap-2 h-10 px-4 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all hover:-translate-y-0.5"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
              statusFilter === tab.key
                ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white shadow-md'
                : 'bg-white border border-[#F0EDE8] text-[#4A4540] hover:border-orange-200 hover:text-[#FF7A00]'
            }`}
          >
            {tab.label}
            {tab.key === 'pending_review' && counts.pending_review > 0 && statusFilter !== 'pending_review' && (
              <span className="ml-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-black inline-flex items-center justify-center">!</span>
            )}
            {tab.key === 'rejected' && counts.rejected > 0 && statusFilter !== 'rejected' && (
              <span className="ml-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black inline-flex items-center justify-center">!</span>
            )}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4B8AF]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full h-10 pl-9 pr-4 bg-white border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00] transition-colors"
          />
        </div>
        <div className="ml-auto flex items-center gap-1.5 bg-white border border-[#F0EDE8] rounded-xl p-1">
          <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-[#FF7A00] text-white' : 'text-[#9B8F84] hover:text-[#FF7A00]'}`}>
            <LayoutGrid size={15} />
          </button>
          <button onClick={() => setView('table')} className={`p-1.5 rounded-lg transition-all ${view === 'table' ? 'bg-[#FF7A00] text-white' : 'text-[#9B8F84] hover:text-[#FF7A00]'}`}>
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Products */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F0EDE8] p-12 text-center">
          <Package size={40} className="text-[#D4C9BF] mx-auto mb-3" />
          <p className="text-base font-bold text-[#1A1A1A] mb-1">No products found</p>
          <p className="text-sm text-[#9B8F84] mb-4">Try adjusting your filters or add a new product</p>
          <Link href="/seller-products/add" className="inline-flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold rounded-xl">
            <Plus size={15} /> Add First Product
          </Link>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onDelete={deleteProduct} onStockChange={updateStock} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#F0EDE8] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#FAFAF8] border-b border-[#F0EDE8]">
              <tr>
                {['Product', 'Price', 'Stock', 'Sold', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-[11px] font-black text-[#9B8F84] tracking-wider uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map(p => <ProductRow key={p.id} product={p} onDelete={deleteProduct} onStockChange={updateStock} />)}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
