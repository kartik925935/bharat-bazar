'use client';

import { useState, useEffect, useRef } from 'react';

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startTime: number;
          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

export function StatsSection() {
  const { count: sellers, ref: sellersRef } = useCountUp(50234);
  const { count: products, ref: productsRef } = useCountUp(234891);
  const { count: revenue, ref: revenueRef } = useCountUp(124);
  const { count: rating, ref: ratingRef } = useCountUp(48);

  return (
    <div className="bg-gradient-to-r from-[#FF7A00] to-[#FF4500] py-6 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div ref={sellersRef} className="px-4">
            <div className="text-2xl font-bold">{sellers.toLocaleString()}+</div>
            <div className="text-xs text-white/80 mt-0.5">Active Sellers</div>
          </div>
          <div ref={productsRef} className="px-4">
            <div className="text-2xl font-bold">{products.toLocaleString()}+</div>
            <div className="text-xs text-white/80 mt-0.5">Products Listed</div>
          </div>
          <div ref={revenueRef} className="px-4">
            <div className="text-2xl font-bold">₹{(revenue / 10).toFixed(1)} Cr+</div>
            <div className="text-xs text-white/80 mt-0.5">Total Sales</div>
          </div>
          <div ref={ratingRef} className="px-4">
            <div className="text-2xl font-bold">{(rating / 10).toFixed(1)} ★</div>
            <div className="text-xs text-white/80 mt-0.5">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}
