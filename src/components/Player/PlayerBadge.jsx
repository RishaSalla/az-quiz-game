import React from 'react';
import { motion } from 'framer-motion';

const PlayerBadge = ({ player, isActive }) => {
  if (!player) return null;

  // رمز SVG يدوياً للمستخدم (بدلاً من الأيقونات الجاهزة)
  const UserSVG = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  return (
    <motion.div
      animate={isActive ? { scale: 1.05, y: -5 } : { scale: 1, y: 0 }}
      className={`
        relative p-4 md:p-6 min-w-[140px] md:min-w-[200px]
        border-4 border-b-8 border-[#3d2b1f] bg-white
        transition-all duration-300 flex flex-col items-center
        ${isActive ? 'shadow-[8px_8px_0px_#3d2b1f]' : 'shadow-none opacity-60'}
      `}
    >
      {/* مؤشر الدور النشط */}
      {isActive && (
        <div className="absolute -top-3 -right-3 bg-[#d36a3e] border-2 border-[#3d2b1f] px-2 py-1 text-[10px] font-black text-white uppercase tracking-tighter">
          دورك الآن
        </div>
      )}

      {/* أيقونة اللاعب */}
      <div className={`w-12 h-12 md:w-16 md:h-16 border-4 border-[#3d2b1f] flex items-center justify-center mb-3 text-white ${player.color}`}>
        <UserSVG />
      </div>

      {/* اسم اللاعب أو الفريق */}
      <h3 className="text-sm md:text-lg font-black text-[#3d2b1f] text-center leading-tight">
        {player.name}
      </h3>

      {/* عرض أسماء أعضاء الفريق (في حال وجودهم) */}
      {player.members && player.members.length > 0 && (
        <div className="mt-3 w-full border-t-2 border-[#3d2b1f]/10 pt-2">
          <div className="flex flex-wrap justify-center gap-1">
            {player.members.map((member, index) => (
              <span 
                key={index} 
                className="text-[10px] md:text-xs font-bold text-[#3d2b1f]/60 bg-[#f5eedc] px-2 py-0.5 border border-[#3d2b1f]/20"
              >
                {member}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PlayerBadge;
