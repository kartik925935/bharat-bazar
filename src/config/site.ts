export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Bharat Bazaar',
  tagline: 'From Village Hands to Your Home',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Shop directly from artisans, village producers, and NGOs across India. Handloom sarees, pottery, organic spices, Madhubani art, silver filigree.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  logoText: 'BB',
  contact: {
    email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@bharatbazaar.com',
    phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || '1800-XXX-XXXX',
    address: 'Bangalore, Karnataka, India 🇮🇳',
  },
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/products' },
    { label: 'Sellers', href: '/sellers' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
  ],
  categories: [
    { label: 'Handloom & Textiles', icon: '🧵', href: '/products?category=handloom-textiles' },
    { label: 'Pottery & Ceramics', icon: '🏺', href: '/products?category=pottery-ceramics' },
    { label: 'Organic Food', icon: '🌿', href: '/products?category=organic-food' },
    { label: 'Paintings & Art', icon: '🎨', href: '/products?category=paintings-art' },
    { label: 'Jewelry', icon: '💍', href: '/products?category=jewelry' },
    { label: 'Home Décor', icon: '🪑', href: '/products?category=home-decor' },
  ],
  footerLinks: {
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Impact Report', href: '/about#impact' },
    ],
    Sellers: [
      { label: 'Start Selling', href: '/seller-register' },
      { label: 'Seller Dashboard', href: '/seller-dashboard' },
    ],
    Help: [
      { label: 'FAQ', href: '/contact#faq' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Track Order', href: '/orders' },
    ],
    Categories: [
      { label: 'Handloom & Textiles', href: '/products?category=handloom-textiles' },
      { label: 'Organic Food', href: '/products?category=organic-food' },
      { label: 'Pottery & Ceramics', href: '/products?category=pottery-ceramics' },
      { label: 'Jewelry', href: '/products?category=jewelry' },
    ],
  },
  paymentMethods: ['UPI', 'Visa', 'Mastercard', 'RuPay', 'Razorpay'],
};
