import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AccessLogin from './pages/AccessLogin';
import PlayerSetup from './pages/PlayerSetup';
import GameArena from './pages/GameArena';

function App() {
  return (
    <Router basename="/az-quiz-game">
      {/* خلفية نظيفة بلون الرمل مع تأثير الورق (Sandpaper) فقط وبدون رسومات مشوهة */}
      <div className="min-h-screen w-full relative overflow-hidden bg-[#f5eedc]">
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
