import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

// =====================================================================
// THEME PALETTE — Edit only these 5 values to retheme the entire app.
// CSS custom properties (--p1 … --p5) are auto-generated from this
// object too, so SVG attributes and Recharts colour props stay in sync
// without any extra configuration.
// =====================================================================
const PALETTE = {
  p1: '#ffffff',   // White      - Background
  p2: '#18181b',   // Zinc-900   - Accent / primary (near-black)
  p3: '#71717a',   // Zinc-500   - Muted text / borders
  p4: '#a1a1aa',   // Zinc-400   - Subtle text / light borders
  p5: '#09090b',   // Zinc-950   - Foreground text
} as const

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        p1: PALETTE.p1,
        p2: PALETTE.p2,
        p3: PALETTE.p3,
        p4: PALETTE.p4,
        p5: PALETTE.p5,
        // semantic aliases for self-documenting class names
        surface: PALETTE.p1,
        accent:  PALETTE.p2,
        muted:   PALETTE.p3,
        subtle:  PALETTE.p4,
        fore:    PALETTE.p5,
        // remap Tailwind's built-in gray shades to palette tones
        gray: {
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      boxShadow: {
        card:         '0 0 0 1px #18181b14, 0 4px 24px #18181b08',
        glow:         '0 4px 16px #18181b18',
        'inner-glow': 'inset 0 1px 0 #a1a1aa22',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':    'shimmer 1.6s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [
    // Auto-generates CSS custom properties (--p1 … --p5) so that SVG
    // attributes, Recharts props, and plain CSS can reference the palette
    // without duplicating any hex values.
    plugin(function ({ addBase }) {
      addBase({
        ':root': Object.fromEntries(
          Object.entries(PALETTE).map(([k, v]) => [`--${k}`, v])
        ) as Record<string, string>,
      })
    }),
  ],
} satisfies Config
