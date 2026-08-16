import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'
import {
  MOCK_HOMEPAGE_SECTIONS,
  MOCK_HERO_SLIDES,
  MOCK_ANNOUNCEMENT_BAR,
  MOCK_NAV_MENU_ITEMS,
  MOCK_MEDIA_ASSETS,
  MOCK_SEO_CONFIGS,
  MOCK_STATIC_PAGES,
  MOCK_TRENDING_SEARCHES,
  MOCK_PINNED_PRODUCTS,
  MOCK_SEARCH_SYNONYMS,
  MOCK_SHIPPING_ZONES,
  MOCK_PINCODE_SERVICEABILITY,
  MOCK_STOREFRONT_THEME,
  type SAHomepageSection,
  type SAHeroSlide,
  type SAAnnouncementBar,
  type SANavMenuItem,
  type SAMediaAsset,
  type SASEOPageConfig,
  type SAStaticPage,
  type SATrendingSearch,
  type SAPinnedProduct,
  type SASearchSynonym,
  type SAShippingZone,
  type SAPincodeServiceability,
  type SAStorefrontTheme,
} from '@/lib/mock/sa-storefront.mock'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

interface StorefrontStore {
  // State
  homepageSections: SAHomepageSection[]
  heroSlides: SAHeroSlide[]
  announcementBar: SAAnnouncementBar | null
  navMenuItems: SANavMenuItem[]
  mediaAssets: SAMediaAsset[]
  seoConfigs: SASEOPageConfig[]
  staticPages: SAStaticPage[]
  trendingSearches: SATrendingSearch[]
  pinnedProducts: SAPinnedProduct[]
  searchSynonyms: SASearchSynonym[]
  shippingZones: SAShippingZone[]
  storefrontTheme: SAStorefrontTheme

  // Homepage Actions
  reorderHomepageSections: (orderedIds: string[]) => void
  toggleSectionActive: (id: string) => Promise<{ success: boolean }>
  updateSectionConfig: (id: string, config: Record<string, unknown>) => Promise<{ success: boolean }>
  publishHomepageChanges: () => Promise<{ success: boolean }>

  // Hero Slide Actions
  addHeroSlide: (data: Omit<SAHeroSlide, 'id' | 'order'>) => Promise<{ success: boolean }>
  updateHeroSlide: (id: string, data: Partial<SAHeroSlide>) => Promise<{ success: boolean }>
  deleteHeroSlide: (id: string) => Promise<{ success: boolean }>
  reorderHeroSlides: (orderedIds: string[]) => void

  // Announcement Actions
  updateAnnouncementBar: (data: Partial<SAAnnouncementBar>) => Promise<{ success: boolean }>
  deactivateAnnouncementBar: () => Promise<{ success: boolean }>

  // Nav Menu Actions
  addNavMenuItem: (data: Omit<SANavMenuItem, 'id'>) => Promise<{ success: boolean }>
  updateNavMenuItem: (id: string, data: Partial<SANavMenuItem>) => Promise<{ success: boolean }>
  deleteNavMenuItem: (id: string) => Promise<{ success: boolean }>

  // Media Actions
  addMediaAsset: (asset: Omit<SAMediaAsset, 'id' | 'uploadedAt'>) => Promise<{ success: boolean; assetId: string }>
  deleteMediaAsset: (id: string) => Promise<{ success: boolean; blocked?: boolean }>
  updateMediaMetadata: (id: string, altText: string, tags: string[]) => Promise<{ success: boolean }>

  // SEO Actions
  updateSEOConfig: (id: string, data: Partial<SASEOPageConfig>) => Promise<{ success: boolean }>

  // Static Pages Actions
  updateStaticPage: (id: string, data: Partial<SAStaticPage> & { versionNote?: string }) => Promise<{ success: boolean }>
  publishStaticPage: (id: string) => Promise<{ success: boolean }>

  // Trending / Pins / Synonyms
  updateTrendingSearch: (id: string, data: Partial<SATrendingSearch>) => Promise<{ success: boolean }>
  reorderTrendingSearches: (orderedIds: string[]) => void
  addTrendingSearch: (term: string) => Promise<{ success: boolean }>
  deleteTrendingSearch: (id: string) => Promise<{ success: boolean }>
  addPinnedProduct: (data: Omit<SAPinnedProduct, 'id'>) => Promise<{ success: boolean }>
  deletePinnedProduct: (id: string) => Promise<{ success: boolean }>
  addSearchSynonym: (term: string, synonyms: string[]) => Promise<{ success: boolean }>
  updateSearchSynonym: (id: string, synonyms: string[]) => Promise<{ success: boolean }>
  deleteSearchSynonym: (id: string) => Promise<{ success: boolean }>

  // Shipping Actions
  addShippingZone: (data: Omit<SAShippingZone, 'id'>) => Promise<{ success: boolean }>
  updateShippingZone: (id: string, data: Partial<SAShippingZone>) => Promise<{ success: boolean }>
  deleteShippingZone: (id: string) => Promise<{ success: boolean }>
  checkPincodeServiceability: (pincode: string) => SAPincodeServiceability | null

