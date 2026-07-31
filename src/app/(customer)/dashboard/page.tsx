'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import {
  Package, Heart, Star, MapPin, RotateCcw, MessageCircle,
  Gift, Download, ArrowRight, Check, CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { useBrowsingStore } from '@/lib/store/browsing-store';
import { useNotificationStore } from '@/lib/store/notification-store';
import { mockOrders, STATUS_CONFIG } from '@/lib/mock/orders';
import { mockProducts } from '@/lib/mock/products';
import { MOCK_USER_LOYALTY } from '@/lib/mock/customer';
import { formatCurrency } from '@/lib/utils/format-currency';
import { ProductCard } from '@/components/storefront/product-card';

/* ── Animated Counter ─────────────────────────────────────────────────────── */
function Counter({ end, prefix = '', suffix = '', duration = 1500 }: {
  end: number; prefix?: string; suffix?: string; duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || end === 0) { setCount(end); return; }
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  const fmt = prefix === '₹'
    ? `₹${count >= 1000 ? (count / 1000).toFixed(1) + 'K' : count}`
    : `${count}${suffix}`;

  return <span ref={ref}>{fmt}</span>;
}

/* ── Greeting ─────────────────────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', emoji: '☀️', gradient: 'from-[#FF7A00] via-[#FF9A00] to-[#FFB347]' };
  if (h < 17) return { text: 'Good Afternoon', emoji: '🌤️', gradient: 'from-[#FF6B35] via-[#FF7A00] to-[#FF9A00]' };
  if (h < 21) return { text: 'Good Evening', emoji: '🌅', gradient: 'from-[#C42B00] via-[#E63900] to-[#FF7A00]' };
  return { text: 'Good Night', emoji: '🌙', gradient: 'from-[#312E81] via-[#4C1D95] to-[#7C3AED]' };
}

/* ── Order Timeline Mini ──────────────────────────────────────────────────── */
function MiniTimeline({ timeline }: { timeline: { done: boolean; label: string }[] }) {
  const steps = timeline.slice(0, 5);
  return (
    <div className="flex items-center gap-1 mt-3">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
            step.done ? 'bg-[#FF7A00] text-white' : 'bg-[#E8E4DE] text-[#B5A99A]'
          }`}>
            {step.done ? <Check size={9} /> : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-4 ${step.done && steps[i + 1]?.done ? 'bg-[#FF7A00]' : 'bg-[#E8E4DE]'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-8 animate-pulse">
      <div className="h-36 rounded-2xl skeleton" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map(i => <div key={i} className="h-32 rounded-2xl skeleton" />)}
      </div>
      <div className="space-y-4">
        <div className="h-6 w-40 rounded skeleton" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0,1].map(i => <div key={i} className="h-40 rounded-2xl skeleton" />)}
        </div>
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {[0,1,2,3,4,5].map(i => <div key={i} className="h-24 rounded-2xl skeleton" />)}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function CustomerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const wishlistItems = useWishlistStore((s) => s.items);
  const { recentlyViewed } = useBrowsingStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (!user) return null;
  if (loading) return <DashboardSkeleton />;

  const greeting = getGreeting();
  const firstName = user.name.split(' ')[0];

  const activeOrders = mockOrders.filter((o) =>
    ['confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery'].includes(o.status)
  );
  const deliveredOrders = mockOrders.filter((o) => o.status === 'delivered');
  const totalSpent = mockOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const pendingReviews = mockOrders
    .filter(o => o.status === 'delivered')
    .flatMap(o => o.items)
    .filter(i => !i.reviewed).length;

  const recommendations = mockProducts.slice(0, 6);

  const STATS = [
    { icon: Package, label: 'Total Orders', value: mockOrders.length, sub: `${activeOrders.length} active`, link: '/orders', iconBg: 'bg-[#FFF3E8]', iconColor: 'text-[#FF7A00]' },
    { icon: Heart,   label: 'Wishlist',      value: wishlistItems.length, sub: 'Saved items', link: '/wishlist', iconBg: 'bg-[#FEF2F2]', iconColor: 'text-[#EF4444]' },
    { icon: Gift,    label: 'Total Spent',   value: totalSpent, isPrice: true, sub: 'Lifetime value', link: '/spending-summary', iconBg: 'bg-[#F0FDF4]', iconColor: 'text-[#16A34A]' },
    { icon: Star,    label: 'Reviews Due',   value: pendingReviews, sub: 'Write now →', link: '/my-reviews', iconBg: 'bg-[#FEFCE8]', iconColor: 'text-[#CA8A04]' },
  ];

  const QUICK_ACTIONS = [
    { icon: MapPin,        label: 'Track Order',  sub: 'Live tracking',  bg: 'bg-[#FFF3E8]', iconColor: 'text-[#FF7A00]', link: '/orders?filter=active' },
    { icon: Star,          label: 'Write Review', sub: `${pendingReviews} pending`, bg: 'bg-[#FEFCE8]', iconColor: 'text-[#CA8A04]', link: '/my-reviews', badge: pendingReviews },
    { icon: RotateCcw,     label: 'Return Item',  sub: 'Easy returns',   bg: 'bg-[#EFF6FF]', iconColor: 'text-[#2563EB]', link: '/returns' },
    { icon: Download,      label: 'Get Invoice',  sub: 'PDF format',     bg: 'bg-[#F0FDF4]', iconColor: 'text-[#16A34A]', link: '/orders' },
    { icon: MessageCircle, label: 'Get Help',     sub: '24/7 support',   bg: 'bg-[#F5F3FF]', iconColor: 'text-[#7C3AED]', link: '/help' },
    { icon: Gift,          label: 'Refer & Earn', sub: 'Earn ₹100',      bg: 'bg-[#FFF1F2]', iconColor: 'text-[#E11D48]', link: '/wallet' },
  ];

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
  const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="p-4 sm:p-6 space-y-8">

      {/* ── GREETING HERO ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${greeting.gradient} p-6 md:p-8 text-white`}
      >
        {/* Decorative mandala */}
        <div className="absolute right-0 top-0 w-48 h-48 opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-spin" style={{ animationDuration: '30s' }} fill="white">
            <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="0.5" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * 2 * Math.PI;
              return <line key={i} x1={100 + 60 * Math.cos(a)} y1={100 + 60 * Math.sin(a)} x2={100 + 90 * Math.cos(a)} y2={100 + 90 * Math.sin(a)} stroke="white" strokeWidth="0.5" />;
            })}
          </svg>
        </div>

        <div className="relative">
          <p className="text-white/70 text-sm font-medium mb-1">Welcome back 🙏</p>
          <h1 className="text-2xl md:text-3xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {greeting.text}, {firstName}! {greeting.emoji}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
              <Package size={14} />
              <span>{activeOrders.length} Active {activeOrders.length === 1 ? 'Order' : 'Orders'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
              <Heart size={14} />
              <span>{wishlistItems.length} Wishlisted</span>
            </div>
            {pendingReviews > 0 && (
              <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
                <Star size={14} />
                <span>{pendingReviews} Review{pendingReviews > 1 ? 's' : ''} Due</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <motion.div
        variants={stagger} initial="hidden" animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} variants={fadeUp}>
              <Link href={s.link} className="block">
                <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5 hover:shadow-[0_8px_32px_rgba(255,122,0,0.1)] hover:-translate-y-1 hover:border-[#FF7A00]/20 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon size={20} className={s.iconColor} />
                    </div>
                    <span className="text-[10px] font-bold text-[#8C7B6E] bg-[#F5F4F0] px-2 py-1 rounded-full">
                      {s.sub}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-[#1A0A00]">
                    {s.isPrice
                      ? <Counter end={totalSpent} prefix="₹" />
                      : <Counter end={s.value as number} />}
                  </p>
                  <p className="text-xs text-[#8C7B6E] mt-0.5">{s.label}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── ACTIVE ORDERS TRACKER ────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Track Your Orders
          </h2>
          <Link href="/orders" className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {activeOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E4DE] p-8 text-center">
            <Package size={40} className="text-[#E8E4DE] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#4A3728]">No active orders right now</p>
            <p className="text-xs text-[#8C7B6E] mt-1 mb-4">Start exploring handcrafted products from India</p>
            <Link href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#FF7A00] to-[#FF4500]">
              Shop Now <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeOrders.map((order) => {
              const status = STATUS_CONFIG[order.status];
              const item = order.items[0];
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-[#E8E4DE] p-4 hover:shadow-[0_4px_16px_rgba(255,122,0,0.08)] transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-bold text-[#8C7B6E]">#{order.orderNumber}</p>
                      <p className="text-[10px] text-[#B5A99A]">{new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ color: status.color, background: status.bg }}>
                      {status.label}
                    </span>
                  </div>

                  <div className="flex gap-3 mb-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-[#F5F4F0] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#1A0A00] line-clamp-2 leading-snug">{item.name}</p>
                      <p className="text-xs font-bold text-[#FF7A00] mt-1">{formatCurrency(order.total)}</p>
                    </div>
                  </div>

                  <MiniTimeline timeline={order.timeline} />

                  <p className="text-[11px] text-[#8C7B6E] mt-2 flex items-center gap-1">
                    📅 Expected: {new Date(order.expectedDelivery).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <Link href={`/orders/${order.id}`} className="flex-1 h-9 flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold cursor-pointer">
                      Track Order
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── QUICK ACTIONS ────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-black text-[#1A0A00] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Quick Actions
        </h2>
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <motion.div key={action.label} variants={fadeUp}>
                <Link href={action.link} className="block">
                  <div className="relative bg-white rounded-2xl border border-[#E8E4DE] p-4 text-center hover:shadow-[0_4px_20px_rgba(255,122,0,0.1)] hover:-translate-y-1 hover:border-[#FF7A00]/20 transition-all group cursor-pointer">
                    {action.badge && action.badge > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF7A00] text-white text-[10px] font-bold flex items-center justify-center">
                        {action.badge}
                      </span>
                    )}
                    <div className={`w-11 h-11 rounded-xl ${action.bg} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                      <Icon size={20} className={action.iconColor} />
                    </div>
                    <p className="text-xs font-bold text-[#1A0A00] leading-tight">{action.label}</p>
                    <p className="text-[10px] text-[#8C7B6E] mt-0.5">{action.sub}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ── RECENTLY VIEWED ──────────────────────────────────────────────── */}
      {recentlyViewed.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Continue Shopping
            </h2>
            <Link href="/recently-viewed" className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentlyViewed.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* ── LOYALTY CARD ─────────────────────────────────────────────────── */}
      {(() => {
        const loyalty = MOCK_USER_LOYALTY;
        const tierColors: Record<string, string> = { Bronze: 'from-[#CD7F32] to-[#A0522D]', Silver: 'from-[#6B7280] to-[#4B5563]', Gold: 'from-[#FF7A00] to-[#E63900]', Platinum: 'from-[#312E81] to-[#4C1D95]' };
        const tierMarkers = ['Bronze', 'Silver', 'Gold', 'Platinum'];
        const currentTierIdx = tierMarkers.indexOf(loyalty.tier);
        const progressPct = Math.min(100, (loyalty.points / loyalty.nextTierPoints) * 100);
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${tierColors[loyalty.tier] ?? tierColors.Bronze} p-6 text-white`}
          >
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -right-4 -bottom-8 w-28 h-28 rounded-full bg-white/10" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-bold text-white/70 mb-1">🏆 BHARAT BAZAAR REWARDS</p>
                  <h3 className="text-xl font-black">Hi, {firstName}!</h3>
                  <p className="text-sm text-white/80">{loyalty.tier} Member</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black">{loyalty.points}</p>
                  <p className="text-xs text-white/70">Available Points</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-white/80 mb-1">
                  <span>{loyalty.points} / {loyalty.nextTierPoints} pts to next tier</span>
                  <span>{loyalty.nextTierPoints - loyalty.points} more!</span>
                </div>
                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progressPct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-white/60 mt-1">
                  {tierMarkers.map((t, i) => (
                    <span key={t} className={i <= currentTierIdx ? 'text-white font-bold' : ''}>{t}{i === currentTierIdx ? ' ★' : ''}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link href="/wallet" className="px-4 py-2 rounded-xl bg-white text-[#FF7A00] text-xs font-bold hover:bg-white/90 transition-colors">
                  Redeem Points
                </Link>
                <Link href="/products" className="px-4 py-2 rounded-xl bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })()}

      {/* ── RECOMMENDATIONS ──────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
              ✨ Picked for You
            </h2>
            <p className="text-xs text-[#8C7B6E] mt-0.5">Based on your browsing history</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommendations.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

    </div>
  );
}
