import { create } from 'zustand';

const useGameStore = create((set) => ({
  // بيانات الفرق واللاعبين
  teamA: { name: 'الفريق البرتقالي', players: [] },
  teamB: { name: 'الفريق البني', players: [] },
  
  // مؤشرات "الميكروفون الدوار" (أي لاعب عليه الدور الآن داخل الفريق)
  teamAPlayerIndex: 0,
  teamBPlayerIndex: 0,
  
  // الفريق الذي عليه الدور حالياً (teamA أو teamB)
  currentTeam: 'teamA',
  
  // حالة خلايا الهرم (رقم الخلية: الفريق المستولي عليها)
  cells: {},
  
  // حالة اللعبة (setup, playing, winner)
  status: 'setup',
  winner: null,

  // ضبط إعدادات اللعبة وبدء اللعب
  setGameSetup: (data) => set({
    teamA: data.teamA,
    teamB: data.teamB,
    teamAPlayerIndex: 0,
    teamBPlayerIndex: 0,
    status: 'playing',
    cells: {},
    winner: null,
    currentTeam: 'teamA'
  }),

  // منطق "الميكروفون الدوار" وتغيير الدور للفريق الآخر
  nextTurn: () => set((state) => {
    const isTeamA = state.currentTeam === 'teamA';
    
    // حساب الفهرس القادم للاعب (يعود للصفر إذا انتهت قائمة الأسماء)
    const nextPlayerIndex = isTeamA 
      ? (state.teamAPlayerIndex + 1) % (state.teamA.players.length || 1)
      : (state.teamBPlayerIndex + 1) % (state.teamB.players.length || 1);

    return {
      currentTeam: isTeamA ? 'teamB' : 'teamA',
      teamAPlayerIndex: isTeamA ? nextPlayerIndex : state.teamAPlayerIndex,
      teamBPlayerIndex: !isTeamA ? nextPlayerIndex : state.teamBPlayerIndex,
    };
  }),

  // وظيفة "التخطي" - تمرر الدور دون الاستيلاء على أي خلية
  skipTurn: () => {
    // استدعاء منطق تبديل الدور والميكروفون مباشرة
    set((state) => {
      const isTeamA = state.currentTeam === 'teamA';
      const nextIndex = isTeamA 
        ? (state.teamAPlayerIndex + 1) % (state.teamA.players.length || 1)
        : (state.teamBPlayerIndex + 1) % (state.teamB.players.length || 1);

      return {
        currentTeam: isTeamA ? 'teamB' : 'teamA',
        teamAPlayerIndex: isTeamA ? nextIndex : state.teamAPlayerIndex,
        teamBPlayerIndex: !isTeamA ? nextIndex : state.teamBPlayerIndex,
      };
    });
  },

  // الاستيلاء على الخلية للفريق الحالي
  occupyCell: (cellId) => set((state) => ({
    cells: { ...state.cells, [cellId]: state.currentTeam }
  })),

  // إعادة تصفير اللعبة بالكامل
  resetGame: () => set({
    cells: {},
    currentTeam: 'teamA',
    teamAPlayerIndex: 0,
    teamBPlayerIndex: 0,
    status: 'setup',
    winner: null
  })
}));

export default useGameStore;
