import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#FFFFFF',
          muted: '#F6F9FC',
        },
        ink: {
          DEFAULT: '#0A2540',
          secondary: '#425466',
          tertiary: '#8898AA',
        },
        accent: {
          DEFAULT: '#635BFF',
          light: '#635BFF10',
          dark: '#4B45C6',
        },
        warm: {
          DEFAULT: '#FF6B35',
          light: '#FF6B3510',
          dark: '#CC5429',
        },
        border: {
          DEFAULT: '#E3E8EE',
          strong: '#C1C9D2',
        },
      },
      fontFamily: {
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.75rem', { lineHeight: '1.06', letterSpacing: '-0.03em' }],
        'h1': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h2': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'h3': ['1.25rem', { lineHeight: '1.3' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 2px 5px -1px rgba(50, 50, 93, 0.08), 0 1px 3px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 13px 27px -5px rgba(50, 50, 93, 0.12), 0 8px 16px -8px rgba(0, 0, 0, 0.09)',
        'nav': '0 2px 5px -1px rgba(50, 50, 93, 0.08), 0 1px 3px -1px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
