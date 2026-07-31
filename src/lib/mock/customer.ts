export const MOCK_TRANSACTIONS = ((true as boolean) ? [
  { id: 'tx-1', type: 'credit', title: 'Reward Points Converted', amount: 200, date: '18 Jan 2025', source: 'Loyalty Rewards' },
  { id: 'tx-2', type: 'credit', title: 'Referral Bonus', amount: 100, date: '10 Jan 2025', source: 'Friend Referral' },
  { id: 'tx-3', type: 'debit', title: 'Used on Order #BB-2025-78234', amount: 100, date: '15 Jan 2025', source: 'Order Purchase' },
] : []) as any[];

export const MOCK_RETURNS = ((true as boolean) ? [
  {
    id: 'ret-1',
    returnNumber: 'RET-2025-001',
    orderNumber: 'BB-2025-71234',
    productName: 'Sambhalpuri Ikat Silk Saree',
    productImage: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=300&auto=format&fit=crop',
    reason: 'Color slightly different from photo',
    refundAmount: 3200,
    status: 'under_review',
    date: '2025-01-18',
    expectedRefundMethod: 'UPI (GPay)',
  },
  {
    id: 'ret-2',
    returnNumber: 'RET-2024-089',
    orderNumber: 'BB-2024-65891',
    productName: 'Blue Pottery Decorative Plate',
    productImage: 'https://images.unsplash.com/photo-1536266305399-b367feb671f9?w=300&auto=format&fit=crop',
    reason: 'Damaged during transit',
    refundAmount: 750,
    status: 'refunded',
    date: '2024-12-29',
    expectedRefundMethod: 'Original Payment Method',
  },
] : []) as any[];

export const MOCK_REVIEWS = ((true as boolean) ? [
  {
    id: 'rev-1',
    orderId: 'ORD-89234188',
    productId: 'prod-1',
    productName: 'Sambhalpuri Ikat Silk Saree',
    productImage: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=300&auto=format&fit=crop',
    sellerName: 'Kala Kendra',
    rating: 5,
    title: 'Beautiful craftsmanship!',
    comment: 'The saree is exactly as shown in the picture. The fabric is pure silk and the ikat work is mesmerizing. Very happy with the purchase.',
    date: '15 Jan 2025',
    status: 'published',
    helpful: 12
  },
  {
    id: 'rev-2',
    orderId: 'ORD-89234175',
    productId: 'prod-2',
    productName: 'Blue Pottery Decorative Plate',
    productImage: 'https://images.unsplash.com/photo-1536266305399-b367feb671f9?w=300&auto=format&fit=crop',
    sellerName: 'Jaipur Crafts',
    rating: 4,
    title: 'Good but smaller than expected',
    comment: 'The plate looks gorgeous and the colors are vibrant, but I misjudged the 8-inch size. It is a bit small for my center table.',
    date: '02 Dec 2024',
    status: 'published',
    helpful: 3
  }
] : []) as any[];

export const PENDING_REVIEWS = ((true as boolean) ? [
  {
    id: 'prev-1',
    orderId: 'BB-2025-78234',
    productId: 'prod-3',
    productName: 'Handcrafted Wooden Toys Set',
    productImage: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=300&auto=format&fit=crop',
    sellerName: 'Channapatna Toys',
    deliveredDate: '18 Jan 2025'
  }
] : []) as any[];

