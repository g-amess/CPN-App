import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Client-side only SPA. base './' so the built app works from any static path.
export default defineConfig({
  plugins: [react()],
  base: './',
})
