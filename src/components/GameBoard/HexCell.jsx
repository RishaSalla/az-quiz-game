import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const HexCell = ({ label, status, onClick, disabled, colorClass }) => {
  // ألوان ريشة المعتمدة
  const colors = {
    neutral: { fill: '#ffffff', stroke: '#3d2b1f', text: '#3d2b1f' },
    teamA: { fill: '#d36a3e', stroke: '#3d2b1f', text: '#ffffff' }, // برتقالي ريشة
    teamB: { fill: '#3d2b1f', stroke: '#d36a3e', text: '#f5eedc' }, // بني داكن
  };

  const currentTheme = status === 'teamA' ? colors.teamA : status === 'teamB' ? colors.teamB : colors.neutral;

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={clsx("relative w-20 h-24 cursor-pointer flex items-center justify-center", disabled && "cursor-default")}
      onClick={!disabled ? onClick : undefined}
    >
      <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full filter drop-shadow-sm">
        {/* رسم الخلية الهندسية بدقة متناهية */}
        <polygon
          points="50 0, 100 28.8, 100 86.2, 50 115, 0 86.2, 0 28.8"
          fill={currentTheme.fill}
          stroke={currentTheme.stroke}
          strokeWidth="6"
        />
      </svg>
      
      {/* الحرف داخل الخلية */}
      <span className="relative z-10 text-2xl font-black font-tajawal" style={{ color: currentTheme.text }}>
        {label}
      </span>
    </motion.div>
  );
};

export default HexCell;
