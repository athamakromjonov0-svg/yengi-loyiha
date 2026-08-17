/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // QORA + OLTIN PALITRA — Grand Decor brendi
        // slate = qora/neytral shkala, qolgan barcha oilalar = oltin/bronza
        slate: {
          50: '#F4EEE3',
          100: '#EAE2D3',
          200: '#DDD3C0',
          300: '#C7BBA3',
          400: '#A99B82',
          500: '#8A8378',  // Warm Grey — ikkinchi darajali matn
          600: '#57513F',
          700: '#3B362E',
          800: '#211D16',
          900: '#17140F',
          950: '#0D0C0A',  // Chuqur qora — asosiy fon
        },
        // Toza tilla (Pure Gold) — asosiy aksent
        amber: {
          50: '#FFFDF2',
          100: '#FEF7DC',
          200: '#FDEBAF',
          300: '#FFD966',
          400: '#FFC107',
          500: '#E5B20D',
          600: '#CC9A00',
          700: '#B08A00',
          800: '#8F6E00',
          900: '#6B5300',
        },
        yellow: {
          200: '#FDEBAF',
          300: '#FFD966',
          400: '#FFC107',
          500: '#E5B20D',
          600: '#CC9A00',
        },
        emerald: {
          100: '#FEF7DC',
          200: '#FDEBAF',
          300: '#FFD966',
          400: '#FFC107',
          500: '#E5B20D',
          600: '#CC9A00',
          700: '#B08A00',
          800: '#8F6E00',
          900: '#6B5300',
        },
        teal: {
          300: '#FFD966',
          400: '#FFC107',
          500: '#E5B20D',
          600: '#CC9A00',
        },
        green: {
          300: '#FFD966',
          400: '#FFC107',
          500: '#E5B20D',
          600: '#CC9A00',
        },
        lime: {
          300: '#FDEBAF',
          400: '#FFD966',
          500: '#FFC107',
        },
        cyan: {
          300: '#FDEBAF',
          400: '#FFD966',
          500: '#FFC107',
          600: '#E5B20D',
        },
        sky: {
          300: '#FDEBAF',
          400: '#FFD966',
          500: '#FFC107',
        },
        blue: {
          200: '#FDEBAF',
          300: '#FFD966',
          400: '#FFC107',
          500: '#E5B20D',
          600: '#CC9A00',
          700: '#B08A00',
          800: '#8F6E00',
          900: '#6B5300',
          950: '#3B2C08',
        },
        indigo: {
          300: '#FFC107',
          400: '#E5B20D',
          500: '#CC9A00',
          600: '#B08A00',
          700: '#8F6E00',
          800: '#6B5300',
          900: '#2E1F05',
        },
        violet: {
          300: '#FFC107',
          400: '#E5B20D',
          500: '#CC9A00',
          600: '#B08A00',
          700: '#8F6E00',
          800: '#6B5300',
          900: '#2E1F05',
        },
        purple: {
          300: '#FFC107',
          400: '#E5B20D',
          500: '#CC9A00',
          600: '#B08A00',
          700: '#8F6E00',
        },
        fuchsia: {
          300: '#FFC107',
          400: '#E5B20D',
          500: '#CC9A00',
        },
        pink: {
          300: '#FFD966',
          400: '#FFC107',
          500: '#E5B20D',
        },
        rose: {
          300: '#FFD966',
          400: '#FFC107',
          500: '#E5B20D',
          600: '#CC9A00',
          700: '#B08A00',
        },
        red: {
          400: '#FFC107',
          500: '#E5B20D',
          600: '#CC9A00',
        },
        orange: {
          200: '#FDEBAF',
          300: '#FFD966',
          400: '#FFC107',
          500: '#E5B20D',
          600: '#CC9A00',
          700: '#B08A00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}