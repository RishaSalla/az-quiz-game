// إنشاء سياق الصوت (AudioContext)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/**
 * دالة مساعدة لتوليد نغمة بسيطة
 * @param {number} freq - التردد بالهيرتز
 * @param {string} type - نوع الموجة (sine, square, sawtooth, triangle)
 * @param {number} duration - المدة بالثواني
 * @param {number} startTime - وقت البدء
 */
const playTone = (freq, type, duration, startTime = 0) => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);
  
  // ضبط ارتفاع وانخفاض الصوت (Envelope)
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime + startTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + startTime + 0.05); // Attack
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startTime + duration); // Decay

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime + startTime);
  osc.stop(audioCtx.currentTime + startTime + duration);
};

/**
 * المشغل الرئيسي للأصوات
 * @param {string} soundType - 'click', 'correct', 'wrong', 'win'
 */
export const playSound = (soundType) => {
  // التأكد من تفعيل الصوت
  if (audioCtx.state === 'suspended') audioCtx.resume();

  switch (soundType) {
    case 'click':
      // صوت نقرة خفيفة عالية التردد
      playTone(800, 'sine', 0.1);
      break;

    case 'correct':
      // نغمة صاعدة (تفاؤلية) - مثل Major Chord
      playTone(523.25, 'sine', 0.3, 0);    // C5
      playTone(659.25, 'sine', 0.3, 0.1);  // E5
      playTone(783.99, 'sine', 0.6, 0.2);  // G5
      break;

    case 'wrong':
      // نغمة هابطة (سلبية) - Sawtooth wave
      playTone(150, 'sawtooth', 0.3, 0);
      playTone(100, 'sawtooth', 0.4, 0.15);
      break;

    case 'win':
      // موسيقى احتفالية سريعة
      const melody = [523.25, 659.25, 783.99, 1046.50]; // C Major Arpeggio
      melody.forEach((note, index) => {
        playTone(note, 'triangle', 0.4, index * 0.15);
      });
      // نغمة نهائية طويلة
      setTimeout(() => playTone(1046.50, 'square', 1.0, 0), 600);
      break;
      
    default:
      break;
  }
};
