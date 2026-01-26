import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Clock, Play, User } from 'lucide-react';
import Button from '../components/UI/Button';
import { useGameStore } from '../store/useGameStore';

const PlayerSetup = () => {
  const navigate = useNavigate();
  const startGame = useGameStore((state) => state.startGame);

  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  const [enableTimer, setEnableTimer] = useState(false);

  const handleStart = (e) => {
    e.preventDefault();
    // استخدام الأسماء المدخلة أو أسماء افتراضية
    startGame(
      p1Name.trim() || 'الفريق الأحمر',
      p2Name.trim() || 'الفريق الأزرق',
      enableTimer
    );
    navigate('/game');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 flex flex-col md:flex-row"
      >
        {/* قسم اللاعب 1 (الأحمر) */}
        <div className="flex-1 p-8 bg-red-50/50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-l border-gray-100">
          <div className="w-20 h-20 rounded-full bg-team-red text-white flex items-center justify-center mb-6 shadow-lg shadow-red-200">
            <User size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">الفريق الأحمر</h2>
          <input
            type="text"
            value={p1Name}
            onChange={(e) => setP1Name(e.target.value)}
            placeholder="اسم اللاعب أو الفريق"
            className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-team-red focus:bg-white bg-white/50 text-center outline-none transition-all placeholder-red-200"
          />
        </div>

        {/* قسم الإعدادات الوسطي */}
        <div className="flex-1 p-8 flex flex-col justify-between relative z-20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 font-sans">تجهيز المعركة</h1>
            <p className="text-gray-500 text-sm">أدخل أسماء المتنافسين للبدء</p>
          </div>

          <form onSubmit={handleStart} className="space-y-8">
            {/* خيار المؤقت */}
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between
                ${enableTimer ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => setEnableTimer(!enableTimer)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${enableTimer ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <Clock size={20} />
                </div>
                <div className="text-right">
                  <span className="block font-bold text-gray-700">مؤقت التفكير</span>
                  <span className="text-xs text-gray-500">30 ثانية لكل إجابة</span>
                </div>
              </div>
              
              {/* مفتاح التبديل بصري */}
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${enableTimer ? 'bg-blue-500' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${enableTimer ? '-translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full py-4 text-xl shadow-blue-500/25">
              <Play size={24} fill="currentColor" />
              ابدأ التحدي
            </Button>
          </form>
        </div>

        {/* قسم اللاعب 2 (الأزرق) */}
        <div className="flex-1 p-8 bg-blue-50/50 flex flex-col items-center justify-center border-t md:border-t-0 md:border-r border-gray-100">
          <div className="w-20 h-20 rounded-full bg-team-blue text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
            <User size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">الفريق الأزرق</h2>
          <input
            type="text"
            value={p2Name}
            onChange={(e) => setP2Name(e.target.value)}
            placeholder="اسم اللاعب أو الفريق"
            className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-team-blue focus:bg-white bg-white/50 text-center outline-none transition-all placeholder-blue-200"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PlayerSetup;
