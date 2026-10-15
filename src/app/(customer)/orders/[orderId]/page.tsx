'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import {
  ChevronRight, Package, CheckCircle2, Phone, MessageSquare,
  FileText, RotateCcw, Star, RefreshCw, ArrowLeft, MapPin,
  CreditCard, Truck,
} from 'lucide-react';
import { STATUS_CONFIG, type MockOrder } from '@/lib/mock/orders';
import { mapDbOrderToUi } from '@/lib/utils/order-mapper';
import { getOrderById } from '@/actions/orders/actions';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

function OrderDetailSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-5 animate-pulse">
      <div className="h-5 w-48 rounded skeleton" />
      <div className="h-32 rounded-2xl skeleton" />
      <div className="h-72 rounded-2xl skeleton" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-36 rounded-2xl skeleton" />
        <div className="h-36 rounded-2xl skeleton" />
      </div>
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<MockOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadOrder() {
      setLoading(true);
      try {
        const res = await getOrderById(orderId);
        if (!isMounted) return;
        if (res.error || !res.data) {
          setNotFoundState(true);
        } else {
          setOrder(mapDbOrderToUi(res.data));
        }
      } catch (err) {
        if (!isMounted) return;
        setNotFoundState(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (loading) return <OrderDetailSkeleton />;
  if (notFoundState || !order) return notFound();

  const statusCfg = STATUS_CONFIG[order.status];
  const isActive = ['confirmed','processing','packed','shipped','in_transit','out_for_delivery'].includes(order.status);
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  const statusMessages: Record<string, string> = {
    in_transit:       '🚚 Your order is on the way!',
    out_for_delivery: '📦 Out for delivery today!',
    delivered:        '✅ Order delivered successfully!',
    cancelled:        '❌ This order was cancelled',
    confirmed:        '✅ Order confirmed!',
    processing:       '⚙️ Seller is preparing your order',
    packed:           '📦 Order packed and ready for pickup',
    shipped:          '🚛 Order has been shipped',
  };

  const heroGradients: Record<string, string> = {
    in_transit:       'from-[#FF7A00] to-[#FF4500]',
    out_for_delivery: 'from-[#D97706] to-[#B45309]',
    delivered:        'from-[#16A34A] to-[#15803D]',
    cancelled:        'from-[#6B7280] to-[#4B5563]',
    confirmed:        'from-[#2563EB] to-[#1D4ED8]',
    processing:       'from-[#4F46E5] to-[#4338CA]',
    packed:           'from-[#0891B2] to-[#0E7490]',
    shipped:          'from-[#0369A1] to-[#075985]',
  };

  const heroGradient = heroGradients[order.status] || 'from-[#FF7A00] to-[#FF4500]';

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#8C7B6E]">
        <Link href="/orders" className="hover:text-[#FF7A00] font-medium flex items-center gap-1 cursor-pointer">
          <ArrowLeft size={12} /> My Orders
        </Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-[#1A0A00]">#{order.orderNumber}</span>
      </nav>

      {/* Status Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${heroGradient} p-5 md:p-6 text-white`}
      >
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -right-2 -bottom-6 w-20 h-20 rounded-full bg-white/10" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-white/70 mb-1">#{order.orderNumber}</p>
              <h2 className="text-lg md:text-xl font-black mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {statusMessages[order.status] || 'Processing your order'}
              </h2>
              {isActive && (
                <p className="text-sm text-white/80">
                  Expected by {new Date(order.expectedDelivery).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              )}
              {isDelivered && (
                <p className="text-sm text-white/80">
                  Delivered on {new Date(order.timeline.find(t => t.status === 'delivered')?.timestamp || order.expectedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-black">{formatCurrency(order.total)}</p>
              <p className="text-xs text-white/70">Total Paid</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delivery Partner (if in transit/out for delivery) */}
      {(order.status === 'in_transit' || order.status === 'out_for_delivery') && order.deliveryPartner && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#E8E4DE] p-4">
          <p className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider mb-3">Delivery Partner</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white font-bold">
              {order.deliveryPartner.name[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#1A0A00]">{order.deliveryPartner.name}</p>
              <p className="text-xs text-[#8C7B6E]">⭐ {order.deliveryPartner.rating} • {order.deliveryPartner.vehicle}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toast.info('Call feature coming soon')}
                className="w-9 h-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#16A34A] cursor-pointer hover:bg-[#DCFCE7] transition-colors"
              >
                <Phone size={15} />
              </button>
              <button
                onClick={() => toast.info('Chat feature coming soon')}
                className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] cursor-pointer hover:bg-[#DBEAFE] transition-colors"
              >
                <MessageSquare size={15} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5">
        <p className="text-sm font-black text-[#1A0A00] mb-4">Order Timeline</p>
        <div className="relative space-y-0">
          {order.timeline.map((step, i) => {
            const isLast = i === order.timeline.length - 1;
            const isCurrent = step.done && (!order.timeline[i + 1] || !order.timeline[i + 1].done);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="relative flex gap-4"
              >
                {/* Line */}
                {!isLast && (
                  <div className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${step.done ? 'bg-[#FF7A00]' : 'bg-[#E8E4DE]'}`} />
                )}
                {/* Dot */}
                <div className={`relative w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  step.done
                    ? 'bg-[#FF7A00]'
                    : 'border-2 border-[#E8E4DE] bg-white'
                }`}>
                  {step.done && <CheckCircle2 size={16} className="text-white" />}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#FF7A00]"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.2, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-5 ${isLast ? '' : ''}`}>
                  <p className={`text-sm font-bold ${step.done ? 'text-[#1A0A00]' : 'text-[#B5A99A]'}`}>{step.label}</p>
                  {step.timestamp && (
                    <p className="text-[11px] text-[#8C7B6E] mt-0.5">
                      {new Date(step.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                  )}
                  <p className={`text-xs mt-0.5 ${step.done ? 'text-[#4A3728]' : 'text-[#B5A99A]'}`}>{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5">
        <p className="text-sm font-black text-[#1A0A00] mb-4">Items in this Order</p>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.productId} className="flex gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F5F4F0] shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  unoptimized
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A0A00] leading-snug">{item.name}</p>
                <p className="text-xs text-[#8C7B6E] mt-0.5">by {item.sellerName}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <p className="text-sm font-black text-[#FF7A00]">{formatCurrency(item.price)}</p>
                  {item.mrp > item.price && (
                    <p className="text-xs text-[#B5A99A] line-through">{formatCurrency(item.mrp)}</p>
                  )}
                  <p className="text-xs text-[#8C7B6E]">Qty: {item.quantity}</p>
                </div>
                {isDelivered && !item.reviewed && (
                  <Link href="/my-reviews" className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-[#CA8A04] bg-[#FEFCE8] px-2.5 py-1 rounded-lg border border-[#FDE68A] cursor-pointer hover:bg-[#FEF08A] transition-colors">
                    <Star size={11} /> Write Review
                  </Link>
                )}
                {isDelivered && (
                  <Link href="/returns" className="ml-2 inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-lg border border-[#BFDBFE] cursor-pointer hover:bg-[#DBEAFE] transition-colors">
                    <RotateCcw size={11} /> Return
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Address + Payment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address */}
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-[#FF7A00]" />
            <p className="text-sm font-black text-[#1A0A00]">Delivery Address</p>
          </div>
          <p className="text-sm font-semibold text-[#1A0A00]">{order.address.name}</p>
          <p className="text-xs text-[#4A3728] mt-1 leading-relaxed">
            {order.address.line1}
            {order.address.line2 && <><br />{order.address.line2}</>}
            <br />{order.address.city}, {order.address.state} {order.address.pincode}
          </p>
          <p className="text-xs text-[#8C7B6E] mt-1.5">{order.address.phone}</p>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={16} className="text-[#FF7A00]" />
            <p className="text-sm font-black text-[#1A0A00]">Payment Details</p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[#4A3728]">
              <span>MRP Total</span>
              <span>{formatCurrency(order.items.reduce((s, i) => s + i.mrp * i.quantity, 0))}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#16A34A]">
                <span>Discount{order.coupon ? ` (${order.coupon})` : ''}</span>
                <span>− {formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#4A3728]">
              <span>Delivery</span>
              <span className={order.shipping === 0 ? 'text-[#16A34A] font-semibold' : ''}>
                {order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}
              </span>
            </div>
            <div className="border-t border-[#E8E4DE] pt-2 flex justify-between font-black text-sm text-[#1A0A00]">
              <span>Total Paid</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
          <p className="text-[11px] text-[#8C7B6E] mt-3">
            Paid via {order.paymentMethod} • {order.paymentId}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {isActive && (
          <button
            onClick={() => toast.info('Contact seller feature coming soon')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E8E4DE] text-sm font-semibold text-[#4A3728] hover:border-[#FF7A00]/30 transition-colors cursor-pointer"
          >
            <MessageSquare size={15} /> Contact Seller
          </button>
        )}
        {isDelivered && (
          <>
            <Link href="/my-reviews" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FEFCE8] border border-[#FDE68A] text-sm font-semibold text-[#CA8A04] cursor-pointer hover:bg-[#FEF08A] transition-colors">
              <Star size={15} /> Rate Products
            </Link>
            <Link href="/returns" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E8E4DE] text-sm font-semibold text-[#4A3728] hover:border-[#FF7A00]/30 transition-colors cursor-pointer">
              <RotateCcw size={15} /> Return Order
            </Link>
          </>
        )}
        <button
          onClick={() => toast.info('Invoice download coming soon')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E8E4DE] text-sm font-semibold text-[#4A3728] hover:border-[#FF7A00]/30 transition-colors cursor-pointer"
        >
          <FileText size={15} /> Download Invoice
        </button>
      </div>

      {/* Help */}
      <div className="bg-[#FFF3E8] border border-[#FFD9B2] rounded-2xl p-5">
        <p className="text-sm font-bold text-[#1A0A00] mb-3">Need help with this order?</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/help" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E8E4DE] text-xs font-semibold text-[#4A3728] hover:border-[#FF7A00]/30 transition-colors cursor-pointer">
            <MessageSquare size={13} /> Chat Support
          </Link>
          <button
            onClick={() => toast.info('Email support: support@bharatbazaar.in')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E8E4DE] text-xs font-semibold text-[#4A3728] hover:border-[#FF7A00]/30 transition-colors cursor-pointer"
          >
            <FileText size={13} /> Email Us
          </button>
          <button
            onClick={() => toast.info('Toll-free: 1800-XXX-XXXX')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E8E4DE] text-xs font-semibold text-[#4A3728] hover:border-[#FF7A00]/30 transition-colors cursor-pointer"
          >
            <Phone size={13} /> Call Us
          </button>
        </div>
      </div>
    </div>
  );
}
