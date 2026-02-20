import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import PyramidGrid from '../components/GameBoard/PyramidGrid';
import logo from '../assets/logo.risha.png';

const GameArena = () => {
  const navigate = useNavigate();
  const { 
    teamA, teamB, currentTeam, 
    gameMode, timerSetting, status, winnerData, cells, usedQuestions,
    cellLetters, refreshCellLetter, 
    occupateCell, nextTurn, resetGame, markQuestionAsUsed,
    setGameSetup 
  } = useGameStore();

  const [selectedCell, setSelectedCell] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

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

  const pyramidRows = [ [1], [2,3], [4,5,6], [7,8,9,10], [11,12,13,14,15], [16,17,18,19,20,21], [22,23,24,25,26,27,28] ];

  const handleCellClick = useCallback(async (cell) => {
    if (cells[cell.id]) return;

    const letterKey = cellLetters[cell.id];
    const letterIndex = letterKeys.indexOf(letterKey);
    const letterLabel = letterLabels[letterIndex];

    try {
      const module = await import(`../data/letters/${letterKey}.json`);
      const questionsArray = module.default || module;

      const availableQuestions = questionsArray.filter(q => !usedQuestions.includes(q.question));
      const finalQuestions = availableQuestions.length > 0 ? availableQuestions : questionsArray;
      
      const randomQ = finalQuestions[Math.floor(Math.random() * finalQuestions.length)];
      setCurrentQuestion({ ...randomQ, label: letterLabel });
      setSelectedCell(cell);
      setShowAnswer(false);
      
      if (timerSetting !== 'off') {
        setTimeLeft(parseInt(timerSetting));
        setIsTimerActive(true);
      }
    } catch (err) {
      console.error("خطأ في جلب ملف السؤال:", err);
    }
  }, [cells, timerSetting, usedQuestions, cellLetters]);

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
    refreshCellLetter(selectedCell.id);
    setTimeout(() => {
      setIsShaking(false);
      setSelectedCell(null);
      setCurrentQuestion(null);
      nextTurn();
    }, 500);
  };

  const handleCorrect = () => {
    setIsTimerActive(false);
    markQuestionAsUsed(currentQuestion.question);
    occupateCell(selectedCell.id);
    nextTurn();
    setSelectedCell(null);
  };

  const handleRematch = () => {
    setGameSetup({ teamA, teamB, gameMode, timerSetting });
  };

  const handleMainMenu = () => {
    resetGame();
    navigate('/');
  };

  return (
    // استخدام الحاوية الذكية لضمان التجاوب في ساحة اللعب
    <div className="smart-scaling-container font-tajawal text-[#3d2b1f] relative">
      
      {/* توحيد مكان زر القوانين في اليمين */}
      <button 
        onClick={() => setShowInstructions(true)} 
        className="rules-side-button"
      >
        قوانين التحدي
      </button>

      {/* الهيدر المجاوب: يتقلص في الشاشات الصغيرة ليحمي الهرم */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-4 bg-white/40 rounded-3xl border-2 border-[#3d2b1f]/10 backdrop-blur-sm shadow-sm">
        <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-500 ${currentTeam === 'teamA' ? 'bg-[#d36a3e] text-white shadow-xl scale-105' : 'opacity-20'}`}>
          <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">الطرف البرتقالي</div>
          <div className="text-sm md:text-xl font-black">{currentTeam === 'teamA' ? 'دور: ' : ''}{teamA.name}</div>
        </div>

        <img src={logo} alt="Risha" className="h-10 md:h-14" />

        <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-500 ${currentTeam === 'teamB' ? 'bg-[#3d2b1f] text-white shadow-xl scale-105' : 'opacity-20'}`}>
          <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1 text-right">الطرف البني</div>
          <div className="text-sm md:text-xl font-black">{currentTeam === 'teamB' ? 'دور: ' : ''}{teamB.name}</div>
        </div>
      </div>

      {/* منطقة الهرم: تملأ المساحة المتبقية بذكاء */}
      <div className="flex-1 flex items-center justify-center w-full max-w-6xl mx-auto pyramid-scale">
        <PyramidGrid onCellClick={handleCellClick} />
      </div>

      <AnimatePresence>
        {selectedCell && currentQuestion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3d2b1f]/90 backdrop-blur-md">
            <motion.div animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}} className="bg-[#f5eedc] border-4 border-[#3d2b1f] p-6 md:p-8 rounded-[35px] md:rounded-[40px] max-w-xl w-full shadow-2xl relative">
              {timerSetting !== 'off' && (
                <div className={`absolute -top-5 md:-top-6 left-1/2 -translate-x-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-[#3d2b1f] flex items-center justify-center font-black text-xl ${timeLeft <= 5 ? 'bg-red-600 text-white animate-pulse' : 'bg-white'}`}>
                  {timeLeft}
                </div>
              )}
              <div className="text-center mb-6 md:mb-8 pt-4">
                <p className="text-[#d36a3e] font-black text-lg md:text-xl mb-4">الإجابة تبدأ بحرف: {currentQuestion.label}</p>
                <h3 className="text-xl md:text-2xl font-black leading-relaxed">{currentQuestion.question}</h3>
              </div>
              {!showAnswer ? (
                <div className="space-y-4">
                  <button onClick={() => { setShowAnswer(true); setIsTimerActive(false); }} className="w-full bg-[#d36a3e] text-white py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl border-b-8 border-[#3d2b1f] active:border-b-0 active:translate-y-2 transition-all">إظهار الإجابة</button>
                  <button onClick={handleSkip} className="w-full bg-[#3d2b1f]/10 py-3 rounded-2xl font-bold border-2 border-[#3d2b1f]/20">تخطي </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 md:p-6 bg-white/60 rounded-3xl border-2 border-dashed border-[#d36a3e] text-center">
                    <span className="text-[10px] font-bold block mb-1 opacity-50">الإجابة النموذجية</span>
                    <p className="text-xl md:text-2xl font-black">{currentQuestion.answer}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={handleCorrect} className="flex-1 bg-green-700 text-white py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl border-b-8 border-green-900 active:border-b-0 active:translate-y-2 transition-all">صح</button>
                    <button onClick={handleSkip} className="flex-1 bg-red-700 text-white py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl border-b-8 border-red-900 active:border-b-0 active:translate-y-2 transition-all">خطأ</button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status === 'winner' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#d36a3e] p-4 md:p-6 text-center">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-[#f5eedc] p-6 md:p-10 rounded-[40px] md:rounded-[50px] border-8 border-[#3d2b1f] shadow-2xl max-w-2xl w-full">
              <div className="flex flex-col items-center gap-1 mb-6 md:mb-8">
                {pyramidRows.map((row, rIdx) => (
                  <div key={rIdx} className="flex gap-1">
                    {row.map(cellId => (
                      <div 
                        key={cellId} 
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-sm rotate-45 border border-[#3d2b1f]/20 ${cells[cellId] === (winnerData.name === teamA.name ? 'teamA' : 'teamB') ? (cells[cellId] === 'teamA' ? 'bg-[#d36a3e]' : 'bg-[#3d2b1f]') : 'bg-white/30'}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-[#3d2b1f] mb-2 uppercase tracking-tighter">مبروك!</h1>
              <div className="text-3xl md:text-4xl font-black text-[#d36a3e] mb-2 leading-tight">{winnerData.name}</div>
              <div className="flex flex-col gap-3 mt-6 md:mt-8">
                <button onClick={handleRematch} className="bg-[#3d2b1f] text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl border-b-8 border-black active:border-0 active:translate-y-1 transition-all">تحدي جديد (نفس الأسماء)</button>
                <button onClick={handleMainMenu} className="text-[#3d2b1f] font-black text-xs opacity-60 hover:opacity-100 transition-opacity">العودة للقائمة الرئيسية</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#3d2b1f]/90 backdrop-blur-sm">
            <div className="bg-[#f5eedc] border-4 border-[#3d2b1f] p-6 md:p-10 rounded-[35px] md:rounded-[40px] max-w-2xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh]">
              <button onClick={() => setShowInstructions(false)} className="absolute top-4 left-4 md:top-6 md:left-6 font-black text-red-600 bg-white/80 p-2 rounded-full">إغلاق</button>
              <h2 className="text-2xl md:text-3xl font-black mb-6">قوانين التحدي</h2>
              <ul className="space-y-4 font-bold text-base md:text-lg text-right mb-10">
                <li>• الفوز يتطلب توصيل أضلاع الهرم الثلاثة ببعضها.</li>
                <li>• الحروف تظهر بشكل عشوائي تماماً عند كل اختيار.</li>
                <li>• زر التخطي أو انتهاء الوقت يحول الدور للمنافس مباشرة.</li>
              </ul>
              <div className="border-t-2 border-[#3d2b1f]/10 pt-6 text-center">
                <p className="text-[10px] font-bold opacity-60 uppercase">مستوحاة من البرنامج الشهير (AZ-kvíz)</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameArena;
