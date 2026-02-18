import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // المسار الأساسي للموقع على GitHub Pages
  base: '/az-quiz-game/', 
  build: {
    // لضمان تنظيم ملفات الـ Assets بشكل صحيح عند الرفع
    outDir: 'dist',
    assetsDir: 'assets',
    // لتقليل حجم الملفات الناتجة وتحسين الأداء
    minify: 'terser',
  },
  server: {
    host: true,
    port: 5173
  }
})
