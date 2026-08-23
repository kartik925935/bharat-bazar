'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ConfirmModalConfig {
  isOpen: boolean
  title: string
  description: string
  variant: 'danger' | 'warning' | 'info'
  confirmLabel: string
  onConfirm: (() => void) | null
}

interface SavedView {
  id: string
  label: string
  state: Record<string, unknown>
  createdAt: string
}

interface RecentlyViewedItem {
  type: string
  id: string
  label: string
  visitedAt: string
}

interface SAUIState {
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  commandPaletteOpen: boolean
  activeDropdown: 'notifications' | 'profile' | null
  confirmModal: ConfirmModalConfig
  pageLoading: boolean
  savedViews: Record<string, SavedView[]>   // keyed by pageKey
  recentlyViewed: RecentlyViewedItem[]
  isCompactMode: boolean
}

interface SAUIActions {
  toggleSidebar: () => void
  setSidebarCollapsed: (val: boolean) => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  openCommandPalette: () => void
  closeCommandPalette: () => void
  toggleCommandPalette: () => void
  setActiveDropdown: (dropdown: 'notifications' | 'profile' | null) => void
  openConfirmModal: (config: Omit<ConfirmModalConfig, 'isOpen'>) => void
  closeConfirmModal: () => void
  setPageLoading: (val: boolean) => void
  // Saved Views
  addSavedView: (pageKey: string, view: SavedView) => void
  removeSavedView: (pageKey: string, viewId: string) => void
  renameSavedView: (pageKey: string, viewId: string, newLabel: string) => void
  
  // Command Palette & Global
  pushRecentlyViewed: (entry: { type: string; id: string; label: string }) => void
  toggleDensity: () => void
}

const INITIAL_CONFIRM: ConfirmModalConfig = {
  isOpen: false,
  title: '',
  description: '',
  variant: 'danger',
  confirmLabel: 'Confirm',
  onConfirm: null,
}

export const useSAUIStore = create<SAUIState & SAUIActions>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      commandPaletteOpen: false,
      activeDropdown: null,
      confirmModal: INITIAL_CONFIRM,
      pageLoading: false,
      savedViews: {},
      recentlyViewed: [],
      isCompactMode: false,

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
      toggleMobileSidebar: () => set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
      closeMobileSidebar: () => set({ mobileSidebarOpen: false }),

      openCommandPalette: () => set({ commandPaletteOpen: true, activeDropdown: null }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),
      toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen, activeDropdown: null })),

      setActiveDropdown: (dropdown) => set({ activeDropdown: dropdown, commandPaletteOpen: false }),

      openConfirmModal: (config) => set({ confirmModal: { ...config, isOpen: true } }),
      closeConfirmModal: () => set({ confirmModal: INITIAL_CONFIRM }),

      setPageLoading: (val) => set({ pageLoading: val }),

      addSavedView: (pageKey, view) => set((s) => ({
        savedViews: {
          ...s.savedViews,
          [pageKey]: [...(s.savedViews[pageKey] ?? []), view],
        },
      })),

      removeSavedView: (pageKey, viewId) => set((s) => ({
        savedViews: {
          ...s.savedViews,
          [pageKey]: (s.savedViews[pageKey] ?? []).filter((v) => v.id !== viewId),
        },
      })),

      renameSavedView: (pageKey, viewId, newLabel) => set((s) => ({
        savedViews: {
          ...s.savedViews,
          [pageKey]: (s.savedViews[pageKey] ?? []).map((v) =>
            v.id === viewId ? { ...v, label: newLabel } : v
          ),
        },
      })),

      pushRecentlyViewed: (entry) => set((s) => {
        const newItem: RecentlyViewedItem = { ...entry, visitedAt: new Date().toISOString() }
        const filtered = s.recentlyViewed.filter(
          item => !(item.type === entry.type && item.id === entry.id)
        )
        return { recentlyViewed: [newItem, ...filtered].slice(0, 5) }
      }),

      toggleDensity: () => set((s) => ({ isCompactMode: !s.isCompactMode }))
    }),
    {
      name: 'sa-ui-state',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        savedViews: state.savedViews,
        recentlyViewed: state.recentlyViewed,
        isCompactMode: state.isCompactMode,
      }),
    }
  )
)
