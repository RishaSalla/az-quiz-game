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
    occupyCell, nextTurn, resetGame, markQuestionAsUsed,
    setGameSetup,
    teamAPlayerIndex, teamBPlayerIndex // جلب عدادات اللاعبين من المخزن
  } = useGameStore();

  const [selectedCell, setSelectedCell] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
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
    occupyCell(selectedCell.id);
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

  // دوال مساعدة لاستخراج أسماء اللاعبين وتحديد من عليه الدور ومن يستعد
  const getActivePlayerName = (teamObj, index) => {
    if (gameMode === 'single') return teamObj.name;
    if (teamObj.players && teamObj.players.length > 0) {
      return teamObj.players[index % teamObj.players.length];
    }
    return teamObj.name;
  };

  const getNextPlayerName = (teamObj, index) => {
    if (gameMode === 'single') return null; // لا يوجد "يستعد" في الفردي
    if (teamObj.players && teamObj.players.length > 1) {
      return teamObj.players[(index + 1) % teamObj.players.length];
    }
    return null;
  };

  return (
    <div className="smart-scaling-container font-tajawal text-[#3d2b1f] relative">
      
      {/* زر الخروج الجديد */}
      <button 
        onClick={() => setShowExitConfirm(true)}
        className="absolute top-4 left-4 md:top-6 md:left-6 z-40 bg-white/60 hover:bg-red-100 text-red-600 font-bold px-4 py-2 rounded-xl border-2 border-red-200 transition-all text-sm shadow-sm"
      >
        خروج ✖
      </button>

      {/* زر القوانين */}
      <button 
        onClick={() => setShowInstructions(true)} 
        className="rules-side-button"
      >
        قوانين التحدي
      </button>

      {/* الهيدر المطور الذي يظهر أسماء اللاعبين بالتناوب */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4 mb-8 px-6 py-4 bg-white/40 rounded-3xl border-2 border-[#3d2b1f]/10 backdrop-blur-sm shadow-sm mt-4 md:mt-0">
        
        {/* بطاقة الطرف البرتقالي */}
        <div className={`p-4 rounded-2xl w-full md:w-48 text-center transition-all duration-500 ${currentTeam === 'teamA' ? 'bg-[#d36a3e] text-white shadow-xl scale-105' : 'opacity-40'}`}>
          <div className="text-[10px] font-black uppercase tracking-widest mb-1">الطرف البرتقالي</div>
          <div className="text-xl font-black mb-1">
            {currentTeam === 'teamA' ? 'دور: ' : ''}
            {getActivePlayerName(teamA, teamAPlayerIndex)}
          </div>
          {/* مؤشر "يستعد" يظهر فقط عندما لا يكون دور الفريق وفي وضع الفرق */}
          {currentTeam !== 'teamA' && getNextPlayerName(teamA, teamAPlayerIndex) && (
            <div className="text-xs font-bold opacity-60">
              استعد: {getActivePlayerName(teamA, teamAPlayerIndex)}
            </div>
          )}
        </div>

        <img src={logo} alt="Risha" className="h-10 md:h-14" />

        {/* بطاقة الطرف البني */}
        <div className={`p-4 rounded-2xl w-full md:w-48 text-center transition-all duration-500 ${currentTeam === 'teamB' ? 'bg-[#3d2b1f] text-white shadow-xl scale-105' : 'opacity-40'}`}>
          <div className="text-[10px] font-black uppercase tracking-widest mb-1 text-center">الطرف البني</div>
          <div className="text-xl font-black mb-1">
            {currentTeam === 'teamB' ? 'دور: ' : ''}
            {getActivePlayerName(teamB, teamBPlayerIndex)}
          </div>
          {/* مؤشر "يستعد" */}
          {currentTeam !== 'teamB' && getNextPlayerName(teamB, teamBPlayerIndex) && (
            <div className="text-xs font-bold opacity-60">
              يستعد: {getActivePlayerName(teamB, teamBPlayerIndex)}
            </div>
          )}
        </div>
      </div>

      {/* منطقة الهرم */}
      <div className="flex-1 flex items-center justify-center w-full max-w-4xl mx-auto py-10 pyramid-scale">
        <PyramidGrid onCellClick={handleCellClick} />
      </div>

      {/* نافذة السؤال */}
      <AnimatePresence>
        {selectedCell && currentQuestion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#3d2b1f]/90 backdrop-blur-md">
            <motion.div animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}} className="bg-[#f5eedc] border-4 border-[#3d2b1f] p-8 rounded-[40px] max-w-xl w-full shadow-2xl relative">
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
                  <button onClick={handleSkip} className="w-full bg-[#3d2b1f]/10 py-4 rounded-2xl font-bold border-2 border-[#3d2b1f]/20">تخطي </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 bg-white/60 rounded-3xl border-2 border-dashed border-[#d36a3e] text-center">
                    <span className="text-xs font-bold block mb-1 opacity-50">الإجابة النموذجية</span>
                    <p className="text-2xl font-black">{currentQuestion.answer}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={handleCorrect} className="flex-1 bg-green-700 text-white py-5 rounded-2xl font-black text-xl border-b-8 border-green-900 active:border-b-0 active:translate-y-2 transition-all">صح</button>
                    <button onClick={handleSkip} className="flex-1 bg-red-700 text-white py-5 rounded-2xl font-black text-xl border-b-8 border-red-900 active:border-b-0 active:translate-y-2 transition-all">خطأ</button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة الفوز المطورة بلوحة الشرف */}
      <AnimatePresence>
        {status === 'winner' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#d36a3e] p-6 text-center">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-[#f5eedc] p-10 rounded-[50px] border-8 border-[#3d2b1f] shadow-2xl max-w-2xl w-full">
              
              {/* الهرم المصغر لمسار الفوز */}
              <div className="flex flex-col items-center gap-1 md:gap-1.5 mb-6 md:mb-8 opacity-90">
                {pyramidRows.map((row, rIdx) => (
                  <div key={rIdx} className="flex gap-1 md:gap-1.5">
                    {row.map(cellId => {
                      const isTeamA = cells[cellId] === 'teamA';
                      const isTeamB = cells[cellId] === 'teamB';
                      const bgColor = isTeamA ? 'bg-[#d36a3e]' : (isTeamB ? 'bg-[#3d2b1f]' : 'bg-white/40');
                      return (
                        <div
                          key={cellId}
                          className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-sm rotate-45 border border-[#3d2b1f]/10 shadow-sm ${bgColor}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              <h1 className="text-5xl font-black text-[#3d2b1f] mb-4 uppercase tracking-tighter">مبروك!</h1>
              
              {/* عرض اسم الطرف كفائز رئيسي */}
              <div className="text-4xl font-black text-[#d36a3e] mb-4 leading-tight">
                {winnerData.name}
              </div>

              {/* لوحة الشرف: عرض أسماء الأعضاء إذا كان اللعب بنظام الفرق */}
              {gameMode === 'team' && winnerData.players && winnerData.players.length > 0 && (
                <div className="bg-white/50 p-4 rounded-2xl border-2 border-[#3d2b1f]/10 mb-8 inline-block min-w-[200px]">
                  <span className="text-xs font-bold opacity-60 uppercase block mb-2">أبطال التحدي</span>
                  <div className="text-lg font-black text-[#3d2b1f]">
                    {winnerData.players.join(' - ')}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-4">
                <button onClick={handleRematch} className="bg-[#3d2b1f] text-white px-12 py-5 rounded-3xl font-black text-xl border-b-8 border-black active:border-0 active:translate-y-1 transition-all">تحدي جديد (نفس الأسماء)</button>
                <button onClick={handleMainMenu} className="text-[#3d2b1f] font-black text-sm opacity-60 hover:opacity-100 transition-opacity">العودة للقائمة الرئيسية</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة القوانين */}
      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#3d2b1f]/90 backdrop-blur-sm">
            <div className="bg-[#f5eedc] border-4 border-[#3d2b1f] p-8 md:p-10 rounded-[40px] max-w-2xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh]">
              <button onClick={() => setShowInstructions(false)} className="absolute top-6 left-6 font-black text-red-600 bg-white p-2 rounded-full">إغلاق</button>
              <h2 className="text-2xl font-black mb-8">قوانين التحدي</h2>
              <ul className="space-y-4 font-bold text-lg text-right mb-10">
                <li>• الفوز يتطلب توصيل أضلاع الهرم الثلاثة ببعضها.</li>
                <li>• الحروف تظهر بشكل عشوائي تماماً عند كل اختيار.</li>
                <li>• زر التخطي أو انتهاء الوقت يحول الدور للمنافس مباشرة.</li>
              </ul>
              <div className="border-t-2 border-[#3d2b1f]/10 pt-6 text-center">
                <p className="text-[10px] font-bold opacity-60 uppercase">نسخة مطورة مستوحاة من (AZ-kvíz)</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة تأكيد الخروج */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#3d2b1f]/90 backdrop-blur-sm">
            <div className="bg-[#f5eedc] border-4 border-[#3d2b1f] p-8 md:p-10 rounded-[40px] max-w-md w-full relative shadow-2xl text-center">
              <h2 className="text-2xl font-black mb-4 text-red-600">إنهاء التحدي؟</h2>
              <p className="font-bold text-lg mb-8 opacity-80">هل أنت متأكد من رغبتك في الخروج؟ سيتم إلغاء التحدي الحالي بالكامل.</p>
              <div className="flex gap-4">
                <button onClick={handleMainMenu} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black border-b-8 border-red-800 active:border-b-0 active:translate-y-2 transition-all">نعم، خروج</button>
                <button onClick={() => setShowExitConfirm(false)} className="flex-1 bg-[#3d2b1f] text-white py-4 rounded-2xl font-black border-b-8 border-black active:border-b-0 active:translate-y-2 transition-all">تراجع</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GameArena;
