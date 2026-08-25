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
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        background: {
          primary: '#1B1B3A',
          secondary: '#6366F1',
        },
        // Redesign light theme (Figma "AI Centre Guide") — AIC2-129
        brand: {
          DEFAULT: '#022ac0', // primary blue: buttons, logo wordmark, CTA well
          dark: '#001e5b',    // deep navy: headings + body text on light surfaces
        },
        navy: '#001e5b',
      },
      fontFamily: {
        // Headings use Avant Garde For Salesforce (Demi); body/UI use Salesforce Sans.
        heading: ['"Avant Garde For Salesforce"', '"Salesforce Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Salesforce Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1B1B3A 0%, #2D1B69 60%, #6366F1 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        // Page background for redesigned light pages — cream at top fading to light blue.
        // Figma node 7:49 ("Cloud Yellow Gradient 2"), reversed so cream sits at the top of the page.
        'page-gradient':
          'linear-gradient(180deg, #FBF3E0 0%, #EAF5FE 35%, #90D0FE 78%, #00B3FF 100%)',
      },
      borderRadius: {
        card: '16px', // shared white content card shell (Figma rounded-16)
      },
      boxShadow: {
        card: '0 8px 30px rgba(0, 30, 91, 0.08)', // soft navy-tinted card shadow
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'floating': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0px, 0)' },
          '50%': { transform: 'translate3d(0, -8px, 0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config