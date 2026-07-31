'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Search, MessageSquare, Phone, Mail, ChevronDown, ChevronUp, Package, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { toast } from 'sonner';

import { FAQS } from '@/lib/mock/customer';

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter(
    (f) => f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#FF7A00] to-[#FF4500] rounded-2xl p-6 md:p-8 text-white text-center space-y-4">
        <h1 className="text-2xl md:text-3xl font-black" style={{ fontFamily: "'Playfair Display', serif" }}>
          How can we help you today?
        </h1>
        <div className="relative max-w-md mx-auto">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B5A99A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help topics (e.g. returns, tracking, refund)…"
            className="w-full h-11 pl-10 pr-4 rounded-xl text-sm text-[#1A0A00] bg-white outline-none placeholder-[#B5A99A] shadow-md"
          />
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Package, title: 'Track Order', sub: 'Live status', link: '/orders' },
          { icon: RotateCcw, title: 'Return Item', sub: '7-day policy', link: '/returns' },
          { icon: ShieldCheck, title: 'Artisan Trust', sub: 'Authenticity', link: '/about' },
          { icon: Truck, title: 'Shipping info', sub: 'Delivery times', link: '/faq' },
        ].map(({ icon: Icon, title, sub, link }) => (
          <a key={title} href={link} className="bg-white rounded-2xl border border-[#E8E4DE] p-4 text-center hover:border-[#FF7A00]/30 transition-all group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-[#FFF3E8] text-[#FF7A00] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <Icon size={18} />
            </div>
            <p className="text-xs font-bold text-[#1A0A00]">{title}</p>
            <p className="text-[10px] text-[#8C7B6E]">{sub}</p>
          </a>
        ))}
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5 space-y-3">
        <h3 className="text-base font-black text-[#1A0A00] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Frequently Asked Questions
        </h3>
        {filteredFaqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="border-b border-[#F5F4F0] last:border-0 pb-3 last:pb-0">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between text-left text-sm font-bold text-[#1A0A00] hover:text-[#FF7A00] py-2 cursor-pointer transition-colors"
              >
                <span>{faq.question}</span>
                {isOpen ? <ChevronUp size={16} className="text-[#FF7A00] shrink-0" /> : <ChevronDown size={16} className="text-[#8C7B6E] shrink-0" />}
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-[#4A3728] leading-relaxed pt-1 pb-2"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Contact Channel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5 text-center space-y-2">
          <MessageSquare size={24} className="text-[#FF7A00] mx-auto" />
          <p className="text-sm font-bold text-[#1A0A00]">24/7 Live Chat</p>
          <p className="text-xs text-[#8C7B6E]">Speak with a support agent right now</p>
          <button
            onClick={() => toast.info('Live chat support connecting…')}
            className="w-full py-2 rounded-xl bg-[#FFF3E8] text-[#FF7A00] text-xs font-bold hover:bg-[#FFE4CC] cursor-pointer"
          >
            Start Chat
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5 text-center space-y-2">
          <Phone size={24} className="text-[#16A34A] mx-auto" />
          <p className="text-sm font-bold text-[#1A0A00]">Phone Support</p>
          <p className="text-xs text-[#8C7B6E]">Toll-free: 1800-123-4567 (9 AM - 9 PM)</p>
          <button
            onClick={() => toast.info('Calling 1800-123-4567')}
            className="w-full py-2 rounded-xl bg-[#F0FDF4] text-[#16A34A] text-xs font-bold hover:bg-[#DCFCE7] cursor-pointer"
          >
            Call Support
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5 text-center space-y-2">
          <Mail size={24} className="text-[#2563EB] mx-auto" />
          <p className="text-sm font-bold text-[#1A0A00]">Email Support</p>
          <p className="text-xs text-[#8C7B6E]">support@bharatbazaar.in</p>
          <button
            onClick={() => toast.info('Email sent to support@bharatbazaar.in')}
            className="w-full py-2 rounded-xl bg-[#EFF6FF] text-[#2563EB] text-xs font-bold hover:bg-[#DBEAFE] cursor-pointer"
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}
