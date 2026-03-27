import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          reactVendor: ['react', 'react-dom', 'react-router-dom'],
          supabaseVendor: ['@supabase/supabase-js'],
          searchVendor: ['fuse.js'],
        },
      },
    },
  },
})
