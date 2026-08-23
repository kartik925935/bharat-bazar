// src/lib/mock/sa-storefront.mock.ts
// Controls the customer-facing storefront configuration

export type HomepageSectionType =
  | 'hero_carousel' | 'categories_grid' | 'featured_products'
  | 'flash_sale' | 'seller_stories' | 'stats_counter'
  | 'trust_badges' | 'newsletter_bar'

export interface SAHomepageSection {
  id: string
  type: HomepageSectionType
  order: number
  isActive: boolean
  title: string
  config: Record<string, unknown>
  lastEditedAt: string
  lastEditedBy: string
}

export interface SAHeroSlide {
  id: string
  imageUrl: string
  mobileImageUrl?: string
  headline: string
  subheadline: string
  ctaText: string
  ctaLink: string
  order: number
  isActive: boolean
  scheduledStart?: string
  scheduledEnd?: string
}

export interface SAAnnouncementBar {
  id: string
  message: string
  linkText?: string
  linkUrl?: string
  backgroundColor: string
  textColor: string
  isActive: boolean
  dismissible: boolean
  startDate?: string
  endDate?: string
  displayPages: 'all' | 'homepage_only' | string[]
}

export interface SANavMenuItem {
  id: string
  label: string
  href: string
  order: number
  isVisible: boolean
  parentId?: string
  badge?: string
}

export interface SAMediaAsset {
  id: string
  url: string
  filename: string
  altText: string
  tags: string[]
  fileSize: number
  dimensions: { width: number; height: number }
  uploadedBy: string
  uploadedAt: string
  usedIn: { type: string; label: string; id: string }[]
}

export interface SASEOPageConfig {
  id: string
  routePattern: string
  label: string
  metaTitleTemplate: string
  metaDescriptionTemplate: string
  ogImageUrl?: string
  noIndex: boolean
  lastEditedAt: string
}

export interface SAStaticPage {
  id: string
  slug: string
  title: string
  contentMarkdown: string
  isPublished: boolean
  lastEditedBy: string
  lastEditedAt: string
  version: number
}

export interface SATrendingSearch {
  id: string
  term: string
  order: number
  isActive: boolean
}

export interface SAPinnedProduct {
  id: string
  searchTerm: string
  productId: string
  productName: string
  pinPosition: number
}

export interface SASearchSynonym {
  id: string
  term: string
  synonyms: string[]
}

export interface SAShippingZone {
  id: string
  name: string
  states: string[]
  baseRate: number
  perKgRate: number
  freeShippingThreshold: number
  estimatedDaysMin: number
  estimatedDaysMax: number
  isActive: boolean
}

export interface SAPincodeServiceability {
  pincode: string
  city: string
  zoneId: string
  isServiceable: boolean
  codAvailable: boolean
}

export interface SAStorefrontTheme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logoUrl: string
  logoUrlDark?: string
  faviconUrl: string
  fontFamily: 'inter' | 'poppins' | 'lato' | 'system'
  announcementBarEnabled: boolean
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

export const MOCK_HOMEPAGE_SECTIONS: SAHomepageSection[] = [
  { id: 'sec_001', type: 'hero_carousel', order: 1, isActive: true, title: 'Main Hero Banner', config: {}, lastEditedAt: new Date(Date.now() - 2*86400000).toISOString(), lastEditedBy: 'Arjun Mehta' },
  { id: 'sec_002', type: 'categories_grid', order: 2, isActive: true, title: 'Shop by Category', config: { categoriesShown: 8 }, lastEditedAt: new Date(Date.now() - 5*86400000).toISOString(), lastEditedBy: 'Priya Sharma' },
  { id: 'sec_003', type: 'flash_sale', order: 3, isActive: true, title: 'Republic Day Flash Sale', config: { offerId: 'offer_003' }, lastEditedAt: new Date(Date.now() - 1*86400000).toISOString(), lastEditedBy: 'Arjun Mehta' },
  { id: 'sec_004', type: 'featured_products', order: 4, isActive: true, title: 'Handpicked for You', config: { productIds: ['prod_001','prod_007','prod_012'] }, lastEditedAt: new Date().toISOString(), lastEditedBy: 'Arjun Mehta' },
  { id: 'sec_005', type: 'seller_stories', order: 5, isActive: true, title: 'Meet Our Artisans', config: { sellerIds: ['sell-003','sell-009'] }, lastEditedAt: new Date(Date.now()-10*86400000).toISOString(), lastEditedBy: 'Priya Sharma' },
  { id: 'sec_006', type: 'stats_counter', order: 6, isActive: true, title: 'Platform Stats', config: { artisansCount: 342, ordersDelivered: 8942 }, lastEditedAt: new Date(Date.now()-15*86400000).toISOString(), lastEditedBy: 'Arjun Mehta' },
  { id: 'sec_007', type: 'trust_badges', order: 7, isActive: true, title: 'Trust Badges Row', config: {}, lastEditedAt: new Date(Date.now()-20*86400000).toISOString(), lastEditedBy: 'Arjun Mehta' },
  { id: 'sec_008', type: 'newsletter_bar', order: 8, isActive: false, title: 'Email Signup CTA', config: {}, lastEditedAt: new Date(Date.now()-30*86400000).toISOString(), lastEditedBy: 'Priya Sharma' },
]

