import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const HexCell = ({ cell, onClick, disabled, isWinningPath }) => {
  const { letter, owner, isOccupied } = cell;

  // تحديد ألوان الخلية بناءً على المالك
  const getCellColor = () => {
    if (owner === 1) return 'bg-team-red text-white shadow-red-500/50';
    if (owner === 2) return 'bg-team-blue text-white shadow-blue-500/50';
    return 'bg-white text-gray-800 hover:bg-gray-50 shadow-gray-200/50';
  };

  return (
    <div 
      className="relative w-16 h-14 md:w-20 md:h-[4.5rem] flex items-center justify-center -mb-2 md:-mb-3 mx-[2px]"
      style={{ 
        // تداخل الخلايا قليلاً لإنشاء شكل خلية النحل المتراصة
        filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' 
      }}
    >
      <motion.button
        whileHover={!isOccupied && !disabled ? { scale: 1.1, zIndex: 10 } : {}}
        whileTap={!isOccupied && !disabled ? { scale: 0.95 } : {}}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20, 
          delay: cell.id * 0.02 // ظهور متتابع جميل
        }}
        onClick={onClick}
        disabled={isOccupied || disabled}
        className={clsx(
          "w-full h-full flex items-center justify-center transition-colors duration-300",
          "clip-hexagon", // سنضيف هذا الكلاس في ملف CSS لاحقاً
          getCellColor(),
          isWinningPath && "ring-4 ring-yellow-400 z-20 scale-110", // تمييز مسار الفوز
          disabled && !isOccupied && "opacity-50 cursor-not-allowed"
        )}
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
        }}
      >
        {/* الحرف */}
        <span className="text-2xl md:text-3xl font-bold font-sans select-none">
          {letter}
        </span>

        {/* لمعة زجاجية خفيفة */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      </motion.button>
    </div>
  );
};

export default HexCell;