  // Theme Actions
  updateStorefrontTheme: (data: Partial<SAStorefrontTheme>) => Promise<{ success: boolean }>
}

let _nextId = 1000
const nextId = (prefix: string) => `${prefix}_${++_nextId}`

export const useStorefrontStore = create<StorefrontStore>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────────────────────────
      homepageSections: MOCK_HOMEPAGE_SECTIONS,
      heroSlides: MOCK_HERO_SLIDES,
      announcementBar: MOCK_ANNOUNCEMENT_BAR,
      navMenuItems: MOCK_NAV_MENU_ITEMS,
      mediaAssets: MOCK_MEDIA_ASSETS,
      seoConfigs: MOCK_SEO_CONFIGS,
      staticPages: MOCK_STATIC_PAGES,
      trendingSearches: MOCK_TRENDING_SEARCHES,
      pinnedProducts: MOCK_PINNED_PRODUCTS,
      searchSynonyms: MOCK_SEARCH_SYNONYMS,
      shippingZones: MOCK_SHIPPING_ZONES,
      storefrontTheme: MOCK_STOREFRONT_THEME,

      // ── Homepage Actions ────────────────────────────────────────────────────
      reorderHomepageSections: (orderedIds) => {
        set(state => ({
          homepageSections: orderedIds
            .map((id, idx) => {
              const s = state.homepageSections.find(x => x.id === id)
              return s ? { ...s, order: idx + 1 } : null
            })
            .filter(Boolean) as SAHomepageSection[]
        }))
      },

      toggleSectionActive: async (id) => {
        await delay()
        set(state => ({
          homepageSections: state.homepageSections.map(s =>
            s.id === id ? { ...s, isActive: !s.isActive } : s
          )
        }))
        return { success: true }
      },

      updateSectionConfig: async (id, config) => {
        await delay()
        set(state => ({
          homepageSections: state.homepageSections.map(s =>
            s.id === id ? { ...s, config, lastEditedAt: new Date().toISOString() } : s
          )
        }))
        toast.success('Section updated')
        return { success: true }
      },

      publishHomepageChanges: async () => {
        await delay(600)
        toast.success('Homepage changes published to storefront')
        return { success: true }
      },

      // ── Hero Slides ────────────────────────────────────────────────────────
      addHeroSlide: async (data) => {
        await delay()
        const newSlide: SAHeroSlide = { ...data, id: nextId('slide'), order: get().heroSlides.length + 1 }
        set(state => ({ heroSlides: [...state.heroSlides, newSlide] }))
        return { success: true }
      },

      updateHeroSlide: async (id, data) => {
        await delay()
        set(state => ({
          heroSlides: state.heroSlides.map(s => s.id === id ? { ...s, ...data } : s)
        }))
        return { success: true }
      },

      deleteHeroSlide: async (id) => {
        await delay()
        set(state => ({ heroSlides: state.heroSlides.filter(s => s.id !== id) }))
        return { success: true }
      },

      reorderHeroSlides: (orderedIds) => {
        set(state => ({
          heroSlides: orderedIds
            .map((id, idx) => {
              const s = state.heroSlides.find(x => x.id === id)
              return s ? { ...s, order: idx + 1 } : null
            })
            .filter(Boolean) as SAHeroSlide[]
        }))
      },

      // ── Announcement Bar ───────────────────────────────────────────────────
      updateAnnouncementBar: async (data) => {
        await delay()
        set(state => ({ announcementBar: state.announcementBar ? { ...state.announcementBar, ...data } : null }))
        toast.success('Announcement bar updated')
        return { success: true }
      },

      deactivateAnnouncementBar: async () => {
        await delay()
        set(state => ({
          announcementBar: state.announcementBar ? { ...state.announcementBar, isActive: false } : null
        }))
        return { success: true }
      },

      // ── Nav Menu ───────────────────────────────────────────────────────────
      addNavMenuItem: async (data) => {
        await delay()
        set(state => ({ navMenuItems: [...state.navMenuItems, { ...data, id: nextId('nav') }] }))
        return { success: true }
      },

      updateNavMenuItem: async (id, data) => {
        await delay()
        set(state => ({
          navMenuItems: state.navMenuItems.map(m => m.id === id ? { ...m, ...data } : m)
        }))
        return { success: true }
      },

      deleteNavMenuItem: async (id) => {
        await delay()
        set(state => ({ navMenuItems: state.navMenuItems.filter(m => m.id !== id) }))
        return { success: true }
      },

      // ── Media Library ──────────────────────────────────────────────────────
      addMediaAsset: async (asset) => {
        await delay(800) // simulate upload
        const id = nextId('med')
        set(state => ({
          mediaAssets: [{ ...asset, id, uploadedAt: new Date().toISOString(), usedIn: [] }, ...state.mediaAssets]
        }))
        return { success: true, assetId: id }
      },

      deleteMediaAsset: async (id) => {
        const asset = get().mediaAssets.find(a => a.id === id)
        if (asset && asset.usedIn.length > 0) {
          toast.error(`Cannot delete — used in ${asset.usedIn.length} place(s)`)
          return { success: false, blocked: true }
        }
        await delay()
        set(state => ({ mediaAssets: state.mediaAssets.filter(a => a.id !== id) }))
        toast.success('Asset deleted')
        return { success: true }
      },

      updateMediaMetadata: async (id, altText, tags) => {
        await delay()
        set(state => ({
          mediaAssets: state.mediaAssets.map(a => a.id === id ? { ...a, altText, tags } : a)
        }))
        return { success: true }
      },

      // ── SEO ────────────────────────────────────────────────────────────────
      updateSEOConfig: async (id, data) => {
        await delay()
        set(state => ({
          seoConfigs: state.seoConfigs.map(c => c.id === id ? { ...c, ...data, lastEditedAt: new Date().toISOString() } : c)
        }))
        toast.success('SEO config saved')
        return { success: true }
      },

      // ── Static Pages ───────────────────────────────────────────────────────
      updateStaticPage: async (id, data) => {
        await delay()
        set(state => ({
          staticPages: state.staticPages.map(p =>
            p.id === id ? { ...p, ...data, lastEditedAt: new Date().toISOString(), version: p.version + 1 } : p
          )
        }))
        toast.success('Page saved as draft')
        return { success: true }
      },

      publishStaticPage: async (id) => {
        await delay()
        set(state => ({
          staticPages: state.staticPages.map(p =>
            p.id === id ? { ...p, isPublished: true, lastEditedAt: new Date().toISOString() } : p
          )
        }))
        toast.success('Page published')
        return { success: true }
      },

      // ── Trending / Search ──────────────────────────────────────────────────
      updateTrendingSearch: async (id, data) => {
        await delay()
        set(state => ({
          trendingSearches: state.trendingSearches.map(t => t.id === id ? { ...t, ...data } : t)
        }))
        return { success: true }
      },

      reorderTrendingSearches: (orderedIds) => {
        set(state => ({
          trendingSearches: orderedIds
            .map((id, idx) => {
              const t = state.trendingSearches.find(x => x.id === id)
              return t ? { ...t, order: idx + 1 } : null
            })
            .filter(Boolean) as SATrendingSearch[]
        }))
      },

      addTrendingSearch: async (term) => {
        await delay()
        const id = nextId('ts')
        set(state => ({
          trendingSearches: [...state.trendingSearches, { id, term, order: state.trendingSearches.length + 1, isActive: true }]
        }))
        return { success: true }
      },

      deleteTrendingSearch: async (id) => {
        await delay()
        set(state => ({ trendingSearches: state.trendingSearches.filter(t => t.id !== id) }))
        return { success: true }
      },

      addPinnedProduct: async (data) => {
        await delay()
        set(state => ({
          pinnedProducts: [...state.pinnedProducts, { ...data, id: nextId('pin') }]
        }))
        return { success: true }
      },

      deletePinnedProduct: async (id) => {
        await delay()
        set(state => ({ pinnedProducts: state.pinnedProducts.filter(p => p.id !== id) }))
        return { success: true }
      },

      addSearchSynonym: async (term, synonyms) => {
        await delay()
        set(state => ({
          searchSynonyms: [...state.searchSynonyms, { id: nextId('syn'), term, synonyms }]
        }))
        return { success: true }
      },

      updateSearchSynonym: async (id, synonyms) => {
        await delay()
        set(state => ({
          searchSynonyms: state.searchSynonyms.map(s => s.id === id ? { ...s, synonyms } : s)
        }))
        return { success: true }
      },

      deleteSearchSynonym: async (id) => {
        await delay()
        set(state => ({ searchSynonyms: state.searchSynonyms.filter(s => s.id !== id) }))
        return { success: true }
      },

      // ── Shipping ───────────────────────────────────────────────────────────
      addShippingZone: async (data) => {
        await delay()
        set(state => ({
          shippingZones: [...state.shippingZones, { ...data, id: nextId('zone') }]
        }))
        return { success: true }
      },

      updateShippingZone: async (id, data) => {
        await delay()
        set(state => ({
          shippingZones: state.shippingZones.map(z => z.id === id ? { ...z, ...data } : z)
        }))
        toast.success('Shipping zone updated')
        return { success: true }
      },

      deleteShippingZone: async (id) => {
        await delay()
        set(state => ({ shippingZones: state.shippingZones.filter(z => z.id !== id) }))
        return { success: true }
      },

      checkPincodeServiceability: (pincode) => {
        return MOCK_PINCODE_SERVICEABILITY.find(p => p.pincode === pincode) ?? null
      },

      // ── Theme ──────────────────────────────────────────────────────────────
      updateStorefrontTheme: async (data) => {
        await delay()
        set(state => ({ storefrontTheme: { ...state.storefrontTheme, ...data } }))
        toast.success('Theme saved')
        return { success: true }
      },
    }),
    {
      name: 'sa-storefront-store',
    }
  )
)
