import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType =
  | 'order_placed' | 'order_shipped' | 'order_delivered'
  | 'payment_success' | 'review_reminder' | 'price_drop'
  | 'offer_alert' | 'return_update' | 'refund_success'
  | 'seller_approved' | 'product_approved' | 'system' | 'welcome';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

const ICON_MAP: Record<NotificationType, string> = {
  order_placed:     '🛒',
  order_shipped:    '🚚',
  order_delivered:  '📦',
  payment_success:  '💳',
  review_reminder:  '⭐',
  price_drop:       '❤️',
  offer_alert:      '🏷️',
  return_update:    '↩️',
  refund_success:   '💰',
  seller_approved:  '✅',
  product_approved: '🎉',
  system:           '🔔',
  welcome:          '👋',
};

export function getNotificationIcon(type: NotificationType): string {
  return ICON_MAP[type] ?? '🔔';
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  add: (notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [
        {
          id: 'n1',
          type: 'order_shipped',
          title: 'Order Shipped!',
          body: 'Your Madhubani painting is on its way. Expected by Jan 23.',
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'n2',
          type: 'offer_alert',
          title: 'New Offer',
          body: 'Flash sale: 25% off on all Pottery this weekend!',
          read: false,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'n3',
          type: 'welcome',
          title: 'Welcome to Bharat Bazaar!',
          body: 'Discover 50,000+ authentic handcrafted products from Indian artisans.',
          read: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      unreadCount: 2,

      add: (notification) =>
        set((state) => {
          const n: AppNotification = {
            ...notification,
            id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            read: false,
            createdAt: new Date().toISOString(),
          };
          return {
            notifications: [n, ...state.notifications],
            unreadCount: state.unreadCount + 1,
          };
        }),

      markRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        }),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      remove: (id) =>
        set((state) => {
          const updated = state.notifications.filter((n) => n.id !== id);
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        }),

      clear: () => set({ notifications: [], unreadCount: 0 }),
    }),
    { name: 'bb-notifications' }
  )
);
