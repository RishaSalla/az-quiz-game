import React from 'react';
import HexCell from './HexCell';
import { useGameStore } from '../../store/useGameStore';

const PyramidGrid = ({ onCellClick }) => {
  const { grid, currentPlayerIndex, gameStatus } = useGameStore();

  // دالة مساعدة لتجميع الخلايا حسب الصفوف لرسم الهرم
  const getRows = () => {
    const rows = {};
    grid.forEach(cell => {
      if (!rows[cell.row]) rows[cell.row] = [];
      rows[cell.row].push(cell);
    });
    return Object.values(rows);
  };

  const rows = getRows();

  return (
    <div className="flex flex-col items-center justify-center gap-1 md:gap-2 py-8 select-none">
      {rows.map((rowCells, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex items-center justify-center"
          // إضافة هامش سلبي بسيط لتقليل الفراغات بين الصفوف السداسية
          style={{ marginBottom: '-10px' }}
        >
          {rowCells.map((cell) => (
            <HexCell
              key={cell.id}
              cell={cell}
              onClick={() => onCellClick(cell)}
              disabled={gameStatus !== 'playing'}
              // لاحقاً يمكننا تمرير isWinningPath إذا أردنا تلوين مسار الفوز
              isWinningPath={false} 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PyramidGrid;
