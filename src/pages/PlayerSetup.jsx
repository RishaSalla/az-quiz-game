import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import logo from '../assets/logo.risha.png'; // المسار الصحيح المعتمد

const PlayerSetup = () => {
  const navigate = useNavigate();
  const setGameSetup = useGameStore((state) => state.setGameSetup);
  const [showInstructions, setShowInstructions] = useState(false);

  const [setup, setSetup] = useState({
    teamA: { name: 'الفريق البرتقالي', players: '' },
    teamB: { name: 'الفريق البني', players: '' }
  });

  const handleStart = () => {
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

    if (data.teamA.players.length === 0 || data.teamB.players.length === 0) {
      alert('الرجاء إدخال اسم واحد على الأقل لكل طرف');
      return;
    }

    setGameSetup(data);
    navigate('/game');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f5eedc] font-tajawal">
      <img src={logo} alt="Risha" className="h-24 w-auto mb-8 drop-shadow-xl" />
      
      {/* لوحة التعليمات الوافية */}
      <div className="max-w-4xl w-full mb-8 bg-white/40 p-6 rounded-3xl border-2 border-[#3d2b1f]/10">
        <button 
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full flex justify-between items-center text-[#3d2b1f] font-black text-lg"
        >
          <span>📖 تعليمات وقوانين "تحدي ريشة"</span>
          <span>{showInstructions ? '▲' : '▼'}</span>
        </button>
        
        {showInstructions && (
          <div className="mt-4 text-sm text-[#3d2b1f]/80 leading-relaxed space-y-3 border-t border-[#3d2b1f]/10 pt-4">
            <p><strong>1. إعداد اللعب:</strong> أدخل اسماً واحداً للعب الفردي، أو عدة أسماء مفصولة بفاصلة (,) لتفعيل نظام الميكروفون الدوار للفرق.</p>
            <p><strong>2. طريقة التحدي:</strong> يختار المحكم الحرف، يظهر السؤال، ثم يتم التأكد من الإجابة. إذا كانت صحيحة يستولي الفريق على الخلية، وإذا كانت خاطئة ينتقل الدور للمنافس.</p>
            <p><strong>3. قانون الفوز:</strong> الفريق البرتقالي يفوز بتوصيل الجانب الأيمن بالأيسر، والفريق البني يفوز بتوصيل القمة بالقاعدة.</p>
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* إعداد الطرف الأول */}
        <div className="bg-white/60 p-8 rounded-[40px] border-4 border-[#3d2b1f] shadow-[8px_8px_0px_0px_#d36a3e]">
          <h2 className="text-xl font-black text-[#d36a3e] mb-4">الطرف الأول (برتقالي)</h2>
          <input 
            placeholder="اسم اللاعب أو الفريق"
            value={setup.teamA.name}
            onChange={(e) => setSetup({...setup, teamA: {...setup.teamA, name: e.target.value}})}
            className="w-full p-4 mb-4 rounded-2xl border-2 border-[#3d2b1f] bg-white outline-none font-bold"
          />
          <textarea 
            placeholder="للمجموعات: أدخل الأسماء مفصولة بفاصلة"
            value={setup.teamA.players}
            onChange={(e) => setSetup({...setup, teamA: {...setup.teamA, players: e.target.value}})}
            className="w-full p-4 rounded-2xl border-2 border-[#3d2b1f] bg-white outline-none font-bold"
          />
        </div>

        {/* إعداد الطرف الثاني */}
        <div className="bg-white/60 p-8 rounded-[40px] border-4 border-[#3d2b1f] shadow-[8px_8px_0px_0px_#3d2b1f]">
          <h2 className="text-xl font-black text-[#3d2b1f] mb-4">الطرف الثاني (بني)</h2>
          <input 
            placeholder="اسم اللاعب أو الفريق"
            value={setup.teamB.name}
            onChange={(e) => setSetup({...setup, teamB: {...setup.teamB, name: e.target.value}})}
            className="w-full p-4 mb-4 rounded-2xl border-2 border-[#3d2b1f] bg-white outline-none font-bold"
          />
          <textarea 
            placeholder="للمجموعات: أدخل الأسماء مفصولة بفاصلة"
            value={setup.teamB.players}
            onChange={(e) => setSetup({...setup, teamB: {...setup.teamB, players: e.target.value}})}
            className="w-full p-4 rounded-2xl border-2 border-[#3d2b1f] bg-white outline-none font-bold"
          />
        </div>
      </div>

      <button 
        onClick={handleStart}
        className="mt-10 bg-[#d36a3e] text-white px-16 py-5 rounded-3xl text-xl font-black border-b-8 border-[#3d2b1f] active:border-b-0 active:translate-y-2 transition-all hover:scale-105"
      >
        بدء التحدي
      </button>
    </div>
  );
};

export default PlayerSetup;
