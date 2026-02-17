import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import PyramidGrid from '../components/GameBoard/PyramidGrid';
import PlayerBadge from '../components/Player/PlayerBadge';
import Modal from '../components/UI/Modal';
import Button from '../components/UI/Button';
import WinnerOverlay from '../components/Player/WinnerOverlay';
import { checkAnswerLogic, ARABIC_LETTERS } from '../logic/gameMechanics';

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
  const [userAnswer, setUserAnswer] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(turnDuration);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!players || players.length === 0) {
      navigate('/setup');
    }
  }, [players, navigate]);

  useEffect(() => {
    let timer;
    if (isModalOpen && isTimerEnabled && timeLeft > 0 && !feedback) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !feedback) {
      handleSubmitAnswer(true);
    }
    return () => clearInterval(timer);
  }, [isModalOpen, timeLeft, isTimerEnabled, feedback]);

  // دالة لجلب اسم الملف بناءً على الحرف
  const getFileNameByLetter = (letter) => {
    const index = ARABIC_LETTERS.indexOf(letter);
    if (index === -1) return null;
    
    // قائمة بأسماء الملفات كما ظهرت في الصورة بالترتيب
    const fileNames = [
      "01alif", "02ba", "03ta", "04tha", "05jeem", "06haa", "07khaa",
      "08dal", "09dhal", "10ra", "11zay", "12seen", "13sheen", "14sad",
      "15dad", "16ta_a", "17zha", "18ain", "19ghain", "20fa", "21qaf",
      "22kaf", "23lam", "24meem", "25noon", "26ha_a", "27waw", "28ya"
    ];
    
    return fileNames[index];
  };

  const handleCellClick = async (cell) => {
    setIsLoading(true);
    const fileName = getFileNameByLetter(cell.letter);
    
    try {
      // استدعاء ملف الـ JSON الخاص بالحرف ديناميكياً
      const module = await import(`../data/letters/${fileName}.json`);
      const questions = module.default;
      
      // اختيار سؤال عشوائي من المصفوفة
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

      setSelectedCell(cell);
      setCurrentQuestion(randomQuestion);
      setUserAnswer('');
      setFeedback(null);
      setTimeLeft(turnDuration);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error loading question file:", error);
      alert("عذراً، تعذر تحميل الأسئلة لهذا الحرف.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = (isTimeout = false) => {
    if (!currentQuestion) return;

    const isCorrect = !isTimeout && checkAnswerLogic(userAnswer, currentQuestion.answer);

    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        handleCorrectAnswer(selectedCell.id);
        closeModal();
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        handleWrongAnswer();
        closeModal();
      }, 1500);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCell(null);
    setCurrentQuestion(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10 overflow-hidden pb-10">
      <header className="px-4 py-6 flex justify-between items-start md:px-20 max-w-6xl mx-auto w-full">
        <PlayerBadge 
          player={players[1]} 
          isActive={gameStatus === 'playing' && currentPlayerIndex === 1}
          isWinner={gameStatus === 'finished' && players[1].id === useGameStore.getState().winner?.id}
        />

        <div className="mt-4 flex flex-col items-center">
          <div className="text-gray-400 font-bold text-sm tracking-widest mb-2">VS</div>
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            currentPlayerIndex === 0 ? 'bg-team-red' : 'bg-team-blue'
          }`} />
        </div>

        <PlayerBadge 
          player={players[0]} 
          isActive={gameStatus === 'playing' && currentPlayerIndex === 0}
          isWinner={gameStatus === 'finished' && players[0].id === useGameStore.getState().winner?.id}
        />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          <PyramidGrid onCellClick={handleCellClick} />
        </div>
      </main>

      <div className="absolute top-4 left-4">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {}} 
        showCloseButton={false}
        title={selectedCell ? `حرف (${selectedCell.letter})` : ''}
      >
        <div className="space-y-6 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
            {currentQuestion?.question}
          </h3>

          {isTimerEnabled && !feedback && (
            <div className="flex items-center justify-center gap-2 text-orange-600 font-mono text-xl">
              <Clock size={20} />
              <span>00:{timeLeft.toString().padStart(2, '0')}</span>
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="اكتب الإجابة هنا..."
              disabled={!!feedback}
              className={`w-full p-4 text-center text-lg border-2 rounded-xl outline-none transition-all
                ${feedback === 'correct' ? 'border-green-500 bg-green-50 text-green-700' : ''}
                ${feedback === 'wrong' ? 'border-red-500 bg-red-50 text-red-700' : ''}
                ${!feedback ? 'border-gray-300 focus:border-blue-500' : ''}
              `}
              onKeyDown={(e) => e.key === 'Enter' && !feedback && handleSubmitAnswer()}
              autoFocus
            />
          </div>

          {!feedback && (
            <Button onClick={() => handleSubmitAnswer()} className="w-full">
              تأكيد الإجابة
            </Button>
          )}

          {feedback === 'wrong' && (
            <p className="text-red-500 text-sm flex items-center justify-center gap-1">
              <AlertCircle size={16} />
              إجابة خاطئة!
            </p>
          )}
        </div>
      </Modal>

      <WinnerOverlay />
    </div>
  );
};

export default GameArena;
