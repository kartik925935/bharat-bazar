export const SA_THEME = {
  // ─── BACKGROUNDS ───────────────────────────────
  bg: {
    page: '#050508',          // True deep dark
    primary: '#0C0C14',       // Primary surface
    secondary: '#111120',     // Secondary surface
    card: '#14141F',          // Card background
    cardHover: '#1A1A2E',     // Card on hover
    sidebar: '#08080F',       // Sidebar background
    input: '#0E0E1A',         // Input fields
    inputFocus: '#141422',    // Input focused
    modal: '#0F0F1C',         // Modal background
    tooltip: '#1C1C2E',       // Tooltip
    dropdown: '#12121E',      // Dropdown menus
    highlight: '#1E1E35',     // Selected/highlighted rows
  },

  // ─── BORDERS ───────────────────────────────────
  border: {
    primary: '#1E1E35',       // Default borders
    secondary: '#16162A',     // Subtle borders
    accent: '#2E2E55',        // Accent borders
    gold: '#F5C84240',        // Gold border (semi-transparent)
    focus: '#F5C842',         // Focus ring color
    error: '#EF4444',         // Error border
    success: '#10B981',       // Success border
  },

  // ─── TEXT ──────────────────────────────────────
  text: {
    primary: '#F0F0FF',       // Main text (off-white/blue)
    secondary: '#9090B8',     // Secondary text
    muted: '#5A5A80',         // Muted/placeholder
    inverse: '#050508',       // Text on gold backgrounds
    gold: '#F5C842',          // Gold accent text
    success: '#10B981',       // Success text
    error: '#EF4444',         // Error text
    warning: '#F59E0B',       // Warning text
    info: '#3B82F6',          // Info text
    code: '#A78BFA',          // Code/monospace text
  },

  // ─── GOLD (Primary Brand for SA) ───────────────
  gold: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F5C842',           // Primary gold
    600: '#D4A017',           // Darker gold
    700: '#8B7420',           // Dimmed gold
    gradient: 'linear-gradient(135deg, #F5C842 0%, #D4A017 50%, #F5C842 100%)',
    glow: '0 0 20px rgba(245, 200, 66, 0.3)',
    softGlow: '0 0 10px rgba(245, 200, 66, 0.15)',
  },

  // ─── STATUS COLORS ─────────────────────────────
  status: {
    pending: { bg: '#F59E0B20', text: '#F59E0B', border: '#F59E0B40' },
    approved: { bg: '#10B98120', text: '#10B981', border: '#10B98140' },
    rejected: { bg: '#EF444420', text: '#EF4444', border: '#EF444440' },
    suspended: { bg: '#EF444420', text: '#EF4444', border: '#EF444440' },
    review: { bg: '#3B82F620', text: '#3B82F6', border: '#3B82F640' },
    changes: { bg: '#F9731620', text: '#F97316', border: '#F9731640' },
    active: { bg: '#10B98120', text: '#10B981', border: '#10B98140' },
    inactive: { bg: '#6B728020', text: '#6B7280', border: '#6B728040' },
    locked: { bg: '#7C3AED20', text: '#7C3AED', border: '#7C3AED40' },
    live: { bg: '#EF444420', text: '#EF4444', border: '#EF444440' },
  },

  // ─── DATA VISUALIZATION ────────────────────────
  charts: {
    colors: ['#F5C842', '#8B5CF6', '#3B82F6', '#10B981', '#F97316', '#EC4899'],
    grid: '#1E1E35',
    axis: '#5A5A80',
    tooltip: { bg: '#1C1C2E', border: '#2E2E55', text: '#F0F0FF' },
  },
};
