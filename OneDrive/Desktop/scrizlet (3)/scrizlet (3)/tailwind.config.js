/** @type {import('tailwindcss').Config} */
export default {
  // 1. content
  // ———————————————————————————————
  // Tells Tailwind which files to scan for class names.
  // In production builds it uses this to “tree‑shake” unused utilities,
  // keeping your final CSS bundle tiny.
  content: [
    "./index.html",                // your main HTML entry point
    "./src/**/*.{js,ts,jsx,tsx}",  // all JS/TS/JSX/TSX files under src/
  ],

  // 2. theme
  // ———————————————————————————————
  // The “theme” section lets you customize Tailwind’s default design tokens
  // (colors, spacing, fonts, etc.) or extend them.
  theme: {
    extend: {
      colors: {
        // • Primary colors
        'primary':        '#ff0000',  // e.g. bg-primary, text-primary
        'primary-dark':   '#cc0000',
        'primary-light':  '#ffe6e6',
        'primary-border': '#ffcccc',

        // • Accent colors
        'charcoal':    '#1e1e1e',
        'jet':         '#000000',
        'accent-blue': '#0077ff',
        'accent-gold': '#ffcc00',

        // • Custom shades of “red”
        //    Tailwind already includes default red-50…red-900,
        //    but this lets you override or add new shades (e.g. red-950).
        'red': {
          50:  '#ffe6e6',
          100: '#ffcccc',
          200: '#ff9999',
          300: '#ff6666',
          400: '#ff3333',
          500: '#ff0000',
          600: '#e60000',
          700: '#cc0000',
          800: '#b30000',
          900: '#990000',
          950: '#4d0000',
        },
      },
    },
  },

  // 3. plugins
  // ———————————————————————————————
  // If you want to pull in official Tailwind plugins (forms, typography, etc.)
  // or custom community/community‑built plugins, list them here.
  // it’s just an empty array.
  plugins: [],
}
