import React from 'react';
import useGameStore from '../../store/useGameStore';
import HexCell from './HexCell';

const PyramidGrid = ({ onCellClick }) => {
  const cells = useGameStore((state) => state.cells);

  // توزيع الأرقام (1-28) على 7 صفوف لبناء شكل الهرم (1، 2، 3، 4، 5، 6، 7)
  const rows = [
    [1],
    [2, 3],
    [4, 5, 6],
    [7, 8, 9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28]
  ];

  return (
    <div className="flex flex-col items-center select-none py-8 px-4">
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex justify-center gap-1 sm:gap-2"
          /* الهندسة المتلاحمة: استخدام هامش علوي سالب مدروس (-1.4rem) 
             لجعل الصفوف تتداخل عمودياً وتغلق الفراغات البيضاء تماماً
          */
          style={{ 
            marginTop: rowIndex === 0 ? '0' : '-1.4rem',
            zIndex: rowIndex 
          }}
        >
          {row.map((cellId) => (
            <HexCell
              key={cellId}
              label={cellId} // الرقم هو العنوان الأساسي للخلية
              status={cells[cellId]} // الفريق المستولي (برتقالي أو بني)
              onClick={() => onCellClick({ id: cellId })}
              disabled={!!cells[cellId]} // منع الضغط على الخلايا المحجوزة
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PyramidGrid;
