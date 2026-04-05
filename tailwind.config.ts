import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── PALETA ───────────────────────────────────────────────
      colors: {
        vx: {
          black:    '#111111',
          white:    '#FFFFFF',
          cyan:     '#FFFFFF',
          'cyan-dim': '#CCCCCC',

          // Grises de soporte
          gray900:  '#1A1A1A',
          gray800:  '#222222',
          gray700:  '#333333',
          gray600:  '#444444',
          gray500:  '#666666',
          gray400:  '#888888',
          gray300:  '#AAAAAA',
          gray200:  '#CCCCCC',
          gray100:  '#EEEEEE',
        },
      },

      // ─── TIPOGRAFÍA ───────────────────────────────────────────
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],  // Títulos bold
        body:    ['var(--font-body)',    'sans-serif'],   // Cuerpo clean
      },
      fontSize: {
        '2xs': ['0.625rem',  { lineHeight: '1rem' }],
        xs:    ['0.75rem',   { lineHeight: '1rem' }],
        sm:    ['0.875rem',  { lineHeight: '1.25rem' }],
        base:  ['1rem',      { lineHeight: '1.5rem' }],
        lg:    ['1.125rem',  { lineHeight: '1.75rem' }],
        xl:    ['1.25rem',   { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',    { lineHeight: '2rem' }],
        '3xl': ['1.875rem',  { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem',   { lineHeight: '2.5rem' }],
        '5xl': ['3rem',      { lineHeight: '1.1' }],
        '6xl': ['3.75rem',   { lineHeight: '1' }],
        '7xl': ['4.5rem',    { lineHeight: '1' }],
        '8xl': ['6rem',      { lineHeight: '1' }],
        '9xl': ['8rem',      { lineHeight: '1' }],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter:  '-0.025em',
        tight:    '-0.01em',
        normal:   '0',
        wide:     '0.05em',
        wider:    '0.1em',
        widest:   '0.2em',
        caps:     '0.3em',
      },

      // ─── ESPACIADO ────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },

      // ─── LAYOUT ───────────────────────────────────────────────
      maxWidth: {
        '8xl':  '88rem',
        '9xl':  '96rem',
        'site': '1280px',
      },

      // ─── BORDER RADIUS ────────────────────────────────────────
      borderRadius: {
        none:   '0',
        sm:     '0.125rem',
        DEFAULT:'0.25rem',
        md:     '0.375rem',
        lg:     '0.5rem',
        xl:     '0.75rem',
        '2xl':  '1rem',
        '3xl':  '1.5rem',
        full:   '9999px',
      },

      // ─── SOMBRAS ──────────────────────────────────────────────
      boxShadow: {
        'cyan-sm':  '0 0 8px rgba(255, 255, 255, 0.2)',
        'cyan-md':  '0 0 20px rgba(255, 255, 255, 0.3)',
        'cyan-lg':  '0 0 40px rgba(255, 255, 255, 0.4)',
        'inset-cyan': 'inset 0 0 0 1px rgba(255, 255, 255, 0.3)',
        card:       '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.6)',
      },

      // ─── BREAKPOINTS ──────────────────────────────────────────
      screens: {
        xs:  '375px',
        sm:  '640px',
        md:  '768px',
        lg:  '1024px',
        xl:  '1280px',
        '2xl': '1536px',
      },

      // ─── ANIMACIONES ──────────────────────────────────────────
      transitionDuration: {
        '50':  '50ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'out-expo':  'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      animation: {
        'fade-in':       'fadeIn 0.4s ease-out forwards',
        'fade-up':       'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right':'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in':      'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-cyan':    'pulseCyan 2s ease-in-out infinite',
        'spin-slow':     'spin 3s linear infinite',
        'countdown':     'countdownFlip 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        pulseCyan: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(255, 255, 255, 0.2)' },
          '50%':      { boxShadow: '0 0 24px rgba(255, 255, 255, 0.5)' },
        },
        countdownFlip: {
          from: { transform: 'translateY(-10px)', opacity: '0' },
          to:   { transform: 'translateY(0)',     opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
