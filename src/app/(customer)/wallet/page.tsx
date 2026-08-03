'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Gift, ArrowUpRight, ArrowDownLeft, Copy, Check, X, Loader2, AlertCircle, CheckCircle2, CreditCard, Smartphone, ChevronRight, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';
import { MOCK_TRANSACTIONS, MOCK_USER_LOYALTY, type MockTransaction } from '@/lib/mock/customer';

// ─── Schemas ─────────────────────────────────────────────────────────────────
const addMoneySchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((v) => !isNaN(parseFloat(v)), 'Enter a valid amount')
    .refine((v) => parseFloat(v) >= 10, 'Minimum top-up amount is ₹10')
    .refine((v) => parseFloat(v) <= 100000, 'Maximum top-up is ₹1,00,000 per transaction'),
  paymentMethod: z.enum(['upi', 'card', 'netbanking'], {
    required_error: 'Please select a payment method',
  }),
});
type AddMoneyData = z.infer<typeof addMoneySchema>;

const redeemSchema = z.object({
  points: z
    .string()
    .min(1, 'Enter points to redeem')
    .refine((v) => !isNaN(parseInt(v)), 'Enter a valid number')
    .refine((v) => parseInt(v) >= 100, 'Minimum 100 points per redemption')
    .refine((v) => Number.isInteger(parseFloat(v)), 'Points must be a whole number'),
});
type RedeemData = z.infer<typeof redeemSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-sm text-red-600 mt-1.5"
      role="alert"
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </motion.p>
  );
}


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


  // Redeem modal
  const [showRedeem, setShowRedeem] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);


  const handleCopyCode = () => {
    navigator.clipboard.writeText(loyalty.referralCode);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const addForm = useForm<AddMoneyData>({
    resolver: zodResolver(addMoneySchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { amount: '', paymentMethod: 'upi' },
  });
  const { register: addReg, handleSubmit: addSubmit, watch: addWatch, setValue: addSet,
    formState: { errors: addErrors, touchedFields: addTouched, isSubmitting: addSubmitting, isValid: addValid },
    reset: addReset } = addForm;
  const watchedAmount = addWatch('amount', '');
  const watchedMethod = addWatch('paymentMethod', 'upi');

  const onAddMoney = async (data: AddMoneyData) => {
    const amt = parseFloat(data.amount);
    await new Promise((r) => setTimeout(r, 1200));
    setWalletBalance((prev) => prev + amt);
    const newTx: MockTransaction = {
      id: `tx-${Date.now()}`,
      type: 'credit',
      title: 'Wallet Top-up',
      amount: amt,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      source: PAYMENT_METHODS.find((m) => m.id === data.paymentMethod)?.label ?? 'UPI',
    };
    setTransactions((prev) => [newTx, ...prev]);
    setShowAddMoney(false);
    addReset();
    toast.success(`₹${amt} added to your wallet! 🎉`);
  };

  const redeemForm = useForm<RedeemData>({
    resolver: zodResolver(redeemSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { points: '' },
  });
  const { register: redeemReg, handleSubmit: redeemSubmit, watch: redeemWatch,
    formState: { errors: redeemErrors, touchedFields: redeemTouched, isSubmitting: redeemSubmitting, isValid: redeemValid },
    reset: redeemReset } = redeemForm;
  const watchedPoints = redeemWatch('points', '');
  const redeemPointsNum = parseInt(watchedPoints) || 0;
  const cashValue = Math.floor(redeemPointsNum / 2);

  const onRedeem = async (data: RedeemData) => {
    const pts = parseInt(data.points);
    if (pts > rewardPoints) { toast.error('Not enough points'); return; }
    await new Promise((r) => setTimeout(r, 1200));
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
    redeemReset();
    toast.success(`${pts} points redeemed for ${formatCurrency(cashValue)}!`);
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
            onClick={() => !addSubmitting && setShowAddMoney(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>Add Money to Wallet</h3>
                <button onClick={() => { setShowAddMoney(false); addReset(); }} className="text-[#8C7B6E] hover:text-[#1A0A00] cursor-pointer" aria-label="Close"><X size={20} /></button>
              </div>

              <form onSubmit={addSubmit(onAddMoney)} className="space-y-4" noValidate>
                <div>
                  <label className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider block mb-2">Quick Select Amount</label>
                  <div className="grid grid-cols-3 gap-2">
                    {ADD_AMOUNTS.map((amt) => (
                      <button key={amt} type="button" onClick={() => addSet('amount', String(amt), { shouldValidate: true, shouldDirty: true })}
                        className={`h-11 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                          watchedAmount === String(amt) ? 'border-[#FF7A00] bg-[#FFF3E8] text-[#FF7A00]' : 'border-[#E8E4DE] text-[#4A3728] hover:border-[#FF7A00]/40'
                        }`}>
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="addAmount" className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">Or enter custom amount <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-[#4A3728]">₹</span>
                    <input id="addAmount" type="number" inputMode="numeric" placeholder="Enter amount"
                      {...addReg('amount')}
                      className={`w-full h-12 pl-9 pr-4 rounded-xl border-2 text-base font-semibold outline-none transition-all duration-200 focus:ring-4 ${
                        addErrors.amount
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : addTouched.amount && !addErrors.amount
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                          : 'border-[#E8E4DE] focus:border-[#FF7A00] focus:ring-[#FF7A00]/20'
                      }`} />
                  </div>
                  <AnimatePresence mode="wait">
                    {addErrors.amount ? <FieldError key="e" message={addErrors.amount.message} /> : addTouched.amount && !addErrors.amount && watchedAmount ? (
                      <motion.p key="s" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-sm text-green-600 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Wallet balance after top-up: {formatCurrency(walletBalance + (parseFloat(watchedAmount) || 0))}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider block mb-2">Payment Method <span className="text-red-500">*</span></label>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((m) => (
                      <button key={m.id} type="button" onClick={() => addSet('paymentMethod', m.id as 'upi' | 'card' | 'netbanking', { shouldValidate: true, shouldDirty: true })}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          watchedMethod === m.id ? 'border-[#FF7A00] bg-[#FFFBF7]' : 'border-[#E8E4DE] hover:border-[#FF7A00]/30'
                        }`}>
                        <span className="text-lg">{m.icon}</span>
                        <span className="text-sm font-semibold text-[#1A0A00]">{m.label}</span>
                        {watchedMethod === m.id && <Check size={14} className="ml-auto text-[#FF7A00]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={!addValid || addSubmitting}
                  className={`w-full h-12 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-all ${
                    (!addValid || addSubmitting) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-95'
                  }`}>
                  {addSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                  ) : (
                    <>Add {watchedAmount ? formatCurrency(parseFloat(watchedAmount) || 0) : 'Money'}</>
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
            onClick={() => !redeemSubmitting && setShowRedeem(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>Redeem Points</h3>
                <button onClick={() => { setShowRedeem(false); redeemReset(); }} className="text-[#8C7B6E] hover:text-[#1A0A00] cursor-pointer" aria-label="Close"><X size={20} /></button>
              </div>

              <div className="bg-[#FFF3E8] rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-[#FF7A00]">{rewardPoints}</p>
                <p className="text-xs text-[#8C7B6E] mt-0.5">Available Points</p>
                <p className="text-xs font-bold text-[#4A3728] mt-1">= {formatCurrency(Math.floor(rewardPoints / 2))} max cash value</p>
              </div>

              <p className="text-xs text-[#8C7B6E] text-center">2 points = ₹1 · Minimum 100 points per redemption</p>

              <form onSubmit={redeemSubmit(onRedeem)} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="redeemPoints" className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">
                    Points to Redeem <span className="text-red-500">*</span>
                  </label>
                  <input id="redeemPoints" type="number" inputMode="numeric"
                    min={100} max={rewardPoints}
                    placeholder={`100 – ${rewardPoints}`}
                    {...redeemReg('points')}
                    className={`w-full h-12 px-4 rounded-xl border-2 text-base font-semibold outline-none transition-all duration-200 focus:ring-4 ${
                      redeemErrors.points
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : redeemTouched.points && !redeemErrors.points
                        ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'border-[#E8E4DE] focus:border-[#FF7A00] focus:ring-[#FF7A00]/20'
                    }`} />
                  <AnimatePresence mode="wait">
                    {redeemErrors.points ? <FieldError key="e" message={redeemErrors.points.message} /> : redeemTouched.points && !redeemErrors.points && watchedPoints ? (
                      <motion.p key="s" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-sm text-green-600 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> You'll receive {formatCurrency(Math.floor(redeemPointsNum / 2))} in wallet
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => { setShowRedeem(false); redeemReset(); }}
                    className="flex-1 h-12 rounded-xl border-2 border-[#E8E4DE] text-sm font-semibold text-[#4A3728] cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={!redeemValid || redeemSubmitting}
                    className={`flex-1 h-12 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 ${
                      (!redeemValid || redeemSubmitting) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-95 active:scale-[0.98]'
                    }`}>
                    {redeemSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Redeem'}
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
