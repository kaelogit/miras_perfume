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
          light: '#FDF2F0', // Very light pink for backgrounds
          DEFAULT: '#E29578', // Dusty Rose (Our Main Color)
          dark: '#D08266',    // Darker Rose for hover
        },
        slate: {
          50: '#F8FAFC',
          800: '#333333',     // Our "Dark Gray" text
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], // Good for "Luxury" headings
      }
    },
  },
  plugins: [],
}