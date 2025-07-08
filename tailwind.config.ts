import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-start': '#667eea',
        'primary-end': '#764ba2',
        'secondary-start': '#4ecdc4',
        'secondary-end': '#44a08d',
        primary: {
          50: '#f0f5ff',
          100: '#e6edff',
          200: '#ccd9ff',
          300: '#99b8ff',
          400: '#6691ff',
          500: '#3366ff',
          600: '#1a4dff',
          700: '#0033cc',
          800: '#002299',
          900: '#001166',
          950: '#000d4d',
        },
        secondary: {
          50: '#f0fdfb',
          100: '#ccfbf5',
          200: '#99f6ed',
          300: '#66f0e5',
          400: '#33ebdd',
          500: '#00e6d5',
          600: '#00b8aa',
          700: '#008a80',
          800: '#005c55',
          900: '#002e2b',
          950: '#001715',
        },
        accent: {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ffa3a3',
          400: '#ff7171',
          500: '#ff4747',
          600: '#ff1f1f',
          700: '#e60000',
          800: '#b30000',
          900: '#800000',
          950: '#4d0000',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

export default config