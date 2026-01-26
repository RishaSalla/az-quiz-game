/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ألوان الفرق (مستوحاة من العلم التشيكي)
        'team-red': '#E4002B', // أحمر غامق وقوي
        'team-blue': '#11457E', // أزرق ملكي
        
        // ألوان الخلفية والواجهة
        'glass-white': 'rgba(255, 255, 255, 0.85)',
        'glass-border': 'rgba(255, 255, 255, 0.4)',
        'app-bg': '#f3f4f6', // رمادي فاتح عصري للخلفية
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'cell': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'], // خط عربي مقترح (سنضيف رابطه لاحقاً)
      }
    },
  },
  plugins: [],
}
