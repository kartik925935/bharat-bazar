'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, User, CheckCircle2, ShieldAlert, XOctagon } from 'lucide-react';
import { MOCK_ADMIN_PRODUCTS } from '@/lib/mock/super-admin';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const product = MOCK_ADMIN_PRODUCTS.find(p => p.id === resolvedParams.slug) || MOCK_ADMIN_PRODUCTS[0];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/super-admin/products" className="p-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#F0F0F8]">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-black text-[#F0F0F8]">{product.name}</h1>
          <p className="text-xs text-[#9898B0]">Product ID: {product.id}</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-black border uppercase ${
          product.status === 'approved' ? 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30' : 
          product.status === 'flagged' ? 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30 animate-pulse' : 
          'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30'
        }`}>
          {product.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#16161F] border border-[#1E1E2E] p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-[#F0F0F8] border-b border-[#1E1E2E] pb-2">Listing Details</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[#9898B0]">Seller</span>
              <span className="text-[#F0F0F8] font-bold">{product.seller}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9898B0]">Category</span>
              <span className="text-[#F0F0F8]">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9898B0]">Price</span>
              <span className="text-[#FF7A00] font-mono font-bold">{formatCurrency(product.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9898B0]">Current Stock</span>
              <span className="text-[#F0F0F8] font-mono">{product.stock} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9898B0]">Submitted Date</span>
              <span className="text-[#F0F0F8]">{product.submittedDate}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#16161F] border border-[#1E1E2E] p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#F0F0F8] border-b border-[#1E1E2E] pb-2">Moderation Tools</h2>
            {product.status === 'flagged' && product.flagReason && (
              <div className="mt-3 bg-[#EF4444]/10 border border-[#EF4444]/30 p-3 rounded-xl text-xs">
                <span className="text-[#EF4444] font-bold uppercase block mb-1">Flag Reason</span>
                <span className="text-[#F0F0F8]">{product.flagReason}</span>
              </div>
            )}
            <p className="text-xs text-[#9898B0] mt-3">Please ensure the listing complies with our copyright and counterfeit policies before approval.</p>
          </div>

          <div className="flex gap-2">
            {product.status !== 'approved' && (
              <button onClick={() => toast.success('Product Approved')} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white text-xs font-bold cursor-pointer">
                <CheckCircle2 size={14} /> Approve
              </button>
            )}
            {product.status !== 'flagged' && (
              <button onClick={() => toast.success('Product Flagged')} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-bold hover:bg-[#EF4444]/20 cursor-pointer">
                <ShieldAlert size={14} /> Flag
              </button>
            )}
            {product.status !== 'rejected' && (
              <button onClick={() => toast.error('Product Rejected')} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#EF4444] text-xs font-bold cursor-pointer">
                <XOctagon size={14} /> Reject
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
