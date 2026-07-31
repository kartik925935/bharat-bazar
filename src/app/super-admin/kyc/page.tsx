'use client';

import { useState } from 'react';
import { CheckCircle2, AlertTriangle, X, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_KYC_REQUESTS } from '@/lib/mock/super-admin';

export default function KYCPage() {
  const [apps, setApps] = useState(MOCK_KYC_REQUESTS);

  const handleApprove = (id: string, name: string) => {
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, status: 'approved' } : a));
    toast.success(`KYC verified & approved for ${name}!`);
  };

  const handleReject = (id: string, name: string) => {
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, status: 'rejected' } : a));
    toast.error(`KYC rejected for ${name}. Notification sent to seller.`);
  };

  const pendingApps = apps.filter((a) => a.status === 'pending');
  const urgentApps = pendingApps.filter((a) => a.waitDays >= 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
          ✅ KYC Verification Center
        </h1>
        <p className="text-xs text-[#9898B0] mt-0.5">Verify seller identity cards, PAN records, and bank accounts</p>
      </div>

      {/* Priority Banner */}
      {urgentApps.length > 0 && (
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-[#EF4444] animate-pulse" size={20} />
            <div>
              <p className="text-xs font-black text-[#F0F0F8]">Priority KYC Queue Alert</p>
              <p className="text-[11px] text-[#9898B0]">{urgentApps.length} applications pending 48+ hours. Please process urgent cases first.</p>
            </div>
          </div>
          <button
            onClick={() => toast.info('Filtering urgent KYC cases')}
            className="px-3 py-1.5 rounded-xl bg-[#EF4444] text-white text-xs font-bold shadow-md cursor-pointer"
          >
            Process Urgent First
          </button>
        </div>
      )}

      {/* KYC Applications List */}
      <div className="space-y-4">
        {pendingApps.map((app) => (
          <div key={app.id} className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-[#1E1E2E] pb-3">
              <div>
                <span className="text-xs font-bold text-[#FF7A00]">{app.shop}</span>
                <h3 className="text-base font-black text-[#F0F0F8]">{app.sellerName}</h3>
                <p className="text-xs text-[#9898B0]">Submitted {app.submittedDate} ({app.waitDays} days waiting)</p>
              </div>
              {app.waitDays >= 2 && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 animate-pulse">
                  🔴 URGENT &gt;48H
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#111118] border border-[#1E1E2E] rounded-xl">
                <p className="text-[10px] text-[#9898B0] uppercase font-bold">PAN / Docs</p>
                <p className="font-mono font-bold text-[#F0F0F8] mt-1">{app.panNumber}</p>
                <p className="text-[10px] text-[#5C5C78] mt-1">{app.documentType}</p>
                <span className="text-[10px] text-[#22C55E] font-bold mt-1 inline-block">✓ Format Valid</span>
              </div>

              <div className="p-3 bg-[#111118] border border-[#1E1E2E] rounded-xl">
                <p className="text-[10px] text-[#9898B0] uppercase font-bold">GST Number</p>
                <p className="font-mono font-bold text-[#F0F0F8] mt-1">{app.gstNumber || 'Not provided'}</p>
                {app.gstNumber && (
                  <button onClick={() => toast.info('Validating GST API')} className="text-[10px] text-[#3B82F6] font-bold mt-1 hover:underline cursor-pointer">
                    Verify via API →
                  </button>
                )}
              </div>

              <div className="p-3 bg-[#111118] border border-[#1E1E2E] rounded-xl">
                <p className="text-[10px] text-[#9898B0] uppercase font-bold">Bank Acc</p>
                <p className="font-mono font-bold text-[#F0F0F8] mt-1">{app.bankAccount}</p>
                <span className="text-[10px] text-[#22C55E] font-bold mt-1 inline-block">✓ Penny Drop Success</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1E1E2E]">
              <button
                onClick={() => handleReject(app.id, app.sellerName)}
                className="px-4 py-2 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs font-bold hover:bg-[#EF4444]/20 cursor-pointer"
              >
                ❌ Reject Application
              </button>
              <button
                onClick={() => handleApprove(app.id, app.sellerName)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white text-xs font-bold shadow-lg cursor-pointer"
              >
                ✅ Approve KYC
              </button>
            </div>
          </div>
        ))}
        {pendingApps.length === 0 && <div className="text-center py-12 text-[#5C5C78] text-sm">No pending KYC applications.</div>}
      </div>
    </div>
  );
}
