import { Address } from './cart.types';

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'confirmed'
  | 'processing'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerName: string;
}

export interface TrackingStep {
  label: string;
  completed: boolean;
  timestamp?: string;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string; // ORD-2024-XXXXXX
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  discount: number;
  deliveryFee: number;
  placedAt: string;
  estimatedDelivery: string;
  deliveredAt?: string;
  address: Address;
  paymentMethod: string;
  trackingSteps: TrackingStep[];
}
