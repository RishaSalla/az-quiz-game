import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; 
import useGameStore from '../store/useGameStore';
import logo from '../assets/logo.risha.png';

const PlayerSetup = () => {
  const navigate = useNavigate();
  const setGameSetup = useGameStore((state) => state.setGameSetup);

  const [mode, setMode] = useState('single');
  const [timer, setTimer] = useState('off');
  const [showInstructions, setShowInstructions] = useState(false);

  const [teamAPlayers, setTeamAPlayers] = useState(['']);
  const [teamBPlayers, setTeamBPlayers] = useState(['']);

  const handleAddInput = (team) => {
    if (team === 'A') setTeamAPlayers([...teamAPlayers, '']);
    else setTeamBPlayers([...teamBPlayers, '']);
  };

  const handleInputChange = (team, index, value) => {
    if (team === 'A') {
      const newInp = [...teamAPlayers];
      newInp[index] = value;
      setTeamAPlayers(newInp);
    } else {
      const newInp = [...teamBPlayers];
      newInp[index] = value;
      setTeamBPlayers(newInp);
    }
  };

  const handleStart = () => {
    const finalA = teamAPlayers.filter(n => n.trim() !== '');
    const finalB = teamBPlayers.filter(n => n.trim() !== '');

    if (finalA.length === 0 || finalB.length === 0) {
      alert('الرجاء إدخال اسم واحد على الأقل لكل طرف');
      return;
    }

    setGameSetup({
      gameMode: mode,
      timerSetting: timer,
      teamA: { name: mode === 'team' ? 'فريق البرتقالي' : finalA[0], players: finalA },
      teamB: { name: mode === 'team' ? 'فريق البني' : finalB[0], players: finalB }
    });
    navigate('/game');
  };

  return (
    // استخدام الحاوية التي تسمح بالسكرول وتبدأ من أعلى الصفحة
    <div className="smart-scaling-container font-tajawal text-[#3d2b1f] relative">
      
      {/* زر القوانين: تم ربطه بالكلاس الثابت في اليمين */}
      <button 
        onClick={() => setShowInstructions(true)}
        className="rules-side-button"
      >
        قوانين التحدي
      </button>

      {/* الشعار: سيلتزم بالحجم المحدد له في الـ CSS لمنع الانفجار البصري */}
      <img src={logo} alt="Risha" className="risha-logo-setup" />
      
      <h1 className="text-2xl md:text-3xl font-black mb-8 text-center tracking-tighter">
        تحدي الهرم للحروف
      </h1>

      {/* لوحة التحكم: محصورة بعرض معين لضمان الاستقرار */}
      <div className="w-full max-w-3xl bg-white/40 rounded-[40px] border-2 border-[#3d2b1f]/10 mb-8 backdrop-blur-sm shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <span className="block font-black mb-3 text-center opacity-70 text-sm">نمط المواجهة</span>
            <div className="flex bg-[#3d2b1f]/5 p-2 rounded-2xl gap-2">
              <button onClick={() => { setMode('single'); setTeamAPlayers(['']); setTeamBPlayers(['']); }} className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm ${mode === 'single' ? 'bg-[#3d2b1f] text-white shadow-lg' : 'hover:bg-white/20'}`}>فردي</button>
              <button onClick={() => setMode('team')} className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm ${mode === 'team' ? 'bg-[#3d2b1f] text-white shadow-lg' : 'hover:bg-white/20'}`}>فرق</button>
            </div>
          </div>
          <div>
            <span className="block font-black mb-3 text-center opacity-70 text-sm">المؤقت (بالثواني)</span>
            <div className="grid grid-cols-4 bg-[#3d2b1f]/5 p-2 rounded-2xl gap-1">
              {['off', '15', '30', '60'].map((t) => (
                <button key={t} onClick={() => setTimer(t)} className={`py-3 rounded-xl font-bold text-xs md:text-sm transition-all ${timer === t ? 'bg-[#d36a3e] text-white shadow-lg' : 'hover:bg-white/20'}`}>
                  {t === 'off' ? 'إيقاف' : t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* حقول إدخال الأسماء: ترتيب عمودي بسيط في الجوال وعرضي في اللابتوب */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
        <div className="bg-white/60 p-6 md:p-8 rounded-[40px] border-4 border-[#3d2b1f] shadow-[6px_6px_0px_#d36a3e]">
          <h2 className="text-lg font-black text-[#d36a3e] mb-4">الطرف البرتقالي</h2>
          <div className="space-y-3">
            {teamAPlayers.map((n, i) => (
              <input key={i} value={n} onChange={(e) => handleInputChange('A', i, e.target.value)} className="w-full p-4 rounded-2xl border-2 border-[#3d2b1f] bg-white font-bold outline-none text-sm" placeholder={mode === 'single' ? "اسم اللاعب" : `اسم العضو ${i+1}`} />
            ))}
            {mode === 'team' && <button onClick={() => handleAddInput('A')} className="w-full py-2 border-2 border-dashed border-[#d36a3e] rounded-xl text-[#d36a3e] font-bold text-xs">+ إضافة لاعب</button>}
          </div>
        </div>

        <div className="bg-white/60 p-6 md:p-8 rounded-[40px] border-4 border-[#3d2b1f] shadow-[6px_6px_0px_#3d2b1f]">
          <h2 className="text-lg font-black text-[#3d2b1f] mb-4">الطرف البني</h2>
          <div className="space-y-3">
            {teamBPlayers.map((n, i) => (
              <input key={i} value={n} onChange={(e) => handleInputChange('B', i, e.target.value)} className="w-full p-4 rounded-2xl border-2 border-[#3d2b1f] bg-white font-bold outline-none text-sm" placeholder={mode === 'single' ? "اسم اللاعب" : `اسم العضو ${i+1}`} />
            ))}
            {mode === 'team' && <button onClick={() => handleAddInput('B')} className="w-full py-2 border-2 border-dashed border-[#3d2b1f] rounded-xl text-[#3d2b1f] font-bold text-xs">+ إضافة لاعب</button>}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center pb-20">
        <button onClick={handleStart} className="bg-[#d36a3e] text-white px-16 md:px-24 py-5 rounded-3xl text-xl md:text-2xl font-black border-b-8 border-[#3d2b1f] active:border-b-0 active:translate-y-2 transition-all shadow-xl">
          بدء التحدي
        </button>
        <p className="mt-6 text-[10px] font-bold opacity-30 text-[#3d2b1f] tracking-widest uppercase text-center max-w-xs">
          هذه اللعبة هي نسخة مطورة باللغة العربية ومستوحاة من البرنامج التشيكي الشهير (AZ-kvíz)
        </p>
      </div>

      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3d2b1f]/90 backdrop-blur-sm">
            <div className="bg-[#f5eedc] border-4 border-[#3d2b1f] p-8 md:p-10 rounded-[40px] max-w-2xl w-full shadow-2xl relative overflow-y-auto max-h-[90vh]">
              <button onClick={() => setShowInstructions(false)} className="absolute top-4 left-4 text-xl font-black text-red-600 bg-white/80 p-2 rounded-full">إغلاق</button>
              <h2 className="text-2xl md:text-3xl font-black mb-8 text-[#d36a3e]">كيف تلعب تحدي الهرم؟</h2>
              <div className="space-y-6 text-base md:text-lg font-bold leading-relaxed text-right">
                <p>• الهدف هو توصيل **أضلاع الهرم الثلاثة** ببعضها.</p>
                <p>• اختر رقماً، وسيظهر لك **حرف وسؤال عشوائيان**.</p>
                <p>• زر **تخطي** يعني خسارة المحاولة؛ وتنتقل الفرصة للمنافس.</p>
                <p>• المؤقت يبدأ فور ظهور السؤال.</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayerSetup;
