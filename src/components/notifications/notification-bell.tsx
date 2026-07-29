'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check } from 'lucide-react';
import { useNotificationStore, getNotificationIcon } from '@/lib/store/notification-store';
import { cn } from '@/lib/utils/cn';

type FilterTab = 'All' | 'Orders' | 'Offers' | 'System';

const ORDER_TYPES = ['order_placed', 'order_shipped', 'order_delivered', 'return_update', 'refund_success'];
const OFFER_TYPES = ['offer_alert', 'price_drop', 'review_reminder'];
const SYSTEM_TYPES = ['welcome', 'system', 'seller_approved', 'product_approved', 'payment_success'];

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<FilterTab>('All');
  const panelRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markRead, markAllRead, remove } = useNotificationStore();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const filtered = notifications.filter((n) => {
    if (filter === 'Orders') return ORDER_TYPES.includes(n.type);
    if (filter === 'Offers') return OFFER_TYPES.includes(n.type);
    if (filter === 'System') return SYSTEM_TYPES.includes(n.type);
    return true;
  });

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#FFF3E8] text-[#4A3728] hover:text-[#FF7A00] transition-all cursor-pointer"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white text-[10px] font-bold flex items-center justify-center px-1"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="absolute right-0 top-12 w-[360px] max-w-[calc(100vw-1rem)] bg-white rounded-2xl shadow-2xl border border-[#E8E4DE] overflow-hidden z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E4DE]">
              <div>
                <p className="text-sm font-bold text-[#1A0A00]">Notifications</p>
                {unreadCount > 0 && (
                  <p className="text-[11px] text-[#8C7B6E]">{unreadCount} unread</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-semibold text-[#FF7A00] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Check size={12} /> Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg text-[#8C7B6E] hover:text-[#1A0A00] hover:bg-[#F5F4F0] cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 px-3 py-2 border-b border-[#E8E4DE]">
              {(['All', 'Orders', 'Offers', 'System'] as FilterTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all',
                    filter === tab
                      ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white'
                      : 'text-[#8C7B6E] hover:text-[#FF7A00] hover:bg-[#FFF3E8]'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto divide-y divide-[#F5F4F0]">
              {filtered.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell size={32} className="text-[#E8E4DE] mx-auto mb-2" />
                  <p className="text-sm text-[#8C7B6E]">No notifications</p>
                </div>
              ) : (
                filtered.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-[#FAFAF8] transition-colors group',
                      !n.read && 'bg-[#FFF8F0]'
                    )}
                  >
                    <div className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0',
                      !n.read ? 'bg-[#FFF3E8]' : 'bg-[#F5F4F0]'
                    )}>
                      {getNotificationIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn('text-xs font-semibold', !n.read ? 'text-[#1A0A00]' : 'text-[#4A3728]')}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-[#FF7A00] shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#8C7B6E] leading-relaxed mt-0.5 line-clamp-2">{n.body}</p>
                      <p className="text-[10px] text-[#B5A99A] mt-1">{formatRelative(n.createdAt)}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-[#B5A99A] hover:text-[#EF4444] transition-all cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
