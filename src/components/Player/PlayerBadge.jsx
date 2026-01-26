import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { User, Trophy } from 'lucide-react'; // أيقونات

const PlayerBadge = ({ player, isActive, isWinner }) => {
  return (
    <motion.div
      animate={{
        scale: isActive || isWinner ? 1.1 : 0.9,
        opacity: isActive || isWinner ? 1 : 0.6,
        y: isActive ? -10 : 0
      }}
      className={clsx(
        "relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 min-w-[140px]",
        // الخلفية والحدود تتغير حسب حالة النشاط
        isActive 
          ? "bg-white shadow-xl border-2" 
          : "bg-white/50 border border-transparent",
        player.id === 1 ? "border-team-red" : "border-team-blue"
      )}
    >
      {/* مؤشر الفوز (تاج) */}
      {isWinner && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-6 text-yellow-500 bg-white rounded-full p-2 shadow-lg"
        >
          <Trophy size={24} fill="currentColor" />
        </motion.div>
      )}

      {/* أيقونة اللاعب */}
      <div 
        className={clsx(
          "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-2 shadow-md",
          player.color
        )}
      >
        <User size={24} />
      </div>

      {/* اسم اللاعب */}
      <h3 className={clsx(
        "font-bold text-lg text-center",
        isActive ? "text-gray-800" : "text-gray-500"
      )}>
        {player.name}
      </h3>

      {/* نص الحالة */}
      <span className={clsx(
        "text-xs font-medium px-2 py-1 rounded-full mt-1",
        isActive ? "bg-gray-100 text-gray-600" : "text-transparent"
      )}>
        {isActive ? 'دورك الآن' : '.'}
      </span>

      {/* مؤشر ضوئي سفلي عند النشاط */}
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className={clsx(
            "absolute -bottom-2 w-1/2 h-1 rounded-full",
            player.id === 1 ? "bg-team-red" : "bg-team-blue"
          )}
        />
      )}
    </motion.div>
  );
};

export default PlayerBadge;
