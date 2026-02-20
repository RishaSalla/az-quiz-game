import React from 'react';
// تحويل النظام إلى HashRouter لحل مشكلة الـ 404 وتوافق GitHub Pages
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AccessLogin from './pages/AccessLogin';
import PlayerSetup from './pages/PlayerSetup';
import GameArena from './pages/GameArena';

function App() {
  // فحص ما إذا كان المستخدم يمتلك تصريح دخول مسبق (الكود السري)
  const isAuthorized = localStorage.getItem('risha_access_authorized') === 'true';

  return (
    <Router>
      {/* خلفية نظيفة بلون الرمل مع تأثير الورق (Sandpaper) */}
      <div className="min-h-screen w-full relative overflow-hidden bg-[#f5eedc]">
        <Routes>
          {/* إذا كان المستخدم مرخصاً، يتم تحويله تلقائياً لصفحة الإعدادات.
            إذا لم يكن مرخصاً، تظهر له صفحة الكود السري.
          */}
          <Route 
            path="/" 
            element={isAuthorized ? <Navigate to="/setup" replace /> : <AccessLogin />} 
          />
          
          <Route path="/setup" element={<PlayerSetup />} />
          <Route path="/game" element={<GameArena />} />

          {/* إعادة توجيه أي مسار خاطئ إلى الصفحة الرئيسية */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