export const MOCK_HERO_SLIDES: SAHeroSlide[] = [
  { id: 'slide_001', imageUrl: '/mock-media/hero-diwali.jpg', headline: 'Celebrate Diwali with Authentic Crafts', subheadline: 'Up to 40% off handmade decor', ctaText: 'Shop Now', ctaLink: '/category/home-decor', order: 1, isActive: true },
  { id: 'slide_002', imageUrl: '/mock-media/hero-artisans.jpg', headline: 'Meet the Hands Behind the Craft', subheadline: '10,000+ artisans across India', ctaText: 'Our Story', ctaLink: '/about', order: 2, isActive: true },
  { id: 'slide_003', imageUrl: '/mock-media/hero-republic-day.jpg', headline: 'Republic Day Sale', subheadline: 'Flat ₹500 off on orders above ₹2999', ctaText: 'Grab Deal', ctaLink: '/offers/republic-day', order: 3, isActive: false, scheduledStart: '2025-01-24T00:00:00Z', scheduledEnd: '2025-01-27T00:00:00Z' },
]

export const MOCK_ANNOUNCEMENT_BAR: SAAnnouncementBar = {
  id: 'ann_001',
  message: '🎉 Free shipping on orders above ₹999! Use code FREESHIP',
  linkText: 'Shop Now',
  linkUrl: '/products',
  backgroundColor: '#FF7A00',
  textColor: '#FFFFFF',
  isActive: true,
  dismissible: true,
  displayPages: 'all',
}

export const MOCK_NAV_MENU_ITEMS: SANavMenuItem[] = [
  { id: 'nav_001', label: 'Home', href: '/', order: 1, isVisible: true },
  { id: 'nav_002', label: 'Shop', href: '/products', order: 2, isVisible: true },
  { id: 'nav_003', label: 'Categories', href: '/categories', order: 3, isVisible: true },
  { id: 'nav_004', label: 'Artisans', href: '/artisans', order: 4, isVisible: true },
  { id: 'nav_005', label: 'Offers', href: '/offers', order: 5, isVisible: true, badge: 'Sale' },
  { id: 'nav_006', label: 'About', href: '/about', order: 6, isVisible: true },
  { id: 'nav_007', label: 'Handloom', href: '/category/handloom', order: 1, isVisible: true, parentId: 'nav_003' },
  { id: 'nav_008', label: 'Pottery', href: '/category/pottery', order: 2, isVisible: true, parentId: 'nav_003' },
  { id: 'nav_009', label: 'Jewellery', href: '/category/jewellery', order: 3, isVisible: true, parentId: 'nav_003', badge: 'New' },
]

