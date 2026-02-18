import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AccessLogin from './pages/AccessLogin';
import PlayerSetup from './pages/PlayerSetup';
import GameArena from './pages/GameArena';

function App() {
  return (
    /* 👈 التعديل هنا: أضفنا basename ليطابق مسار مشروعك في GitHub */
    <Router basename="/az-quiz-game">
      <div className="min-h-screen w-full relative overflow-hidden bg-[#f5eedc]">
        
        {/* تأثير زخرفي خفيف في الخلفية (ريشة بكسل كبيرة باهتة) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <svg width="500" height="500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" fill="#3d2b1f" />
            <line x1="16" y1="8" x2="2" y2="22" stroke="#3d2b1f" strokeWidth="2" />
          </svg>
        </div>

        <Routes>
          <Route path="/" element={<AccessLogin />} />
          <Route path="/setup" element={<PlayerSetup />} />
          <Route path="/game" element={<GameArena />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
