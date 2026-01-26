// ثوابت الهرم
export const ROWS = 7;
export const TOTAL_CELLS = 28;

// دالة لتوليد شبكة الهرم
export const generatePyramidGrid = () => {
  const cells = [];
  let idCounter = 0;

  for (let row = 0; row < ROWS; row++) {
    // في الهرم، عدد الأعمدة في الصف يساوي رقم الصف + 1
    // الصف 0 = خانة واحدة، الصف 1 = خانتان...
    for (let col = 0; col <= row; col++) {
      cells.push({
        id: idCounter,
        row: row,
        col: col,
        // هذه القيم ستستخدم لاحقاً للرسم
        // offset يساعد في تشكيل المثلث
        x: col - row / 2, 
        y: row,
        isOccupied: false,
        owner: null,
        letter: '', // سيتم تعبئتها لاحقاً
      });
      idCounter++;
    }
  }
  return cells;
};

// دالة لمعرفة الجيران (الملاصقين) لخانة معينة
// في الشبكة السداسية الهرمية، كل خانة لها اتصال بـ:
// (row-1, col-1), (row-1, col)  => فوق
// (row, col-1),   (row, col+1)  => يمين ويسار
// (row+1, col),   (row+1, col+1) => تحت
export const getNeighbors = (cellId, allCells) => {
  const cell = allCells[cellId];
  if (!cell) return [];

  const { row, col } = cell;
  
  // الاحتمالات الستة للجيران
  const potentialNeighbors = [
    { r: row - 1, c: col - 1 }, // Top Left
    { r: row - 1, c: col },     // Top Right
    { r: row, c: col - 1 },     // Left
    { r: row, c: col + 1 },     // Right
    { r: row + 1, c: col },     // Bottom Left
    { r: row + 1, c: col + 1 }  // Bottom Right
  ];

  // تصفية النتائج (إرجاع فقط الخانات الموجودة فعلياً داخل الهرم)
  return potentialNeighbors
    .map(n => allCells.find(c => c.row === n.r && c.col === n.c))
    .filter(Boolean) // إزالة undefined
    .map(c => c.id);
};