export const PAST_REVIEWS = [
  { id: 'r1', orderId: 'ORD-2024-001233', product: 'Blue Pottery Vase', img: 'https://images.unsplash.com/photo-1536266305399-b367feb671f9?w=80&fit=crop', seller: 'Rajput Pottery Works', rating: 5, date: 'Nov 22, 2024', text: 'Stunning craftsmanship! The blue glaze is even more beautiful in person. Arrived very securely packed.', verified: true },
  { id: 'r2', orderId: 'ORD-2024-001232', product: 'Silver Filigree Earrings', img: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=80&fit=crop', seller: 'Odissi Craft House', rating: 4, date: 'Nov 18, 2024', text: 'Intricate Odissi silver work. Very delicate and lightweight. Delivery took 5 days.', verified: true },
];

export const COUPONS = [
  { id: 'c1', code: 'BHARAT200', title: '₹200 OFF on Handloom Sarees', desc: 'Valid on minimum purchase of ₹1,499 from verified Handloom sellers.', discount: '₹200 OFF', minOrder: 1499, expiry: 'Dec 31, 2024', category: 'Handloom & Textiles', isNew: true, appliesTo: 'Handloom Sarees & Textiles' },
  { id: 'c2', code: 'POTTERY15', title: '15% OFF Jaipur Blue Pottery', desc: 'Get 15% discount on all authentic Jaipur ceramics & pottery items.', discount: '15% OFF', minOrder: 799, expiry: 'Dec 15, 2024', category: 'Pottery & Ceramics', isNew: false, appliesTo: 'Pottery & Ceramic Decor' },
  { id: 'c3', code: 'WELCOME10', title: '10% OFF Your First Order', desc: 'Special welcome offer for new registered shoppers across all categories.', discount: '10% OFF', minOrder: 499, expiry: 'Jan 31, 2025', category: 'Site-wide', isNew: false, appliesTo: 'All Products' },
];

export const RETURNABLE_ITEMS = [
  { id: 'p1', name: 'Handwoven Bandhani Saree', orderId: 'ORD-2024-001234', deliveredDate: 'Nov 28, 2024', price: 1299, returnEligibleUntil: 'Dec 5, 2024', img: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=80&fit=crop', seller: 'Meena Handicrafts' },
  { id: 'p2', name: 'Kashmiri Saffron 2g', orderId: 'ORD-2024-001234', deliveredDate: 'Nov 28, 2024', price: 598, returnEligibleUntil: 'Dec 5, 2024', img: 'https://images.unsplash.com/photo-1663325265966-0d17de3e85c5?w=80&fit=crop', seller: 'Kashmir Harvest Co.' },
];

export const RECENT_PRODUCTS = [
  { id: 'p1', name: 'Handwoven Bandhani Saree', price: 1299, mrp: 1999, rating: 4.5, seller: 'Meena Handicrafts', viewed: '2 hours ago', time: '2 hours ago', img: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=200&fit=crop' },
  { id: 'p2', name: 'Hand-painted Blue Pottery Vase', price: 849, mrp: 1200, rating: 4.8, seller: 'Rajput Pottery Works', viewed: 'Yesterday', time: 'Yesterday', img: 'https://images.unsplash.com/photo-1536266305399-b367feb671f9?w=200&fit=crop' },
  { id: 'p3', name: 'Organic Kashmiri Saffron 2g', price: 299, mrp: 450, rating: 4.9, seller: 'Kashmir Harvest Co.', viewed: '3 days ago', time: '3 days ago', img: 'https://images.unsplash.com/photo-1663325265966-0d17de3e85c5?w=200&fit=crop' },
];

export const PURCHASE_HISTORY = [
  { month: "November 2024", orders: [{ id: "ORD-001234", item: "Bandhani Silk Saree", amount: 1299, date: "Nov 28" }, { id: "ORD-001230", item: "Block Print Dupatta", amount: 699, date: "Nov 22" }] },
  { month: "October 2024", orders: [{ id: "ORD-001190", item: "Blue Pottery Vase", amount: 849, date: "Oct 15" }, { id: "ORD-001150", item: "Madhubani Painting", amount: 1299, date: "Oct 3" }] },
  { month: "September 2024", orders: [{ id: "ORD-001100", item: "Kashmiri Saffron (10g)", amount: 299, date: "Sep 18" }] },
];

export const FAV_SELLERS = [
  { id: 's1', name: 'Meena Handicrafts', location: 'Jaipur, Rajasthan', rating: 4.9, reviews: 1234, tier: 'Platinum', productsCount: 234, avatar: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=100&fit=crop', since: '2018', tagline: 'Authentic Rajasthani Bandhani & Block Print' },
  { id: 's2', name: 'Kashmir Harvest Co.', location: 'Srinagar, J&K', rating: 4.9, reviews: 9012, tier: 'Platinum', productsCount: 145, avatar: 'https://images.unsplash.com/photo-1663325265966-0d17de3e85c5?w=100&fit=crop', since: '2019', tagline: 'Pure Kashmir, Direct to Your Doorstep' },
];

export const SESSIONS = [
  { id: 'sess-1', device: 'Chrome on macOS', location: 'Bangalore, India', ip: '49.207.210.45', lastActive: 'Active now', isCurrent: true },
  { id: 'sess-2', device: 'Bharat Bazaar iOS App', location: 'Bangalore, India', ip: '49.207.210.45', lastActive: 'Yesterday at 8:42 PM', isCurrent: false },
];

export const LOGIN_HISTORY = [
  { id: 'lh-1', date: 'Jul 31, 2026 at 2:15 PM', device: 'Chrome on macOS', location: 'Bangalore, India', status: 'Success', ip: '49.207.210.45' },
  { id: 'lh-2', date: 'Jul 30, 2026 at 8:42 PM', device: 'Bharat Bazaar iOS App', location: 'Bangalore, India', status: 'Success', ip: '49.207.210.45' },
];

export const CATEGORIES = ((true as boolean) ? ['All', 'Handloom & Textiles', 'Pottery & Ceramics', 'Paintings & Art', 'Jewelry', 'Home Decor', 'Organic & Natural', 'Toys & Games'] : []) as any[];

export const FAQS = ((true as boolean) ? [
  { id: 'faq-1', question: 'How do I track my order?', answer: 'You can track your order from the "My Orders" section in your dashboard.' },
  { id: 'faq-2', question: 'What is the return policy?', answer: 'We offer a 7-day no-questions-asked return policy for eligible items.' },
  { id: 'faq-3', question: 'How long do refunds take?', answer: 'Refunds are typically processed within 5-7 business days to the original payment method.' },
  { id: 'faq-4', question: 'Can I cancel my order?', answer: 'Orders can be cancelled before they are shipped.' },
] : []) as any[];

export const DASHBOARD_STATS = ((true as boolean) ? [
  { label: 'Total Orders', value: '12', link: '/orders' },
  { label: 'Active Returns', value: '1', link: '/returns' },
  { label: 'Wallet Balance', value: '₹500', link: '/wallet' },
] : []) as any[];

export const DASHBOARD_QUICK_ACTIONS = ((true as boolean) ? [
  { label: 'Track Order', icon: 'Package', link: '/orders' },
  { label: 'Customer Support', icon: 'HelpCircle', link: '/support' },
  { label: 'Saved Addresses', icon: 'MapPin', link: '/addresses' },
] : []) as any[];

export const INITIAL_ADDRESSES: any[] = ((true as boolean) ? [
  {
    id: 'addr-1',
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    line1: '123 MG Road, Koramangala',
    line2: 'Near Forum Mall',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    type: 'home',
    isDefault: true,
  },
  {
    id: 'addr-2',
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    line1: 'Tech Park, Whitefield',
    line2: 'Block B, Floor 4',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    type: 'work',
    isDefault: false,
  },
] : []) as any[];
