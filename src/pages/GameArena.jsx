import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/useGameStore';
import PyramidGrid from '../components/GameBoard/PyramidGrid';
import logo from '../assets/logo.risha.png';

const GameArena = () => {
  const { 
    teamA, teamB, currentTeam, teamAPlayerIndex, teamBPlayerIndex, 
    gameMode, timerSetting, status, winnerData, cells,
    occupyCell, nextTurn, resetGame 
  } = useGameStore();

  const [selectedCell, setSelectedCell] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // قائمة الحروف للمسارات العشوائية
  const letterKeys = ["alif", "baa", "taa", "thaa", "jeem", "haa", "khaa", "daal", "thaal", "raa", "zaay", "seen", "sheen", "saad", "daad", "taa_v2", "zaa", "ayn", "ghayn", "faa", "qaaf", "kaaf", "laam", "meem", "noon", "haa_v2", "waaw", "yaa"];
  const letterLabels = ["الألف", "الباء", "التاء", "الثاء", "الجيم", "الحاء", "الخاء", "الدال", "الذال", "الراء", "الزاي", "السين", "الشين", "الصاد", "الضاد", "الطاء", "الظاء", "العين", "الغين", "الفاء", "القاف", "الكاف", "اللام", "الميم", "النون", "الهاء", "الواو", "الياء"];

  // تحديد اسم المتحدث الحالي (فردي أو فريق)
  const currentPlayerName = currentTeam === 'teamA' 
    ? (gameMode === 'team' ? teamA.players[teamAPlayerIndex] : teamA.name)
    : (gameMode === 'team' ? teamB.players[teamBPlayerIndex] : teamB.name);

  // منطق العشوائية عند الضغط على الرقم
  const handleCellClick = useCallback((cell) => {
    if (cells[cell.id]) return; // الخلية محجوزة مسبقاً

    const randomIndex = Math.floor(Math.random() * letterKeys.length);
    const letterKey = letterKeys[randomIndex];
    const letterLabel = letterLabels[randomIndex];
    const fileNumber = (randomIndex + 1).toString().padStart(2, '0');

    fetch(`data/letters/${fileNumber}${letterKey}.json`)
      .then(res => res.json())
      .then(data => {
        const randomQ = data.questions[Math.floor(Math.random() * data.questions.length)];
        setCurrentQuestion({ ...randomQ, label: letterLabel });
        setSelectedCell(cell);
        setShowAnswer(false);
        
        // تشغيل المؤقت إذا كان مفعلاً
        if (timerSetting !== 'off') {
          setTimeLeft(parseInt(timerSetting));
          setIsTimerActive(true);
        }
      })
      .catch(err => console.error("خطأ في تحميل السؤال:", err));
  }, [cells, timerSetting]);

  // تحديث المؤقت
  useEffect(() => {
    let interval;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      handleSkip(); // انتهى الوقت = تخطي (خطأ)
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const handleSkip = () => {
    setIsTimerActive(false);
    setSelectedCell(null);
    setCurrentQuestion(null);
    nextTurn();
  };

  const handleCorrect = () => {
    setIsTimerActive(false);
    occupyCell(selectedCell.id);
    nextTurn();
    setSelectedCell(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-[#f5eedc] font-tajawal text-[#3d2b1f]">
      
      {/* رأس الصفحة: الميكروفون واللاعبين */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 px-6 py-4 bg-white/40 rounded-3xl border-2 border-[#3d2b1f]/10 backdrop-blur-sm">
        <div className={`p-4 rounded-2xl transition-all ${currentTeam === 'teamA' ? 'bg-[#d36a3e] text-white shadow-lg scale-105' : 'opacity-30'}`}>
          <div className="text-[10px] font-bold mb-1 uppercase tracking-tighter">الطرف البرتقالي</div>
          <div className="flex items-center gap-2 font-black text-lg">
            {currentTeam === 'teamA' && <span className="animate-pulse">🎤</span>} {currentPlayerName}
          </div>
        </div>

        <img src={logo} alt="Risha" className="h-14" />

        <div className={`p-4 rounded-2xl transition-all ${currentTeam === 'teamB' ? 'bg-[#3d2b1f] text-white shadow-lg scale-105' : 'opacity-30'}`}>
          <div className="text-[10px] font-bold mb-1 uppercase tracking-tighter text-right">الطرف البني</div>
          <div className="flex items-center gap-2 font-black text-lg">
            {currentPlayerName} {currentTeam === 'teamB' && <span className="animate-pulse">🎤</span>}
          </div>
        </div>
      </div>

      {/* الهرم */}
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
        <PyramidGrid onCellClick={handleCellClick} />
      </div>

      {/* نافذة السؤال (Modal) */}
      <AnimatePresence>
        {selectedCell && currentQuestion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3d2b1f]/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#f5eedc] border-4 border-[#3d2b1f] p-8 rounded-[40px] max-w-xl w-full shadow-2xl relative">
              
              {/* المؤقت */}
              {timerSetting !== 'off' && (
                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-[#3d2b1f] flex items-center justify-center font-black text-2xl ${timeLeft <= 5 ? 'bg-red-500 text-white animate-bounce' : 'bg-white text-[#3d2b1f]'}`}>
                  {timeLeft}
                </div>
              )}

              <div className="text-center mb-8 mt-4">
                <p className="text-[#d36a3e] font-black text-xl mb-2">الإجابة تبدأ بحرف: {currentQuestion.label}</p>
                <div className="h-1 w-20 bg-[#3d2b1f]/10 mx-auto mb-6"></div>
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
                    <span className="text-xs font-bold block mb-1 opacity-50 text-[#3d2b1f]">الإجابة هي</span>
                    <p className="text-2xl font-black">{currentQuestion.answer}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={handleCorrect} className="flex-1 bg-green-600 text-white py-5 rounded-2xl font-black text-xl border-b-8 border-green-900 active:border-b-0 active:translate-y-2 transition-all">صحيحة</button>
                    <button onClick={handleSkip} className="flex-1 bg-red-600 text-white py-5 rounded-2xl font-black text-xl border-b-8 border-red-900 active:border-b-0 active:translate-y-2 transition-all">خاطئة</button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة الفوز النهائي */}
      <AnimatePresence>
        {status === 'winner' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#d36a3e] p-6 text-center">
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="bg-[#f5eedc] p-12 rounded-[50px] border-8 border-[#3d2b1f] shadow-2xl max-w-2xl w-full">
              <h1 className="text-6xl font-black text-[#3d2b1f] mb-6">مبروك!</h1>
              <div className="text-3xl font-bold mb-4">الفائز هو:</div>
              <div className="text-5xl font-black text-[#d36a3e] mb-8">
                {gameMode === 'single' ? winnerData.name : winnerData.players.join(' ، ')}
              </div>
              <button onClick={resetGame} className="bg-[#3d2b1f] text-white px-12 py-5 rounded-3xl font-black text-xl">العودة للرئيسية</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameArena;
