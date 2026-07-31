import { Seller, SellerTier } from '@/types';

export const TIER_COLORS: Record<SellerTier, string> = {
  bronze: 'text-amber-700 bg-amber-100 border-amber-300',
  silver: 'text-slate-600 bg-slate-100 border-slate-300',
  gold: 'text-yellow-700 bg-yellow-100 border-yellow-300',
  platinum: 'text-amber-800 bg-amber-50 border-amber-400',
};

export const TIER_ICONS: Record<SellerTier, string> = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
};

export const TIER_BADGE: Record<string, { bg: string; text: string; icon: string }> = {
  Platinum: { bg: '#F3E8FF', text: '#5B21B6', icon: '💎' },
  Gold: { bg: '#FEF3C7', text: '#92400E', icon: '🥇' },
  Silver: { bg: '#F1F5F9', text: '#475569', icon: '🥈' },
  Bronze: { bg: '#FEF0E6', text: '#9A3412', icon: '🥉' },
};

export const tierColors: Record<string, string> = {
  Platinum: '#BF953F',
  Gold: '#FFB800',
  Silver: '#9E9E9E',
  Bronze: '#CD7F32',
};

export const tierIcons: Record<string, string> = {
  Platinum: '💎',
  Gold: '🥇',
  Silver: '🥈',
  Bronze: '🥉',
};

export const mockSellers: Seller[] = [
  {
    id: 'sel-001',
    sellerId: 'SEL-IND-001234',
    username: 'meena-handicrafts',
    displayName: 'Meena Handicrafts',
    legalName: 'Meena Handicrafts Pvt Ltd',
    type: 'artisan',
    tier: 'platinum',
    kycStatus: 'approved',
    rating: 4.9,
    totalSales: 12345,
    totalProducts: 234,
    location: 'Jaipur',
    state: 'Rajasthan',
    joinedAt: '2018',
    avatar: 'https://ui-avatars.com/api/?name=Meena+Devi&bg=FF7A00&color=fff',
    banner: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=600&auto=format&fit=crop',
    tagline: 'Authentic Rajasthani Handloom Since 2018',
    quote: "Every thread I weave carries the blessing of my mother's hands.",
    commissionRate: 5.0,
    isVerified: true,
    badges: ['Verified Artisan', 'Top Seller 2024', 'GI Certified'],
  },
  {
    id: 'sel-004',
    sellerId: 'SEL-IND-001235',
    username: 'bihar-art-collective',
    displayName: 'Bihar Art Collective',
    legalName: 'Mithila Kala Welfare Society',
    type: 'ngo',
    tier: 'gold',
    kycStatus: 'approved',
    rating: 4.7,
    totalSales: 5678,
    totalProducts: 89,
    location: 'Madhubani',
    state: 'Bihar',
    joinedAt: '2020',
    avatar: 'https://ui-avatars.com/api/?name=Bihar+Art&bg=1A9E4E&color=fff',
    banner: 'https://images.unsplash.com/photo-1590180021913-f5e9eb51644c?w=600&auto=format&fit=crop',
    tagline: 'Preserving Madhubani Art for Future Generations',
    quote: 'Art is our language, crafts are our heritage.',
    commissionRate: 3.5,
    isVerified: true,
    badges: ['NGO Partner', 'Women Empowerment'],
  },
  {
    id: 'sel-003',
    sellerId: 'SEL-IND-001236',
    username: 'kashmir-harvest',
    displayName: 'Kashmir Harvest Co.',
    legalName: 'Kashmir Saffron Producers Co-op',
    type: 'village_producer',
    tier: 'platinum',
    kycStatus: 'approved',
    rating: 4.9,
    totalSales: 9012,
    totalProducts: 145,
    location: 'Srinagar',
    state: 'Jammu & Kashmir',
    joinedAt: '2019',
    avatar: 'https://ui-avatars.com/api/?name=Kashmir+Harvest&bg=3333FF&color=fff',
    banner: 'https://images.unsplash.com/photo-1663325265966-0d17de3e85c5?w=600&auto=format&fit=crop',
    tagline: 'Pure Kashmir, Direct to Your Doorstep',
    quote: 'Our fields are our pride, our produce is our promise.',
    commissionRate: 4.0,
    isVerified: true,
    badges: ['100% Organic', 'GI Tagged Saffron'],
  },
];

