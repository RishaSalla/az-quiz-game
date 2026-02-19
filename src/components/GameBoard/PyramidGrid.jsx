import React from 'react';
import useGameStore from '../../store/useGameStore';
import HexCell from './HexCell';

const PyramidGrid = ({ onCellClick }) => {
  const { cells } = useGameStore();

  // مصفوفة الأرقام الـ 28 للهرم
  const cellIds = Array.from({ length: 28 }, (_, i) => i + 1);

  // تقسيم الأرقام إلى 7 صفوف لبناء شكل الهرم المتدرج (1، 2، 3، 4، 5، 6، 7)
  const rows = [];
  let currentIdx = 0;
  for (let i = 1; i <= 7; i++) {
    rows.push(cellIds.slice(currentIdx, currentIdx + i));
    currentIdx += i;
  }

  return (
    <div className="flex flex-col items-center select-none py-10 px-4">
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex justify-center gap-1"
          /* سر التلاحم الهندسي:
             استخدام هامش علوي سالب مدروس (-1.5rem) يجعل الصفوف تتداخل 
             بحيث يركب ضلع السداسي العلوي مع ضلع السداسي السفلي بدقة.
          */
          style={{ 
            marginTop: rowIndex === 0 ? '0' : '-1.55rem',
            zIndex: rowIndex 
          }}
        >
          {row.map((cellId) => (
            <HexCell
              key={cellId}
              label={cellId} // عرض الرقم فقط (1-28)
              status={cells[cellId]} // 'teamA', 'teamB', أو undefined
              onClick={() => onCellClick({ id: cellId })}
              disabled={!!cells[cellId]} // تعطيل الخلية إذا تم الاستحواذ عليها
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PyramidGrid;
