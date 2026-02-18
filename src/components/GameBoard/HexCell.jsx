import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const HexCell = ({ label, status, onClick, disabled }) => {
  // ألوان هوية ريشة المعتمدة هندسياً
  const themes = {
    neutral: { fill: '#ffffff', stroke: '#3d2b1f', text: '#3d2b1f' },
    teamA: { fill: '#d36a3e', stroke: '#3d2b1f', text: '#ffffff' }, // برتقالي ريشة
    teamB: { fill: '#3d2b1f', stroke: '#d36a3e', text: '#f5eedc' }, // بني داكن
  };

  const currentTheme = status === 'teamA' ? themes.teamA : status === 'teamB' ? themes.teamB : themes.neutral;

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={clsx(
        "relative w-20 h-24 flex items-center justify-center transition-opacity",
        disabled ? "cursor-default opacity-90" : "cursor-pointer"
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {/* الرسم الهندسي للخلية السداسية - SVG لضمان عدم تآكل الحواف */}
      <svg 
        viewBox="0 0 100 115" 
        className="absolute inset-0 w-full h-full drop-shadow-md"
        style={{ overflow: 'visible' }}
      >
        <polygon
          points="50 0, 100 28.8, 100 86.2, 50 115, 0 86.2, 0 28.8"
          fill={currentTheme.fill}
          stroke={currentTheme.stroke}
          strokeWidth="6"
          strokeLinejoin="round"
        />
      </svg>
      
      {/* الحرف بداخل الخلية بخط "تجوال" العريض */}
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
