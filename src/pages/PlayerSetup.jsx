import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
// استخدام الشعار المعتمد للموقع المشغل
import logo from '../assets/logo.risha.png'; 

const PlayerSetup = () => {
  const navigate = useNavigate();
  const setGameSetup = useGameStore((state) => state.setGameSetup);

  // التحكم في نمط اللعب والمؤقت
  const [mode, setMode] = useState('single'); // 'single' أو 'team'
  const [timer, setTimer] = useState('off'); // 'off', '30', '15', '10'

  // إدارة أسماء اللاعبين في حقول مستقلة لكل طرف
  const [teamAPlayers, setTeamAPlayers] = useState(['']);
  const [teamBPlayers, setTeamBPlayers] = useState(['']);

  const handleAddPlayer = (team) => {
    if (team === 'A') setTeamAPlayers([...teamAPlayers, '']);
    else setTeamBPlayers([...teamBPlayers, '']);
  };

  const handlePlayerChange = (team, index, value) => {
    if (team === 'A') {
      const newPlayers = [...teamAPlayers];
      newPlayers[index] = value;
      setTeamAPlayers(newPlayers);
    } else {
      const newPlayers = [...teamBPlayers];
      newPlayers[index] = value;
      setTeamBPlayers(newPlayers);
    }
  };

  const handleStart = () => {
    // تصفية الأسماء الفارغة للتأكد من جدية الإدخال
    const finalA = teamAPlayers.filter(name => name.trim() !== '');
    const finalB = teamBPlayers.filter(name => name.trim() !== '');

    if (finalA.length === 0 || finalB.length === 0) {
      alert('الرجاء إدخال اسم واحد على الأقل لكل طرف لبدء التحدي');
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f5eedc] font-tajawal text-[#3d2b1f]">
      <img src={logo} alt="Risha" className="h-20 mb-6 drop-shadow-md" />
      <h1 className="text-3xl font-black mb-10 text-center">تحدي الهرم للحروف</h1>

      {/* لوحة التحكم الرئيسية (النمط والمؤقت) */}
      <div className="w-full max-w-4xl bg-white/40 p-8 rounded-[40px] border-2 border-[#3d2b1f]/10 mb-8 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* اختيار النمط */}
          <div>
            <label className="block font-black mb-4 text-center underline decoration-[#d36a3e] decoration-4 underline-offset-8">نمط المواجهة</label>
            <div className="flex bg-[#3d2b1f]/5 p-2 rounded-2xl gap-2">
              <button 
                onClick={() => { setMode('single'); setTeamAPlayers(['']); setTeamBPlayers(['']); }}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'single' ? 'bg-[#3d2b1f] text-white shadow-lg' : 'hover:bg-white/50'}`}
              >
                لعب فردي (1 VS 1)
              </button>
              <button 
                onClick={() => setMode('team')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'team' ? 'bg-[#3d2b1f] text-white shadow-lg' : 'hover:bg-white/50'}`}
              >
                لعب فرق (الميكروفون)
              </button>
            </div>
          </div>

          {/* إعدادات المؤقت */}
          <div>
            <label className="block font-black mb-4 text-center underline decoration-[#d36a3e] decoration-4 underline-offset-8">مؤقت التفكير</label>
            <div className="grid grid-cols-4 bg-[#3d2b1f]/5 p-2 rounded-2xl gap-1">
              {['off', '30', '15', '10'].map((option) => (
                <button 
                  key={option}
                  onClick={() => setTimer(option)}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${timer === option ? 'bg-[#d36a3e] text-white shadow-lg' : 'hover:bg-white/50'}`}
                >
                  {option === 'off' ? 'إيقاف' : `${option} ثانية`}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* حقول إدخال المتنافسين */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* الطرف البرتقالي */}
        <div className="bg-white/60 p-8 rounded-[40px] border-4 border-[#3d2b1f] shadow-[10px_10px_0px_0px_#d36a3e]">
          <h2 className="text-xl font-black text-[#d36a3e] mb-6">الطرف الأول (البرتقالي)</h2>
          <div className="space-y-3">
            {teamAPlayers.map((name, i) => (
              <input 
                key={i} value={name} placeholder={mode === 'single' ? "اسم اللاعب" : `اسم العضو ${i+1}`}
                onChange={(e) => handlePlayerChange('A', i, e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-[#3d2b1f] bg-white outline-none font-bold focus:ring-2 ring-[#d36a3e]"
              />
            ))}
            {mode === 'team' && (
              <button onClick={() => handleAddPlayer('A')} className="w-full py-3 border-2 border-dashed border-[#d36a3e] rounded-xl text-[#d36a3e] font-bold hover:bg-[#d36a3e]/5">+ إضافة لاعب للفريق</button>
            )}
          </div>
        </div>

        {/* الطرف البني */}
        <div className="bg-white/60 p-8 rounded-[40px] border-4 border-[#3d2b1f] shadow-[10px_10px_0px_0px_#3d2b1f]">
          <h2 className="text-xl font-black text-[#3d2b1f] mb-6">الطرف الثاني (البني)</h2>
          <div className="space-y-3">
            {teamBPlayers.map((name, i) => (
              <input 
                key={i} value={name} placeholder={mode === 'single' ? "اسم اللاعب" : `اسم العضو ${i+1}`}
                onChange={(e) => handlePlayerChange('B', i, e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-[#3d2b1f] bg-white outline-none font-bold focus:ring-2 ring-[#3d2b1f]"
              />
            ))}
            {mode === 'team' && (
              <button onClick={() => handleAddPlayer('B')} className="w-full py-3 border-2 border-dashed border-[#3d2b1f] rounded-xl text-[#3d2b1f] font-bold hover:bg-[#3d2b1f]/5">+ إضافة لاعب للفريق</button>
            )}
          </div>
        </div>

      </div>

      <button 
        onClick={handleStart}
        className="bg-[#d36a3e] text-white px-24 py-6 rounded-3xl text-2xl font-black border-b-8 border-[#3d2b1f] active:border-b-0 active:translate-y-2 transition-all hover:scale-105 shadow-2xl"
      >
        بدء التحدي
      </button>

      <p className="mt-8 text-sm opacity-40 font-bold italic text-center">بناءً على منطق التحدي الأصلي Az-kvíz</p>
    </div>
  );
};

export default PlayerSetup;
