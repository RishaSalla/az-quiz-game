import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // المسار الأساسي لموقعك على GitHub Pages
  base: '/az-quiz-game/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // حذفنا 'terser' لتجنب أخطاء البناء
  },
  server: {
    host: true,
    port: 5173
  }
})
