import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AccessLogin from './pages/AccessLogin';
import PlayerSetup from './pages/PlayerSetup';
import GameArena from './pages/GameArena';
import Background from './components/UI/Background';

function App() {
  return (
    <>
      {/* الخلفية الثابتة لكل التطبيق */}
      <Background />
      
      {/* نظام التوجيه */}
      <Routes>
        <Route path="/" element={<AccessLogin />} />
        <Route path="/setup" element={<PlayerSetup />} />
        <Route path="/game" element={<GameArena />} />
        
        {/* إعادة توجيه أي رابط غير معروف إلى الصفحة الرئيسية */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
