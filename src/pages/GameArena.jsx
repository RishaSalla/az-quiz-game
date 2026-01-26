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
import questionsData from '../data/questions.json';
import { checkAnswerLogic } from '../logic/gameMechanics';

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

  // الحالة المحلية لإدارة السؤال الحالي
  const [selectedCell, setSelectedCell] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(turnDuration);
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', null

  // التأكد من وجود لاعبين (حماية من التحديث المباشر للصفحة)
  useEffect(() => {
    if (!players || players.length === 0) {
      navigate('/setup');
    }
  }, [players, navigate]);

  // إدارة المؤقت عند فتح السؤال
  useEffect(() => {
    let timer;
    if (isModalOpen && isTimerEnabled && timeLeft > 0 && !feedback) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !feedback) {
      handleSubmitAnswer(true); // انتهى الوقت = إجابة خاطئة
    }
    return () => clearInterval(timer);
  }, [isModalOpen, timeLeft, isTimerEnabled, feedback]);

  // عند النقر على خلية
  const handleCellClick = (cell) => {
    // 1. البحث عن سؤال يبدأ بهذا الحرف
    // ملاحظة: في التطبيق الحقيقي يفضل تصفية الأسئلة مسبقاً
    const eligibleQuestions = questionsData.filter(q => q.letter === cell.letter);
    const randomQuestion = eligibleQuestions.length > 0 
      ? eligibleQuestions[Math.floor(Math.random() * eligibleQuestions.length)]
      : { question: `سؤال افتراضي لحرف ${cell.letter}`, answer: "تجربة" }; // fallback

    setSelectedCell(cell);
    setCurrentQuestion(randomQuestion);
    setUserAnswer('');
    setFeedback(null);
    setTimeLeft(turnDuration);
    setIsModalOpen(true);
  };

  // تقديم الإجابة
  const handleSubmitAnswer = (isTimeout = false) => {
    if (!currentQuestion) return;

    const isCorrect = !isTimeout && checkAnswerLogic(userAnswer, currentQuestion.answer);

    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        handleCorrectAnswer(selectedCell.id);
        closeModal();
      }, 1000); // انتظار لرؤية رسالة "صحيح"
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        handleWrongAnswer();
        closeModal();
      }, 1500); // انتظار لرؤية رسالة "خطأ"
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCell(null);
    setCurrentQuestion(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10 overflow-hidden pb-10">
      {/* 1. الشريط العلوي: اللاعبين والنتيجة */}
      <header className="px-4 py-6 flex justify-between items-start md:px-20 max-w-6xl mx-auto w-full">
        {/* اللاعب 2 (الأزرق) - يظهر يساراً */}
        <PlayerBadge 
          player={players[1]} 
          isActive={gameStatus === 'playing' && currentPlayerIndex === 1}
          isWinner={gameStatus === 'finished' && players[1].id === useGameStore.getState().winner?.id}
        />

        {/* مؤشر الدور في المنتصف */}
        <div className="mt-4 flex flex-col items-center">
          <div className="text-gray-400 font-bold text-sm tracking-widest mb-2">VS</div>
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            currentPlayerIndex === 0 ? 'bg-team-red' : 'bg-team-blue'
          }`} />
        </div>

        {/* اللاعب 1 (الأحمر) - يظهر يميناً */}
        <PlayerBadge 
          player={players[0]} 
          isActive={gameStatus === 'playing' && currentPlayerIndex === 0}
          isWinner={gameStatus === 'finished' && players[0].id === useGameStore.getState().winner?.id}
        />
      </header>

      {/* 2. منطقة اللعب الوسطى (الهرم) */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="transform scale-90 md:scale-100 transition-transform">
          <PyramidGrid onCellClick={handleCellClick} />
        </div>
      </main>

      {/* 3. زر الخروج */}
      <div className="absolute top-4 left-4">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* 4. نافذة السؤال */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {}} // نمنع الإغلاق عند النقر خارج النافذة
        showCloseButton={false}
        title={selectedCell ? `حرف (${selectedCell.letter})` : ''}
      >
        <div className="space-y-6 text-center">
          {/* نص السؤال */}
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
            {currentQuestion?.question}
          </h3>

          {/* المؤشر الزمني (إذا كان مفعلاً) */}
          {isTimerEnabled && !feedback && (
            <div className="flex items-center justify-center gap-2 text-orange-600 font-mono text-xl">
              <Clock size={20} />
              <span>00:{timeLeft.toString().padStart(2, '0')}</span>
            </div>
          )}

          {/* حقل الإجابة */}
          <div className="relative">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="اكتب الإجابة هنا..."
              disabled={!!feedback} // تعطيل الكتابة عند ظهور النتيجة
              className={`w-full p-4 text-center text-lg border-2 rounded-xl outline-none transition-all
                ${feedback === 'correct' ? 'border-green-500 bg-green-50 text-green-700' : ''}
                ${feedback === 'wrong' ? 'border-red-500 bg-red-50 text-red-700' : ''}
                ${!feedback ? 'border-gray-300 focus:border-blue-500' : ''}
              `}
              onKeyDown={(e) => e.key === 'Enter' && !feedback && handleSubmitAnswer()}
              autoFocus
            />
            
            {/* رسائل التغذية الراجعة */}
            {feedback === 'correct' && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-4 text-green-600">
                ✅
              </motion.div>
            )}
            {feedback === 'wrong' && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-4 text-red-600">
                ❌
              </motion.div>
            )}
          </div>

          {/* زر التأكيد */}
          {!feedback && (
            <Button onClick={() => handleSubmitAnswer()} className="w-full">
              تأكيد الإجابة
            </Button>
          )}

          {/* رسالة الخطأ النصية */}
          {feedback === 'wrong' && (
            <p className="text-red-500 text-sm flex items-center justify-center gap-1">
              <AlertCircle size={16} />
              إجابة خاطئة! الإجابة الصحيحة تبدأ بحرف {selectedCell.letter}
            </p>
          )}
        </div>
      </Modal>

      {/* 5. شاشة الفوز (تظهر تلقائياً) */}
      <WinnerOverlay />
    </div>
  );
};

export default GameArena;
