import { create } from 'zustand';

/**
 * خريطة الجوار لخلايا الهرم (28 خلية)
 * تم حساب الجيران لكل خلية لضمان دقة خوارزمية التوصيل
 */
const adjacencyMap = {
  1: [2, 3],
  2: [1, 3, 4, 5], 3: [1, 2, 5, 6],
  4: [2, 5, 7, 8], 5: [2, 3, 4, 6, 8, 9], 6: [3, 5, 9, 10],
  7: [4, 8, 11, 12], 8: [4, 5, 7, 9, 12, 13], 9: [5, 6, 8, 10, 13, 14], 10: [6, 9, 14, 15],
  11: [7, 12, 16, 17], 12: [7, 8, 11, 13, 17, 18], 13: [8, 9, 12, 14, 18, 19], 14: [9, 10, 13, 15, 19, 20], 15: [10, 14, 20, 21],
  16: [11, 17, 22, 23], 17: [11, 12, 16, 18, 23, 24], 18: [12, 13, 17, 19, 24, 25], 19: [13, 14, 18, 20, 25, 26], 20: [14, 15, 19, 21, 26, 27], 21: [15, 20, 27, 28],
  22: [16, 23], 23: [16, 17, 22, 24], 24: [17, 18, 23, 25], 25: [18, 19, 24, 26], 26: [19, 20, 25, 27], 27: [20, 21, 26, 28], 28: [21, 27]
};

/**
 * تحديد أضلاع الهرم الثلاثة للتحقق من الفوز
 */
const SIDES = {
  LEFT: [1, 2, 4, 7, 11, 16, 22],
  RIGHT: [1, 3, 6, 10, 15, 21, 28],
  BOTTOM: [22, 23, 24, 25, 26, 27, 28]
};

const useGameStore = create((set, get) => ({
  // بيانات المتنافسين
  teamA: { name: '', players: [] }, // الطرف البرتقالي
  teamB: { name: '', players: [] }, // الطرف البني
  
  gameMode: 'single', // single (فردي) أو team (فرق)
  timerSetting: 'off', // off, 30, 15, 10
  
  currentTeam: 'teamA',
  teamAPlayerIndex: 0,
  teamBPlayerIndex: 0,
  
  cells: {}, // الحالة: { cellId: 'teamA' | 'teamB' }
  status: 'setup', // setup, playing, winner
  winnerData: null,

  // إعداد اللعبة
  setGameSetup: (config) => set({
    teamA: config.teamA,
    teamB: config.teamB,
    gameMode: config.gameMode,
    timerSetting: config.timerSetting,
    status: 'playing',
    cells: {},
    winnerData: null,
    currentTeam: 'teamA',
    teamAPlayerIndex: 0,
    teamBPlayerIndex: 0
  }),

  // الاستيلاء على خلية والتحقق من الفوز
  occupyCell: (cellId) => {
    const { currentTeam, cells } = get();
    const newCells = { ...cells, [cellId]: currentTeam };
    set({ cells: newCells });
    
    // فحص الفوز بمنطق الأضلاع الثلاثة (Az-kvíz)
    if (get().checkWinCondition(newCells, currentTeam)) {
      const winnerInfo = currentTeam === 'teamA' ? get().teamA : get().teamB;
      set({ 
        status: 'winner', 
        winnerData: {
          name: winnerInfo.name,
          players: winnerInfo.players
        }
      });
    }
  },

  // خوارزمية البحث (BFS) للتأكد من اتصال الأضلاع الثلاثة
  checkWinCondition: (currentCells, team) => {
    const teamCells = Object.keys(currentCells)
      .filter(id => currentCells[id] === team)
      .map(Number);

    if (teamCells.length < 7) return false; // أقل عدد ممكن للتوصيل

    // دالة للتحقق من الاتصال بين مجموعة من الخلايا
    const hasPath = (startNodes, targetSide1, targetSide2) => {
      let visited = new Set();
      let queue = [...startNodes];
      let reachedSide1 = false;
      let reachedSide2 = false;

      while (queue.length > 0) {
        let node = queue.shift();
        if (visited.has(node)) continue;
        visited.add(node);

        if (targetSide1.includes(node)) reachedSide1 = true;
        if (targetSide2.includes(node)) reachedSide2 = true;
        if (reachedSide1 && reachedSide2) return true;

        const neighbors = adjacencyMap[node] || [];
        for (let neighbor of neighbors) {
          if (teamCells.includes(neighbor) && !visited.has(neighbor)) {
            queue.push(neighbor);
          }
        }
      }
      return false;
    };

    // التحقق: هل يوجد مسار يربط خلايا القاعدة بـ (الضلع الأيمن والضلع الأيسر)؟
    const startNodes = teamCells.filter(id => SIDES.BOTTOM.includes(id));
    return hasPath(startNodes, SIDES.LEFT, SIDES.RIGHT);
  },

  // تبديل الدور وإدارة الميكروفون الدوار
  nextTurn: () => set((state) => {
    const isTeamA = state.currentTeam === 'teamA';
    const nextTeam = isTeamA ? 'teamB' : 'teamA';
    
    // تحديث مؤشر اللاعب في حال نمط الفرق
    let newTeamAPlayerIndex = state.teamAPlayerIndex;
    let newTeamBPlayerIndex = state.teamBPlayerIndex;

    if (state.gameMode === 'team') {
      if (isTeamA) {
        newTeamAPlayerIndex = (state.teamAPlayerIndex + 1) % state.teamA.players.length;
      } else {
        newTeamBPlayerIndex = (state.teamBPlayerIndex + 1) % state.teamB.players.length;
      }
    }

    return {
      currentTeam: nextTeam,
      teamAPlayerIndex: newTeamAPlayerIndex,
      teamBPlayerIndex: newTeamBPlayerIndex
    };
  }),

  resetGame: () => set({
    status: 'setup',
    cells: {},
    winnerData: null,
    currentTeam: 'teamA'
  })
}));

export default useGameStore;
