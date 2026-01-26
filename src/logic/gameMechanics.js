// الحروف الأبجدية العربية (28 حرف)
export const ARABIC_LETTERS = [
  'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 
  'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 
  'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 
  'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'
];

/**
 * خلط مصفوفة عشوائياً (Fisher-Yates Shuffle)
 */
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * توزيع الأحرف على شبكة الهرم
 * كل خلية تأخذ حرفاً واحداً عشوائياً
 */
export const distributeLetters = (gridCells) => {
  // نخلط الحروف للحصول على ترتيب عشوائي
  const shuffledLetters = shuffleArray(ARABIC_LETTERS);
  
  // نوزع الحروف على الخلايا
  return gridCells.map((cell, index) => ({
    ...cell,
    letter: shuffledLetters[index] || '؟' // في حال زاد عدد الخلايا عن الحروف
  }));
};

/**
 * التحقق من صحة الإجابة
 * القاعدة: يجب أن تبدأ الإجابة بنفس حرف الخانة
 * (هذا تحقق أولي، التحقق الفعلي يكون بمطابقة نص الإجابة المخزنة)
 */
export const normalizeText = (text) => {
  if (!text) return "";
  // توحيد الهمزات والتاء المربوطة لتسهيل المقارنة
  return text.trim().toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
};

export const checkAnswerLogic = (userAnswer, correctAnswer) => {
  return normalizeText(userAnswer) === normalizeText(correctAnswer);
};
