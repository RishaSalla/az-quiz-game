import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw, Home } from 'lucide-react';
import Button from '../UI/Button';
import { useGameStore } from '../../store/useGameStore';
import { useNavigate } from 'react-router-dom';

const WinnerOverlay = () => {
  const { winner, resetGame } = useGameStore();
  const navigate = useNavigate();

  if (!winner) return null;

  const handleRestart = () => {
    resetGame();
    // إعادة التوجيه لصفحة الإعدادات لبدء جولة جديدة
    navigate('/setup'); 
  };

  const handleHome = () => {
    resetGame();
    navigate('/');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.5, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
        >
          {/* خلفية ملونة حسب الفائز */}
          <div className={`absolute top-0 left-0 w-full h-32 ${winner.color} opacity-20`} />
          
          {/* أيقونة الكأس */}
          <div className="relative mb-6 flex justify-center">
            <div className={`w-24 h-24 rounded-full ${winner.color} flex items-center justify-center shadow-lg border-4 border-white`}>
              <Trophy size={48} className="text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            مبروك! 🎉
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg">
            الفائز هو <span className={`font-bold ${winner.text}`}>{winner.name}</span>
            <br />
            لقد نجحت في ربط أضلاع الهرم!
          </p>

          <div className="flex flex-col gap-3">
            <Button onClick={handleRestart} variant="primary" className="w-full">
              <RefreshCw size={20} />
              لعبة جديدة
            </Button>
            
            <Button onClick={handleHome} variant="secondary" className="w-full">
              <Home size={20} />
              خروج للقائمة
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WinnerOverlay;
