import React from 'react';
import { motion } from 'framer-motion';

const HexCell = ({ cell, onClick }) => {
  const { isOccupied, owner, displayId } = cell;

  // تحديد اللون بناءً على المالك (نظام ريشة)
  const getCellColor = () => {
    if (!isOccupied) return 'bg-white'; // خلية فارغة
    return owner === 1 ? 'bg-[#d36a3e]' : 'bg-[#4a7c59]'; // برتقالي للفريق 1، أخضر للفريق 2
  };

  const getTextColor = () => {
    if (!isOccupied) return 'text-[#3d2b1f]';
    return 'text-white';
  };

  return (
    <motion.div
      whileHover={!isOccupied ? { scale: 1.1, zIndex: 10 } : {}}
      whileTap={!isOccupied ? { scale: 0.9 } : {}}
      onClick={onClick}
      className={`
        relative w-12 h-14 md:w-16 md:h-20 
        m-1 cursor-pointer transition-colors duration-300
        clip-hexagon flex items-center justify-center
        border-4 border-[#3d2b1f]
        ${getCellColor()}
        ${!isOccupied ? 'shadow-[0_4px_0_#3d2b1f] hover:shadow-none' : ''}
      `}
      style={{
        // إضافة حدود يدوية لأن clip-path قد يخفي الحدود العادية
        boxShadow: isOccupied ? 'none' : 'inset 0 0 0 4px #3d2b1f',
      }}
    >
      {/* عرض الرقم 1-28 بدلاً من الحرف */}
      <span className={`text-lg md:text-2xl font-black ${getTextColor()} z-10`}>
        {displayId}
      </span>

      {/* تأثير لمعان بسيط للخلايا المملوكة */}
      {isOccupied && (
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10" />
      )}
    </motion.div>
  );
};

export default HexCell;
