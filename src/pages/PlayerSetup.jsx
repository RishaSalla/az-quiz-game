import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import logo from '../assets/logo.risha.png';

const PlayerSetup = () => {
  const navigate = useNavigate();
  const setGameSetup = useGameStore((state) => state.setGameSetup);

  // حالات التحكم في النمط، المؤقت، والتعليمات
  const [mode, setMode] = useState('single');
  const [timer, setTimer] = useState('off');
  const [showInstructions, setShowInstructions] = useState(false);

  // حقول إدخال مستقلة لكل لاعب
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f5eedc] font-tajawal text-[#3d2b1f] relative overflow-hidden">
      
      {/* زر التعليمات الجانبي */}
      <button 
        onClick={() => setShowInstructions(true)}
        className="fixed left-6 top-1/2 -translate-y-1/2 bg-[#3d2b1f] text-white p-4 rounded-r-none rounded-l-3xl font-black shadow-xl hover:bg-[#d36a3e] transition-all z-40 flex items-center gap-2"
        style={{ writingMode: 'vertical-rl' }}
      >
        قوانين التحدي
      </button>

      <img src={logo} alt="Risha" className="h-20 mb-8" />
      <h1 className="text-3xl font-black mb-10 text-center tracking-tighter">تحدي الهرم للحروف</h1>

      {/* لوحة التحكم */}
      <div className="w-full max-w-4xl bg-white/40 p-8 rounded-[40px] border-2 border-[#3d2b1f]/10 mb-8 backdrop-blur-sm shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <span className="block font-black mb-4 text-center opacity-70">نمط المواجهة</span>
            <div className="flex bg-[#3d2b1f]/5 p-2 rounded-2xl gap-2">
              <button onClick={() => { setMode('single'); setTeamAPlayers(['']); setTeamBPlayers(['']); }} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'single' ? 'bg-[#3d2b1f] text-white shadow-lg' : 'hover:bg-white/20'}`}>فردي</button>
              <button onClick={() => setMode('team')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'team' ? 'bg-[#3d2b1f] text-white shadow-lg' : 'hover:bg-white/20'}`}>فرق</button>
            </div>
          </div>
          <div>
            <span className="block font-black mb-4 text-center opacity-70">المؤقت (بالثواني)</span>
            <div className="grid grid-cols-4 bg-[#3d2b1f]/5 p-2 rounded-2xl gap-1">
              {['off', '15', '30', '60'].map((t) => (
                <button key={t} onClick={() => setTimer(t)} className={`py-3 rounded-xl font-bold text-sm transition-all ${timer === t ? 'bg-[#d36a3e] text-white shadow-lg' : 'hover:bg-white/20'}`}>
                  {t === 'off' ? 'إيقاف' : t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* إدخال الأسماء */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white/60 p-8 rounded-[40px] border-4 border-[#3d2b1f] shadow-[8px_8px_0px_#d36a3e]">
          <h2 className="text-xl font-black text-[#d36a3e] mb-6">الطرف البرتقالي</h2>
          <div className="space-y-3">
            {teamAPlayers.map((n, i) => (
              <input key={i} value={n} onChange={(e) => handleInputChange('A', i, e.target.value)} className="w-full p-4 rounded-2xl border-2 border-[#3d2b1f] bg-white font-bold outline-none" placeholder={mode === 'single' ? "اسم اللاعب" : `اسم العضو ${i+1}`} />
            ))}
            {mode === 'team' && <button onClick={() => handleAddInput('A')} className="w-full py-2 border-2 border-dashed border-[#d36a3e] rounded-xl text-[#d36a3e] font-bold text-sm">+ إضافة لاعب</button>}
          </div>
        </div>

        <div className="bg-white/60 p-8 rounded-[40px] border-4 border-[#3d2b1f] shadow-[8px_8px_0px_#3d2b1f]">
          <h2 className="text-xl font-black text-[#3d2b1f] mb-6">الطرف البني</h2>
          <div className="space-y-3">
            {teamBPlayers.map((n, i) => (
              <input key={i} value={n} onChange={(e) => handleInputChange('B', i, e.target.value)} className="w-full p-4 rounded-2xl border-2 border-[#3d2b1f] bg-white font-bold outline-none" placeholder={mode === 'single' ? "اسم اللاعب" : `اسم العضو ${i+1}`} />
            ))}
            {mode === 'team' && <button onClick={() => handleAddInput('B')} className="w-full py-2 border-2 border-dashed border-[#3d2b1f] rounded-xl text-[#3d2b1f] font-bold text-sm">+ إضافة لاعب</button>}
          </div>
        </div>
      </div>

      <button onClick={handleStart} className="bg-[#d36a3e] text-white px-20 py-5 rounded-3xl text-2xl font-black border-b-8 border-[#3d2b1f] active:border-b-0 active:translate-y-2 transition-all">بدء التحدي</button>

      {/* نافذة التعليمات المنبثقة */}
      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#3d2b1f]/90 backdrop-blur-sm">
            <div className="bg-[#f5eedc] border-4 border-[#3d2b1f] p-10 rounded-[40px] max-w-2xl w-full shadow-2xl relative">
              <button onClick={() => setShowInstructions(false)} className="absolute top-6 left-6 text-2xl font-black text-red-600">إغلاق</button>
              <h2 className="text-3xl font-black mb-8 text-[#d36a3e]">كيف تلعب تحدي الهرم؟</h2>
              <div className="space-y-6 text-lg font-bold leading-relaxed">
                <p>• الهدف هو توصيل **أضلاع الهرم الثلاثة** (اليمين، اليسار، والقاعدة) ببعضها عبر طريق متصل من الخلايا.</p>
                <p>• اختر رقماً، وسيظهر لك **حرف وسؤال عشوائيان**. الحروف لا ترتبط بالأرقام.</p>
                <p>• زر **تخطي** يعني خسارة المحاولة؛ ستعود الخلية لوضع الرقم وينتقل الدور للمنافس.</p>
                <p>• المؤقت يبدأ فور ظهور السؤال؛ إذا انتهى الوقت ولم تُجب، تُعتبر المحاولة خاطئة.</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayerSetup;
