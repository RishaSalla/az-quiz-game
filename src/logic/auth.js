import { ACCESS_DATA } from '../data/hashedCodes.js';

/**
 * دالة مساعدة لتوليد بصمة SHA-256 للنص
 * تعتمد على Web Crypto API المدمجة في المتصفح للأمان والسرعة
 */
async function sha256(message) {
  // تحويل النص إلى بيانات ثنائية
  const msgBuffer = new TextEncoder().encode(message);
  
  // التشفير
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
  // تحويل النتيجة إلى مصفوفة بايتات
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // تحويل البايتات إلى نص سداسي عشري (Hex String)
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * الدالة الرئيسية للتحقق من الكود
 * @param {string} inputCode - الكود الذي أدخله المستخدم
 * @returns {Promise<boolean>} - صح إذا كان الكود مقبولاً
 */
export const verifyCode = async (inputCode) => {
  if (!inputCode) return false;

  // تنظيف المدخلات (إزالة المسافات الزائدة)
  const cleanCode = inputCode.trim();

  try {
    // تشفير المدخل
    const hashedInput = await sha256(cleanCode);
    
    // البحث في القائمة المسموحة
    // نستخدم includes للبحث عن البصمة
    return ACCESS_DATA.valid_hashes.includes(hashedInput);
  } catch (error) {
    console.error("Encryption Error:", error);
    return false;
  }
};
