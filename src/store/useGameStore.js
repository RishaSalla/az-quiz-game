import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// خريطة الجيران الدقيقة لكل خلية (1-28) لضمان دقة التوصيل
const adjacencyMap = {
  1: [2, 3],
  2: [1, 3, 4, 5], 3: [1, 2, 5, 6],
  4: [2, 5, 7, 8], 5: [2, 3, 4, 6, 8, 9], 6: [3, 5, 9, 10],
  7: [4, 8, 11, 12], 8: [4, 5, 7, 9, 12, 13], 9: [5, 6, 8, 10, 13, 14], 10: [6, 9, 14, 15],
  11: [7, 12, 16, 17], 12: [7, 8, 11, 13, 17, 18], 13: [8, 9, 12, 14, 18, 19], 14: [9, 10, 13, 15, 19, 20], 15: [10, 14, 20, 21],
  16: [11, 17, 22, 23], 17: [11, 12, 16, 18, 23, 24], 18: [12, 13, 17, 19, 24, 25], 19: [13, 14, 18, 20, 25, 26], 20: [14, 15, 19, 21, 26, 27], 21: [15, 20, 27, 28],
  22: [16, 23], 23: [16, 17, 22, 24], 24: [17, 18, 23, 25], 25: [18, 19, 24, 26], 26: [19, 20, 25, 27], 27: [20, 21, 26, 28], 28: [21, 27]
};

const SIDES = {
  LEFT: [1, 2, 4, 7, 11, 16, 22],
  RIGHT: [1, 3, 6, 10, 15, 21, 28],
  BOTTOM: [22, 23, 24, 25, 26, 27, 28]
};

const letterKeysBase = [
  "01alif", "02ba", "03ta", "04tha", "05jeem", "06haa", "07khaa", "08dal", 
  "09dhal", "10ra", "11zay", "12seen", "13sheen", "14sad", "15dad", "16ta_a", 
  "17zha", "18ain", "19ghain", "20fa", "21qaf", "22kaf", "23lam", "24meem", 
  "25noon", "26ha_a", "27waw", "28ya"
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const useGameStore = create(
  persist(
    (set, get) => ({
      teamA: { name: '', players: [] },
      teamB: { name: '', players: [] },
      gameMode: 'single',
      timerSetting: 'off',
      currentTeam: 'teamA',
      teamAPlayerIndex: 0,
      teamBPlayerIndex: 0,
      cells: {}, 
      usedQuestions: [],
      status: 'setup',
      winnerData: null,
      cellLetters: {}, // خريطة الحروف الموزعة على الأرقام

      setGameSetup: (config) => {
        const shuffled = shuffleArray(letterKeysBase);
        const initialCellLetters = {};
        for (let i = 1; i <= 28; i++) {
          initialCellLetters[i] = shuffled[i - 1];
        }

        set({
          ...config,
          status: 'playing',
          cells: {},
          usedQuestions: [],
          winnerData: null,
          currentTeam: 'teamA',
          teamAPlayerIndex: 0,
          teamBPlayerIndex: 0,
          cellLetters: initialCellLetters
        });
      },

      // تبديل الحرف عند الإجابة الخاطئة لضمان عدم التكرار
      refreshCellLetter: (cellId) => {
        const { usedQuestions, cellLetters } = get();
        // تصفية الحروف التي لم تُستخدم أسئلتها بعد
        const available = letterKeysBase.filter(l => !usedQuestions.includes(l));
        
        if (available.length > 0) {
          const newLetter = available[Math.floor(Math.random() * available.length)];
          set({
            cellLetters: { ...cellLetters, [cellId]: newLetter }
          });
        }
      },

      occupyCell: (cellId) => {
        const { currentTeam, cells } = get();
        const newCells = { ...cells, [cellId]: currentTeam };
        set({ cells: newCells });
        
        if (get().checkWin(newCells, currentTeam)) {
          const winner = currentTeam === 'teamA' ? get().teamA : get().teamB;
          set({ status: 'winner', winnerData: { name: winner.name, players: winner.players } });
        }
      },

      checkWin: (currentCells, team) => {
        const teamCells = Object.keys(currentCells).filter(id => currentCells[id] === team).map(Number);
        if (teamCells.length < 7) return false;

        const hasPathToAllSides = (startNode, targetSide1, targetSide2) => {
          let visited = new Set();
          let queue = [startNode];
          let foundSide1 = false;
          let foundSide2 = false;

          while (queue.length > 0) {
            let node = queue.shift();
            if (visited.has(node)) continue;
            visited.add(node);

            if (targetSide1.includes(node)) foundSide1 = true;
            if (targetSide2.includes(node)) foundSide2 = true;
            if (foundSide1 && foundSide2) return true;

            const neighbors = adjacencyMap[node] || [];
            for (let neighbor of neighbors) {
              if (teamCells.includes(neighbor) && !visited.has(neighbor)) {
                queue.push(neighbor);
              }
            }
          }
          return false;
        };

        const startNodes = teamCells.filter(id => SIDES.BOTTOM.includes(id));
        return startNodes.some(node => hasPathToAllSides(node, SIDES.LEFT, SIDES.RIGHT));
      },

      markQuestionAsUsed: (questionText) => set((state) => ({
        usedQuestions: [...state.usedQuestions, questionText]
      })),

      nextTurn: () => set((state) => {
        const isTeamA = state.currentTeam === 'teamA';
        const nextTeam = isTeamA ? 'teamB' : 'teamA';
        let nextAIdx = state.teamAPlayerIndex;
        let nextBIdx = state.teamBPlayerIndex;

        if (state.gameMode === 'team') {
          if (isTeamA) nextAIdx = (state.teamAPlayerIndex + 1) % state.teamA.players.length;
          else nextBIdx = (state.teamBPlayerIndex + 1) % state.teamB.players.length;
        }

        return { currentTeam: nextTeam, teamAPlayerIndex: nextAIdx, teamBPlayerIndex: nextBIdx };
      }),

      resetGame: () => {
        set({ status: 'setup', cells: {}, usedQuestions: [], winnerData: null, currentTeam: 'teamA', cellLetters: {} });
        localStorage.removeItem('az-quiz-storage');
      }
    }),
    {
      name: 'az-quiz-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useGameStore;
