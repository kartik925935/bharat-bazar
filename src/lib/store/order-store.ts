import { create } from 'zustand';
import { MockOrder } from '@/lib/mock/orders';
import { getOrders } from '@/actions/orders/actions';
import { mapDbOrderToUi } from '@/lib/utils/order-mapper';

interface OrderStore {
  orders: MockOrder[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  addOrUpdateOrder: (order: MockOrder) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  loading: false,
  error: null,
  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getOrders();
      if (res.data) {
        set({ orders: res.data.map(mapDbOrderToUi), loading: false });
      } else {
        set({ loading: false, error: res.error || 'Failed to fetch orders' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch orders';
      set({ loading: false, error: msg });
    }
  },
  addOrUpdateOrder: (order: MockOrder) => {
    set((state) => {
      const existingIdx = state.orders.findIndex((o) => o.id === order.id || o.orderNumber === order.orderNumber);
      if (existingIdx >= 0) {
        const next = [...state.orders];
        next[existingIdx] = order;
        return { orders: next };
      }
      return { orders: [order, ...state.orders] };
    });
  },
}));
