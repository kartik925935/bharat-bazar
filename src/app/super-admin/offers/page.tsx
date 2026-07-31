'use client';

import { useState } from 'react';
import { Gift, Plus, Calendar, Tag, Trash2, Power } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_OFFERS = [
  { id: 'off-1', title: 'Grand Artisans Harvest Sale 2025', desc: '30% OFF on all Pottery & Handloom products', status: 'active', from: '2025-08-01', to: '2025-08-15', categories: ['Pottery', 'Handloom'] },
  { id: 'off-2', title: 'Diwali Mega Bumper', desc: 'Flat ₹500 off on orders above ₹2000', status: 'scheduled', from: '2025-10-15', to: '2025-10-25', categories: ['All'] },
  { id: 'off-3', title: 'Monsoon Clearance', desc: 'Up to 50% off on last season stock', status: 'ended', from: '2025-07-01', to: '2025-07-10', categories: ['Apparel', 'Accessories'] }
];

export default function OffersPage() {
  const [offers] = useState(MOCK_OFFERS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            🎁 Promotional Offers & Campaigns
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Manage flash sales, seasonal artisan festivals, and banner promotions</p>
        </div>
        <button
          onClick={() => toast.info('New campaign manager opening')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold shadow-lg cursor-pointer w-fit"
        >
          <Plus size={15} /> Launch Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map(offer => (
          <div key={offer.id} className="bg-[#16161F] border border-[#1E1E2E] p-6 rounded-2xl space-y-4 shadow-xl hover:border-[#FF7A00]/30 transition-colors">
            <div className="flex justify-between items-start border-b border-[#1E1E2E] pb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                offer.status === 'active' ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20' : 
                offer.status === 'scheduled' ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20' : 
                'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
              }`}>
                {offer.status}
              </span>
              <Gift size={16} className="text-[#FF7A00]" />
            </div>
            
            <div>
              <h2 className="text-sm font-black text-[#F0F0F8]">{offer.title}</h2>
              <p className="text-xs text-[#9898B0] mt-1">{offer.desc}</p>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-[#5C5C78]">
                <Calendar size={14} /> <span className="font-mono text-[#F0F0F8]">{offer.from} to {offer.to}</span>
              </div>
              <div className="flex items-center gap-2 text-[#5C5C78]">
                <Tag size={14} /> <span className="font-bold text-[#A855F7]">{offer.categories.join(', ')}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-[#1E1E2E]">
              {offer.status !== 'ended' && (
                <button onClick={() => toast.error('Campaign stopped')} className="flex-1 py-2 bg-[#111118] border border-[#1E1E2E] rounded-xl text-[10px] font-bold text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                  <Power size={12}/> Disable
                </button>
              )}
              <button onClick={() => toast.info('Edit campaign')} className="flex-1 py-2 bg-[#111118] border border-[#1E1E2E] rounded-xl text-[10px] font-bold text-[#9898B0] hover:text-[#F0F0F8] transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
