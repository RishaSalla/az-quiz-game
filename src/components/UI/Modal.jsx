import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children, showCloseButton = true }) => {
  
  // رمز SVG لزر الإغلاق مصمم يدوياً
  const CloseSVG = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* الخلفية المظلمة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#3d2b1f]/70 backdrop-blur-sm"
          />

          {/* محتوى النافذة */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#f5eedc] pixel-card overflow-hidden z-10 shadow-[12px_12px_0px_#3d2b1f]"
          >
            {/* شريط العنوان */}
            {(title || showCloseButton) && (
              <div className="bg-[#3d2b1f] p-4 flex justify-between items-center text-white">
                <h2 className="text-lg font-black tracking-tight">{title}</h2>
                {showCloseButton && (
                  <button 
                    onClick={onClose}
                    className="p-1 hover:bg-white/20 transition-colors border-2 border-transparent active:border-white"
                  >
                    <CloseSVG />
                  </button>
                )}
              </div>
            )}

            {/* محتوى النافذة الداخلي */}
            <div className="p-6 md:p-8">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
