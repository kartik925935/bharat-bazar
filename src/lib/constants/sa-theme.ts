// Bharat Bazaar Super Admin — Fortress-Grade Design System
export const SA_THEME = {
  colors: {
    // Backgrounds
    bg: {
      primary: '#09090B',       // Near black — main background
      secondary: '#111118',     // Slightly lighter — cards
      tertiary: '#1A1A2E',      // Panels & sidebars
      elevated: '#1E1E30',      // Elevated elements
      overlay: 'rgba(0,0,0,0.8)',
    },
    // Borders
    border: {
      primary: '#2A2A3E',
      secondary: '#3A3A50',
      accent: '#FF7A00',
    },
    // Text
    text: {
      primary: '#F8F8FF',
      secondary: '#A0A0B8',
      muted: '#6B6B80',
      accent: '#FF7A00',
      gold: '#F5C842',
    },
    // Accent Colors
    accent: {
      orange: '#FF7A00',
      gold: '#F5C842',
      orangeLight: '#FF9A40',
      orangeDark: '#CC5F00',
    },
    // Status Colors
    status: {
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    // Gradients
    gradient: {
      primary: 'linear-gradient(135deg, #FF7A00 0%, #F5C842 100%)',
      sidebar: 'linear-gradient(180deg, #09090B 0%, #111118 100%)',
      card: 'linear-gradient(135deg, #1A1A2E 0%, #111118 100%)',
      header: 'linear-gradient(90deg, #FF7A00 0%, #F5C842 100%)',
    },
  },
  fonts: {
    display: "'Playfair Display', Georgia, serif",   // Authority headers
    body: "'Inter', system-ui, sans-serif",           // UI text
    mono: "'JetBrains Mono', 'Fira Code', monospace", // Code, IDs
  },
  spacing: {
    sidebar: {
      expanded: '280px',
      collapsed: '72px',
    },
    topbar: '64px',
    sessionBar: '36px',
  },
  animation: {
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
    spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
} as const
