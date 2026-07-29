'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Gift, ArrowUpRight, ArrowDownLeft, Clock, ShieldCheck, Sparkles, Copy, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  title: string;
  amount: number;
  date: string;
  source: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', type: 'credit', title: 'Reward Points Converted', amount: 200, date: '18 Jan 2025', source: 'Loyalty Rewards' },
  { id: 'tx-2', type: 'credit', title: 'Referral Bonus', amount: 100, date: '10 Jan 2025', source: 'Friend Referral' },
  { id: 'tx-3', type: 'debit', title: 'Used on Order #BB-2025-78234', amount: 100, date: '15 Jan 2025', source: 'Order Purchase' },
];

export default function WalletPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'PRIYA100';
  const walletBalance = 450;
  const rewardPoints = 800;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
          💰 Wallet & Credits
        </h1>
        <p className="text-sm text-[#8C7B6E] mt-0.5">Manage your store balance, reward points and referral earnings</p>
      </div>

      {/* Balance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wallet Balance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#FF7A00] to-[#FF4500] rounded-2xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10" />
          <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Store Credit Balance</p>
          <h2 className="text-3xl font-black mb-4">{formatCurrency(walletBalance)}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => toast.info('Add money flow coming soon')}
              className="px-4 py-2 rounded-xl bg-white text-[#FF7A00] text-xs font-bold hover:bg-white/90 cursor-pointer"
            >
              + Add Money
            </button>
            <button
              onClick={() => toast.info('Credits automatically apply during checkout!')}
              className="px-4 py-2 rounded-xl bg-white/20 text-white text-xs font-bold hover:bg-white/30 cursor-pointer"
            >
              How to Use
            </button>
          </div>
        </motion.div>

        {/* Loyalty Points */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-white rounded-2xl border border-[#E8E4DE] p-6 relative"
        >
          <p className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider mb-1">Loyalty Points</p>
          <div className="flex items-baseline gap-2 mb-4">
            <h2 className="text-3xl font-black text-[#1A0A00]">{rewardPoints}</h2>
            <span className="text-xs font-semibold text-[#FF7A00]">pts (Gold Tier)</span>
          </div>
          <button
            onClick={() => toast.success('Converted 200 points to ₹100 credit!')}
            className="px-4 py-2 rounded-xl bg-[#FFF3E8] text-[#FF7A00] text-xs font-bold hover:bg-[#FFE4CC] cursor-pointer"
          >
            Redeem Points for Cash
          </button>
        </motion.div>
      </div>

      {/* Refer & Earn Banner */}
      <div className="bg-white rounded-2xl border border-[#E8E4DE] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF3E8] text-[#FF7A00] flex items-center justify-center shrink-0">
            <Gift size={28} />
          </div>
          <div>
            <h3 className="text-base font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Refer Friends & Earn ₹100 Each!
            </h3>
            <p className="text-xs text-[#8C7B6E] mt-0.5">
              Share your code with friends. They get ₹100 off their first order, you get ₹100 store credit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#FAFAF8] border border-[#E8E4DE] rounded-xl p-2 shrink-0">
          <span className="text-sm font-black text-[#1A0A00] px-3">{referralCode}</span>
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5 space-y-4">
        <h3 className="text-sm font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Transaction History
        </h3>
        <div className="space-y-3">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FAFAF8] border border-[#F5F4F0]">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FEF2F2] text-[#DC2626]'}`}>
                  {tx.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1A0A00]">{tx.title}</p>
                  <p className="text-[10px] text-[#8C7B6E]">{tx.source} • {tx.date}</p>
                </div>
              </div>
              <span className={`text-sm font-black ${tx.type === 'credit' ? 'text-[#16A34A]' : 'text-[#1A0A00]'}`}>
                {tx.type === 'credit' ? '+' : '−'} {formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
