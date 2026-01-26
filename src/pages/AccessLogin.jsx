import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import Button from '../components/UI/Button';
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
      setError('كود الدخول غير صحيح، تأكد من الأحرف.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50"
      >
        <div className="p-8 md:p-10 text-center">
          {/* أيقونة القفل */}
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600 shadow-inner">
            <Lock size={40} />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-sans">
            بوابة الدخول
          </h1>
          <p className="text-gray-500 mb-8">
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
                placeholder="أدخل الكود هنا..."
                className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-gray-200 
                           focus:border-blue-500 focus:bg-white focus:outline-none transition-all
                           text-center text-xl tracking-widest font-mono text-gray-700 placeholder-gray-400"
                autoFocus
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center justify-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg text-sm"
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-4 text-lg shadow-blue-500/30"
              disabled={isLoading || !code}
            >
              {isLoading ? 'جاري التحقق...' : 'دخول'}
              {!isLoading && <ArrowLeft size={20} />}
            </Button>
          </form>
        </div>
        
        {/* تذييل بسيط */}
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
          AZ Quiz Game &copy; 2026
        </div>
      </motion.div>
    </div>
  );
};

export default AccessLogin;
