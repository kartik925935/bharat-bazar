'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/format-currency';
import { MOCK_COMPLAINTS } from '@/lib/mock/super-admin';

export default function ComplaintResolutionPage({ params }: { params: Promise<{ complaintId: string }> }) {
  const resolvedParams = use(params);
  const complaintId = resolvedParams.complaintId;
  const complaint = MOCK_COMPLAINTS.find(c => c.id === complaintId) || MOCK_COMPLAINTS[0];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/super-admin/complaints" className="p-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#F0F0F8]">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Dispute Arbitration Center
          </h1>
          <p className="text-xs text-[#9898B0]">Ticket ID: {complaint.ticketNo}</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-black border capitalize ${
          complaint.status === 'resolved' ? 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30' : 
          complaint.status === 'open' ? 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30' : 
          'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30'
        }`}>
          {complaint.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#16161F] border border-[#1E1E2E] p-6 rounded-2xl space-y-4">
            <div className="border-b border-[#1E1E2E] pb-3 flex justify-between items-start">
              <div>
                <span className={`text-[10px] font-bold uppercase ${
                  complaint.priority === 'urgent' ? 'text-[#EF4444]' : complaint.priority === 'high' ? 'text-[#F59E0B]' : 'text-[#3B82F6]'
                }`}>{complaint.priority} Priority Dispute</span>
                <h2 className="text-lg font-black text-[#F0F0F8] mt-1">{complaint.subject}</h2>
              </div>
              <p className="text-xs text-[#9898B0]">{complaint.createdDate}</p>
            </div>
            
            <div>
              <h3 className="text-xs font-bold text-[#9898B0] uppercase mb-2">Issue Description</h3>
              <p className="text-sm text-[#F0F0F8] leading-relaxed bg-[#111118] p-4 rounded-xl border border-[#1E1E2E]">
                {complaint.description}
              </p>
            </div>

            {complaint.status !== 'resolved' && (
              <div className="flex gap-3 pt-4 border-t border-[#1E1E2E]">
                <button
                  onClick={() => toast.success('Full refund issued to buyer & seller penalized')}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  ✅ Rule in Favor of Buyer
                </button>
                <button
                  onClick={() => toast.info('Dispute dismissed, no action taken')}
                  className="flex-1 py-2.5 rounded-xl bg-[#111118] border border-[#1E1E2E] text-xs font-bold text-[#9898B0] hover:text-[#F0F0F8] cursor-pointer"
                >
                  Dismiss Complaint
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#16161F] border border-[#1E1E2E] p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-[#9898B0] uppercase">Dispute Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-[#1E1E2E] pb-2">
                <span className="text-[#5C5C78]">Customer</span>
                <span className="font-bold text-[#F0F0F8]">{complaint.customer}</span>
              </div>
              <div className="flex justify-between border-b border-[#1E1E2E] pb-2">
                <span className="text-[#5C5C78]">Seller</span>
                <span className="font-bold text-[#F0F0F8]">{complaint.seller}</span>
              </div>
              <div className="flex justify-between border-b border-[#1E1E2E] pb-2">
                <span className="text-[#5C5C78]">Order No</span>
                <span className="font-mono text-[#FF7A00]">{complaint.orderNo}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#5C5C78]">Amount</span>
                <span className="font-mono font-bold text-[#F0F0F8]">{formatCurrency(complaint.amount)}</span>
              </div>
            </div>
          </div>
          
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#111118] border border-[#1E1E2E] text-xs font-bold text-[#FF7A00] hover:bg-[#1C1C28] cursor-pointer">
            <MessageSquare size={14} /> View Order Chat Log
          </button>
        </div>
      </div>
    </div>
  );
}
