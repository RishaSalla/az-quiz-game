import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/az-quiz-game/', // 👈 هذا السطر هو الأهم لكي تعمل على GitHub Pages
  server: {
    host: true,
    port: 5173
  }
})
