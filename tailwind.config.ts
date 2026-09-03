import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#151F19',
        cream: '#F3EEE0',
        stone: '#E4DDC8',
        forest: '#1C3F2D',
        'forest-dk': '#122A1F',
        sprout: '#CFFA57',
        'sprout-dim': '#B7E23F',
        leaf: '#3E8F52',
        'leaf-lt': '#66B36F',
        amber: '#FF9F5A',
        plum: '#9C4A5C',
        blush: '#F3DFE4',
        'blush-dk': '#E8C7CE',
        sage: '#93C285',
        'sage-dk': '#7BAE6E',
        muted: '#5C6B60',
        warmwhite: '#FFFDF8',
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontFamily: {
        display: ["'Anton'", 'sans-serif'],
        serif: ["'Fraunces'", 'serif'],
        editorial: ["'Newsreader'", 'Georgia', 'serif'],
        handwriting: ["'Caveat'", 'cursive'],
        sans: ["'Inter'", 'sans-serif'],
        mono: ["'IBM Plex Mono'", 'monospace'],
        spacemono: ["'Space Mono'", 'monospace'],
      },
      animation: {
        kenburns: 'kenburns 20s ease-in-out infinite alternate',
        drift: 'drift 9s ease-in-out infinite',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1.14)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--r, 0deg))' },
          '50%': { transform: 'translateY(-13px) rotate(calc(var(--r, 0deg) + 5deg))' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
