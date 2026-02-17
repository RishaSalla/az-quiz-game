import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import PyramidGrid from '../components/GameBoard/PyramidGrid';
import PlayerBadge from '../components/Player/PlayerBadge';
import Modal from '../components/UI/Modal';
import WinnerOverlay from '../components/Player/WinnerOverlay';
import { ARABIC_LETTERS } from '../logic/gameMechanics';

const GameArena = () => {
  const navigate = useNavigate();
  const { 
    players, 
    currentPlayerIndex, 
    handleCorrectAnswer, 
    handleWrongAnswer,
    gameStatus,
    isTimerEnabled,
    turnDuration
  } = useGameStore();

  const [selectedCell, setSelectedCell] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(turnDuration);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!players || players.length === 0) {
      navigate('/setup');
    }
  }, [players, navigate]);

  useEffect(() => {
    let timer;
    if (isModalOpen && isTimerEnabled && timeLeft > 0 && !showAnswer) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isModalOpen && !showAnswer) {
      // عند انتهاء الوقت، لا نقفل السؤال بل ننتظر قرار المحكم أو يحسب خطأ
    }
    return () => clearInterval(timer);
  }, [isModalOpen, timeLeft, isTimerEnabled, showAnswer]);

  const getFileNameByLetter = (letter) => {
    const index = ARABIC_LETTERS.indexOf(letter);
    if (index === -1) return null;
    const fileNames = ["01alif", "02ba", "03ta", "04tha", "05jeem", "06haa", "07khaa", "08dal", "09dhal", "10ra", "11zay", "12seen", "13sheen", "14sad", "15dad", "16ta_a", "17zha", "18ain", "19ghain", "20fa", "21qaf", "22kaf", "23lam", "24meem", "25noon", "26ha_a", "27waw", "28ya"];
    return fileNames[index];
  };

  const handleCellClick = async (cell) => {
    if (cell.isOccupied) return;
    setIsLoading(true);
    const fileName = getFileNameByLetter(cell.letter);
    
    try {
      const module = await import(`../data/letters/${fileName}.json`);
      const questions = module.default;
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

      setSelectedCell(cell);
      setCurrentQuestion(randomQuestion);
      setShowAnswer(false);
      setTimeLeft(turnDuration);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error loading question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markCorrect = () => {
    handleCorrectAnswer(selectedCell.id);
    closeModal();
  };

  const markWrong = () => {
    handleWrongAnswer(selectedCell.id);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCell(null);
    setCurrentQuestion(null);
  };

  // رموز SVG يدوية
  const RishaLogoSVG = () => (
    <svg width="80" height="40" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="40" y="20" fill="#d36a3e" />
      <text x="50%" y="45" textAnchor="middle" fill="#3d2b1f" style={{ font: 'bold 24px Arial', letterSpacing: '2px' }}>RISHA</text>
    </svg>
  );

  const ArrowLeftSVG = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );

  const InfoSVG = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );

  return (
    <div className="game-container-responsive relative z-10 overflow-hidden">
      {/* الشريط العلوي */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center px-4 mb-4">
        <PlayerBadge 
          player={players[1]} 
          isActive={currentPlayerIndex === 1}
        />
        
        <div className="flex flex-col items-center">
          <RishaLogoSVG />
          <div className={`mt-2 w-4 h-4 rounded-full animate-pulse ${currentPlayerIndex === 0 ? 'bg-[#d36a3e]' : 'bg-[#4a7c59]'}`} />
        </div>

        <PlayerBadge 
          player={players[0]} 
          isActive={currentPlayerIndex === 0}
        />
      </header>

      {/* الهرم مع التدرج في الحجم */}
      <main className="flex-1 flex items-center justify-center pyramid-scale transition-transform duration-500">
        <div className={isLoading ? "opacity-30 pointer-events-none" : ""}>
          <PyramidGrid onCellClick={handleCellClick} />
        </div>
      </main>

      {/* أزرار التحكم الجانبية */}
      <div className="absolute top-6 left-6 flex flex-col gap-4">
        <button onClick={() => navigate('/setup')} className="p-3 bg-white border-4 border-[#3d2b1f] hover:bg-[#f5eedc] transition-colors">
          <ArrowLeftSVG />
        </button>
        <button onClick={() => setShowInfo(!showInfo)} className="p-3 bg-white border-4 border-[#3d2b1f] hover:bg-[#f5eedc] transition-colors">
          <InfoSVG />
        </button>
      </div>

      {/* نافذة السؤال (نمط المُحكم) */}
      <Modal isOpen={isModalOpen} onClose={() => {}} showCloseButton={false} title={`السؤال الرقمي (${selectedCell?.displayId})`}>
        <div className="space-y-6 text-center py-4">
          <div className="text-sm font-bold text-[#d36a3e] uppercase tracking-widest">حرف المخبأ: {selectedCell?.letter}</div>
          <h3 className="text-2xl font-bold text-[#3d2b1f] leading-relaxed">{currentQuestion?.question}</h3>

          {isTimerEnabled && !showAnswer && (
            <div className={`text-2xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-bounce' : 'text-[#3d2b1f]'}`}>
              {timeLeft > 0 ? `00:${timeLeft.toString().padStart(2, '0')}` : 'انتهى الوقت!'}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {!showAnswer ? (
              <button onClick={() => setShowAnswer(true)} className="pixel-button-orange py-4 text-xl font-bold">إظهار الإجابة</button>
            ) : (
              <>
                <div className="p-4 bg-[#f5eedc] border-4 border-[#3d2b1f] text-xl font-bold text-[#3d2b1f] mb-4">الإجابة: {currentQuestion?.answer}</div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={markCorrect} className="bg-[#4a7c59] text-white border-4 border-b-8 border-[#3d2b1f] py-3 font-bold text-lg active:border-b-4">✅ صحيح</button>
                  <button onClick={markWrong} className="bg-red-600 text-white border-4 border-b-8 border-[#3d2b1f] py-3 font-bold text-lg active:border-b-4">❌ خطأ / تخطي</button>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>

      {/* نافذة التعليمات السريعة */}
      {showInfo && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-6" onClick={() => setShowInfo(false)}>
          <div className="pixel-card p-8 max-w-lg bg-[#f5eedc]" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4 text-[#3d2b1f]">تعليمات منطقة اللعب</h2>
            <ul className="text-right space-y-3 text-[#3d2b1f]/80 text-sm">
              <li>• الهرم مرقم من 1 إلى 28، اختر رقماً لبدء التحدي.</li>
              <li>• عند الخطأ، يختفي الحرف ويُستبدل بحرف آخر عشوائي لزيادة الحماس.</li>
              <li>• المُحكم هو من يقرر صحة الإجابة بعد الضغط على "إظهار الإجابة".</li>
              <li>• اربط الأطراف الثلاثة لتكون بطل ريشة القادم!</li>
            </ul>
            <button onClick={() => setShowInfo(false)} className="pixel-button-orange w-full mt-6 py-2">فهمت</button>
          </div>
        </div>
      )}

      <WinnerOverlay />
    </div>
  );
};

export default GameArena;
