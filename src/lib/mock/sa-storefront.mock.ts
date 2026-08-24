// src/lib/mock/sa-storefront.mock.ts
// Cleared for Supabase migration — data will come from real backend

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

// ─── Cleared Mock Data ──────────────────────────────────────────────────────────

export const MOCK_HOMEPAGE_SECTIONS: SAHomepageSection[] = []
export const MOCK_HERO_SLIDES: SAHeroSlide[] = []

export const MOCK_ANNOUNCEMENT_BAR: SAAnnouncementBar = {
  id: '',
  message: '',
  backgroundColor: '#FF7A00',
  textColor: '#FFFFFF',
  isActive: false,
  dismissible: false,
  displayPages: 'all',
}

export const MOCK_NAV_MENU_ITEMS: SANavMenuItem[] = []
export const MOCK_MEDIA_ASSETS: SAMediaAsset[] = []
export const MOCK_SEO_CONFIGS: SASEOPageConfig[] = []
export const MOCK_STATIC_PAGES: SAStaticPage[] = []
export const MOCK_TRENDING_SEARCHES: SATrendingSearch[] = []
export const MOCK_PINNED_PRODUCTS: SAPinnedProduct[] = []
export const MOCK_SEARCH_SYNONYMS: SASearchSynonym[] = []
export const MOCK_SHIPPING_ZONES: SAShippingZone[] = []
export const MOCK_PINCODE_SERVICEABILITY: SAPincodeServiceability[] = []

export const MOCK_STOREFRONT_THEME: SAStorefrontTheme = {
  primaryColor: '#FF7A00',
  secondaryColor: '#F5C842',
  accentColor: '#FF4500',
  logoUrl: '/logo.svg',
  logoUrlDark: '/logo-dark.svg',
  faviconUrl: '/favicon.ico',
  fontFamily: 'inter',
  announcementBarEnabled: false,
}
