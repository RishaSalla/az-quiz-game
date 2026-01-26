import React from 'react';
import { motion } from 'framer-motion';

const Background = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-app-bg -z-10">
      {/* طبقة التدرج اللوني الأساسية */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />

      {/* أشكال زخرفية ضبابية متحركة */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-blue-200/20 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-red-200/20 rounded-full blur-3xl"
      />

      {/* طبقة شبكية خفيفة جداً لإعطاء ملمس تقني (اختياري) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
    </div>
  );
};

export default Background;
