import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', // 'primary', 'secondary', 'danger', 'white'
  disabled = false, 
  className = '',
  icon = null // يمكن تمرير SVG كـ icon
}) => {
  
  // تعريف الأنماط بناءً على النوع (Variant) مستوحاة من ألوان ريشة
  const variants = {
    primary: 'pixel-button-orange text-white',
    secondary: 'bg-[#4a7c59] text-white border-4 border-b-8 border-r-8 border-[#3d2b1f] hover:bg-[#3d6347]',
    danger: 'bg-red-600 text-white border-4 border-b-8 border-r-8 border-[#3d2b1f] hover:bg-red-700',
    white: 'pixel-button-white text-[#3d2b1f]'
  };

  const baseStyles = 'relative flex items-center justify-center gap-2 px-6 py-2 font-bold transition-all duration-100 select-none';
  const disabledStyles = 'opacity-50 cursor-not-allowed transform-none border-b-4 border-r-4';
  const activeStyles = 'active:border-b-4 active:border-r-4 active:translate-y-1 active:translate-x-1';

  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${disabled ? disabledStyles : activeStyles}
        ${className}
      `}
    >
      {/* عرض الأيقونة اليدوية (SVG) إذا وجدت */}
      {icon && (
        <span className="w-5 h-5 flex items-center justify-center">
          {icon}
        </span>
      )}
      
      <span>{children}</span>
    </button>
  );
};

export default Button;
