'use client';

import { Bell, Check, ShoppingCart, Star, RotateCcw, Landmark, Package, Shield, Settings, Info } from 'lucide-react';
import { useSellerStore, SellerNotif } from '@/lib/store/seller-store';
import Link from 'next/link';
import { toast } from 'sonner';

const NOTIF_ICONS: Record<SellerNotif['type'], React.ReactNode> = {
  new_order: <ShoppingCart size={16} className="text-orange-500" />,
  order_cancelled: <ShoppingCart size={16} className="text-red-500" />,
  review_received: <Star size={16} className="text-yellow-500" />,
  return_requested: <RotateCcw size={16} className="text-amber-500" />,
  settlement_processed: <Landmark size={16} className="text-emerald-500" />,
  product_approved: <Package size={16} className="text-blue-500" />,
  product_rejected: <Package size={16} className="text-red-500" />,
  kyc_update: <Shield size={16} className="text-indigo-500" />,
  low_stock: <Package size={16} className="text-amber-500" />,
  tier_change: <Star size={16} className="text-purple-500" />,
  system: <Info size={16} className="text-gray-500" />,
};

export default function SellerNotificationsPage() {
  const { notifications, markNotifRead, markAllNotifRead, unreadNotifCount } = useSellerStore();
  const unreadCount = unreadNotifCount();
  const sorted = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A]">Notifications</h1>
          <p className="text-sm text-[#9B8F84]">You have {unreadCount} unread messages</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => { markAllNotifRead(); toast.success('All marked as read'); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#F0EDE8] rounded-xl text-sm font-bold text-[#4A4540] hover:bg-[#FAFAF8]"
          >
            <Check size={16} /> Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#F0EDE8] overflow-hidden">
        {sorted.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={40} className="text-[#D4C9BF] mx-auto mb-3" />
            <p className="text-base font-bold text-[#1A1A1A]">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0EDE8]">
            {sorted.map(notif => (
              <div key={notif.id} onClick={() => { if(!notif.read) markNotifRead(notif.id); }} className={`p-4 flex gap-4 transition-colors ${notif.read ? 'bg-white' : 'bg-[#FFF7ED] cursor-pointer hover:bg-orange-50/50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.read ? 'bg-[#FAFAF8]' : 'bg-white shadow-sm border border-orange-100'}`}>
                  {NOTIF_ICONS[notif.type]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm ${notif.read ? 'font-bold text-[#1A1A1A]' : 'font-black text-[#FF7A00]'}`}>{notif.title}</h3>
                    <span className="text-[10px] text-[#9B8F84]">{new Date(notif.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <p className={`text-sm mb-2 ${notif.read ? 'text-[#4A4540]' : 'text-[#1A1A1A]'}`}>{notif.message}</p>
                  {notif.link && (
                    <Link href={notif.link} className="text-xs font-bold text-[#FF7A00] hover:underline">View Details →</Link>
                  )}
                </div>
                {!notif.read && <div className="w-2.5 h-2.5 rounded-full bg-[#FF4500] mt-1.5 flex-shrink-0" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
