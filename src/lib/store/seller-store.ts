'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SellerProfile {
  id: string;
  sellerId: string;
  legalName: string;
  displayName: string;
  email: string;
  phone: string;
  avatar: string | null;
  sellerType: 'artisan' | 'ngo' | 'shg' | 'village_producer' | 'shop_owner' | 'family_craft' | 'professional';
  shopName: string;
  shopDescription: string;
  shopLogo: string | null;
  shopBanner: string | null;
  shopCategory: string;
  subCategories: string[];
  village: string;
  district: string;
  state: string;
  pincode: string;
  fullAddress: string;
  panNumber: string;
  aadhaarNumber: string;
  gstNumber: string | null;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended' | 'changes_required';
  kycStatus: 'pending' | 'verified' | 'failed' | 'changes_required';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierScore: number;
  rating: number;
  totalReviews: number;
  totalSales: number;
  totalOrders: number;
  totalRevenue: number;
  returnRate: number;
  cancellationRate: number;
  onTimeDispatchRate: number;
  responseRate: number;
  vacationMode: boolean;
  vacationMessage: string | null;
  shippingAreas: string[];
  processingDays: number;
  joinedAt: string;
  approvedAt: string | null;
  lastActiveAt: string;
  profileCompleteness: number;
  password: string;
}

