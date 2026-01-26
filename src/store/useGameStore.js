import { create } from 'zustand';
import { generatePyramidGrid } from '../logic/gridGeometry';
import { distributeLetters } from '../logic/gameMechanics';
import { checkWin } from '../logic/winCondition';
import { playSound } from '../logic/soundEngine';

export const useGameStore = create((set, get) => ({
  // --- حالة اللعبة (State) ---
  gameStatus: 'setup', // 'setup', 'playing', 'finished'
  players: [
    { id: 1, name: 'اللاعب 1', color: 'bg-team-red', borderColor: 'border-team-red' },
    { id: 2, name: 'اللاعب 2', color: 'bg-team-blue', borderColor: 'border-team-blue' }
  ],
  currentPlayerIndex: 0, // 0 for Player 1, 1 for Player 2
  grid: [],
  winner: null,
  
  // إعدادات المؤقت (اختيارية)
  isTimerEnabled: false,
  turnDuration: 30, // ثانية
  
  // --- الأوامر (Actions) ---

  // 1. بدء اللعبة
  startGame: (player1Name, player2Name, enableTimer) => {
    const initialGrid = generatePyramidGrid();
    const filledGrid = distributeLetters(initialGrid);
    
    set({
      players: [
        { id: 1, name: player1Name || 'الفريق الأحمر', color: 'bg-team-red', text: 'text-team-red' },
        { id: 2, name: player2Name || 'الفريق الأزرق', color: 'bg-team-blue', text: 'text-team-blue' }
      ],
      isTimerEnabled: enableTimer,
      grid: filledGrid,
      gameStatus: 'playing',
      currentPlayerIndex: 0,
      winner: null
    });
    playSound('click');
  },

  // 2. معالجة الإجابة الصحيحة
  handleCorrectAnswer: (cellId) => {
    const { grid, currentPlayerIndex, players } = get();
    const currentPlayer = players[currentPlayerIndex];

    // تحديث الخلية لتصبح مملوكة للاعب الحالي
    const newGrid = grid.map(cell => 
      cell.id === cellId 
        ? { ...cell, isOccupied: true, owner: currentPlayer.id } 
        : cell
    );

    set({ grid: newGrid });
    playSound('correct');

    // التحقق من الفوز
    if (checkWin(newGrid, currentPlayer.id)) {
      set({ winner: currentPlayer, gameStatus: 'finished' });
      playSound('win');
    } else {
      // إذا لم يفز، ينتقل الدور للخصم
      get().switchTurn();
    }
  },

  // 3. معالجة الإجابة الخاطئة
  handleWrongAnswer: () => {
    playSound('wrong');
    get().switchTurn();
  },

  // 4. تبديل الأدوار
  switchTurn: () => {
    set((state) => ({
      currentPlayerIndex: state.currentPlayerIndex === 0 ? 1 : 0
    }));
  },

  // 5. إعادة اللعب
  resetGame: () => {
    set({ gameStatus: 'setup', winner: null, grid: [] });
  }
}));
