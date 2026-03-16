/**
 * Procurement Panic - Design Tokens
 *
 * Single source of truth for ALL visual values in the app.
 * Import from here. Never hardcode colors, fonts, spacing, or radii in components.
 *
 * CSS variables are injected at runtime via injectTheme() - call it once in main.tsx.
 * Components can use either:
 *   - JS constants (for Framer Motion, Recharts, inline styles)
 *   - var(--xxx) in CSS (for stylesheets)
 */

// ─── Colors ──────────────────────────────────────────────────────────────────

export const colors = {
  bg: '#FFF8F0',
  bgAlt: '#FFF0E0',
  surface: '#FFFFFF',
  surfaceHover: '#FFF5EB',

  text: '#2A1F3D',
  textSecondary: '#7C6F8A',
  textMuted: '#A99FBA',
  textOnColor: '#FFFFFF',

  primary: '#FF6B6B',
  primaryHover: '#FF5252',
  primaryLight: '#FFE0E0',
  secondary: '#2EC4B6',
  secondaryHover: '#25B0A3',
  secondaryLight: '#D4F5F2',

  success: '#7ED957',
  warning: '#FFB830',
  danger: '#FF4757',
  dangerLight: '#FFE0E3',

  border: '#E8DDD0',
  borderLight: '#F0E8DF',

  belt: '#C4B5A0',
  beltStripe: '#B5A690',
  beltShadow: '#A89880',

  overlay: 'rgba(26, 17, 37, 0.6)',
} as const;

// ─── Department Colors ───────────────────────────────────────────────────────
// Also exposed as CSS variables: --color-dept-finance, --color-dept-legal, etc.
// DEPARTMENTS.ts references these via var() strings.

export const deptColors = {
  finance: '#FFBE0B',
  legal: '#8338EC',
  it: '#3A86FF',
  security: '#06D6A0',
  flag: '#FF006E',
} as const;

// Lightened variants for card backgrounds / bucket fills
export const deptColorsLight = {
  finance: '#FFF3D0',
  legal: '#F0E4FF',
  it: '#DDE9FF',
  security: '#D0F8EC',
  flag: '#FFD6E8',
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────

export const fonts = {
  heading: "'Fredoka', sans-serif",
  body: "'Nunito', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const;

export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  '4xl': '2.5rem',
  '5xl': '3.5rem',
} as const;

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeights = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.65,
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────
// 4px base grid

export const spacing = {
  '2xs': '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
} as const;

// ─── Border Radii ────────────────────────────────────────────────────────────

export const radii = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  pill: '9999px',
  circle: '50%',
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const shadows = {
  sm: '0 2px 8px rgba(42, 31, 61, 0.06)',
  md: '0 4px 16px rgba(42, 31, 61, 0.1)',
  lg: '0 8px 32px rgba(42, 31, 61, 0.14)',
  xl: '0 16px 48px rgba(42, 31, 61, 0.18)',
  inner: 'inset 0 2px 4px rgba(42, 31, 61, 0.06)',
  glow: (color: string) => `0 0 24px ${color}55, 0 0 48px ${color}22`,
  cardHover: '0 8px 24px rgba(42, 31, 61, 0.15), 0 2px 8px rgba(42, 31, 61, 0.08)',
} as const;

// ─── Z-Index Layers ──────────────────────────────────────────────────────────

export const zIndex = {
  belt: 0,
  card: 10,
  cardDragging: 50,
  bucket: 5,
  meter: 60,
  overlay: 80,
  modal: 90,
  toast: 100,
} as const;

// ─── Animation Presets (Framer Motion) ───────────────────────────────────────

export const animation = {
  spring: { type: 'spring' as const, stiffness: 300, damping: 22 },
  springBouncy: { type: 'spring' as const, stiffness: 450, damping: 15 },
  springGentle: { type: 'spring' as const, stiffness: 180, damping: 20 },
  springSnappy: { type: 'spring' as const, stiffness: 500, damping: 30 },
  duration: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.4,
    dramatic: 0.8,
  },
  easing: [0.22, 1, 0.36, 1] as [number, number, number, number],
} as const;

// ─── Game Constants ──────────────────────────────────────────────────────────

export const game = {
  cardWidth: '240px',
  cardHeight: '210px',
  bucketWidth: '140px',
  bucketHeight: '120px',
  beltHeight: '240px',
  meterHeight: '48px',
} as const;

// ─── CSS Variable Injection ──────────────────────────────────────────────────
// Call once in main.tsx to set all design tokens as CSS custom properties on :root.

export function injectTheme(): void {
  const root = document.documentElement;

  const vars: Record<string, string> = {
    // Backgrounds
    '--color-bg': colors.bg,
    '--color-bg-alt': colors.bgAlt,
    '--color-surface': colors.surface,
    '--color-surface-hover': colors.surfaceHover,

    // Text
    '--color-text': colors.text,
    '--color-text-secondary': colors.textSecondary,
    '--color-text-muted': colors.textMuted,
    '--color-text-on-color': colors.textOnColor,

    // Actions
    '--color-primary': colors.primary,
    '--color-primary-hover': colors.primaryHover,
    '--color-primary-light': colors.primaryLight,
    '--color-secondary': colors.secondary,
    '--color-secondary-hover': colors.secondaryHover,
    '--color-secondary-light': colors.secondaryLight,

    // Status
    '--color-success': colors.success,
    '--color-warning': colors.warning,
    '--color-danger': colors.danger,
    '--color-danger-light': colors.dangerLight,

    // Borders
    '--color-border': colors.border,
    '--color-border-light': colors.borderLight,

    // Game
    '--color-belt': colors.belt,
    '--color-belt-stripe': colors.beltStripe,
    '--color-belt-shadow': colors.beltShadow,
    '--color-overlay': colors.overlay,

    // Department colors (referenced by DEPARTMENTS.ts)
    '--color-dept-finance': deptColors.finance,
    '--color-dept-legal': deptColors.legal,
    '--color-dept-it': deptColors.it,
    '--color-dept-security': deptColors.security,
    '--color-dept-flag': deptColors.flag,

    // Department light variants
    '--color-dept-finance-light': deptColorsLight.finance,
    '--color-dept-legal-light': deptColorsLight.legal,
    '--color-dept-it-light': deptColorsLight.it,
    '--color-dept-security-light': deptColorsLight.security,
    '--color-dept-flag-light': deptColorsLight.flag,

    // Typography
    '--font-heading': fonts.heading,
    '--font-body': fonts.body,
    '--font-mono': fonts.mono,

    // Spacing
    '--space-2xs': spacing['2xs'],
    '--space-xs': spacing.xs,
    '--space-sm': spacing.sm,
    '--space-md': spacing.md,
    '--space-lg': spacing.lg,
    '--space-xl': spacing.xl,
    '--space-2xl': spacing['2xl'],
    '--space-3xl': spacing['3xl'],
    '--space-4xl': spacing['4xl'],

    // Radii
    '--radius-sm': radii.sm,
    '--radius-md': radii.md,
    '--radius-lg': radii.lg,
    '--radius-xl': radii.xl,
    '--radius-pill': radii.pill,

    // Shadows
    '--shadow-sm': shadows.sm,
    '--shadow-md': shadows.md,
    '--shadow-lg': shadows.lg,
    '--shadow-xl': shadows.xl,
    '--shadow-inner': shadows.inner,
  };

  for (const [prop, value] of Object.entries(vars)) {
    root.style.setProperty(prop, value);
  }
}
