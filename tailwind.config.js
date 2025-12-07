/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#FDF2F0', 
          DEFAULT: '#E29578', 
          dark: '#D08266',    
        },
        slate: {
          50: '#F8FAFC',
          800: '#333333',     
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], 
      }
    },
  },
  plugins: [],
}