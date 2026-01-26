import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react'; // أيقونة الإغلاق

const Modal = ({ isOpen, onClose, title, children, showCloseButton = true }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* الخلفية المعتمة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          {/* جسم النافذة */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-lg bg-glass-white/95 backdrop-blur-xl border border-white/50 
                         rounded-3xl shadow-glass p-6 md:p-8 pointer-events-auto relative overflow-hidden"
            >
              {/* لمعة جمالية في الخلفية */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-400/20 rounded-full blur-3xl pointer-events-none" />

              {/* رأس النافذة */}
              <div className="flex justify-between items-center mb-6 relative z-10">
                {title && (
                  <h2 className="text-2xl font-bold text-gray-800 font-sans">{title}</h2>
                )}
                {showCloseButton && (
                  <button 
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-black/5 transition-colors text-gray-500"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>

              {/* محتوى النافذة */}
              <div className="relative z-10">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