export const sellers = [
  {
    id: 's1',
    name: 'Meena Handicrafts',
    location: 'Jaipur, Rajasthan',
    tier: 'Platinum',
    rating: 4.9,
    reviews: 12345,
    products: 234,
    since: 2018,
    banner: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=600&auto=format&fit=crop&h=200',
    avatar: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=200&h=200&fit=crop',
    tagline: 'Authentic Rajasthani Handloom Since 2018',
    type: 'Artisan',
    quote: "Every thread I weave carries the blessing of my mother's hands.",
  },
  {
    id: 's2',
    name: 'Bihar Art Collective',
    location: 'Madhubani, Bihar',
    tier: 'Gold',
    rating: 4.7,
    reviews: 5678,
    products: 89,
    since: 2020,
    banner: 'https://images.unsplash.com/photo-1590180021913-f5e9eb51644c?w=600&auto=format&fit=crop&h=200',
    avatar: 'https://ui-avatars.com/api/?name=Bihar+Art&bg=1A9E4E&color=fff',
    tagline: 'Preserving Madhubani Art for Future Generations',
    type: 'NGO',
    quote: 'Art is our language, crafts are our heritage.',
  },
  {
    id: 's3',
    name: 'Kashmir Harvest Co.',
    location: 'Srinagar, J&K',
    tier: 'Platinum',
    rating: 4.9,
    reviews: 9012,
    products: 145,
    since: 2019,
    banner: 'https://images.unsplash.com/photo-1663325265966-0d17de3e85c5?w=600&auto=format&fit=crop&h=200',
    avatar: 'https://ui-avatars.com/api/?name=Kashmir+Harvest&bg=3333FF&color=fff',
    tagline: 'Pure Kashmir, Direct to Your Doorstep',
    type: 'Village Producer',
    quote: 'Our fields are our pride, our produce is our promise.',
  },
];

