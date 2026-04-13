import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1E3A8A',
          50: '#EEF2FB',
          600: '#1E3A8A',
          700: '#172E6D',
        },
        gold: { DEFAULT: '#B8860B' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