export interface SellerProduct {
  id: string;
  sellerId: string;
  name: string;
  slug: string;
  description: string;
  story: string | null;
  categoryId: string;
  subcategoryId: string | null;
  tags: string[];
  mrp: number;
  sellingPrice: number;
  discount: number;
  stock: number;
  sku: string;
  lowStockThreshold: number;
  weight: number;
  images: { id: string; url: string; isPrimary: boolean; altText: string }[];
  specifications: { key: string; value: string }[];
  hasVariants: boolean;
  variants: { id: string; name: string; price: number; stock: number; sku: string }[];
  freeShipping: boolean;
  shippingCharge: number;
  handmade: boolean;
  giTagged: boolean;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived' | 'out_of_stock';
  rejectionReason: string | null;
  featuredByAdmin: boolean;
  views: number;
  wishlistCount: number;
  cartAddCount: number;
  totalSold: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface SellerOrder {
  id: string;
  orderNumber: string;
  sellerId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    variantName: string | null;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  deliveryAddress: {
    name: string;
    phone: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryType: 'standard' | 'express' | 'next_day';
  expectedDelivery: string;
  actualDelivery: string | null;
  status: 'pending_payment' | 'paid' | 'confirmed' | 'processing' | 'ready_for_pickup' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'return_requested' | 'returned';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  trackingId: string | null;
  statusHistory: { status: string; timestamp: string; note: string | null; updatedBy: string }[];
  customerNote: string | null;
  sellerNote: string | null;
  placedAt: string;
  updatedAt: string;
}

export interface SellerReview {
  id: string;
  productId: string;
  productName: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string | null;
  rating: number;
  title: string;
  body: string;
  images: string[];
  qualityRating: number;
  packagingRating: number;
  valueRating: number;
  sellerResponse: string | null;
  sellerResponseAt: string | null;
  status: 'pending' | 'approved' | 'rejected';
  helpful: number;
  createdAt: string;
}

export interface SellerReturn {
  id: string;
  returnNumber: string;
  orderId: string;
  sellerId: string;
  customerId: string;
  customerName: string;
  items: { productName: string; quantity: number; price: number }[];
  reason: string;
  reasonCategory: string;
  description: string;
  images: string[];
  status: 'requested' | 'under_review' | 'approved' | 'rejected' | 'pickup_scheduled' | 'picked_up' | 'received' | 'refunded';
  refundAmount: number;
  requestedAt: string;
  resolvedAt: string | null;
}

export interface SellerCoupon {
  id: string;
  sellerId: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  maxDiscountAmount: number | null;
  minOrderAmount: number;
  maxUsage: number;
  usageCount: number;
  userLimit: number;
  startDate: string;
  endDate: string;
  applicableProducts: string[];
  status: 'active' | 'inactive' | 'expired' | 'scheduled';
  createdAt: string;
}

export interface SellerEarning {
  id: string;
  sellerId: string;
  orderId: string;
  orderNumber: string;
  productName: string;
  orderAmount: number;
  commission: number;
  commissionRate: number;
  deliveryCharge: number;
  netEarning: number;
  status: 'pending' | 'eligible' | 'processing' | 'paid';
  settlementId: string | null;
  eligibleAt: string;
  paidAt: string | null;
  createdAt: string;
}

export interface SellerSettlement {
  id: string;
  sellerId: string;
  settlementNumber: string;
  amount: number;
  ordersCount: number;
  commissionDeducted: number;
  periodFrom: string;
  periodTo: string;
  status: 'processing' | 'paid' | 'failed' | 'on_hold';
  bankAccount: string;
  utrNumber: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface SellerNotif {
  id: string;
  sellerId: string;
  type: 'new_order' | 'order_cancelled' | 'review_received' | 'return_requested' | 'settlement_processed' | 'product_approved' | 'product_rejected' | 'kyc_update' | 'low_stock' | 'tier_change' | 'system';
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export interface RevenuePoint { date: string; revenue: number; orders: number; units: number; }

// ─── Seed helpers ──────────────────────────────────────────────────────────
const SELLER_KEY = 'bb-sellers-empty-2';

function genId() { return Math.random().toString(36).slice(2, 10); }
function fmtDate(d: Date) { return d.toISOString(); }
function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return fmtDate(d); }
function daysFromNow(n: number) { const d = new Date(); d.setDate(d.getDate() + n); return fmtDate(d); }

function buildSeedSeller(): SellerProfile {
  return {
    id: 'seller-demo-001',
    sellerId: 'SEL-IND-000001',
    legalName: 'Ravi Kumar',
    displayName: 'Ravi Kumar',
    email: 'seller@test.com',
    phone: '9876543210',
    avatar: 'https://i.pravatar.cc/100?img=12',
    sellerType: 'artisan',
    shopName: 'Ravi Kumar Crafts',
    shopDescription: 'Traditional handcrafted items from the heart of Rajasthan. Every piece tells a story of our ancestors.',
    shopLogo: null,
    shopBanner: null,
    shopCategory: 'Paintings & Art',
    subCategories: ['Miniature Paintings', 'Phad Paintings'],
    village: 'Bhilwara',
    district: 'Bhilwara',
    state: 'Rajasthan',
    pincode: '311001',
    fullAddress: '42, Kala Colony, Near Shiv Temple, Bhilwara, Rajasthan 311001',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: 'XXXX-XXXX-3456',
    gstNumber: null,
    bankAccountName: 'Ravi Kumar',
    bankName: 'State Bank of India',
    bankAccountNumber: 'XXXX-XXXX-7890',
    ifscCode: 'SBIN0001234',
    accountType: 'savings',
    status: 'approved',
    kycStatus: 'verified',
    tier: 'gold',
    tierScore: 87,
    rating: 4.7,
    totalReviews: 234,
    totalSales: 847,
    totalOrders: 912,
    totalRevenue: 684200,
    returnRate: 2.3,
    cancellationRate: 1.8,
    onTimeDispatchRate: 89,
    responseRate: 92,
    vacationMode: false,
    vacationMessage: null,
    shippingAreas: ['All India'],
    processingDays: 2,
    joinedAt: daysAgo(180),
    approvedAt: daysAgo(175),
    lastActiveAt: fmtDate(new Date()),
    profileCompleteness: 88,
    password: 'Seller@123',
  };
}

function buildSeedProducts(sellerId: string): SellerProduct[] {
  const items: SellerProduct[] = [
    {
      id: 'prod-001', sellerId, name: 'Rajasthani Miniature Painting - Radha Krishna',
      slug: 'rajasthani-miniature-radha-krishna', description: 'Hand-painted traditional miniature painting on marble.',
      story: 'This painting was created by our master artisan Ramesh Kumar, following the Mewar style.',
      categoryId: 'paintings-art', subcategoryId: 'miniature', tags: ['miniature', 'rajasthani', 'handmade'],
      mrp: 4500, sellingPrice: 3200, discount: 29,
      stock: 8, sku: 'RKC-PAINT-001', lowStockThreshold: 3,
      weight: 500, images: [{ id: 'img-1', url: 'https://images.unsplash.com/photo-1582571352032-448f40b9e26c?w=400&auto=format&fit=crop', isPrimary: true, altText: 'Miniature Painting' }],
      specifications: [{ key: 'Medium', value: 'Natural stone colours on marble' }, { key: 'Size', value: '12x16 inches' }],
      hasVariants: false, variants: [], freeShipping: true, shippingCharge: 0,
      handmade: true, giTagged: false, status: 'approved', rejectionReason: null, featuredByAdmin: true,
      views: 1240, wishlistCount: 89, cartAddCount: 34, totalSold: 42, rating: 4.8, reviewCount: 38,
      createdAt: daysAgo(90), updatedAt: daysAgo(5), publishedAt: daysAgo(88),
    },
    {
      id: 'prod-002', sellerId, name: 'Phad Painting - Epic Scenes from Pabuji',
      slug: 'phad-painting-pabuji-epic', description: 'Traditional Phad scroll painting depicting the legend of Pabuji.',
      story: null, categoryId: 'paintings-art', subcategoryId: 'phad',
      tags: ['phad', 'scroll', 'folk art'], mrp: 8000, sellingPrice: 6200, discount: 23,
      stock: 3, sku: 'RKC-PHAD-001', lowStockThreshold: 2,
      weight: 800, images: [{ id: 'img-2', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop', isPrimary: true, altText: 'Phad Painting' }],
      specifications: [{ key: 'Size', value: '24x48 inches' }, { key: 'Medium', value: 'Cloth with natural dyes' }],
      hasVariants: false, variants: [], freeShipping: true, shippingCharge: 0,
      handmade: true, giTagged: true, status: 'approved', rejectionReason: null, featuredByAdmin: false,
      views: 890, wishlistCount: 67, cartAddCount: 22, totalSold: 18, rating: 4.9, reviewCount: 17,
      createdAt: daysAgo(75), updatedAt: daysAgo(10), publishedAt: daysAgo(73),
    },
    {
      id: 'prod-003', sellerId, name: 'Gond Art - Forest of Wonders',
      slug: 'gond-art-forest-wonders', description: 'Vibrant Gond tribal art from Madhya Pradesh artisans.',
      story: null, categoryId: 'paintings-art', subcategoryId: 'tribal',
      tags: ['gond', 'tribal', 'madhya pradesh'], mrp: 2800, sellingPrice: 1999, discount: 29,
      stock: 2, sku: 'RKC-GOND-001', lowStockThreshold: 3,
      weight: 300, images: [{ id: 'img-3', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop', isPrimary: true, altText: 'Gond Art' }],
      specifications: [{ key: 'Size', value: '16x20 inches' }],
      hasVariants: false, variants: [], freeShipping: false, shippingCharge: 99,
      handmade: true, giTagged: false, status: 'approved', rejectionReason: null, featuredByAdmin: false,
      views: 445, wishlistCount: 31, cartAddCount: 12, totalSold: 27, rating: 4.6, reviewCount: 24,
      createdAt: daysAgo(60), updatedAt: daysAgo(3), publishedAt: daysAgo(58),
    },
    {
      id: 'prod-004', sellerId, name: 'Madhubani Canvas Set (3 pieces)',
      slug: 'madhubani-canvas-set-3', description: 'Set of three Madhubani paintings on canvas.',
      story: null, categoryId: 'paintings-art', subcategoryId: 'madhubani',
      tags: ['madhubani', 'set', 'bihar'], mrp: 3500, sellingPrice: 2800, discount: 20,
      stock: 0, sku: 'RKC-MADH-001', lowStockThreshold: 2,
      weight: 1200, images: [{ id: 'img-4', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop', isPrimary: true, altText: 'Madhubani Set' }],
      specifications: [{ key: 'Pieces', value: '3' }, { key: 'Size each', value: '10x14 inches' }],
      hasVariants: false, variants: [], freeShipping: true, shippingCharge: 0,
      handmade: true, giTagged: false, status: 'out_of_stock', rejectionReason: null, featuredByAdmin: false,
      views: 320, wishlistCount: 44, cartAddCount: 19, totalSold: 15, rating: 4.7, reviewCount: 14,
      createdAt: daysAgo(45), updatedAt: daysAgo(1), publishedAt: daysAgo(44),
    },
    {
      id: 'prod-005', sellerId, name: 'Abstract Warli Wall Art',
      slug: 'abstract-warli-wall-art', description: 'Modern take on traditional Warli tribal art.',
      story: null, categoryId: 'paintings-art', subcategoryId: 'warli',
      tags: ['warli', 'tribal', 'maharashtra'], mrp: 1800, sellingPrice: 1299, discount: 28,
      stock: 15, sku: 'RKC-WARL-001', lowStockThreshold: 5,
      weight: 400, images: [{ id: 'img-5', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&auto=format&fit=crop', isPrimary: true, altText: 'Warli Art' }],
      specifications: [{ key: 'Size', value: '18x24 inches' }],
      hasVariants: false, variants: [], freeShipping: false, shippingCharge: 99,
      handmade: true, giTagged: false, status: 'pending_review', rejectionReason: null, featuredByAdmin: false,
      views: 0, wishlistCount: 0, cartAddCount: 0, totalSold: 0, rating: 0, reviewCount: 0,
      createdAt: daysAgo(2), updatedAt: daysAgo(2), publishedAt: null,
    },
    {
      id: 'prod-006', sellerId, name: 'Kalighat Folk Art Print',
      slug: 'kalighat-folk-art-print', description: 'Kalighat-style folk art from Bengal.',
      story: null, categoryId: 'paintings-art', subcategoryId: 'folk',
      tags: ['kalighat', 'bengal', 'folk'], mrp: 2200, sellingPrice: 1750, discount: 20,
      stock: 11, sku: 'RKC-KALI-001', lowStockThreshold: 3,
      weight: 350, images: [{ id: 'img-6', url: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&auto=format&fit=crop', isPrimary: true, altText: 'Kalighat Art' }],
      specifications: [{ key: 'Size', value: '12x16 inches' }],
      hasVariants: false, variants: [], freeShipping: false, shippingCharge: 99,
      handmade: true, giTagged: false, status: 'draft', rejectionReason: null, featuredByAdmin: false,
      views: 0, wishlistCount: 0, cartAddCount: 0, totalSold: 0, rating: 0, reviewCount: 0,
      createdAt: daysAgo(1), updatedAt: daysAgo(1), publishedAt: null,
    },
  ];
  return items;
}

function buildSeedOrders(sellerId: string): SellerOrder[] {
  const customers = [
    { name: 'Priya Sharma', email: 'priya@email.com', phone: '9876501234', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    { name: 'Arjun Mehta', email: 'arjun@email.com', phone: '9876502345', city: 'Delhi', state: 'Delhi', pincode: '110001' },
    { name: 'Sunita Rao', email: 'sunita@email.com', phone: '9876503456', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
    { name: 'Vikram Nair', email: 'vikram@email.com', phone: '9876504567', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
    { name: 'Meera Patel', email: 'meera@email.com', phone: '9876505678', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' },
    { name: 'Rajesh Gupta', email: 'rajesh@email.com', phone: '9876506789', city: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
    { name: 'Ananya Singh', email: 'ananya@email.com', phone: '9876507890', city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
  ];
  const statuses: SellerOrder['status'][] = ['confirmed', 'processing', 'in_transit', 'delivered', 'delivered', 'cancelled', 'return_requested'];
  const products = [
    { productId: 'prod-001', productName: 'Rajasthani Miniature Painting', productImage: 'https://images.unsplash.com/photo-1582571352032-448f40b9e26c?w=100&auto=format&fit=crop', price: 3200 },
    { productId: 'prod-002', productName: 'Phad Painting - Epic Scenes', productImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&auto=format&fit=crop', price: 6200 },
    { productId: 'prod-003', productName: 'Gond Art - Forest of Wonders', productImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&auto=format&fit=crop', price: 1999 },
  ];
  return customers.map((c, i) => {
    const prod = products[i % products.length];
    const qty = 1 + (i % 2);
    const total = prod.price * qty;
    const ord = statuses[i];
    return {
      id: `order-${i + 1}`,
      orderNumber: `BB-2025-${78000 + i + 1}`,
      sellerId,
      customerId: `cust-${i + 1}`,
      customerName: c.name,
      customerEmail: c.email,
      customerPhone: c.phone,
      items: [{ id: `item-${i}`, productId: prod.productId, productName: prod.productName, productImage: prod.productImage, variantName: null, quantity: qty, price: prod.price, total }],
      subtotal: total,
      discount: i === 0 ? 200 : 0,
      deliveryCharge: 0,
      total: total - (i === 0 ? 200 : 0),
      deliveryAddress: { name: c.name, phone: c.phone, line1: `${10 + i}, Main St`, line2: null, city: c.city, state: c.state, pincode: c.pincode },
      deliveryType: 'standard',
      expectedDelivery: daysFromNow(5 - i),
      actualDelivery: ord === 'delivered' ? daysAgo(1) : null,
      status: ord,
      paymentMethod: i % 2 === 0 ? 'UPI' : 'Credit Card',
      paymentStatus: ord === 'cancelled' ? 'refunded' : 'paid',
      trackingId: ord !== 'confirmed' && ord !== 'processing' ? `TRK${100000 + i}` : null,
      statusHistory: [{ status: ord, timestamp: daysAgo(i), note: null, updatedBy: 'system' }],
      customerNote: null,
      sellerNote: null,
      placedAt: daysAgo(i + 1),
      updatedAt: daysAgo(i),
    };
  });
}

function buildSeedReviews(sellerId: string): SellerReview[] {
  return [
    {
      id: 'rev-001', productId: 'prod-001', productName: 'Rajasthani Miniature Painting',
      orderId: 'order-4', customerId: 'cust-4', customerName: 'Vikram Nair',
      customerAvatar: 'https://i.pravatar.cc/40?img=15',
      rating: 5, title: 'Absolutely stunning!', body: 'The colors are so vibrant and the detail is incredible. Worth every rupee!',
      images: [], qualityRating: 5, packagingRating: 5, valueRating: 4,
      sellerResponse: null, sellerResponseAt: null, status: 'approved', helpful: 12, createdAt: daysAgo(8),
    },
    {
      id: 'rev-002', productId: 'prod-002', productName: 'Phad Painting - Epic Scenes',
      orderId: 'order-5', customerId: 'cust-5', customerName: 'Meera Patel',
      customerAvatar: 'https://i.pravatar.cc/40?img=22',
      rating: 5, title: 'A piece of history!', body: 'This Phad painting is magnificent. The stories depicted are so detailed. My guests are amazed every time they see it.',
      images: [], qualityRating: 5, packagingRating: 5, valueRating: 5,
      sellerResponse: 'Thank you so much for your kind words, Meeraji! It warms our heart. 🙏', sellerResponseAt: daysAgo(6), status: 'approved', helpful: 8, createdAt: daysAgo(10),
    },
    {
      id: 'rev-003', productId: 'prod-003', productName: 'Gond Art - Forest of Wonders',
      orderId: 'order-6', customerId: 'cust-6', customerName: 'Rajesh Gupta',
      customerAvatar: null,
      rating: 4, title: 'Good but smaller than expected', body: 'The painting is beautiful but I expected it to be larger based on the photos. The quality is excellent though.',
      images: [], qualityRating: 5, packagingRating: 4, valueRating: 3,
      sellerResponse: null, sellerResponseAt: null, status: 'approved', helpful: 3, createdAt: daysAgo(15),
    },
    {
      id: 'rev-004', productId: 'prod-001', productName: 'Rajasthani Miniature Painting',
      orderId: 'order-7', customerId: 'cust-7', customerName: 'Ananya Singh',
      customerAvatar: 'https://i.pravatar.cc/40?img=33',
      rating: 5, title: 'Gifted to my mother - she cried with joy!', body: 'A masterpiece for my mother\'s birthday. The packaging was immaculate and the painting is even more beautiful in person.',
      images: [], qualityRating: 5, packagingRating: 5, valueRating: 5,
      sellerResponse: null, sellerResponseAt: null, status: 'pending', helpful: 0, createdAt: daysAgo(2),
    },
  ];
}

function buildSeedReturns(sellerId: string): SellerReturn[] {
  return [
    {
      id: 'ret-001', returnNumber: 'RET-2025-001', orderId: 'order-7', sellerId,
      customerId: 'cust-7', customerName: 'Ananya Singh',
      items: [{ productName: 'Gond Art - Forest of Wonders', quantity: 1, price: 1999 }],
      reason: 'Damaged during transit', reasonCategory: 'shipping_damage',
      description: 'One corner of the frame arrived cracked. Outer packaging was fine.',
      images: [], status: 'under_review', refundAmount: 1999, requestedAt: daysAgo(3), resolvedAt: null,
    },
  ];
}

function buildSeedCoupons(sellerId: string): SellerCoupon[] {
  return [
    {
      id: 'coup-001', sellerId, code: 'RAVI20', description: '20% off for new customers',
      discountType: 'percentage', discountValue: 20, maxDiscountAmount: 500, minOrderAmount: 1000,
      maxUsage: 100, usageCount: 23, userLimit: 1, startDate: daysAgo(30), endDate: daysFromNow(30),
      applicableProducts: [], status: 'active', createdAt: daysAgo(30),
    },
    {
      id: 'coup-002', sellerId, code: 'FLAT300', description: '₹300 flat off on orders above ₹2000',
      discountType: 'flat', discountValue: 300, maxDiscountAmount: null, minOrderAmount: 2000,
      maxUsage: 50, usageCount: 50, userLimit: 1, startDate: daysAgo(60), endDate: daysAgo(1),
      applicableProducts: [], status: 'expired', createdAt: daysAgo(60),
    },
    {
      id: 'coup-003', sellerId, code: 'PHAD10', description: '10% off on Phad Paintings',
      discountType: 'percentage', discountValue: 10, maxDiscountAmount: 300, minOrderAmount: 500,
      maxUsage: 30, usageCount: 8, userLimit: 2, startDate: daysFromNow(5), endDate: daysFromNow(35),
      applicableProducts: ['prod-002'], status: 'scheduled', createdAt: daysAgo(2),
    },
  ];
}

function buildSeedEarnings(sellerId: string): SellerEarning[] {
  const data = [
    { orderId: 'order-4', orderNumber: 'BB-2025-78004', productName: 'Rajasthani Miniature Painting', orderAmount: 3200, commissionRate: 8, status: 'paid' as const, daysAgoN: 10 },
    { orderId: 'order-5', orderNumber: 'BB-2025-78005', productName: 'Phad Painting - Epic Scenes', orderAmount: 6200, commissionRate: 8, status: 'paid' as const, daysAgoN: 8 },
    { orderId: 'order-3', orderNumber: 'BB-2025-78003', productName: 'Gond Art', orderAmount: 1999, commissionRate: 8, status: 'eligible' as const, daysAgoN: 5 },
    { orderId: 'order-1', orderNumber: 'BB-2025-78001', productName: 'Rajasthani Miniature Painting', orderAmount: 3000, commissionRate: 8, status: 'pending' as const, daysAgoN: 2 },
    { orderId: 'order-2', orderNumber: 'BB-2025-78002', productName: 'Phad Painting', orderAmount: 6200, commissionRate: 8, status: 'eligible' as const, daysAgoN: 4 },
  ];
  return data.map((d, i) => {
    const commission = Math.round(d.orderAmount * d.commissionRate / 100);
    return {
      id: `earn-${i + 1}`, sellerId, orderId: d.orderId, orderNumber: d.orderNumber,
      productName: d.productName, orderAmount: d.orderAmount,
      commission, commissionRate: d.commissionRate, deliveryCharge: 0,
      netEarning: d.orderAmount - commission, status: d.status,
      settlementId: d.status === 'paid' ? 'settle-001' : null,
      eligibleAt: daysAgo(d.daysAgoN), paidAt: d.status === 'paid' ? daysAgo(d.daysAgoN - 2) : null,
      createdAt: daysAgo(d.daysAgoN + 1),
    };
  });
}

function buildSeedSettlements(sellerId: string): SellerSettlement[] {
  return [
    {
      id: 'settle-001', sellerId, settlementNumber: 'SET-2025-0021',
      amount: 8726, ordersCount: 4, commissionDeducted: 748,
      periodFrom: daysAgo(14), periodTo: daysAgo(7),
      status: 'paid', bankAccount: 'XXXX-XXXX-7890',
      utrNumber: 'UTR202501140001', paidAt: daysAgo(6), createdAt: daysAgo(7),
    },
    {
      id: 'settle-002', sellerId, settlementNumber: 'SET-2025-0015',
      amount: 15800, ordersCount: 7, commissionDeducted: 1364,
      periodFrom: daysAgo(28), periodTo: daysAgo(21),
      status: 'paid', bankAccount: 'XXXX-XXXX-7890',
      utrNumber: 'UTR202501070002', paidAt: daysAgo(20), createdAt: daysAgo(21),
    },
  ];
}

function buildSeedNotifications(sellerId: string): SellerNotif[] {
  return [
    { id: 'notif-1', sellerId, type: 'new_order', title: 'New Order Received!', message: 'Order #BB-2025-78001 received from Priya Sharma for ₹3,000', link: '/seller-orders', read: false, createdAt: daysAgo(0) },
    { id: 'notif-2', sellerId, type: 'review_received', title: 'New 5-Star Review!', message: 'Vikram Nair rated your Rajasthani Miniature Painting 5 stars.', link: '/seller-reviews', read: false, createdAt: daysAgo(1) },
    { id: 'notif-3', sellerId, type: 'return_requested', title: 'Return Request', message: 'Ananya Singh has requested a return for Gond Art. Action required.', link: '/seller-returns', read: false, createdAt: daysAgo(3) },
    { id: 'notif-4', sellerId, type: 'settlement_processed', title: 'Payment Settled!', message: '₹8,726 has been credited to your bank account. UTR: UTR202501140001', link: '/seller-earnings', read: true, createdAt: daysAgo(6) },
    { id: 'notif-5', sellerId, type: 'low_stock', title: 'Low Stock Alert', message: 'Phad Painting - Epic Scenes is running low (3 units left). Restock soon!', link: '/seller-inventory', read: true, createdAt: daysAgo(7) },
    { id: 'notif-6', sellerId, type: 'product_approved', title: 'Product Approved!', message: 'Rajasthani Miniature Painting has been approved and is now live.', link: '/seller-products', read: true, createdAt: daysAgo(88) },
  ];
}

function buildRevenueData(): RevenuePoint[] {
  const pts: RevenuePoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    pts.push({
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      revenue: Math.floor(800 + Math.random() * 4200),
      orders: Math.floor(1 + Math.random() * 6),
      units: Math.floor(1 + Math.random() * 8),
    });
  }
  return pts;
}

function initializeSellers() {
  const existing = localStorage.getItem(SELLER_KEY);
  if (!existing) {
    const seed = buildSeedSeller();
    const data = {
      sellers: [seed],
      products: [],
      orders: [],
      reviews: [],
      returns: [],
      coupons: [],
      earnings: [],
      settlements: [],
      notifications: [],
      revenueData: [],
    };
    localStorage.setItem(SELLER_KEY, JSON.stringify(data));
  }
}

function getDb() {
  const raw = localStorage.getItem(SELLER_KEY) || '{}';
  return JSON.parse(raw) as {
    sellers: SellerProfile[];
    products: SellerProduct[];
    orders: SellerOrder[];
    reviews: SellerReview[];
    returns: SellerReturn[];
    coupons: SellerCoupon[];
    earnings: SellerEarning[];
    settlements: SellerSettlement[];
    notifications: SellerNotif[];
    revenueData: RevenuePoint[];
  };
}

function saveDb(data: ReturnType<typeof getDb>) {
  localStorage.setItem(SELLER_KEY, JSON.stringify(data));
}

// ─── Store ─────────────────────────────────────────────────────────────────

interface SellerState {
  seller: SellerProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  products: SellerProduct[];
  orders: SellerOrder[];
  reviews: SellerReview[];
  returns: SellerReturn[];
  coupons: SellerCoupon[];
  earnings: SellerEarning[];
  settlements: SellerSettlement[];
  notifications: SellerNotif[];
  revenueData: RevenuePoint[];

  // Auth
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (data: Omit<SellerProfile, 'id' | 'sellerId' | 'tierScore' | 'rating' | 'totalReviews' | 'totalSales' | 'totalOrders' | 'totalRevenue' | 'returnRate' | 'cancellationRate' | 'onTimeDispatchRate' | 'responseRate' | 'joinedAt' | 'approvedAt' | 'lastActiveAt' | 'profileCompleteness' | 'kycStatus' | 'tier'>) => Promise<{ success: boolean; sellerId?: string; error?: string }>;

  // Data loaders
  loadSellerData: (sellerId: string) => void;

  // Products
  createProduct: (data: Omit<SellerProduct, 'id' | 'views' | 'wishlistCount' | 'cartAddCount' | 'totalSold' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt' | 'publishedAt'>) => SellerProduct;
  updateProduct: (id: string, data: Partial<SellerProduct>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, stock: number) => void;

  // Orders
  updateOrderStatus: (id: string, status: SellerOrder['status'], note?: string) => void;
  setSellerNote: (orderId: string, note: string) => void;

  // Reviews
  respondToReview: (id: string, response: string) => void;

  // Returns
  updateReturnStatus: (id: string, status: SellerReturn['status']) => void;

  // Coupons
  createCoupon: (data: Omit<SellerCoupon, 'id' | 'usageCount' | 'createdAt'>) => SellerCoupon;
  updateCoupon: (id: string, data: Partial<SellerCoupon>) => void;
  deleteCoupon: (id: string) => void;

  // Notifications
  markNotifRead: (id: string) => void;
  markAllNotifRead: () => void;

  // Profile
  updateProfile: (data: Partial<SellerProfile>) => void;
  toggleVacationMode: () => void;

  // Computed
  unreadNotifCount: () => number;
  pendingOrdersCount: () => number;
  pendingProductsCount: () => number;
}

export const useSellerStore = create<SellerState>()(
  persist(
    (set, get) => ({
      seller: null,
      isAuthenticated: false,
      isLoading: false,
      products: [],
      orders: [],
      reviews: [],
      returns: [],
      coupons: [],
      earnings: [],
      settlements: [],
      notifications: [],
      revenueData: [],

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          if (typeof window === 'undefined') return { success: false, error: 'Not in browser' };
          initializeSellers();
          const db = getDb();
          const seller = db.sellers.find(s => s.email.toLowerCase() === email.toLowerCase());
          if (!seller) return { success: false, error: 'No seller account found with this email' };
          if (seller.password !== password) return { success: false, error: 'Incorrect password' };
          set({ seller, isAuthenticated: true });
          get().loadSellerData(seller.id);
          return { success: true };
        } finally {
          set({ isLoading: false });
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          // TODO: Implement Supabase OAuth integration here
          // Example: const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
          
          await new Promise(resolve => setTimeout(resolve, 500));
          return { success: false, error: 'Google authentication (Supabase OAuth) is pending integration' };
        } catch (error: any) {
          return { success: false, error: error.message || 'Google Login failed' };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({ seller: null, isAuthenticated: false, products: [], orders: [], reviews: [], returns: [], coupons: [], earnings: [], settlements: [], notifications: [], revenueData: [] });
      },

      register: async (data) => {
        try {
          if (typeof window === 'undefined') return { success: false, error: 'Not in browser' };
          initializeSellers();
          const db = getDb();
          if (db.sellers.some(s => s.email.toLowerCase() === data.email.toLowerCase())) {
            return { success: false, error: 'Email already registered' };
          }
          const count = db.sellers.length + 1;
          const sellerId = `SEL-IND-${String(count).padStart(6, '0')}`;
          const newSeller: SellerProfile = {
            ...data,
            id: genId(),
            sellerId,
            status: 'pending',
            kycStatus: 'pending',
            tier: 'bronze',
            tierScore: 0,
            rating: 0,
            totalReviews: 0,
            totalSales: 0,
            totalOrders: 0,
            totalRevenue: 0,
            returnRate: 0,
            cancellationRate: 0,
            onTimeDispatchRate: 0,
            responseRate: 0,
            joinedAt: fmtDate(new Date()),
            approvedAt: null,
            lastActiveAt: fmtDate(new Date()),
            profileCompleteness: 60,
          };
          db.sellers.push(newSeller);
          saveDb(db);
          set({ seller: newSeller, isAuthenticated: true });
          return { success: true, sellerId };
        } catch {
          return { success: false, error: 'Registration failed' };
        }
      },

      loadSellerData: (sellerId) => {
        try {
          const db = getDb();
          set({
            products: db.products.filter(p => p.sellerId === sellerId),
            orders: db.orders.filter(o => o.sellerId === sellerId),
            reviews: db.reviews.filter(r => db.orders.some(o => o.sellerId === sellerId && o.id === r.orderId) || true),
            returns: db.returns.filter(r => r.sellerId === sellerId),
            coupons: db.coupons.filter(c => c.sellerId === sellerId),
            earnings: db.earnings.filter(e => e.sellerId === sellerId),
            settlements: db.settlements.filter(s => s.sellerId === sellerId),
            notifications: db.notifications.filter(n => n.sellerId === sellerId),
            revenueData: db.revenueData || [],
          });
        } catch {}
      },

      createProduct: (data) => {
        const product: SellerProduct = { ...data, id: genId(), views: 0, wishlistCount: 0, cartAddCount: 0, totalSold: 0, rating: 0, reviewCount: 0, createdAt: fmtDate(new Date()), updatedAt: fmtDate(new Date()), publishedAt: null };
        const db = getDb();
        db.products.push(product);
        saveDb(db);
        set(s => ({ products: [...s.products, product] }));
        return product;
      },

      updateProduct: (id, data) => {
        const db = getDb();
        db.products = db.products.map(p => p.id === id ? { ...p, ...data, updatedAt: fmtDate(new Date()) } : p);
        saveDb(db);
        set(s => ({ products: s.products.map(p => p.id === id ? { ...p, ...data } : p) }));
      },

      deleteProduct: (id) => {
        const db = getDb();
        db.products = db.products.filter(p => p.id !== id);
        saveDb(db);
        set(s => ({ products: s.products.filter(p => p.id !== id) }));
      },

      updateStock: (id, stock) => {
        get().updateProduct(id, { stock, status: stock === 0 ? 'out_of_stock' : 'approved' });
      },

      updateOrderStatus: (id, status, note) => {
        const db = getDb();
        db.orders = db.orders.map(o => o.id === id ? { ...o, status, updatedAt: fmtDate(new Date()), statusHistory: [...o.statusHistory, { status, timestamp: fmtDate(new Date()), note: note || null, updatedBy: 'seller' }] } : o);
        saveDb(db);
        set(s => ({ orders: s.orders.map(o => o.id === id ? { ...o, status } : o) }));
      },

      setSellerNote: (orderId, note) => {
        const db = getDb();
        db.orders = db.orders.map(o => o.id === orderId ? { ...o, sellerNote: note } : o);
        saveDb(db);
        set(s => ({ orders: s.orders.map(o => o.id === orderId ? { ...o, sellerNote: note } : o) }));
      },

      respondToReview: (id, response) => {
        const db = getDb();
        db.reviews = db.reviews.map(r => r.id === id ? { ...r, sellerResponse: response, sellerResponseAt: fmtDate(new Date()) } : r);
        saveDb(db);
        set(s => ({ reviews: s.reviews.map(r => r.id === id ? { ...r, sellerResponse: response, sellerResponseAt: fmtDate(new Date()) } : r) }));
      },

      updateReturnStatus: (id, status) => {
        const db = getDb();
        db.returns = db.returns.map(r => r.id === id ? { ...r, status, resolvedAt: status === 'refunded' ? fmtDate(new Date()) : r.resolvedAt } : r);
        saveDb(db);
        set(s => ({ returns: s.returns.map(r => r.id === id ? { ...r, status } : r) }));
      },

      createCoupon: (data) => {
        const coupon: SellerCoupon = { ...data, id: genId(), usageCount: 0, createdAt: fmtDate(new Date()) };
        const db = getDb();
        db.coupons.push(coupon);
        saveDb(db);
        set(s => ({ coupons: [...s.coupons, coupon] }));
        return coupon;
      },

      updateCoupon: (id, data) => {
        const db = getDb();
        db.coupons = db.coupons.map(c => c.id === id ? { ...c, ...data } : c);
        saveDb(db);
        set(s => ({ coupons: s.coupons.map(c => c.id === id ? { ...c, ...data } : c) }));
      },

      deleteCoupon: (id) => {
        const db = getDb();
        db.coupons = db.coupons.filter(c => c.id !== id);
        saveDb(db);
        set(s => ({ coupons: s.coupons.filter(c => c.id !== id) }));
      },

      markNotifRead: (id) => {
        const db = getDb();
        db.notifications = db.notifications.map(n => n.id === id ? { ...n, read: true } : n);
        saveDb(db);
        set(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
      },

      markAllNotifRead: () => {
        const db = getDb();
        db.notifications = db.notifications.map(n => ({ ...n, read: true }));
        saveDb(db);
        set(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) }));
      },

      updateProfile: (data) => {
        const db = getDb();
        db.sellers = db.sellers.map(s => s.id === get().seller?.id ? { ...s, ...data } : s);
        saveDb(db);
        set(s => ({ seller: s.seller ? { ...s.seller, ...data } : null }));
      },

      toggleVacationMode: () => {
        const cur = get().seller;
        if (!cur) return;
        get().updateProfile({ vacationMode: !cur.vacationMode });
      },

      unreadNotifCount: () => get().notifications.filter(n => !n.read).length,
      pendingOrdersCount: () => get().orders.filter(o => o.status === 'paid' || o.status === 'confirmed').length,
      pendingProductsCount: () => get().products.filter(p => p.status === 'pending_review').length,
    }),
    {
      name: 'bb-seller-portal-v2',
      partialize: (state) => ({
        seller: state.seller,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
