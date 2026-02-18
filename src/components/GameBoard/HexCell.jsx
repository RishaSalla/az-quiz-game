import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const HexCell = ({ label, status, onClick, disabled }) => {
  // ألوان هوية ريشة المعتمدة هندسياً لضمان التباين العالي
  const themes = {
    neutral: { fill: '#ffffff', stroke: '#3d2b1f', text: '#3d2b1f' }, // وضع الانتظار
    teamA: { fill: '#d36a3e', stroke: '#3d2b1f', text: '#ffffff' }, // الفريق البرتقالي
    teamB: { fill: '#3d2b1f', stroke: '#d36a3e', text: '#f5eedc' }, // الفريق البني
  };

  const currentTheme = status === 'teamA' ? themes.teamA : status === 'teamB' ? themes.teamB : themes.neutral;

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05, zIndex: 10 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={clsx(
        "relative w-20 h-24 flex items-center justify-center transition-all duration-300",
        disabled ? "cursor-default opacity-90" : "cursor-pointer"
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {/* الرسم الهندسي باستخدام SVG لضمان حدة الزوايا ومنع التآكل البصري */}
      <svg 
        viewBox="0 0 100 115" 
        className="absolute inset-0 w-full h-full drop-shadow-md"
        style={{ overflow: 'visible' }}
      >
        <polygon
          points="50 0, 100 28.8, 100 86.2, 50 115, 0 86.2, 0 28.8"
          fill={currentTheme.fill}
          stroke={currentTheme.stroke}
          strokeWidth="8" // زيادة السمك لضمان تلاحم الأضلاع عند التداخل
          strokeLinejoin="round"
        />
      </svg>
      
      {/* عرض الحرف بخط "تجوال" العريض والواضح */}
      <span 
        className="relative z-10 text-2xl font-black font-tajawal select-none" 
        style={{ color: currentTheme.text }}
      >
        {label}
      </span>
    </motion.div>
  );
};

export default HexCell;
