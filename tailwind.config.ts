// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        hind: ['var(--font-hind)', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#f4611a',
          violet: '#6c3fe6',
          pink: '#e63f8a',
          teal: '#0aab8a',
          amber: '#f5a623',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #f4611a 0%, #6c3fe6 100%)',
        'gradient-brand-r': 'linear-gradient(135deg, #6c3fe6 0%, #f4611a 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a1033 0%, #2d1d5e 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        'brand': '0 10px 40px rgba(244, 97, 26, 0.3)',
        'violet': '0 10px 40px rgba(108, 63, 230, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
