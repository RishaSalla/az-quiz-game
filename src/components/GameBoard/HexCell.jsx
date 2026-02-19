import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const HexCell = ({ label, status, onClick, disabled }) => {
  // الألوان المعتمدة لهوية التحدي لضمان أعلى درجات التباين
  const themes = {
    neutral: { fill: '#ffffff', stroke: '#3d2b1f', text: '#3d2b1f' }, // وضع الرقم (انتظار)
    teamA: { fill: '#d36a3e', stroke: '#3d2b1f', text: '#ffffff' }, // الفريق البرتقالي
    teamB: { fill: '#3d2b1f', stroke: '#d36a3e', text: '#f5eedc' }, // الفريق البني
  };

  const currentTheme = status === 'teamA' ? themes.teamA : status === 'teamB' ? themes.teamB : themes.neutral;

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05, zIndex: 50 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={clsx(
        "relative w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center transition-all duration-300",
        disabled ? "cursor-default" : "cursor-pointer"
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {/* رسم هندسي SVG دقيق لضمان حدة الزوايا ومنع التآكل البصري */}
      <svg 
        viewBox="0 0 100 115" 
        className="absolute inset-0 w-full h-full drop-shadow-sm"
        style={{ overflow: 'visible' }}
      >
        <polygon
          points="50 0, 100 28.8, 100 86.2, 50 115, 0 86.2, 0 28.8"
          fill={currentTheme.fill}
          stroke={currentTheme.stroke}
          strokeWidth="10" // سمك إطار عالٍ لضمان تداخل الأضلاع وإغلاق الفراغات تماماً
          strokeLinejoin="round"
        />
      </svg>
      
      {/* عرض الرقم (1-28) بخط تجوال العريض */}
      <span 
        className="relative z-10 text-xl sm:text-2xl font-black font-tajawal select-none" 
        style={{ color: currentTheme.text }}
      >
        {label}
      </span>
    </motion.div>
  );
};

export default HexCell;
