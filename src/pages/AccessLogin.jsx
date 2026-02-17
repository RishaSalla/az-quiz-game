import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { verifyCode } from '../logic/auth';

const AccessLogin = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // محاكاة تأخير بسيط للشعور بالمعالجة
    await new Promise(resolve => setTimeout(resolve, 600));

    const isValid = await verifyCode(code);

    if (isValid) {
      navigate('/setup');
    } else {
      setError('كود الدخول غير صحيح، تأكد من الرمز.');
      setIsLoading(false);
    }
  };

  // رمز SVG لشعار ريشة بنمط بكسل (تبسيط للشعار الأصلي)
  const RishaLogoSVG = () => (
    <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="40" y="20" fill="#d36a3e" />
      <path d="M10 10H20V20H10V10ZM30 10H40V20H30V10ZM50 10H60V20H50V10ZM70 10H80V20H70V10ZM90 10H100V20H90V10Z" fill="#3d2b1f" fillOpacity="0.2"/>
      <text x="50%" y="45" textAnchor="middle" fill="#3d2b1f" style={{ font: 'bold 24px Arial', letterSpacing: '2px' }}>RISHA</text>
    </svg>
  );

  // أيقونة القفل SVG
  const LockSVG = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md pixel-card overflow-hidden"
      >
        <div className="p-8 md:p-10 text-center">
          {/* الشعار الجديد */}
          <div className="flex justify-center mb-6">
            <RishaLogoSVG />
          </div>

          <div className="mx-auto w-16 h-16 bg-[#f5eedc] border-4 border-[#3d2b1f] rounded-full flex items-center justify-center mb-4 text-[#3d2b1f]">
            <LockSVG />
          </div>

          <h1 className="text-2xl font-bold text-[#3d2b1f] mb-2 font-sans">
            بوابة الدخول
          </h1>
          <p className="text-[#3d2b1f]/60 text-sm mb-8">
            أدخل كود الوصول الخاص بنسختك للبدء
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                placeholder="00000000"
                className="w-full px-6 py-4 rounded-lg bg-[#f5eedc]/30 border-4 border-[#3d2b1f] 
                           focus:bg-white focus:outline-none transition-all
                           text-center text-xl tracking-widest font-mono text-[#3d2b1f] placeholder-[#3d2b1f]/20"
                autoFocus
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-3 border-2 border-red-200 rounded-lg text-sm"
              >
                <span>{error}</span>
              </motion.div>
            )}

            <button 
              type="submit" 
              className="pixel-button-orange w-full py-4 text-lg font-bold flex items-center justify-center gap-2"
              disabled={isLoading || !code}
            >
              {isLoading ? 'جاري التحقق...' : 'دخول للمنصة'}
              {!isLoading && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              )}
            </button>
          </form>
        </div>
        
        <div className="bg-[#3d2b1f]/5 p-4 text-center text-xs text-[#3d2b1f]/40 font-bold uppercase tracking-widest">
          Risha Digital Products &copy; 2026
        </div>
      </motion.div>
    </div>
  );
};

export default AccessLogin;
