'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Gift, ArrowUpRight, ArrowDownLeft, Copy, Check, X, Plus, CreditCard, Smartphone, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';
import { MOCK_TRANSACTIONS, MOCK_USER_LOYALTY, type MockTransaction } from '@/lib/mock/customer';

const ADD_AMOUNTS = [100, 250, 500, 1000, 2000, 5000];
const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI (GPay, PhonePe, Paytm)', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
];

export default function WalletPage() {
  const [loyalty] = useState(MOCK_USER_LOYALTY);
  const [transactions, setTransactions] = useState<MockTransaction[]>(MOCK_TRANSACTIONS);
  const [walletBalance, setWalletBalance] = useState(loyalty.walletBalance);
  const [rewardPoints, setRewardPoints] = useState(loyalty.points);
  const [copied, setCopied] = useState(false);

  // Add Money modal
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [addingMoney, setAddingMoney] = useState(false);

  // Redeem modal
  const [showRedeem, setShowRedeem] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  // How to Use modal
  const [showHowToUse, setShowHowToUse] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(loyalty.referralCode);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(addAmount);
    if (!amt || amt < 10) { toast.error('Enter at least ₹10'); return; }
    setAddingMoney(true);
    setTimeout(() => {
      setWalletBalance((prev) => prev + amt);
      const newTx: MockTransaction = {
        id: `tx-${Date.now()}`,
        type: 'credit',
        title: 'Wallet Top-up',
        amount: amt,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        source: PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label ?? 'UPI',
      };
      setTransactions((prev) => [newTx, ...prev]);
      setShowAddMoney(false);
      setAddAmount('');
      setAddingMoney(false);
      toast.success(`₹${amt} added to your wallet! 🎉`);
    }, 1200);
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    const pts = parseInt(redeemPoints);
    if (!pts || pts < 100) { toast.error('Minimum 100 points to redeem'); return; }
    if (pts > rewardPoints) { toast.error('Not enough points'); return; }
    const cashValue = Math.floor(pts / 2); // 2 pts = ₹1
    setRedeeming(true);
    setTimeout(() => {
      setRewardPoints((prev) => prev - pts);
      setWalletBalance((prev) => prev + cashValue);
      const newTx: MockTransaction = {
        id: `tx-${Date.now()}`,
        type: 'credit',
        title: `${pts} Points Redeemed`,
        amount: cashValue,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        source: 'Loyalty Rewards',
      };
      setTransactions((prev) => [newTx, ...prev]);
      setShowRedeem(false);
      setRedeemPoints('');
      setRedeeming(false);
      toast.success(`${pts} points redeemed for ${formatCurrency(cashValue)}!`);
    }, 1200);
  };

  const tierLabel = loyalty.tier;
  const progressPct = Math.min(100, (rewardPoints / loyalty.nextTierPoints) * 100);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
          💰 Wallet & Credits
        </h1>
        <p className="text-sm text-[#8C7B6E] mt-0.5">Manage your store balance, reward points and referral earnings</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wallet Balance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#FF7A00] to-[#FF4500] rounded-2xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10" />
          <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Store Credit Balance</p>
          <h2 className="text-3xl font-black mb-4">{formatCurrency(walletBalance)}</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowAddMoney(true)}
              className="px-4 py-2 rounded-xl bg-white text-[#FF7A00] text-xs font-bold hover:bg-white/90 cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Money
            </button>
            <button
              onClick={() => setShowHowToUse(true)}
              className="px-4 py-2 rounded-xl bg-white/20 text-white text-xs font-bold hover:bg-white/30 cursor-pointer"
            >
              How to Use
            </button>
          </div>
        </motion.div>

        {/* Loyalty Points */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="bg-white rounded-2xl border border-[#E8E4DE] p-6"
        >
          <p className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider mb-1">Loyalty Points</p>
          <div className="flex items-baseline gap-2 mb-2">
            <h2 className="text-3xl font-black text-[#1A0A00]">{rewardPoints}</h2>
            <span className="text-xs font-semibold text-[#FF7A00]">pts ({tierLabel} Tier)</span>
          </div>
          {/* Tier progress */}
          <div className="mb-4">
            <div className="flex justify-between text-[10px] text-[#8C7B6E] mb-1">
              <span>{rewardPoints} / {loyalty.nextTierPoints} pts to next tier</span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div className="h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FF4500] rounded-full"
              />
            </div>
          </div>
          <button
            onClick={() => setShowRedeem(true)}
            disabled={rewardPoints < 100}
            className="px-4 py-2 rounded-xl bg-[#FFF3E8] text-[#FF7A00] text-xs font-bold hover:bg-[#FFE4CC] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Redeem Points for Cash
          </button>
          <p className="text-[10px] text-[#B5A99A] mt-1.5">2 pts = ₹1 · Min 100 pts</p>
        </motion.div>
      </div>

      {/* Refer & Earn */}
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
              Share your code. They get ₹100 off their first order, you get ₹100 store credit.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#FAFAF8] border border-[#E8E4DE] rounded-xl p-2 shrink-0">
          <span className="text-sm font-black text-[#1A0A00] px-3">{loyalty.referralCode}</span>
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5 space-y-4">
        <h3 className="text-sm font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Transaction History
        </h3>
        {transactions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-[#8C7B6E]">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
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
        )}
      </div>

      {/* ── Add Money Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddMoney && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => !addingMoney && setShowAddMoney(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>Add Money to Wallet</h3>
                <button onClick={() => setShowAddMoney(false)} className="text-[#8C7B6E] hover:text-[#1A0A00] cursor-pointer"><X size={20} /></button>
              </div>

              <form onSubmit={handleAddMoney} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider block mb-2">Quick Select Amount</label>
                  <div className="grid grid-cols-3 gap-2">
                    {ADD_AMOUNTS.map((amt) => (
                      <button key={amt} type="button" onClick={() => setAddAmount(String(amt))}
                        className={`h-10 rounded-xl border font-bold text-sm transition-all cursor-pointer ${addAmount === String(amt) ? 'border-[#FF7A00] bg-[#FFF3E8] text-[#FF7A00]' : 'border-[#E8E4DE] text-[#4A3728] hover:border-[#FF7A00]/40'}`}>
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">Or enter custom amount</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#4A3728]">₹</span>
                    <input type="number" min="10" value={addAmount} onChange={(e) => setAddAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full h-11 pl-8 pr-4 rounded-xl border border-[#E8E4DE] text-sm font-semibold outline-none focus:border-[#FF7A00]" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider block mb-2">Payment Method</label>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((m) => (
                      <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${paymentMethod === m.id ? 'border-[#FF7A00] bg-[#FFFBF7]' : 'border-[#E8E4DE] hover:border-[#FF7A00]/30'}`}>
                        <span className="text-lg">{m.icon}</span>
                        <span className="text-xs font-semibold text-[#1A0A00]">{m.label}</span>
                        {paymentMethod === m.id && <Check size={14} className="ml-auto text-[#FF7A00]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={addingMoney || !addAmount}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white font-bold text-sm cursor-pointer hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {addingMoney ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
                  ) : (
                    <>Add {addAmount ? formatCurrency(parseFloat(addAmount) || 0) : 'Money'}</>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Redeem Points Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showRedeem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => !redeeming && setShowRedeem(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>Redeem Points</h3>
                <button onClick={() => setShowRedeem(false)} className="text-[#8C7B6E] hover:text-[#1A0A00] cursor-pointer"><X size={20} /></button>
              </div>

              <div className="bg-[#FFF3E8] rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-[#FF7A00]">{rewardPoints}</p>
                <p className="text-xs text-[#8C7B6E] mt-0.5">Available Points</p>
                <p className="text-xs font-bold text-[#4A3728] mt-1">= {formatCurrency(Math.floor(rewardPoints / 2))} max cash value</p>
              </div>

              <p className="text-xs text-[#8C7B6E] text-center">2 points = ₹1 · Minimum 100 points per redemption</p>

              <form onSubmit={handleRedeem} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">Points to Redeem</label>
                  <input type="number" min="100" max={rewardPoints} value={redeemPoints}
                    onChange={(e) => setRedeemPoints(e.target.value)}
                    placeholder={`100 – ${rewardPoints}`}
                    className="w-full h-11 px-4 rounded-xl border border-[#E8E4DE] text-sm font-semibold outline-none focus:border-[#FF7A00]" />
                  {redeemPoints && parseInt(redeemPoints) >= 100 && (
                    <p className="text-xs text-[#16A34A] mt-1 font-bold">
                      You'll receive {formatCurrency(Math.floor(parseInt(redeemPoints) / 2))} in wallet credits
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowRedeem(false)}
                    className="flex-1 h-11 rounded-xl border border-[#E8E4DE] text-sm font-semibold text-[#4A3728] cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={redeeming || !redeemPoints || parseInt(redeemPoints) < 100}
                    className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white font-bold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {redeeming ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Redeem'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── How to Use Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showHowToUse && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowHowToUse(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>How to Use Wallet</h3>
                <button onClick={() => setShowHowToUse(false)} className="text-[#8C7B6E] hover:text-[#1A0A00] cursor-pointer"><X size={20} /></button>
              </div>
              {[
                { step: '1', title: 'Add Money', desc: 'Top up your wallet using UPI, Card, or Net Banking.' },
                { step: '2', title: 'Shop Freely', desc: 'Wallet balance auto-applies at checkout on eligible orders.' },
                { step: '3', title: 'Earn Points', desc: 'Get 1 loyalty point for every ₹10 spent on Bharat Bazaar.' },
                { step: '4', title: 'Redeem Anytime', desc: '2 points = ₹1. Redeem a minimum of 100 points at a time.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#FFF3E8] text-[#FF7A00] text-xs font-black flex items-center justify-center shrink-0">{item.step}</div>
                  <div>
                    <p className="text-sm font-bold text-[#1A0A00]">{item.title}</p>
                    <p className="text-xs text-[#8C7B6E]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
