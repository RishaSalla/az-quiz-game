import { create } from 'zustand';

const useGameStore = create((set) => ({
  // بيانات الفرق واللاعبين
  teamA: { name: 'الفريق البرتقالي', players: [] },
  teamB: { name: 'الفريق البني', players: [] },
  
  // نمط اللعب: 'single' (لاعب ضد لاعب) أو 'team' (فريق ضد فريق)
  gameMode: 'single',
  
  // مؤشرات "الميكروفون الدوار" لكل فريق
  teamAPlayerIndex: 0,
  teamBPlayerIndex: 0,
  
  currentTeam: 'teamA',
  cells: {}, // حالة خلايا الهرم
  status: 'setup', // setup, playing, winner
  winner: null,

  // إعداد اللعبة وتحديد النمط تلقائياً
  setGameSetup: (data) => set({
    teamA: data.teamA,
    teamB: data.teamB,
    // إذا كان أي فريق لديه أكثر من لاعب، يتحول النمط لـ 'team'
    gameMode: (data.teamA.players.length > 1 || data.teamB.players.length > 1) ? 'team' : 'single',
    teamAPlayerIndex: 0,
    teamBPlayerIndex: 0,
    status: 'playing',
    cells: {},
    winner: null,
    currentTeam: 'teamA'
  }),

  // منطق تبديل الدور وتدوير الميكروفون
  nextTurn: () => set((state) => {
    const isTeamA = state.currentTeam === 'teamA';
    
    // إذا كان النمط جماعي، نقوم بتدوير اللاعب داخل الفريق
    let nextPlayerIndex = isTeamA ? state.teamAPlayerIndex : state.teamBPlayerIndex;
    if (state.gameMode === 'team') {
      const playersList = isTeamA ? state.teamA.players : state.teamB.players;
      nextPlayerIndex = (nextPlayerIndex + 1) % (playersList.length || 1);
    }

    return {
      currentTeam: isTeamA ? 'teamB' : 'teamA',
      teamAPlayerIndex: isTeamA ? nextPlayerIndex : state.teamAPlayerIndex,
      teamBPlayerIndex: !isTeamA ? nextPlayerIndex : state.teamBPlayerIndex,
    };
  }),

  // التخطي: ينقل الدور دون تغيير حالة الخلايا
  skipTurn: () => set((state) => {
    const isTeamA = state.currentTeam === 'teamA';
    let nextIndex = isTeamA ? state.teamAPlayerIndex : state.teamBPlayerIndex;
    
    if (state.gameMode === 'team') {
      const playersList = isTeamA ? state.teamA.players : state.teamB.players;
      nextIndex = (nextIndex + 1) % (playersList.length || 1);
    }

    return {
      currentTeam: isTeamA ? 'teamB' : 'teamA',
      teamAPlayerIndex: isTeamA ? nextIndex : state.teamAPlayerIndex,
      teamBPlayerIndex: !isTeamA ? nextIndex : state.teamBPlayerIndex,
    };
  }),

  // الاستيلاء على الخلية
  occupyCell: (cellId) => set((state) => ({
    cells: { ...state.cells, [cellId]: state.currentTeam }
  })),

  // إعادة التعيين
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
