// src/logic/auth.js

// دالة تحقق بسيطة جداً ومباشرة (بدون تشفير) لضمان الدخول
export const verifyCode = async (code) => {
  // التأكد من وجود كود وإزالة المسافات الزائدة
  const cleanCode = code ? code.trim() : "";
  
  // الشرط: إذا كان الكود يساوي 8 أصفار بالضبط -> اسمح بالدخول
  if (cleanCode === "00000000") {
    return true;
  }
  
  // غير ذلك -> ارفض الدخول
  return false;
};
