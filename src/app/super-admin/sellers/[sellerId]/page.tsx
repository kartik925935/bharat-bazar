'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Package, Star, ShieldCheck, AlertOctagon } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/format-currency';
import { MOCK_SELLERS } from '@/lib/mock/super-admin';

export default function SellerDetailPage({ params }: { params: Promise<{ sellerId: string }> }) {
  const { sellerId } = use(params);
  const seller = MOCK_SELLERS.find((s) => s.id === sellerId) ?? MOCK_SELLERS[0];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/super-admin/sellers">
          <button className="p-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#F0F0F8] cursor-pointer"><ArrowLeft size={16} /></button>
        </Link>
        <div>
          <h1 className="text-xl font-black text-[#F0F0F8]">{seller.name}</h1>
          <p className="text-xs text-[#9898B0]">{seller.shop} · {seller.id}</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-black border capitalize ${
          seller.status === 'active' ? 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30' :
          seller.status === 'pending' ? 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30' :
          'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30'
        }`}>{seller.status}</span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total GMV', value: seller.gmv > 0 ? formatCurrency(seller.gmv) : '—', color: 'text-[#FF7A00]' },
          { label: 'Total Orders', value: seller.totalOrders.toLocaleString(), color: 'text-[#F0F0F8]' },
          { label: 'Products Listed', value: seller.products, color: 'text-[#F0F0F8]' },
          { label: 'Rating', value: seller.rating > 0 ? `★ ${seller.rating}` : '—', color: 'text-amber-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-4 text-center">
            <p className="text-[10px] text-[#5C5C78] uppercase font-bold">{stat.label}</p>
            <p className={`text-xl font-black font-mono mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-black text-[#F0F0F8] border-b border-[#1E1E2E] pb-2">Contact Information</h3>
          <div className="space-y-2 text-xs text-[#9898B0]">
            <p className="flex items-center gap-2"><Mail size={13} />{seller.email}</p>
            <p className="flex items-center gap-2"><Phone size={13} />{seller.phone}</p>
            <p className="flex items-center gap-2"><MapPin size={13} />{seller.location}</p>
            <p className="flex items-center gap-2"><Package size={13} />Category: <span className="text-[#F0F0F8] font-bold">{seller.category}</span></p>
          </div>
        </div>

        <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-black text-[#F0F0F8] border-b border-[#1E1E2E] pb-2">Verification Status</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#9898B0]">KYC Status</span>
              <span className={`font-bold capitalize ${seller.kycStatus === 'verified' ? 'text-[#22C55E]' : seller.kycStatus === 'pending' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>{seller.kycStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9898B0]">Seller Tier</span>
              <span className="font-bold text-amber-400">💎 {seller.tier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9898B0]">Joined Date</span>
              <span className="font-bold text-[#F0F0F8]">{seller.joinedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        {seller.status === 'pending' && (
          <button onClick={() => toast.success(`Seller ${seller.name} approved!`)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white text-xs font-bold cursor-pointer hover:opacity-90">
            <ShieldCheck size={14} /> Approve Seller
          </button>
        )}
        {seller.status === 'active' && (
          <button onClick={() => toast.error(`Seller ${seller.name} suspended.`)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white text-xs font-bold cursor-pointer hover:opacity-90">
            <AlertOctagon size={14} /> Suspend Seller
          </button>
        )}
        <Link href="/super-admin/kyc">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#F0F0F8] text-xs font-bold cursor-pointer">
            <ShieldCheck size={14} /> View KYC Docs
          </button>
        </Link>
      </div>
    </div>
  );
}
