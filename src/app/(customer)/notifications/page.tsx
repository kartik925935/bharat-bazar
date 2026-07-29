'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Trash2, Package, Tag, Shield, Filter } from 'lucide-react';
import { useNotificationStore } from '@/lib/store/notification-store';
import { toast } from 'sonner';

type FilterCategory = 'all' | 'order' | 'offer' | 'system';

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead, remove, clear } = useNotificationStore();
  const [filter, setFilter] = useState<FilterCategory>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'order') return n.type.includes('order');
    if (filter === 'offer') return n.type.includes('coupon') || n.type.includes('deal') || n.type.includes('price');
    if (filter === 'system') return n.type.includes('account') || n.type.includes('security') || n.type.includes('review');
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
            🔔 Notifications
          </h1>
          <p className="text-sm text-[#8C7B6E] mt-0.5">Stay updated on your orders, offers and account alerts</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => { markAllRead(); toast.success('All marked as read'); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E8E4DE] text-xs font-semibold text-[#4A3728] hover:border-[#FF7A00]/30 transition-colors cursor-pointer"
            >
              <CheckCheck size={14} className="text-[#FF7A00]" /> Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={() => { clear(); toast.info('All notifications cleared'); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E8E4DE] text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
            >
              <Trash2 size={14} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#E8E4DE] pb-2">
        {(['all', 'order', 'offer', 'system'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              filter === t ? 'bg-[#FFF3E8] text-[#FF7A00]' : 'text-[#8C7B6E] hover:text-[#1A0A00]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-12 text-center">
          <Bell size={40} className="text-[#E8E4DE] mx-auto mb-3" />
          <p className="text-sm font-bold text-[#4A3728]">No notifications</p>
          <p className="text-xs text-[#8C7B6E] mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => !item.read && markRead(item.id)}
              className={`bg-white rounded-2xl border p-4 transition-all cursor-pointer flex items-start gap-4 ${
                !item.read ? 'border-[#FF7A00] bg-[#FFFBF7] shadow-[0_4px_16px_rgba(255,122,0,0.06)]' : 'border-[#E8E4DE] hover:border-[#FF7A00]/20'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                item.type.includes('order') ? 'bg-[#FFF3E8] text-[#FF7A00]' : item.type.includes('coupon') ? 'bg-[#FEFCE8] text-[#CA8A04]' : 'bg-[#EFF6FF] text-[#2563EB]'
              }`}>
                {item.type.includes('order') ? <Package size={18} /> : item.type.includes('coupon') ? <Tag size={18} /> : <Shield size={18} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-[#1A0A00]">{item.title}</p>
                  <span className="text-[10px] text-[#8C7B6E] shrink-0">{item.createdAt}</span>
                </div>
                <p className="text-xs text-[#4A3728] mt-1 leading-relaxed">{item.body}</p>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); remove(item.id); }}
                className="text-[#B5A99A] hover:text-[#DC2626] p-1 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
