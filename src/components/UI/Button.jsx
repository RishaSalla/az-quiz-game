import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', // primary, secondary, glass, danger
  className = '', 
  disabled = false,
  type = 'button'
}) => {
  
  // أنماط التصميم المختلفة
  const variants = {
    primary: "bg-gradient-to-r from-team-blue to-blue-600 text-white shadow-blue-900/20",
    secondary: "bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-300",
    glass: "bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white/30",
    danger: "bg-team-red text-white shadow-red-900/20",
    outline: "border-2 border-white text-white hover:bg-white/10"
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        relative px-8 py-3 rounded-2xl font-bold text-lg shadow-lg
        transition-all duration-200 flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

export default Button;