export const MOCK_MEDIA_ASSETS: SAMediaAsset[] = [
  { id: 'med_001', url: '/mock-media/hero-diwali.jpg', filename: 'hero-diwali.jpg', altText: 'Diwali celebration with diyas and crafts', tags: ['hero', 'festival', 'diwali'], fileSize: 234567, dimensions: { width: 1920, height: 720 }, uploadedBy: 'Arjun Mehta', uploadedAt: new Date(Date.now() - 2*86400000).toISOString(), usedIn: [{ type: 'hero_slide', label: 'Diwali Hero Slide', id: 'slide_001' }] },
  { id: 'med_002', url: '/mock-media/hero-artisans.jpg', filename: 'hero-artisans.jpg', altText: 'Indian artisan weaving fabric', tags: ['hero', 'artisan', 'weaving'], fileSize: 189432, dimensions: { width: 1920, height: 720 }, uploadedBy: 'Priya Sharma', uploadedAt: new Date(Date.now() - 5*86400000).toISOString(), usedIn: [{ type: 'hero_slide', label: 'Artisan Hero Slide', id: 'slide_002' }] },
  { id: 'med_003', url: '/mock-media/hero-republic-day.jpg', filename: 'hero-republic-day.jpg', altText: 'Republic Day sale banner', tags: ['hero', 'sale', 'republic-day'], fileSize: 201234, dimensions: { width: 1920, height: 720 }, uploadedBy: 'Arjun Mehta', uploadedAt: new Date(Date.now() - 10*86400000).toISOString(), usedIn: [{ type: 'hero_slide', label: 'Republic Day Slide', id: 'slide_003' }] },
  { id: 'med_004', url: '/mock-media/cat-handloom.jpg', filename: 'cat-handloom.jpg', altText: 'Handloom category thumbnail', tags: ['category', 'handloom'], fileSize: 89234, dimensions: { width: 400, height: 400 }, uploadedBy: 'Priya Sharma', uploadedAt: new Date(Date.now() - 15*86400000).toISOString(), usedIn: [] },
  { id: 'med_005', url: '/mock-media/cat-pottery.jpg', filename: 'cat-pottery.jpg', altText: 'Pottery and ceramics category', tags: ['category', 'pottery'], fileSize: 93421, dimensions: { width: 400, height: 400 }, uploadedBy: 'Priya Sharma', uploadedAt: new Date(Date.now() - 15*86400000).toISOString(), usedIn: [] },
  { id: 'med_006', url: '/mock-media/offer-summer.jpg', filename: 'offer-summer.jpg', altText: 'Summer sale offer banner', tags: ['offer', 'sale', 'summer'], fileSize: 145678, dimensions: { width: 800, height: 400 }, uploadedBy: 'Arjun Mehta', uploadedAt: new Date(Date.now() - 20*86400000).toISOString(), usedIn: [] },
  { id: 'med_007', url: '/mock-media/seller-meena.jpg', filename: 'seller-meena.jpg', altText: 'Meena artisan from Rajasthan', tags: ['artisan', 'seller', 'story'], fileSize: 78234, dimensions: { width: 600, height: 600 }, uploadedBy: 'Priya Sharma', uploadedAt: new Date(Date.now() - 25*86400000).toISOString(), usedIn: [] },
]

export const MOCK_SEO_CONFIGS: SASEOPageConfig[] = [
  { id: 'seo_001', routePattern: '/', label: 'Homepage', metaTitleTemplate: 'Bharat Bazaar — Authentic Indian Artisan Marketplace', metaDescriptionTemplate: 'Discover handmade products from 10,000+ artisans across India. Shop pottery, handloom, jewellery & more. Free shipping on orders above ₹999.', noIndex: false, lastEditedAt: new Date(Date.now() - 7*86400000).toISOString() },
  { id: 'seo_002', routePattern: '/product/[slug]', label: 'Product Pages', metaTitleTemplate: '{{productName}} — Buy Online | Bharat Bazaar', metaDescriptionTemplate: 'Buy {{productName}} by {{sellerName}} on Bharat Bazaar. Handcrafted with care. ₹{{price}}. Authentic artisan products from India.', noIndex: false, lastEditedAt: new Date(Date.now() - 14*86400000).toISOString() },
  { id: 'seo_003', routePattern: '/category/[slug]', label: 'Category Pages', metaTitleTemplate: '{{categoryName}} — Shop Handmade | Bharat Bazaar', metaDescriptionTemplate: 'Explore {{categoryName}} crafted by Indian artisans on Bharat Bazaar. Authentic, sustainable, and handmade.', noIndex: false, lastEditedAt: new Date(Date.now() - 14*86400000).toISOString() },
  { id: 'seo_004', routePattern: '/seller/[slug]', label: 'Seller Shops', metaTitleTemplate: '{{sellerName}} — Artisan Shop | Bharat Bazaar', metaDescriptionTemplate: 'Shop {{sellerName}}\'s handmade products on Bharat Bazaar. {{productCount}} unique items from {{state}}.', noIndex: false, lastEditedAt: new Date(Date.now() - 20*86400000).toISOString() },
  { id: 'seo_005', routePattern: '/about', label: 'About Page', metaTitleTemplate: 'About Us — Bharat Bazaar', metaDescriptionTemplate: 'Learn about Bharat Bazaar\'s mission to connect 10,000+ Indian artisans with customers across India.', noIndex: false, lastEditedAt: new Date(Date.now() - 30*86400000).toISOString() },
]

