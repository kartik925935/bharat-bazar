'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function FlashSaleSection() {
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 23, s: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) return { h: 0, m: 0, s: 0 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const banners = [
    {
      title: 'Diwali Festive Sale',
      subtitle: 'Festival of Crafts',
      discount: 'Up to 50% OFF',
      gradient: 'from-[#FF7A00] to-[#FFB800]',
      icon: '🪔',
      href: '/products?sale=diwali',
    },
    {
      title: 'Village Products Week',
      subtitle: 'Direct from Artisans',
      discount: 'Extra 20% OFF',
      gradient: 'from-[#1A9E4E] to-[#0D7A3B]',
      icon: '🌾',
      href: '/products?sale=village',
    },
    {
      title: 'Flash Deal Countdown',
      subtitle: `⏰ Ends in ${String(timeLeft.h).padStart(2, '0')}:${String(timeLeft.m).padStart(2, '0')}:${String(timeLeft.s).padStart(2, '0')}`,
      discount: 'Up to 70% OFF',
      gradient: 'from-[#DC2626] to-[#FF4500]',
      icon: '⚡',
      href: '/products?sale=flash',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {banners.map((b) => (
            <Link key={b.title} href={b.href} className="block group">
              <div
                className={`rounded-2xl p-8 text-white overflow-hidden relative transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl bg-gradient-to-br ${b.gradient}`}
                style={{ minHeight: 180 }}
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{b.icon}</div>
                <div className="text-xs font-semibold text-white/80 mb-1">{b.subtitle}</div>
                <div className="text-2xl font-black mb-4">{b.title}</div>
                <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-sm font-bold">
                  {b.discount}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
