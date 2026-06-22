import type { Config } from 'tailwindcss'
import { palette } from './src/design/tokens'

/**
 * Design tokens extracted from assets/components/*.png and assets/features/*.png.
 * Components must reference ONLY these token names — no raw hex / arbitrary values.
 * Raw values live in src/design/tokens.ts (shared with runtime chart/SVG code).
 *
 *  - brand   : blue accents (logo, active nav, toggles, links, "Marketing" pills, info)
 *  - primary : dark navy/ink — filled primary buttons & dialog actions
 *  - success : green — Active / Consented / positive
 *  - warning : amber — Medium severity / pending
 *  - danger  : red   — error / High / Critical (solid) / Record Withdrawal
 *  - neutral : grays — text, borders, surfaces, zebra rows
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: palette.brand,
        primary: palette.primary,
        success: palette.success,
        warning: palette.warning,
        danger: palette.danger,
        neutral: palette.neutral,
        // semantic surface / text aliases
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F5F6F8', // page background
          sunken: '#F2F4F7', // section header bands / hover
          zebra: '#F9FAFB', // alternating table rows
        },
        border: {
          DEFAULT: '#EAECF0',
          strong: '#D0D5DD',
        },
        fg: {
          DEFAULT: '#344054', // body
          strong: '#101828', // headings
          muted: '#667085', // field labels, secondary
          subtle: '#98A2B3', // placeholder, disabled
          inverse: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'sans-serif'],
      },
      fontSize: {
        // tuned to the dense governance UI
        '2xs': ['0.6875rem', { lineHeight: '1rem' }], // 11px badges
        xs: ['0.75rem', { lineHeight: '1.125rem' }],
        sm: ['0.8125rem', { lineHeight: '1.25rem' }], // 13px table/labels
        base: ['0.875rem', { lineHeight: '1.375rem' }], // 14px default
        md: ['0.9375rem', { lineHeight: '1.5rem' }],
        lg: ['1.0625rem', { lineHeight: '1.5rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }], // page / record headings
      },
      spacing: {
        sidebar: '16rem',
        'sidebar-collapsed': '4rem',
        topbar: '4rem',
        card: '1.5rem',
        'section-gap': '1.5rem',
        'field-gap': '1.25rem',
      },
      borderRadius: {
        card: '0.75rem',
        control: '0.5rem',
        input: '0.625rem',
        chip: '0.375rem',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.10)',
        dropdown: '0 4px 14px rgba(16,24,40,0.10), 0 1px 3px rgba(16,24,40,0.06)',
        topbar: '0 1px 2px rgba(16,24,40,0.05)',
        modal: '0 20px 24px -4px rgba(16,24,40,0.12), 0 8px 8px -4px rgba(16,24,40,0.04)',
        toggle: '0 1px 2px rgba(16,24,40,0.15)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.15s ease-out',
        'scale-in': 'scale-in 0.12s ease-out',
        'slide-up': 'slide-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
