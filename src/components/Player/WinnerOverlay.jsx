import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';

const WinnerOverlay = () => {
  const { winner, gameStatus, resetGame, exitToMain } = useGameStore();

  if (gameStatus !== 'finished' || !winner) return null;

  // رمز SVG لشعار ريشة
  const RishaLogoSVG = () => (
    <svg width="100" height="50" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="40" y="20" fill="#d36a3e" />
      <text x="50%" y="45" textAnchor="middle" fill="#3d2b1f" style={{ font: 'bold 24px Arial', letterSpacing: '2px' }}>RISHA</text>
    </svg>
  );

  // رمز SVG لكأس الفوز مصمم يدوياً
  const TrophySVG = () => (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d36a3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3d2b1f]/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-lg bg-[#f5eedc] pixel-card p-10 text-center relative overflow-hidden"
        >
          {/* تأثيرات خلفية بسيطة */}
          <div className="absolute top-0 left-0 w-full h-2 bg-[#d36a3e]" />
          
          <div className="flex justify-center mb-4">
            <RishaLogoSVG />
          </div>

          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <TrophySVG />
            </motion.div>
          </div>

          <h2 className="text-2xl font-bold text-[#3d2b1f] mb-2">تهانينا للفائز!</h2>
          <div className={`text-4xl font-black mb-8 p-4 border-4 border-[#3d2b1f] bg-white shadow-[6px_6px_0px_#3d2b1f] ${winner.text}`}>
            {winner.name}
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={resetGame}
              className="pixel-button-orange py-4 text-xl font-bold"
            >
              جولة جديدة بنفس الأسماء
            </button>
            
            <button
              onClick={exitToMain}
              className="pixel-button-white py-3 text-[#3d2b1f] font-bold"
            >
              العودة لإعدادات التحدي
            </button>
          </div>

          {/* أسماء أعضاء الفريق إذا وجدوا */}
          {winner.members && winner.members.length > 0 && (
            <div className="mt-8 pt-6 border-t-2 border-dashed border-[#3d2b1f]/20">
              <p className="text-xs text-[#3d2b1f]/50 mb-2 uppercase tracking-widest font-bold">أعضاء الفريق الفائز</p>
              <div className="flex flex-wrap justify-center gap-2">
                {winner.members.map((member, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white border-2 border-[#3d2b1f] text-xs font-bold text-[#3d2b1f]">
                    {member}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WinnerOverlay;
