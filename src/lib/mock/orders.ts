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

export const mockOrders: MockOrder[] = [
  {
    id: 'ord-001',
    orderNumber: 'BB-2025-78234',
    status: 'in_transit',
    placedAt: '2025-01-15T15:42:00Z',
    expectedDelivery: '2025-01-23',
    items: [
      {
        productId: 'prod-001',
        name: 'Madhubani Tree of Life Painting',
        image: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=300&auto=format&fit=crop',
        sellerName: 'Meena Handicrafts',
        sellerTier: 'platinum',
        price: 1800,
        mrp: 2400,
        quantity: 1,
        reviewed: false,
      },
    ],
    address: {
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      line1: '123 MG Road, Koramangala',
      line2: 'Near Forum Mall',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
    },
    subtotal: 1800,
    discount: 100,
    shipping: 0,
    total: 1700,
    paymentMethod: 'UPI (GPay)',
    paymentId: 'TXN8823761',
    coupon: 'BB20',
    deliveryPartner: { name: 'Ramesh Kumar', vehicle: 'KA-09-AB-1234', rating: 4.8 },
    timeline: [
      { status: 'confirmed', label: 'Order Placed', timestamp: '2025-01-15T15:42:00Z', description: 'Order confirmed. Payment of ₹1,700 received.', done: true },
      { status: 'confirmed', label: 'Payment Confirmed', timestamp: '2025-01-15T15:43:00Z', description: 'Payment verified. Order forwarded to seller.', done: true },
      { status: 'processing', label: 'Seller Confirmed', timestamp: '2025-01-15T17:30:00Z', description: 'Meena Handicrafts accepted your order and started preparing.', done: true },
      { status: 'packed', label: 'Packed & Ready', timestamp: '2025-01-16T10:00:00Z', description: 'Your order has been carefully packed.', done: true },
      { status: 'shipped', label: 'Picked Up', timestamp: '2025-01-16T14:00:00Z', description: 'Picked up by delivery partner.', done: true },
      { status: 'in_transit', label: 'In Transit', timestamp: '2025-01-17T08:00:00Z', description: 'Your order is on its way to your city.', done: true },
      { status: 'out_for_delivery', label: 'Out for Delivery', timestamp: null, description: 'Expected soon.', done: false },
      { status: 'delivered', label: 'Delivered', timestamp: null, description: 'Expected by Jan 23.', done: false },
    ],
  },
  {
    id: 'ord-002',
    orderNumber: 'BB-2025-71234',
    status: 'delivered',
    placedAt: '2025-01-05T10:20:00Z',
    expectedDelivery: '2025-01-12',
    items: [
      {
        productId: 'prod-002',
        name: 'Sambhalpuri Ikat Silk Saree',
        image: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=300&auto=format&fit=crop',
        sellerName: 'Weavers of Odisha',
        sellerTier: 'gold',
        price: 3200,
        mrp: 3800,
        quantity: 1,
        reviewed: false,
      },
      {
        productId: 'prod-005',
        name: 'Organic Kashmiri Saffron 2g',
        image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&auto=format&fit=crop',
        sellerName: 'Kashmir Organics',
        sellerTier: 'silver',
        price: 450,
        mrp: 550,
        quantity: 2,
        reviewed: true,
      },
    ],
    address: {
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      line1: '123 MG Road, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
    },
    subtotal: 4100,
    discount: 200,
    shipping: 49,
    total: 3949,
    paymentMethod: 'Credit Card',
    paymentId: 'TXN7712345',
    timeline: [
      { status: 'confirmed', label: 'Order Placed', timestamp: '2025-01-05T10:20:00Z', description: 'Order confirmed.', done: true },
      { status: 'confirmed', label: 'Payment Confirmed', timestamp: '2025-01-05T10:21:00Z', description: 'Payment verified.', done: true },
      { status: 'processing', label: 'Seller Confirmed', timestamp: '2025-01-05T12:00:00Z', description: 'Seller started preparing your order.', done: true },
      { status: 'packed', label: 'Packed & Ready', timestamp: '2025-01-06T09:00:00Z', description: 'Order carefully packed.', done: true },
      { status: 'shipped', label: 'Picked Up', timestamp: '2025-01-06T14:00:00Z', description: 'Picked up by delivery partner.', done: true },
      { status: 'in_transit', label: 'In Transit', timestamp: '2025-01-07T08:00:00Z', description: 'On the way.', done: true },
      { status: 'out_for_delivery', label: 'Out for Delivery', timestamp: '2025-01-11T09:00:00Z', description: 'Out for delivery.', done: true },
      { status: 'delivered', label: 'Delivered', timestamp: '2025-01-11T14:30:00Z', description: 'Delivered successfully. Enjoy your purchase!', done: true },
    ],
  },
  {
    id: 'ord-003',
    orderNumber: 'BB-2025-65891',
    status: 'cancelled',
    placedAt: '2024-12-28T08:00:00Z',
    expectedDelivery: '2025-01-05',
    items: [
      {
        productId: 'prod-003',
        name: 'Blue Pottery Decorative Plate',
        image: 'https://images.unsplash.com/photo-1536266305399-b367feb671f9?w=300&auto=format&fit=crop',
        sellerName: 'Jaipur Blue Arts',
        sellerTier: 'gold',
        price: 750,
        mrp: 950,
        quantity: 2,
        reviewed: false,
      },
    ],
    address: {
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      line1: '123 MG Road, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
    },
    subtotal: 1500,
    discount: 0,
    shipping: 49,
    total: 1549,
    paymentMethod: 'Net Banking',
    paymentId: 'TXN6612345',
    timeline: [
      { status: 'confirmed', label: 'Order Placed', timestamp: '2024-12-28T08:00:00Z', description: 'Order confirmed.', done: true },
      { status: 'cancelled', label: 'Cancelled', timestamp: '2024-12-28T10:00:00Z', description: 'Cancelled by customer. Refund initiated.', done: true },
    ],
  },
];

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
