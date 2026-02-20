import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.risha.png';
// استيراد مصفوفة الأكواد المشفرة من الملف الذي أنشأته
import { hashedCodes } from '../data/hashedCodes';

const AccessLogin = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  // دالة تحويل الكود المدخل إلى بصمة مشفرة SHA-256
  const hashCode = async (text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const inputCode = code.trim();
    
    // 1. تحويل مدخلات المستخدم إلى هاش للمطابقة
    const userHash = await hashCode(inputCode);

    // 2. التحقق: هل الهاش موجود في القائمة؟ أو هل استخدم كود الاختبار؟
    const isValidHash = hashedCodes.includes(userHash);
    const isTestCode = inputCode.toLowerCase() === 'risha' || inputCode === '2026';

    if (isValidHash || isTestCode) {
      // حفظ تصريح الدخول في المتصفح
      localStorage.setItem('risha_access_authorized', 'true');
      navigate('/setup');
    } else {
      alert('رمز الوصول غير صحيح أو مستخدم، يرجى المحاولة مرة أخرى');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f5eedc] font-tajawal">
      <img src={logo} alt="Risha" className="h-32 w-auto mb-10 drop-shadow-2xl" />

      <div className="w-full max-w-md bg-white/60 p-10 rounded-[50px] border-4 border-[#3d2b1f] shadow-[12px_12px_0px_0px_#d36a3e]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#3d2b1f] mb-2">تسجيل الدخول</h1>
          <p className="text-[#3d2b1f]/60 font-bold">أدخل رمز الوصول الخاص باللعبة</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              placeholder="رمز الوصول"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-5 rounded-3xl border-2 border-[#3d2b1f] bg-[#f5eedc]/50 outline-none font-black text-center text-2xl focus:bg-white transition-all placeholder:text-[#3d2b1f]/30"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#d36a3e] text-white py-5 rounded-3xl text-2xl font-black border-b-8 border-[#3d2b1f] active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            دخول
          </button>
        </form>
      </div>

      <p className="mt-12 text-[#3d2b1f]/40 font-bold text-sm">منصة ريشة للفعاليات والمسابقات © 2026</p>
    </div>
  );
};

export default AccessLogin;