export const MOCK_STATIC_PAGES: SAStaticPage[] = [
  { id: 'pg_001', slug: '/about', title: 'About Us', contentMarkdown: '# About Bharat Bazaar\n\nWe connect India\'s village artisans, NGOs, and traditional craftspeople with customers across the country.\n\n## Our Mission\n\nTo empower rural artisans by giving them a digital marketplace that respects their craft and ensures fair compensation.\n\n## Our Story\n\nFounded in 2022, Bharat Bazaar has grown to support over 10,000 artisans across 20+ states.', isPublished: true, lastEditedBy: 'Arjun Mehta', lastEditedAt: new Date(Date.now() - 30*86400000).toISOString(), version: 3 },
  { id: 'pg_002', slug: '/terms', title: 'Terms of Service', contentMarkdown: '# Terms of Service\n\n*Last updated: January 2025*\n\n## 1. Acceptance of Terms\n\nBy using Bharat Bazaar, you agree to these terms.\n\n## 2. User Accounts\n\nYou are responsible for maintaining the security of your account.\n\n## 3. Seller Policies\n\nSellers must comply with our quality and authenticity standards.', isPublished: true, lastEditedBy: 'Priya Sharma', lastEditedAt: new Date(Date.now() - 60*86400000).toISOString(), version: 5 },
  { id: 'pg_003', slug: '/privacy', title: 'Privacy Policy', contentMarkdown: '# Privacy Policy\n\n*Last updated: January 2025*\n\n## Data We Collect\n\nWe collect only what is necessary to provide our services.\n\n## How We Use Your Data\n\nYour data is never sold to third parties.', isPublished: true, lastEditedBy: 'Priya Sharma', lastEditedAt: new Date(Date.now() - 60*86400000).toISOString(), version: 4 },
  { id: 'pg_004', slug: '/return-policy', title: 'Return Policy', contentMarkdown: '# Return Policy\n\nWe offer hassle-free returns within 7 days of delivery for most products.\n\n## Conditions\n\n- Item must be unused and in original packaging\n- Handmade items with minor variations are not eligible for return\n- Proof of purchase required', isPublished: true, lastEditedBy: 'Arjun Mehta', lastEditedAt: new Date(Date.now() - 45*86400000).toISOString(), version: 2 },
  { id: 'pg_005', slug: '/shipping-policy', title: 'Shipping Policy', contentMarkdown: '# Shipping Policy\n\n## Delivery Times\n\n- Metro cities: 2-4 business days\n- Tier 2 cities: 4-6 business days\n- Remote areas: 6-10 business days\n\n## Free Shipping\n\nAll orders above ₹999 qualify for free standard shipping.', isPublished: true, lastEditedBy: 'Arjun Mehta', lastEditedAt: new Date(Date.now() - 45*86400000).toISOString(), version: 2 },
  { id: 'pg_006', slug: '/seller-onboarding', title: 'Seller Onboarding Info', contentMarkdown: '# Become a Seller on Bharat Bazaar\n\n## Eligibility\n\n- Individual artisans, SHGs, NGOs, and village producers\n- Valid Aadhaar and PAN required\n- Must produce or source authentic handmade goods\n\n## How to Apply\n\n1. Create an account\n2. Submit KYC documents\n3. List your first 3 products\n4. Await verification (3-5 business days)', isPublished: true, lastEditedBy: 'Priya Sharma', lastEditedAt: new Date(Date.now() - 20*86400000).toISOString(), version: 6 },
  { id: 'pg_007', slug: '/contact', title: 'Contact Us', contentMarkdown: '# Contact Us\n\n## Customer Support\n\n**Email**: support@bharatbazaar.in\n**Phone**: +91 98765 43210\n**Hours**: Mon-Sat, 9am-6pm IST\n\n## Seller Support\n\n**Email**: sellers@bharatbazaar.in', isPublished: true, lastEditedBy: 'Arjun Mehta', lastEditedAt: new Date(Date.now() - 10*86400000).toISOString(), version: 1 },
]

export const MOCK_TRENDING_SEARCHES: SATrendingSearch[] = [
  { id: 'ts_001', term: 'diya', order: 1, isActive: true },
  { id: 'ts_002', term: 'handloom saree', order: 2, isActive: true },
  { id: 'ts_003', term: 'silver jewellery', order: 3, isActive: true },
  { id: 'ts_004', term: 'pottery', order: 4, isActive: true },
  { id: 'ts_005', term: 'wooden toys', order: 5, isActive: true },
  { id: 'ts_006', term: 'block print', order: 6, isActive: true },
  { id: 'ts_007', term: 'madhubani painting', order: 7, isActive: true },
  { id: 'ts_008', term: 'bamboo crafts', order: 8, isActive: false },
]

