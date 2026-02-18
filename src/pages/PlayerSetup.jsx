import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import logo from '../assets/logo-risha.png'; // شعار ريشة الأصلي

const PlayerSetup = () => {
  const navigate = useNavigate();
  const setGameSetup = useGameStore((state) => state.setGameSetup);

  const [setup, setSetup] = useState({
    teamA: { name: 'الفريق البرتقالي', players: '' },
    teamB: { name: 'الفريق البني', players: '' }
  });

  const handleStart = () => {
    // تحويل الأسماء من نص مفصول بفواصل إلى مصفوفة نظيفة
    const data = {
      teamA: { 
        name: setup.teamA.name, 
        players: setup.teamA.players.split(',').map(p => p.trim()).filter(p => p !== '') 
      },
      teamB: { 
        name: setup.teamB.name, 
        players: setup.teamB.players.split(',').map(p => p.trim()).filter(p => p !== '') 
      }
    };

    // التأكد من إدخال لاعب واحد على الأقل لكل فريق
    if (data.teamA.players.length === 0 || data.teamB.players.length === 0) {
      alert('الرجاء إدخال اسم لاعب واحد على الأقل لكل فريق لبدء التحدي');
      return;
    }

    setGameSetup(data);
    navigate('/game');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f5eedc] font-tajawal">
      <img src={logo} alt="Risha" className="h-28 w-auto mb-12 drop-shadow-xl" />
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* الفريق البرتقالي */}
        <div className="bg-white/60 p-8 rounded-[40px] border-4 border-[#3d2b1f] shadow-[8px_8px_0px_0px_#d36a3e]">
          <h2 className="text-2xl font-black text-[#d36a3e] mb-6 flex items-center gap-2">الفريق الأول</h2>
          <div className="space-y-4">
            <input 
              placeholder="اسم الفريق (مثلاً: الصقور)"
              value={setup.teamA.name}
              onChange={(e) => setSetup({...setup, teamA: {...setup.teamA, name: e.target.value}})}
              className="w-full p-4 rounded-2xl border-2 border-[#3d2b1f] bg-[#f5eedc]/50 outline-none font-bold focus:bg-white transition-all"
            />
            <textarea 
              rows="3"
              placeholder="أسماء اللاعبين (افصل بينهم بفاصلة ,)"
              value={setup.teamA.players}
              onChange={(e) => setSetup({...setup, teamA: {...setup.teamA, players: e.target.value}})}
              className="w-full p-4 rounded-2xl border-2 border-[#3d2b1f] bg-[#f5eedc]/50 outline-none font-bold focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* الفريق البني */}
        <div className="bg-white/60 p-8 rounded-[40px] border-4 border-[#3d2b1f] shadow-[8px_8px_0px_0px_#3d2b1f]">
          <h2 className="text-2xl font-black text-[#3d2b1f] mb-6 flex items-center gap-2">الفريق الثاني</h2>
          <div className="space-y-4">
            <input 
              placeholder="اسم الفريق (مثلاً: العمالقة)"
              value={setup.teamB.name}
              onChange={(e) => setSetup({...setup, teamB: {...setup.teamB, name: e.target.value}})}
              className="w-full p-4 rounded-2xl border-2 border-[#3d2b1f] bg-[#f5eedc]/50 outline-none font-bold focus:bg-white transition-all"
            />
            <textarea 
              rows="3"
              placeholder="أسماء اللاعبين (افصل بينهم بفاصلة ,)"
              value={setup.teamB.players}
              onChange={(e) => setSetup({...setup, teamB: {...setup.teamB, players: e.target.value}})}
              className="w-full p-4 rounded-2xl border-2 border-[#3d2b1f] bg-[#f5eedc]/50 outline-none font-bold focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      <button 
        onClick={handleStart}
        className="mt-12 bg-[#d36a3e] text-white px-20 py-6 rounded-3xl text-2xl font-black border-b-8 border-[#3d2b1f] active:border-b-0 active:translate-y-2 transition-all hover:scale-105"
      >
        ابدأ التحدي
      </button>
    </div>
  );
};

export default PlayerSetup;
