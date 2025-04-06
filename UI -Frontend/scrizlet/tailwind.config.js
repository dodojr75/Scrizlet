/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        'primary': '#ff0028',
        'primary-dark': '#99001a',
        'primary-light': '#ffe6eb',
        'primary-border': '#ffccd5',
        
        // Accent colors
        'charcoal': '#1e1e1e',
        'jet': '#000000',
        'accent-blue': '#0077ff',
        'accent-gold': '#ffcc00',
        
        // Custom red classes
        'red': {
          50: '#ffe6eb',
          100: '#ffccd5',
          200: '#ff99a8',
          300: '#ff667c',
          400: '#ff3350',
          500: '#ff0028',
          600: '#e60024',
          700: '#cc0020',
          800: '#99001a',
          900: '#800015',
          950: '#4c000d',
        },
      },
    },
  },
  plugins: [],
}
