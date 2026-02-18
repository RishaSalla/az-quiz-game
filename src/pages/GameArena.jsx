import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/useGameStore';
import PyramidGrid from '../components/GameBoard/PyramidGrid';
import logo from '../assets/logo.risha.png'; // المسار الصحيح المعتمد

const GameArena = () => {
  const { 
    teamA, teamB, currentTeam, teamAPlayerIndex, teamBPlayerIndex, gameMode,
    occupyCell, nextTurn, skipTurn
  } = useGameStore();

  const [selectedCell, setSelectedCell] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // تحديد من يتحدث الآن بناءً على نمط اللعب
  const currentPlayerName = currentTeam === 'teamA' 
    ? (gameMode === 'team' ? teamA.players[teamAPlayerIndex] : teamA.name)
    : (gameMode === 'team' ? teamB.players[teamBPlayerIndex] : teamB.name);

  const letterMapping = [
    "alif", "baa", "taa", "thaa", "jeem", "haa", "khaa", "daal", "thaal", "raa", "zaay", 
    "seen", "sheen", "saad", "daad", "taa_v2", "zaa", "ayn", "ghayn", "faa", "qaaf", 
    "kaaf", "laam", "meem", "noon", "haa_v2", "waaw", "yaa"
  ];

  // إصلاح جلب الأسئلة باستخدام مسار نسبي مضمون العمل
  useEffect(() => {
    if (selectedCell) {
      const fileNumber = selectedCell.id.toString().padStart(2, '0');
      const fileName = letterMapping[selectedCell.id - 1];
      
      // تم تعديل المسار ليتوافق مع بنية الملفات المرفوعة
      fetch(`data/letters/${fileNumber}${fileName}.json`)
        .then(res => {
          if(!res.ok) throw new Error("الملف غير موجود");
          return res.json();
        })
        .then(data => {
          const randomQ = data.questions[Math.floor(Math.random() * data.questions.length)];
          setCurrentQuestion(randomQ);
        })
        .catch(err => {
          console.error("خطأ في جلب السؤال:", err);
          setCurrentQuestion({ question: "تعذر تحميل السؤال، يرجى التأكد من مسار الملفات.", answer: "خطأ في المسار" });
        });
    } else {
      setCurrentQuestion(null);
      setShowAnswer(false);
    }
  }, [selectedCell]);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 font-tajawal">
      {/* لوحة النتائج والميكروفون */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 mt-2 px-6 py-4 bg-white/40 rounded-3xl border-2 border-[#3d2b1f]/5 backdrop-blur-sm">
        
        {/* الطرف الأول */}
        <div className={`flex flex-col items-start p-4 rounded-2xl transition-all duration-500 ${currentTeam === 'teamA' ? 'bg-[#d36a3e] text-white shadow-[6px_6px_0px_0px_#3d2b1f] scale-105' : 'opacity-40'}`}>
          <span className="text-[10px] font-bold uppercase mb-1">{gameMode === 'team' ? 'فريق ريشة البرتقالي' : 'المنافس الأول'}</span>
          <div className="flex items-center gap-2">
            {currentTeam === 'teamA' && gameMode === 'team' && <span className="animate-pulse">🎤</span>}
            <span className="text-xl font-black">{currentPlayerName}</span>
          </div>
        </div>

        <img src={logo} alt="Risha" className="h-16 w-auto" />

        {/* الطرف الثاني */}
        <div className={`flex flex-col items-end p-4 rounded-2xl transition-all duration-500 ${currentTeam === 'teamB' ? 'bg-[#3d2b1f] text-[#f5eedc] shadow-[6px_6px_0px_0px_#d36a3e] scale-105' : 'opacity-40'}`}>
          <span className="text-[10px] font-bold uppercase mb-1">{gameMode === 'team' ? 'فريق ريشة البني' : 'المنافس الثاني'}</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black">{currentPlayerName}</span>
            {currentTeam === 'teamB' && gameMode === 'team' && <span className="animate-pulse">🎤</span>}
          </div>
        </div>
      </div>

      {/* ساحة الهرم */}
      <div className="flex-1 flex items-center justify-center w-full">
        <PyramidGrid onCellClick={(cell) => setSelectedCell(cell)} />
      </div>

      {/* نافذة السؤال والتحكم (بدون إيموجي) */}
      <AnimatePresence>
        {selectedCell && currentQuestion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3d2b1f]/90 backdrop-blur-md">
            <motion.div initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} className="bg-[#f5eedc] border-4 border-[#3d2b1f] p-8 rounded-[40px] max-w-xl w-full shadow-[12px_12px_0px_0px_#d36a3e]">
              <div className="text-center mb-8">
                <span className="bg-[#3d2b1f] text-[#f5eedc] px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase">حرف {selectedCell.label}</span>
                <h3 className="text-2xl font-black text-[#3d2b1f] mt-4 leading-relaxed">{currentQuestion.question}</h3>
              </div>

              {showAnswer && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10 p-6 bg-white/60 rounded-3xl border-2 border-dashed border-[#d36a3e] text-center">
                  <span className="text-xs text-[#d36a3e] font-bold block mb-1">الإجابة النموذجية</span>
                  <p className="text-2xl font-bold text-[#3d2b1f]">{currentQuestion.answer}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {!showAnswer ? (
                  <div className="flex flex-col gap-3">
                    <button onClick={() => setShowAnswer(true)} className="w-full bg-[#d36a3e] text-white py-5 rounded-2xl font-black text-xl border-b-8 border-[#3d2b1f] active:border-b-0 active:translate-y-2 transition-all">كشف الإجابة</button>
                    <button onClick={() => { skipTurn(); setSelectedCell(null); }} className="w-full bg-[#3d2b1f]/10 text-[#3d2b1f] py-4 rounded-2xl font-bold border-b-4 border-[#3d2b1f]/20">تخطي (نقل الدور)</button>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button onClick={() => { occupyCell(selectedCell.id); nextTurn(); setSelectedCell(null); }} className="flex-1 bg-green-600 text-white py-5 rounded-2xl font-black text-xl border-b-8 border-green-900 flex items-center justify-center gap-3 active:border-b-0 active:translate-y-2 transition-all">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      صحيحة
                    </button>
                    <button onClick={() => { nextTurn(); setSelectedCell(null); }} className="flex-1 bg-red-600 text-white py-5 rounded-2xl font-black text-xl border-b-8 border-red-900 flex items-center justify-center gap-3 active:border-b-0 active:translate-y-2 transition-all">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      خاطئة
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameArena;
