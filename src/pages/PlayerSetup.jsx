import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';

const PlayerSetup = () => {
  const navigate = useNavigate();
  const startGame = useGameStore((state) => state.startGame);

  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  const [p1Members, setP1Members] = useState(''); // لأعضاء الفريق 1
  const [p2Members, setP2Members] = useState(''); // لأعضاء الفريق 2
  const [gameMode, setGameMode] = useState('individual'); // 'individual' or 'team'
  const [timerValue, setTimerValue] = useState(30); // 0, 20, 40, 60

  const handleStart = (e) => {
    e.preventDefault();
    
    const player1Data = {
      name: p1Name.trim() || (gameMode === 'team' ? 'الفريق البرتقالي' : 'المتحدي 1'),
      members: p1Members.split(',').map(m => m.trim()).filter(m => m !== '')
    };
    
    const player2Data = {
      name: p2Name.trim() || (gameMode === 'team' ? 'الفريق الأخضر' : 'المتحدي 2'),
      members: p2Members.split(',').map(m => m.trim()).filter(m => m !== '')
    };

    startGame(player1Data, player2Data, gameMode, timerValue);
    navigate('/game');
  };

  // رموز SVG يدوية
  const RishaLogoSVG = () => (
    <svg width="100" height="50" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="40" y="20" fill="#d36a3e" />
      <text x="50%" y="45" textAnchor="middle" fill="#3d2b1f" style={{ font: 'bold 24px Arial', letterSpacing: '2px' }}>RISHA</text>
    </svg>
  );

  const UserSVG = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl pixel-card flex flex-col md:flex-row overflow-hidden"
      >
        {/* قسم اللاعب/الفريق 1 (البرتقالي) */}
        <div className="flex-1 p-8 bg-[#d36a3e]/10 flex flex-col items-center border-b md:border-b-0 md:border-l-4 border-[#3d2b1f]">
          <div className="w-20 h-20 bg-[#d36a3e] border-4 border-[#3d2b1f] text-white flex items-center justify-center mb-6 shadow-[4px_4px_0px_#3d2b1f]">
            <UserSVG />
          </div>
          <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">الطرف الأول</h2>
          <input
            type="text"
            value={p1Name}
            onChange={(e) => setP1Name(e.target.value)}
            placeholder={gameMode === 'team' ? "اسم الفريق البرتقالي" : "اسم المتحدي"}
            className="w-full px-4 py-3 border-4 border-[#3d2b1f] bg-white outline-none focus:bg-[#f5eedc] text-center mb-4"
          />
          {gameMode === 'team' && (
            <textarea
              placeholder="أسماء الأعضاء (افصل بينهم بفاصلة)"
              value={p1Members}
              onChange={(e) => setP1Members(e.target.value)}
              className="w-full px-4 py-2 border-4 border-[#3d2b1f] bg-white outline-none h-24 text-sm"
            />
          )}
        </div>

        {/* القسم الأوسط للإعدادات */}
        <div className="flex-[1.2] p-8 flex flex-col items-center bg-white relative">
          <div className="mb-6"><RishaLogoSVG /></div>
          <h1 className="text-2xl font-bold text-[#3d2b1f] mb-8">إعداد التحدي</h1>

          <div className="w-full space-y-6">
            {/* اختيار نمط اللعب */}
            <div className="flex gap-2 p-1 border-4 border-[#3d2b1f] bg-[#f5eedc]">
              <button
                onClick={() => setGameMode('individual')}
                className={`flex-1 py-2 font-bold transition-all ${gameMode === 'individual' ? 'bg-[#d36a3e] text-white' : 'text-[#3d2b1f]'}`}
              >
                شخص ضد شخص
              </button>
              <button
                onClick={() => setGameMode('team')}
                className={`flex-1 py-2 font-bold transition-all ${gameMode === 'team' ? 'bg-[#d36a3e] text-white' : 'text-[#3d2b1f]'}`}
              >
                فريق ضد فريق
              </button>
            </div>

            {/* اختيار المؤقت */}
            <div className="space-y-2">
              <label className="block text-center font-bold text-[#3d2b1f] text-sm">مؤقت التفكير (بالثواني)</label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 20, 40, 60].map((val) => (
                  <button
                    key={val}
                    onClick={() => setTimerValue(val)}
                    className={`py-2 border-4 border-[#3d2b1f] font-bold ${timerValue === val ? 'bg-[#3d2b1f] text-white' : 'bg-white text-[#3d2b1f]'}`}
                  >
                    {val === 0 ? 'بدون' : val}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleStart} className="pixel-button-orange w-full py-4 text-xl font-bold">
              هيا نلعب
            </button>
            
            {/* قسم التعليمات المختصرة */}
            <div className="mt-8 p-4 border-2 border-dashed border-[#3d2b1f]/30 rounded-lg bg-[#f5eedc]/20">
              <h3 className="font-bold text-[#3d2b1f] mb-2 text-sm text-center">كيف تفوز؟</h3>
              <p className="text-xs text-[#3d2b1f]/70 leading-relaxed text-right">
                • اختر رقماً من الهرم للإجابة على سؤال الحرف المخبأ خلفه.<br/>
                • إذا أخطأت، سيتم تبديل الحرف بحرف آخر عشوائي لزيادة التحدي!<br/>
                • الفائز هو من يربط أضلاع الهرم الثلاثة (اليمين واليسار والقاعدة) بلونه أولاً.
              </p>
            </div>
          </div>
        </div>

        {/* قسم اللاعب/الفريق 2 (الأخضر) */}
        <div className="flex-1 p-8 bg-[#4a7c59]/10 flex flex-col items-center border-t md:border-t-0 md:border-r-4 border-[#3d2b1f]">
          <div className="w-20 h-20 bg-[#4a7c59] border-4 border-[#3d2b1f] text-white flex items-center justify-center mb-6 shadow-[4px_4px_0px_#3d2b1f]">
            <UserSVG />
          </div>
          <h2 className="text-xl font-bold text-[#3d2b1f] mb-4">الطرف الثاني</h2>
          <input
            type="text"
            value={p2Name}
            onChange={(e) => setP2Name(e.target.value)}
            placeholder={gameMode === 'team' ? "اسم الفريق الأخضر" : "اسم المتحدي"}
            className="w-full px-4 py-3 border-4 border-[#3d2b1f] bg-white outline-none focus:bg-[#f5eedc] text-center mb-4"
          />
          {gameMode === 'team' && (
            <textarea
              placeholder="أسماء الأعضاء (افصل بينهم بفاصلة)"
              value={p2Members}
              onChange={(e) => setP2Members(e.target.value)}
              className="w-full px-4 py-2 border-4 border-[#3d2b1f] bg-white outline-none h-24 text-sm"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PlayerSetup;
