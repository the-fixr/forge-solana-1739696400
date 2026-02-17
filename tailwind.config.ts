import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9945FF',
          50: '#F5EEFF',
          100: '#E8D5FF',
          200: '#D1ABFF',
          300: '#BA80FF',
          400: '#A356FF',
          500: '#9945FF',
          600: '#7B22E6',
          700: '#5E0FBF',
          800: '#430A8A',
          900: '#2A0659',
        },
        accent: {
          DEFAULT: '#14F195',
          50: '#E6FFF5',
          100: '#B3FFE0',
          200: '#80FFCB',
          300: '#4DFFB6',
          400: '#27FFA5',
          500: '#14F195',
          600: '#0FCC7D',
          700: '#0AA665',
          800: '#06804E',
          900: '#035A36',
        },
        background: '#0a0a0a',
        surface: '#111111',
        border: '#1f1f1f',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
