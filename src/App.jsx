import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AccessLogin from './pages/AccessLogin';
import PlayerSetup from './pages/PlayerSetup';
import GameArena from './pages/GameArena';

function App() {
  return (
    <Router>
      {/* الحاوية الرئيسية التي تضمن تطبيق الهوية البصرية ومنع التمرير */}
      <div className="min-h-screen w-full relative overflow-hidden bg-[#f5eedc]">
        
        {/* تأثير زخرفي خفيف في الخلفية (ريشة بكسل كبيرة باهتة) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <svg width="500" height="500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" fill="#3d2b1f" />
            <line x1="16" y1="8" x2="2" y2="22" stroke="#3d2b1f" strokeWidth="2" />
          </svg>
        </div>

        <Routes>
          {/* 1. صفحة الدخول بكود الوصول */}
          <Route path="/" element={<AccessLogin />} />

          {/* 2. صفحة إعداد اللاعبين والفرق والمؤقت */}
          <Route path="/setup" element={<PlayerSetup />} />

          {/* 3. ساحة اللعب (الهرم الرقمي) */}
          <Route path="/game" element={<GameArena />} />

          {/* إعادة التوجيه في حال كتابة مسار خاطئ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
