import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // يتيح الوصول عبر الشبكة المحلية للاختبار
    port: 5173  // المنفذ الافتراضي
  }
})
