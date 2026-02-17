import { create } from 'zustand';
import { generatePyramidGrid } from '../logic/gridGeometry';
import { ARABIC_LETTERS } from '../logic/gameMechanics';
import { checkWin } from '../logic/winCondition';
import { playSound } from '../logic/soundEngine';

export const useGameStore = create((set, get) => ({
  // --- الحالة الأساسية (State) ---
  gameStatus: 'setup', // 'setup', 'playing', 'finished'
  gameMode: 'individual', // 'individual' or 'team'
  
  players: [
    { id: 1, name: 'الفريق البرتقالي', members: [], color: 'bg-[#d36a3e]', text: 'text-[#d36a3e]' },
    { id: 2, name: 'الفريق الأخضر', members: [], color: 'bg-[#4a7c59]', text: 'text-[#4a7c59]' }
  ],
  
  currentPlayerIndex: 0,
  grid: [],
  winner: null,
  
  // إعدادات الوقت
  isTimerEnabled: false,
  turnDuration: 30,

  // حقيبة الحروف المتاحة (التي لم تظهر بعد على الهرم ولم يتم الفوز بها)
  availableLetters: [],

  // --- الأفعال (Actions) ---

  // 1. بدء اللعبة بتوزيع عشوائي للأرقام والحروف
  startGame: (p1Data, p2Data, mode, timerSeconds) => {
    const initialGrid = generatePyramidGrid();
    
    // خلط الحروف الأبجدية الـ 28 بشكل عشوائي تماماً
    const shuffledLetters = [...ARABIC_LETTERS].sort(() => Math.random() - 0.5);
    
    // توزيع أول 28 حرف على الخلايا (مخفية خلف الأرقام)
    const filledGrid = initialGrid.map((cell, index) => ({
      ...cell,
      letter: shuffledLetters[index],
      isOccupied: false,
      owner: null,
      displayId: index + 1 // الرقم من 1 إلى 28
    }));

    set({
      players: [
        { id: 1, ...p1Data, color: 'bg-[#d36a3e]', text: 'text-[#d36a3e]' },
        { id: 2, ...p2Data, color: 'bg-[#4a7c59]', text: 'text-[#4a7c59]' }
      ],
      gameMode: mode,
      isTimerEnabled: timerSeconds > 0,
      turnDuration: timerSeconds,
      grid: filledGrid,
      availableLetters: [], // سيتم استخدامها في تدوير الحروف عند الخطأ
      gameStatus: 'playing',
      currentPlayerIndex: 0,
      winner: null
    });
    
    playSound('click');
  },

  // 2. معالجة الإجابة الصحيحة (تثبيت الخلية للاعب)
  handleCorrectAnswer: (cellId) => {
    const { grid, currentPlayerIndex, players } = get();
    const currentPlayer = players[currentPlayerIndex];

    const newGrid = grid.map(cell => 
      cell.id === cellId 
        ? { ...cell, isOccupied: true, owner: currentPlayer.id } 
        : cell
    );

    set({ grid: newGrid });
    playSound('correct');

    if (checkWin(newGrid, currentPlayer.id)) {
      set({ winner: currentPlayer, gameStatus: 'finished' });
      playSound('win');
    } else {
      get().switchTurn();
    }
  },

  // 3. المنطق الجوهري: معالجة الخطأ وتدوير الحروف
  handleWrongAnswer: (cellId) => {
    const { grid } = get();
    
    // إيجاد كل الحروف التي ليست موجودة حالياً على الهرم (المربعات التي لم تُحل بعد)
    // في نظامنا، سنقوم بتبديل حرف الخلية الفاشلة بحرف "عشوائي" جديد تماماً 
    // لم يتم استخدامه في خلايا أخرى حالياً لضمان عدم التكرار
    
    const usedLettersInGrid = grid.map(c => c.letter);
    const unusedLettersPool = ARABIC_LETTERS.filter(l => !usedLettersInGrid.includes(l));
    
    let newGrid;
    if (unusedLettersPool.length > 0) {
      // اختيار حرف جديد عشوائي من الحروف خارج الهرم
      const newRandomLetter = unusedLettersPool[Math.floor(Math.random() * unusedLettersPool.length)];
      
      newGrid = grid.map(cell => 
        cell.id === cellId 
          ? { ...cell, letter: newRandomLetter, isOccupied: false, owner: null } 
          : cell
      );
    } else {
      // إذا استنفدنا كل الحروف الـ 28 (حالة نادرة)، نعيد خلط الحروف غير المحتلة فقط
      newGrid = [...grid];
    }

    set({ grid: newGrid });
    playSound('wrong');
    get().switchTurn();
  },

  // 4. تبديل الأدوار
  switchTurn: () => {
    set((state) => ({
      currentPlayerIndex: state.currentPlayerIndex === 0 ? 1 : 0
    }));
  },

  // 5. إعادة اللعب بنفس الأسماء والإعدادات
  resetGame: () => {
    const { players, gameMode, isTimerEnabled, turnDuration } = get();
    
    // استخراج البيانات الحالية لللاعبين لإعادة استخدامها
    const p1Data = { name: players[0].name, members: players[0].members };
    const p2Data = { name: players[1].name, members: players[1].members };
    const timerSeconds = isTimerEnabled ? turnDuration : 0;

    // بدء لعبة جديدة بنفس البيانات
    get().startGame(p1Data, p2Data, gameMode, timerSeconds);
  },

  // 6. إنهاء اللعبة بالكامل والعودة للرئيسية
  exitToMain: () => {
    set({ gameStatus: 'setup', winner: null, grid: [], players: [] });
  }
}));
