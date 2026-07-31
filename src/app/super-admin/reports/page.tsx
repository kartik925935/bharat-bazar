'use client';

import { useState } from 'react';
import { Download, FileText, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSuperAdminStore } from '@/lib/store/super-admin-store';
import { exportToCsv } from '@/lib/utils/export-csv';
import { MOCK_SELLERS } from '@/lib/mock/super-admin';

export default function ReportsPage() {
  const { orders } = useSuperAdminStore();

  const handleGenerate = (reportTitle: string) => {
    toast.success(`Generating ${reportTitle}...`);
    
    setTimeout(() => {
      if (reportTitle === 'Seller Performance') {
        exportToCsv('seller-performance', MOCK_SELLERS);
      } else if (reportTitle === 'Tax & GST Liability') {
        exportToCsv('gst-liability', orders);
      } else {
        // Fallback for others
        exportToCsv(reportTitle.replace(/\s+/g, '-').toLowerCase(), [{ data: 'Mock Data Export' }]);
      }
    }, 500);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            📊 Custom Reports & Exports
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Generate and download bulk data for external accounting tools</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Tax & GST Liability', desc: 'Consolidated report for GSTR-1 & GSTR-3B filing for the platform and sellers.', type: 'Monthly' },
          { title: 'Payout Reconciliation', desc: 'Detailed breakdown of all settlements, UTR numbers, and bank responses.', type: 'Weekly' },
          { title: 'Seller Performance', desc: 'Raw data dump of seller ratings, GMV, and active product counts.', type: 'On-Demand' },
          { title: 'Refunds & Chargebacks', desc: 'Log of all processed refunds, payment gateway fees, and dispute losses.', type: 'Monthly' },
          { title: 'Logistics SLA Breach', desc: 'List of all delayed orders crossing the maximum SLA time limit.', type: 'Daily' },
          { title: 'Inventory Stock-out', desc: 'Alert report for high-velocity items currently out of stock.', type: 'On-Demand' },
        ].map((report) => (
          <div key={report.title} className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 space-y-4 hover:border-[#FF7A00]/40 transition-colors shadow-xl">
            <div className="flex justify-between items-start">
              <div className="bg-[#111118] border border-[#1E1E2E] p-2.5 rounded-xl text-[#FF7A00]">
                <FileText size={20} />
              </div>
              <span className="px-2 py-1 rounded bg-[#111118] border border-[#1E1E2E] text-[9px] font-bold text-[#5C5C78] uppercase">{report.type}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F0F0F8]">{report.title}</h3>
              <p className="text-xs text-[#9898B0] mt-1.5 leading-relaxed line-clamp-2">{report.desc}</p>
            </div>
            <button onClick={() => handleGenerate(report.title)} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] text-xs font-bold hover:text-[#F0F0F8] hover:border-[#FF7A00] transition-colors cursor-pointer">
              <Download size={14} /> Generate CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
