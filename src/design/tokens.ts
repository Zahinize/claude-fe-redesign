/**
 * Single source of truth for raw token values.
 * Imported by tailwind.config.ts (utility classes) AND by runtime code that
 * needs hex values (SVG charts, progress rings) — so no color is ever hardcoded
 * at a call site; everything resolves here.
 */
export const palette = {
  brand: { 50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8' },
  primary: { DEFAULT: '#2E3440', hover: '#1F232E', fg: '#FFFFFF' },
  success: { 50: '#ECFDF3', 100: '#D1FADF', 500: '#12B76A', 600: '#027A48', 700: '#05603A' },
  warning: { 50: '#FFFAEB', 100: '#FEF0C7', 500: '#F79009', 600: '#B54708', 700: '#93370D' },
  danger: { 50: '#FEF3F2', 100: '#FEE4E2', 500: '#F04438', 600: '#D92D20', 700: '#B42318' },
  neutral: {
    50: '#F9FAFB', 100: '#F2F4F7', 200: '#EAECF0', 300: '#D0D5DD', 400: '#98A2B3',
    500: '#667085', 600: '#475467', 700: '#344054', 800: '#1D2939', 900: '#101828',
  },
} as const

/** Semantic colors for charts (Recharts needs concrete hex strings). */
export const chartColors = {
  bar: palette.brand[600],
  barTrack: palette.neutral[100],
  axis: palette.neutral[400],
  grid: palette.neutral[200],
  label: palette.neutral[500],
} as const
