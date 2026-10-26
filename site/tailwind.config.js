/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Authentic App Color Palette
        espresso: {
          DEFAULT: '#3a2b20',
          dark: '#1e1610',
          muted: '#6b5138',
          subtle: '#b0793f',
        },
        cream: {
          DEFAULT: '#fdf3e3',
          light: '#fffdf6',
          warm: '#ffeef3',
          surface: '#f7ecd9',
        },
        honey: {
          DEFAULT: '#ffd76e',
          light: '#ffe094',
          dark: '#e5be50',
        },
        coral: {
          DEFAULT: '#ff6d8a',
          light: '#ff8ca3',
          dark: '#e04c6b',
        },
        mint: {
          DEFAULT: '#7ed6a0',
          light: '#9ae6b5',
          dark: '#5dbb82',
        },
        sky: {
          DEFAULT: '#7ec8ff',
          light: '#a0d7ff',
          dark: '#58aef0',
        },
        lavender: {
          DEFAULT: '#cbb2fe',
          light: '#dac7ff',
          dark: '#b291fb',
        },
        // Rich Dark Mode Palette (Warm Cocoa / Espresso instead of cold cyber)
        cocoa: {
          bg: '#140f0c',
          canvas: '#1a1410',
          card: '#221b16',
          border: '#3a2d24',
          borderLight: '#4d3d32',
          hover: '#2c231d',
          text: '#fdf3e3',
          muted: '#a89482',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
        pixel: ['"Pixelify Sans"', 'sans-serif'],
        arcade: ['"Press Start 2P"', 'monospace'],
        dialogue: ['"VT323"', 'monospace'],
      },
      boxShadow: {
        'pixel': '0 4px 0 #3a2b20',
        'pixel-lg': '0 6px 0 #3a2b20',
        'pixel-xl': '0 8px 0 #3a2b20',
        'pixel-dark': '0 4px 0 #000000',
        'pixel-dark-lg': '0 6px 0 #000000',
        'pixel-soft': '0 4px 0 rgba(58, 43, 32, 0.22)',
        'pixel-soft-lg': '0 7px 0 rgba(58, 43, 32, 0.22)',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'float-fast': 'float 2.5s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}