/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PONDO warm identity
        // canvas = backgrounds, ivory = text, brand = terracotta accent,
        // peach = soft accent, bronze = borders.
        canvas: {
          DEFAULT: '#171411', // deep warm black — primary background
          deep: '#100D0B',    // recessed areas (sidebar well, inputs)
          soft: '#211B17',    // dark brown — sidebar / panels
          raised: '#2A211B',  // elevated surfaces (cards, pills)
          overlay: '#241D18', // subtle card surface between soft and raised
        },
        bronze: {
          DEFAULT: '#3B3028', // subtle dark bronze — borders
          light: '#4A3B30',   // hover borders
          faint: '#2E251E',   // hairline dividers
        },
        ivory: {
          DEFAULT: '#F5EEE6', // primary text
          muted: '#A69A90',   // secondary text
          faint: '#7A6E64',   // tertiary text / timestamps
        },
        brand: {
          // Warm terracotta — primary accent
          50: '#FAF3EE',
          100: '#F3E2D6',
          200: '#E8C9B4',
          300: '#DCAE90',
          400: '#D29470',
          500: '#C87950',
          600: '#B0623C',
          700: '#8F4E2F',
          800: '#6E3C24',
          900: '#4F2B19',
          950: '#2E180E',
        },
        peach: {
          // Soft peach — secondary accent
          50: '#FDF8F3',
          100: '#FAEFE6',
          200: '#F5DFCE',
          300: '#F0CFB6',
          400: '#E8B99A',
          500: '#DCA17C',
          600: '#C8855C',
          700: '#A66A45',
          800: '#7E4F33',
          900: '#573522',
        },
        success: {
          // Warm sage green — kept muted to stay on-palette
          100: '#2A2E26',
          200: '#3A4234',
          400: '#9DBBA0',
          500: '#7FA584',
          600: '#5E8565',
          700: '#46674D',
        },
        warning: {
          // Warm amber
          100: '#332B1E',
          200: '#453A26',
          400: '#DDB377',
          500: '#C99A55',
          600: '#A67C3F',
          700: '#7D5D2D',
        },
        danger: {
          // Warm rose — no cool reds
          100: '#332320',
          200: '#462E29',
          400: '#E08A79',
          500: '#CE6B59',
          600: '#AE5242',
          700: '#823C30',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        // Soft, warm shadows only — no glow
        card: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.5)',
        pill: '0 1px 2px rgba(0,0,0,0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