export const MOCK_PINNED_PRODUCTS: SAPinnedProduct[] = [
  { id: 'pin_001', searchTerm: 'diwali', productId: 'prod_001', productName: 'Handmade Clay Diya Set', pinPosition: 1 },
  { id: 'pin_002', searchTerm: 'gift', productId: 'prod_007', productName: 'Brass Puja Thali', pinPosition: 1 },
]

export const MOCK_SEARCH_SYNONYMS: SASearchSynonym[] = [
  { id: 'syn_001', term: 'diya', synonyms: ['deepak', 'lamp', 'oil lamp', 'earthen lamp'] },
  { id: 'syn_002', term: 'saree', synonyms: ['sari', 'silk saree', 'handloom saree', 'drape'] },
  { id: 'syn_003', term: 'kurta', synonyms: ['kurti', 'tunic', 'ethnic top'] },
  { id: 'syn_004', term: 'mitti', synonyms: ['clay', 'earthen', 'terracotta', 'pottery'] },
]

export const MOCK_SHIPPING_ZONES: SAShippingZone[] = [
  { id: 'zone_001', name: 'Metro Cities', states: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'West Bengal'], baseRate: 49, perKgRate: 15, freeShippingThreshold: 999, estimatedDaysMin: 2, estimatedDaysMax: 4, isActive: true },
  { id: 'zone_002', name: 'Tier 2 Cities', states: ['Uttar Pradesh', 'Rajasthan', 'Gujarat', 'Madhya Pradesh', 'Andhra Pradesh', 'Odisha', 'Kerala'], baseRate: 79, perKgRate: 20, freeShippingThreshold: 999, estimatedDaysMin: 4, estimatedDaysMax: 6, isActive: true },
  { id: 'zone_003', name: 'Northeast & Hills', states: ['Assam', 'Meghalaya', 'Manipur', 'Nagaland', 'Arunachal Pradesh', 'Mizoram', 'Tripura', 'Sikkim', 'Himachal Pradesh', 'Uttarakhand', 'Jammu & Kashmir'], baseRate: 129, perKgRate: 30, freeShippingThreshold: 1999, estimatedDaysMin: 6, estimatedDaysMax: 10, isActive: true },
  { id: 'zone_004', name: 'Rest of India', states: ['Bihar', 'Jharkhand', 'Chhattisgarh', 'Haryana', 'Punjab'], baseRate: 89, perKgRate: 22, freeShippingThreshold: 999, estimatedDaysMin: 4, estimatedDaysMax: 7, isActive: true },
]

export const MOCK_PINCODE_SERVICEABILITY: SAPincodeServiceability[] = [
  { pincode: '110001', city: 'New Delhi', zoneId: 'zone_001', isServiceable: true, codAvailable: true },
  { pincode: '400001', city: 'Mumbai', zoneId: 'zone_001', isServiceable: true, codAvailable: true },
  { pincode: '560001', city: 'Bangalore', zoneId: 'zone_001', isServiceable: true, codAvailable: true },
  { pincode: '600001', city: 'Chennai', zoneId: 'zone_001', isServiceable: true, codAvailable: true },
  { pincode: '700001', city: 'Kolkata', zoneId: 'zone_001', isServiceable: true, codAvailable: true },
  { pincode: '500001', city: 'Hyderabad', zoneId: 'zone_001', isServiceable: true, codAvailable: true },
  { pincode: '302001', city: 'Jaipur', zoneId: 'zone_002', isServiceable: true, codAvailable: true },
  { pincode: '380001', city: 'Ahmedabad', zoneId: 'zone_002', isServiceable: true, codAvailable: false },
  { pincode: '226001', city: 'Lucknow', zoneId: 'zone_002', isServiceable: true, codAvailable: true },
  { pincode: '462001', city: 'Bhopal', zoneId: 'zone_002', isServiceable: true, codAvailable: false },
  { pincode: '781001', city: 'Guwahati', zoneId: 'zone_003', isServiceable: true, codAvailable: false },
  { pincode: '793001', city: 'Shillong', zoneId: 'zone_003', isServiceable: false, codAvailable: false },
  { pincode: '171001', city: 'Shimla', zoneId: 'zone_003', isServiceable: true, codAvailable: false },
]

export const MOCK_STOREFRONT_THEME: SAStorefrontTheme = {
  primaryColor: '#FF7A00',
  secondaryColor: '#F5C842',
  accentColor: '#FF4500',
  logoUrl: '/logo.svg',
  logoUrlDark: '/logo-dark.svg',
  faviconUrl: '/favicon.ico',
  fontFamily: 'inter',
  announcementBarEnabled: true,
}
