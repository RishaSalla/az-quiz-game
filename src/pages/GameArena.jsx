import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/useGameStore';
import PyramidGrid from '../components/GameBoard/PyramidGrid';
import logo from '../assets/logo.risha.png';

const GameArena = () => {
  const { 
    teamA, teamB, currentTeam, teamAPlayerIndex, teamBPlayerIndex, 
    gameMode, timerSetting, status, winnerData, cells, usedQuestions,
    occupyCell, nextTurn, resetGame, markQuestionAsUsed 
  } = useGameStore();

  const [selectedCell, setSelectedCell] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // مصفوفة الحروف مطابقة تماماً لمسميات ملفاتك في GitHub (الأرقام مع المسميات)
  const letterKeys = [
    "01alif", "02ba", "03ta", "04tha", "05jeem", "06haa", "07khaa", "08dal", 
    "09dhal", "10ra", "11zay", "12seen", "13sheen", "14sad", "15dad", "16ta_a", 
    "17zha", "18ain", "19ghain", "20fa", "21qaf", "22kaf", "23lam", "24meem", 
    "25noon", "26ha_a", "27waw", "28ya"
  ];

  const letterLabels = [
    "الألف", "الباء", "التاء", "الثاء", "الجيم", "الحاء", "الخاء", "الدال", "الذال", "الراء", "الزاي", 
    "السين", "الشين", "الصاد", "الضاد", "الطاء", "الظاء", "العين", "الغين", "الفاء", "القاف", 
    "الكاف", "اللام", "الميم", "النون", "الهاء", "الواو", "الياء"
  ];

  const currentPlayerName = currentTeam === 'teamA' 
    ? (gameMode === 'team' ? teamA.players[teamAPlayerIndex] : teamA.name)
    : (gameMode === 'team' ? teamB.players[teamBPlayerIndex] : teamB.name);

  // جلب سؤال عشوائي باستخدام الاستيراد الديناميكي لقراءة الملفات من داخل src
  const handleCellClick = useCallback(async (cell) => {
    if (cells[cell.id]) return;

    const randomIndex = Math.floor(Math.random() * letterKeys.length);
    const letterKey = letterKeys[randomIndex];
    const letterLabel = letterLabels[randomIndex];

    try {
      /* الحل السحري: استخدام import() بدلاً من fetch لضمان الوصول لمجلد 
         src/data/letters دون أخطاء في المسارات أو تكرار للأرقام.
      */
      const module = await import(`../data/letters/${letterKey}.json`);
      const data = module.default || module;

      const availableQuestions = data.questions.filter(q => !usedQuestions.includes(q.id));
      const finalQuestions = availableQuestions.length > 0 ? availableQuestions : data.questions;
      
      const randomQ = finalQuestions[Math.floor(Math.random() * finalQuestions.length)];
      setCurrentQuestion({ ...randomQ, label: letterLabel });
      setSelectedCell(cell);
      setShowAnswer(false);
      
      if (timerSetting !== 'off') {
        setTimeLeft(parseInt(timerSetting));
        setIsTimerActive(true);
      }
    } catch (err) {
      console.error("خطأ في جلب ملف السؤال من src/data/letters:", err);
    }
  }, [cells, timerSetting, usedQuestions]);

  // منطق المؤقت
  useEffect(() => {
    let interval;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      handleSkip();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const handleSkip = () => {
    setIsTimerActive(false);
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setSelectedCell(null);
      setCurrentQuestion(null);
      nextTurn();
    }, 500);
  };

  const handleCorrect = () => {
    setIsTimerActive(false);
    markQuestionAsUsed(currentQuestion.id);
    occupyCell(selectedCell.id);
    nextTurn();
    setSelectedCell(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-[#f5eedc] font-tajawal text-[#3d2b1f] relative overflow-hidden">
      
      <button onClick={() => setShowInstructions(true)} className="fixed left-0 top-1/2 -translate-y-1/2 bg-[#3d2b1f] text-white px-2 py-6 rounded-r-2xl font-black text-xs z-40" style={{ writingMode: 'vertical-rl' }}>
        قوانين التحدي
      </button>

      <div className="w-full max-w-5xl flex justify-between items-center mb-6 px-6 py-4 bg-white/40 rounded-3xl border-2 border-[#3d2b1f]/10 backdrop-blur-sm shadow-sm">
        <div className={`p-4 rounded-2xl transition-all duration-500 ${currentTeam === 'teamA' ? 'bg-[#d36a3e] text-white shadow-xl scale-105' : 'opacity-20'}`}>
          <div className="text-[10px] font-black uppercase tracking-widest mb-1">الطرف البرتقالي</div>
          <div className="text-xl font-black">{currentTeam === 'teamA' ? 'متحدث الآن: ' : ''}{teamA.name}</div>
        </div>

        <img src={logo} alt="Risha" className="h-14" />

        <div className={`p-4 rounded-2xl transition-all duration-500 ${currentTeam === 'teamB' ? 'bg-[#3d2b1f] text-white shadow-xl scale-105' : 'opacity-20'}`}>
          <div className="text-[10px] font-black uppercase tracking-widest mb-1 text-right">الطرف البني</div>
          <div className="text-xl font-black">{currentTeam === 'teamB' ? 'متحدث الآن: ' : ''}{teamB.name}</div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <PyramidGrid onCellClick={handleCellClick} />
      </div>

      <AnimatePresence>
        {selectedCell && currentQuestion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3d2b1f]/90 backdrop-blur-md">
            <motion.div 
              animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
              className="bg-[#f5eedc] border-4 border-[#3d2b1f] p-8 rounded-[40px] max-w-xl w-full shadow-2xl relative"
            >
              {timerSetting !== 'off' && (
                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-4 border-[#3d2b1f] flex items-center justify-center font-black text-xl ${timeLeft <= 5 ? 'bg-red-600 text-white animate-pulse' : 'bg-white'}`}>
                  {timeLeft}
                </div>
              )}

              <div className="text-center mb-8 pt-4">
                <p className="text-[#d36a3e] font-black text-xl mb-4">الإجابة تبدأ بحرف: {currentQuestion.label}</p>
                <h3 className="text-2xl font-black leading-relaxed">{currentQuestion.question}</h3>
              </div>

              {!showAnswer ? (
                <div className="space-y-4">
                  <button onClick={() => { setShowAnswer(true); setIsTimerActive(false); }} className="w-full bg-[#d36a3e] text-white py-5 rounded-2xl font-black text-xl border-b-8 border-[#3d2b1f] active:border-b-0 active:translate-y-2 transition-all">إظهار الإجابة</button>
                  <button onClick={handleSkip} className="w-full bg-[#3d2b1f]/10 py-4 rounded-2xl font-bold border-2 border-[#3d2b1f]/20">تخطي (حساب خطأ)</button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 bg-white/60 rounded-3xl border-2 border-dashed border-[#d36a3e] text-center">
                    <span className="text-xs font-bold block mb-1 opacity-50">الإجابة النموذجية</span>
                    <p className="text-2xl font-black">{currentQuestion.answer}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={handleCorrect} className="flex-1 bg-green-700 text-white py-5 rounded-2xl font-black text-xl border-b-8 border-green-900 active:border-b-0 active:translate-y-2 transition-all">إجابة صحيحة</button>
                    <button onClick={handleSkip} className="flex-1 bg-red-700 text-white py-5 rounded-2xl font-black text-xl border-b-8 border-red-900 active:border-b-0 active:translate-y-2 transition-all">إجابة خاطئة</button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status === 'winner' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#d36a3e] p-6 text-center">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-[#f5eedc] p-12 rounded-[50px] border-8 border-[#3d2b1f] shadow-2xl max-w-2xl w-full">
              <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto mb-6">
                <polygon points="50 5, 95 85, 5 85" fill="none" stroke="#3d2b1f" strokeWidth="5" />
                <path d="M30 60 L50 40 L70 60" fill="none" stroke="#d36a3e" strokeWidth="8" strokeLinecap="round" />
              </svg>
              <h1 className="text-5xl font-black text-[#3d2b1f] mb-4">مبروك!</h1>
              <div className="text-4xl font-black text-[#d36a3e] mb-2 leading-tight">
                {winnerData.name}
              </div>
              {gameMode === 'team' && (
                <div className="text-xl font-bold text-[#3d2b1f] mb-8 opacity-70">
                  {winnerData.players.join(' ، ')}
                </div>
              )}
              <button onClick={resetGame} className="bg-[#3d2b1f] text-white px-12 py-5 rounded-3xl font-black text-xl">تحدي جديد</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#3d2b1f]/90 backdrop-blur-sm">
            <div className="bg-[#f5eedc] border-4 border-[#3d2b1f] p-10 rounded-[40px] max-w-2xl w-full relative shadow-2xl">
              <button onClick={() => setShowInstructions(false)} className="absolute top-6 left-6 font-black text-red-600">إغلاق</button>
              <h2 className="text-2xl font-black mb-6">قوانين التحدي</h2>
              <ul className="space-y-4 font-bold text-lg text-right">
                <li>• الفوز يتطلب توصيل أضلاع الهرم الثلاثة (اليمين، اليسار، القاعدة).</li>
                <li>• الحروف تظهر بشكل عشوائي تماماً عند كل ضغطة لزيادة الإثارة.</li>
                <li>• زر التخطي أو انتهاء الوقت يغلق الخلية ويحول الدور للمنافس.</li>
              </ul>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameArena;
