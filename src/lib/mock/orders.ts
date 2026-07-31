export type OrderStatus =
  | 'pending_payment' | 'confirmed' | 'processing'
  | 'packed' | 'shipped' | 'in_transit' | 'out_for_delivery'
  | 'delivered' | 'cancelled' | 'returned' | 'refunded';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  sellerName: string;
  sellerTier: string;
  price: number;
  mrp: number;
  quantity: number;
  reviewed?: boolean;
}

export interface OrderAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  label: string;
  timestamp: string | null;
  description: string;
  done: boolean;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  placedAt: string;
  items: OrderItem[];
  address: OrderAddress;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentId: string;
  coupon?: string;
  expectedDelivery: string;
  timeline: OrderTimeline[];
  deliveryPartner?: { name: string; vehicle: string; rating: number };
  invoiceUrl?: string;
}

export const mockOrders: MockOrder[] = ([] as any[]);

export const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; dot: string }> = {
  pending_payment: { label: 'Pending Payment', color: '#78716C', bg: '#F5F5F4', dot: '#78716C' },
  confirmed:       { label: 'Confirmed',        color: '#2563EB', bg: '#EFF6FF', dot: '#3B82F6' },
  processing:      { label: 'Processing',       color: '#4F46E5', bg: '#EEF2FF', dot: '#6366F1' },
  packed:          { label: 'Packed',           color: '#0891B2', bg: '#ECFEFF', dot: '#06B6D4' },
  shipped:         { label: 'Shipped',          color: '#0369A1', bg: '#F0F9FF', dot: '#0EA5E9' },
  in_transit:      { label: 'In Transit',       color: '#FF7A00', bg: '#FFF3E8', dot: '#FF7A00' },
  out_for_delivery:{ label: 'Out for Delivery', color: '#D97706', bg: '#FFFBEB', dot: '#F59E0B' },
  delivered:       { label: 'Delivered',        color: '#16A34A', bg: '#F0FDF4', dot: '#22C55E' },
  cancelled:       { label: 'Cancelled',        color: '#DC2626', bg: '#FEF2F2', dot: '#EF4444' },
  returned:        { label: 'Returned',         color: '#D97706', bg: '#FFFBEB', dot: '#F59E0B' },
  refunded:        { label: 'Refunded',         color: '#16A34A', bg: '#F0FDF4', dot: '#22C55E' },
};

export const orders = mockOrders;