export const SELLERS = [
  {
    id: 'meena-handicrafts',
    name: 'Meena Handicrafts',
    tagline: 'Authentic Rajasthani Bandhani & Block Print',
    avatar: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&auto=format&fit=crop',
    location: 'Jaipur, Rajasthan',
    since: '2021',
    tier: 'Gold',
    rating: 4.8,
    totalReviews: 1284,
    totalSales: 4200,
    responseTime: '< 2 hours',
    bio: 'I am Meena Devi, a third-generation Bandhani artisan from Jaipur. My family has practiced this art for over 60 years, passing the craft from mother to daughter. Every piece I make carries the love, precision, and heritage of Rajasthani textile tradition.\n\nI work with a small team of 8 women from my village, all of whom are trained in authentic Bandhani tying techniques. We use only natural dyes sourced from local plants and minerals.',
    specialties: ['Bandhani Sarees', 'Block Print Dupattas', 'Hand-dyed Lehengas', 'Natural Dye Fabrics'],
    certifications: ['GI Tag Holder', 'Handloom Mark', 'Fair Trade Certified'],
    products: [
      { id: '1', name: 'Bandhani Silk Saree - Royal Blue', price: 2499, mrp: 3500, rating: 4.9, reviews: 234, img: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=400&auto=format&fit=crop', badge: 'Bestseller' },
      { id: '2', name: 'Block Print Cotton Dupatta', price: 699, mrp: 999, rating: 4.7, reviews: 156, img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&auto=format&fit=crop', badge: 'New' },
      { id: '3', name: 'Natural Dye Kurta Set', price: 1899, mrp: 2499, rating: 4.8, reviews: 89, img: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&auto=format&fit=crop', badge: '' },
      { id: '4', name: 'Bandhani Lehnga Choli', price: 3999, mrp: 5500, rating: 4.9, reviews: 67, img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&auto=format&fit=crop', badge: 'Top Rated' },
      { id: '5', name: 'Indigo Block Print Saree', price: 1799, mrp: 2400, rating: 4.6, reviews: 112, img: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=400&auto=format&fit=crop', badge: '' },
      { id: '6', name: 'Batik Silk Stole', price: 899, mrp: 1299, rating: 4.7, reviews: 78, img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&auto=format&fit=crop', badge: '' },
    ],
    reviews: [
      { user: 'Sneha R.', rating: 5, text: 'Absolutely stunning saree! The Bandhani work is so intricate. Meena ji was very helpful and even customized the color for me.', date: 'Dec 10, 2024', verified: true },
      { user: 'Priya M.', rating: 5, text: 'Ordered the dupatta and it arrived beautifully packaged. The colors are vibrant and exactly as shown. Will definitely buy again!', date: 'Nov 28, 2024', verified: true },
      { user: 'Kavita S.', rating: 4, text: 'Great quality, just as described. Shipping took a little longer than expected but the product is worth the wait.', date: 'Nov 15, 2024', verified: true },
    ],
  },
];

export const ALL_SELLERS = [
  { id: 'meena-handicrafts', name: 'Meena Handicrafts', tagline: 'Authentic Rajasthani Bandhani & Block Print', location: 'Jaipur, Rajasthan', tier: 'Gold', rating: 4.8, reviews: 1284, sales: '4,200+', category: 'Handloom & Textiles', avatar: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=200&h=200&fit=crop' },
  { id: 'kashmir-harvest', name: 'Kashmir Harvest', tagline: 'Premium Kashmiri Spices & Dry Fruits', location: 'Srinagar, J&K', tier: 'Platinum', rating: 4.9, reviews: 3210, sales: '12,000+', category: 'Organic Food', avatar: 'https://images.unsplash.com/photo-1663325265966-0d17de3e85c5?w=200&h=200&fit=crop' },
  { id: 'rajput-pottery', name: 'Rajput Pottery Works', tagline: 'Hand-painted Blue Pottery from Jaipur', location: 'Jaipur, Rajasthan', tier: 'Silver', rating: 4.7, reviews: 892, sales: '2,800+', category: 'Pottery & Ceramics', avatar: 'https://images.unsplash.com/photo-1629218091978-f70a20a43aab?w=200&h=200&fit=crop' },
  { id: 'odissi-craft', name: 'Odissi Craft House', tagline: 'Traditional Odisha Silver & Brass Jewellery', location: 'Cuttack, Odisha', tier: 'Gold', rating: 4.8, reviews: 1560, sales: '5,100+', category: 'Jewelry', avatar: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=200&h=200&fit=crop' },
  { id: 'warli-art-studio', name: 'Warli Art Studio', tagline: 'Authentic Warli Tribal Paintings & Prints', location: 'Palghar, Maharashtra', tier: 'Silver', rating: 4.6, reviews: 445, sales: '1,200+', category: 'Paintings & Art', avatar: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=200&h=200&fit=crop' },
  { id: 'bamboo-craft-assam', name: 'Bamboo Craft Assam', tagline: 'Eco-friendly Bamboo Home Products', location: 'Guwahati, Assam', tier: 'Bronze', rating: 4.5, reviews: 312, sales: '980+', category: 'Home Décor', avatar: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop' },
  { id: 'madhubani-art', name: 'Madhubani Art Collective', tagline: "Bihar's Finest Madhubani Paintings", location: 'Madhubani, Bihar', tier: 'Gold', rating: 4.7, reviews: 723, sales: '2,100+', category: 'Paintings & Art', avatar: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=200&h=200&fit=crop' },
  { id: 'silk-weavers-varanasi', name: 'Silk Weavers Varanasi', tagline: 'Handwoven Banarasi Silk Sarees', location: 'Varanasi, UP', tier: 'Platinum', rating: 4.9, reviews: 4100, sales: '15,000+', category: 'Handloom & Textiles', avatar: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=200&h=200&fit=crop' },
];

export const MOCK_SELLER_PRODUCTS = [
  { id: 'p1', name: 'Bandhani Silk Saree - Royal Blue', category: 'Textiles', price: 2499, mrp: 3500, stock: 8, status: 'active', sales: 124, rating: 4.9, img: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=200&auto=format&fit=crop' },
  { id: 'p2', name: 'Block Print Cotton Dupatta', category: 'Textiles', price: 699, mrp: 999, stock: 42, status: 'active', sales: 87, rating: 4.7, img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&auto=format&fit=crop' },
  { id: 'p3', name: 'Natural Dye Kurta Set', category: 'Clothing', price: 1899, mrp: 2499, stock: 0, status: 'out_of_stock', sales: 45, rating: 4.8, img: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=200&auto=format&fit=crop' },
  { id: 'p4', name: 'Indigo Block Print Saree', category: 'Textiles', price: 1799, mrp: 2400, stock: 3, status: 'low_stock', sales: 62, rating: 4.6, img: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=200&auto=format&fit=crop' },
  { id: 'p5', name: 'Batik Silk Stole', category: 'Accessories', price: 899, mrp: 1299, stock: 15, status: 'active', sales: 38, rating: 4.7, img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&auto=format&fit=crop' },
];

export const MOCK_SELLER_EARNINGS = [
  { month: 'Jun', revenue: 89000, payout: 80100 },
  { month: 'Jul', revenue: 102000, payout: 91800 },
  { month: 'Aug', revenue: 95000, payout: 85500 },
  { month: 'Sep', revenue: 118000, payout: 106200 },
  { month: 'Oct', revenue: 134000, payout: 120600 },
  { month: 'Nov', revenue: 158000, payout: 142200 },
];

export const MOCK_SELLER_ORDERS_LIST = [
  { id: 'ORD-1023', customer: 'Priya Sharma', product: 'Bandhani Dupatta', amount: 1499, status: 'PROCESSING', date: '26 Jul 2026' },
  { id: 'ORD-1019', customer: 'Rahul Verma', product: 'Blue Pottery Vase', amount: 2199, status: 'IN_TRANSIT', date: '25 Jul 2026' },
  { id: 'ORD-1014', customer: 'Anjali Mehta', product: 'Pashmina Shawl', amount: 4999, status: 'DELIVERED', date: '24 Jul 2026' },
  { id: 'ORD-1008', customer: 'Suresh Kumar', product: 'Khadi Kurta Set', amount: 1899, status: 'DELIVERED', date: '23 Jul 2026' },
  { id: 'ORD-1002', customer: 'Deepa Nair', product: 'Madhubani Painting', amount: 3499, status: 'CANCELLED', date: '22 Jul 2026' },
];

export const MOCK_SELLER_COUPONS_LIST = [
  { code: 'CRAFT20', type: 'percent', value: 20, minOrder: 500, uses: 47, maxUses: 100, active: true, expiry: '31 Aug 2026' },
  { code: 'FIRST150', type: 'flat', value: 150, minOrder: 1000, uses: 23, maxUses: 50, active: true, expiry: '15 Aug 2026' },
];

export const MOCK_SELLER_RETURNS_LIST = [
  { id: 'RTN-041', orderId: 'ORD-1008', product: 'Khadi Kurta Set', customer: 'Suresh Kumar', reason: 'Size mismatch', amount: 1899, status: 'pending' },
  { id: 'RTN-039', orderId: 'ORD-998', product: 'Bandhani Dupatta', customer: 'Meera Singh', reason: 'Color variation', amount: 1499, status: 'approved' },
];

export const MOCK_SELLER_REVIEWS_LIST = [
  { id: 'rv1', customer: 'Priya S.', product: 'Bandhani Dupatta', rating: 5, comment: 'Vibrant colors and authentic tie-dye!', replied: false },
  { id: 'rv2', customer: 'Anjali M.', product: 'Pashmina Shawl', rating: 4, comment: 'Soft and warm product.', replied: true },
];

export const INVENTORY = [
  { id: 'p1', name: 'Bandhani Silk Saree - Royal Blue', sku: 'MH-SAR-001', stock: 8, lowAlert: 5, img: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=80&fit=crop', status: 'in_stock' },
  { id: 'p2', name: 'Block Print Cotton Dupatta', sku: 'MH-DUP-002', stock: 42, lowAlert: 10, img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&fit=crop', status: 'in_stock' },
  { id: 'p3', name: 'Natural Dye Kurta Set', sku: 'MH-KUR-003', stock: 0, lowAlert: 5, img: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=80&fit=crop', status: 'out_of_stock' },
  { id: 'p4', name: 'Indigo Block Print Saree', sku: 'MH-SAR-004', stock: 3, lowAlert: 5, img: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=80&fit=crop', status: 'low_stock' },
  { id: 'p5', name: 'Batik Silk Stole', sku: 'MH-STL-005', stock: 15, lowAlert: 5, img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=80&fit=crop', status: 'in_stock' },
];

export const SELLER_ORDERS = [
  { id: 'ORD-2024-001240', customer: 'Priya S.', product: 'Bandhani Silk Saree', qty: 1, amount: 2499, status: 'NEW', date: 'Dec 1, 2024', img: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=80&fit=crop' },
  { id: 'ORD-2024-001239', customer: 'Amit K.', product: 'Block Print Dupatta', qty: 2, amount: 1398, status: 'PROCESSING', date: 'Nov 30, 2024', img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&fit=crop' },
  { id: 'ORD-2024-001238', customer: 'Riya P.', product: 'Natural Dye Kurta Set', qty: 1, amount: 1899, status: 'SHIPPED', date: 'Nov 29, 2024', img: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=80&fit=crop' },
  { id: 'ORD-2024-001235', customer: 'Suresh M.', product: 'Indigo Block Print Saree', qty: 1, amount: 1799, status: 'DELIVERED', date: 'Nov 25, 2024', img: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=80&fit=crop' },
  { id: 'ORD-2024-001234', customer: 'Kavita R.', product: 'Batik Silk Stole', qty: 3, amount: 2697, status: 'DELIVERED', date: 'Nov 22, 2024', img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=80&fit=crop' },
  { id: 'ORD-2024-001230', customer: 'Meena D.', product: 'Bandhani Silk Saree', qty: 1, amount: 2499, status: 'CANCELLED', date: 'Nov 18, 2024', img: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=80&fit=crop' },
];

export const SELLER_NOTIFS = [
  { id: '1', icon: '🛒', title: 'New Order Received!', body: 'ORD-2024-001240 · Bandhani Silk Saree · ₹2,499', time: '5 min ago', unread: true },
  { id: '2', icon: '⭐', title: 'New 5-Star Review', body: 'Priya S. left you a review on Bandhani Saree', time: '2 hours ago', unread: true },
  { id: '3', icon: '💰', title: 'Payout Credited', body: '₹42,380 credited to your bank account · UTR123456', time: 'Nov 30, 2024', unread: false },
  { id: '4', icon: '⚠️', title: 'Low Stock Alert', body: 'Indigo Block Print Saree has only 3 units left', time: 'Nov 29, 2024', unread: false },
  { id: '5', icon: '↩️', title: 'Return Request', body: 'RET-001 · Bandhani Silk Saree · ₹2,499 · Action needed', time: 'Nov 29, 2024', unread: false },
];

