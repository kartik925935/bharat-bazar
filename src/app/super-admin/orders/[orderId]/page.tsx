'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, User, Store, CreditCard, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/format-currency';
import { MOCK_ADMIN_ORDERS } from '@/lib/mock/super-admin';

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const order = MOCK_ADMIN_ORDERS.find((o) => o.id === orderId) ?? MOCK_ADMIN_ORDERS[0];

  const statusColor = ({
    delivered: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30',
    shipped: 'text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/30',
    processing: 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/30',
    pending: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
    cancelled: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30',
    refunded: 'text-[#9898B0] bg-[#9898B0]/10 border-[#9898B0]/30',
  } as any)[order?.status as string] ?? 'text-[#9898B0]';

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/super-admin/orders">
          <button className="p-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#F0F0F8] cursor-pointer"><ArrowLeft size={16} /></button>
        </Link>
        <div>
          <h1 className="text-xl font-black text-[#F0F0F8] font-mono">{order.orderNo}</h1>
          <p className="text-xs text-[#9898B0]">Placed on {order.date} · {order.items} item(s)</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-black border capitalize ${statusColor}`}>{order.status}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Order Amount', value: formatCurrency(order.amount), color: 'text-[#FF7A00]' },
          { label: 'Commission', value: formatCurrency(order.commission), color: 'text-[#22C55E]' },
          { label: 'Seller Payout', value: formatCurrency(order.amount - order.commission), color: 'text-[#F0F0F8]' },
          { label: 'Payment', value: order.paymentStatus, color: order.paymentStatus === 'paid' ? 'text-[#22C55E]' : 'text-[#F59E0B]' },
        ].map((s) => (
          <div key={s.label} className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-4 text-center">
            <p className="text-[10px] text-[#5C5C78] uppercase font-bold">{s.label}</p>
            <p className={`text-lg font-black font-mono mt-1 capitalize ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-5 space-y-2">
          <h3 className="text-sm font-black text-[#F0F0F8] flex items-center gap-2"><User size={14} className="text-[#FF7A00]" /> Customer</h3>
          <p className="text-sm text-[#F0F0F8] font-bold">{order.customer}</p>
        </div>
        <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-5 space-y-2">
          <h3 className="text-sm font-black text-[#F0F0F8] flex items-center gap-2"><Store size={14} className="text-[#FF7A00]" /> Seller</h3>
          <p className="text-sm text-[#F0F0F8] font-bold">{order.seller}</p>
          <p className="text-xs text-[#9898B0]">{order.category}</p>
        </div>
        <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-5 space-y-2">
          <h3 className="text-sm font-black text-[#F0F0F8] flex items-center gap-2"><Package size={14} className="text-[#FF7A00]" /> Items</h3>
          <p className="text-sm text-[#F0F0F8] font-bold">{order.items} product(s)</p>
          <p className="text-xs text-[#9898B0]">in {order.category}</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {order.status === 'pending' && (
          <button onClick={() => toast.success('Order cancelled')} className="px-5 py-2.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-bold cursor-pointer hover:bg-[#EF4444]/20">Cancel Order</button>
        )}
        <button onClick={() => toast.info('Refund initiated')} className="px-5 py-2.5 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#F0F0F8] text-xs font-bold cursor-pointer">Issue Refund</button>
        <button onClick={() => toast.success('Forwarded to delivery team')} className="px-5 py-2.5 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#F0F0F8] text-xs font-bold cursor-pointer flex items-center gap-2"><Truck size={13} /> Track Shipment</button>
      </div>
    </div>
  );
}
