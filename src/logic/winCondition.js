import { getNeighbors, ROWS } from './gridGeometry.js';

/**
 * تحديد هوية الأضلاع
 */
const isLeftSide = (cell) => cell.col === 0;
const isRightSide = (cell) => cell.col === cell.row;
const isBottomSide = (cell) => cell.row === ROWS - 1;

/**
 * خوارزمية البحث عن الفوز (BFS)
 * الهدف: العثور على مجموعة متصلة من الخلايا المملوكة للاعب
 * تلمس الأضلاع الثلاثة في نفس الوقت.
 */
export const checkWin = (grid, playerId) => {
  // 1. جلب كل الخلايا المملوكة لهذا اللاعب فقط
  const playerCells = grid.filter(cell => cell.owner === playerId);
  
  if (playerCells.length < 3) return false; // مستحيل الفوز بأقل من 3 خلايا

  // 2. تحويل الخلايا إلى مجموعة لسهولة البحث
  const ownedIds = new Set(playerCells.map(c => c.id));
  const visited = new Set();

  // 3. فحص كل "كتلة" متصلة من الخلايا
  for (let cell of playerCells) {
    if (visited.has(cell.id)) continue;

    // نبدأ فحص كتلة جديدة
    const queue = [cell];
    visited.add(cell.id);

    let touchesLeft = false;
    let touchesRight = false;
    let touchesBottom = false;

    while (queue.length > 0) {
      const current = queue.shift();

      // هل هذه الخلية تلمس أحد الأضلاع؟
      if (isLeftSide(current)) touchesLeft = true;
      if (isRightSide(current)) touchesRight = true;
      if (isBottomSide(current)) touchesBottom = true;

      // إذا تحققت الشروط الثلاثة في هذه الكتلة، انتهى الأمر، فاز اللاعب!
      if (touchesLeft && touchesRight && touchesBottom) {
        return true;
      }

      // البحث عن جيران مملوكين لنفس اللاعب لإكمال المسار
      const neighbors = getNeighbors(current.id, grid);
      for (let neighborId of neighbors) {
        // إذا كان الجار مملوكاً لنفس اللاعب ولم نضفه بعد
        if (ownedIds.has(neighborId) && !visited.has(neighborId)) {
          // نجد كائن الخلية الأصلي
          const neighborCell = grid.find(c => c.id === neighborId);
          visited.add(neighborId);
          queue.push(neighborCell);
        }
      }
    }
  }

  return false;
};
