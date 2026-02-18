import React from 'react';
// التصحيح: استدعاء المخزن كـ Default Export لإصلاح خطأ البناء
import useGameStore from '../../store/useGameStore';
import HexCell from './HexCell';

const PyramidGrid = ({ onCellClick }) => {
  const { cells } = useGameStore();

  // قائمة الحروف العربية الـ 28 المعتمدة
  const letters = [
    { id: 1, label: 'أ' }, { id: 2, label: 'ب' }, { id: 3, label: 'ت' }, { id: 4, label: 'ث' },
    { id: 5, label: 'ج' }, { id: 6, label: 'ح' }, { id: 7, label: 'خ' }, { id: 8, label: 'د' },
    { id: 9, label: 'ذ' }, { id: 10, label: 'ر' }, { id: 11, label: 'ز' }, { id: 12, label: 'س' },
    { id: 13, label: 'ش' }, { id: 14, label: 'ص' }, { id: 15, label: 'ض' }, { id: 16, label: 'ط' },
    { id: 17, label: 'ظ' }, { id: 18, label: 'ع' }, { id: 19, label: 'غ' }, { id: 20, label: 'ف' },
    { id: 21, label: 'ق' }, { id: 22, label: 'ك' }, { id: 23, label: 'ل' }, { id: 24, label: 'م' },
    { id: 25, label: 'ن' }, { id: 26, label: 'هـ' }, { id: 27, label: 'و' }, { id: 28, label: 'ي' }
  ];

  // هندسة بناء الهرم: تقسيم الحروف إلى 7 صفوف (1, 2, 3, 4, 5, 6, 7)
  const rows = [];
  let currentIdx = 0;
  for (let i = 1; i <= 7; i++) {
    rows.push(letters.slice(currentIdx, currentIdx + i));
    currentIdx += i;
  }

  return (
    <div className="flex flex-col items-center select-none py-10">
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex justify-center gap-1"
          /* التعديل السحري: استخدام هامش علوي سالب (Negative Margin) 
             لجعل الصفوف "تتداخل" عمودياً وتختفي الفراغات البيضاء
          */
          style={{ marginTop: rowIndex === 0 ? '0' : '-1.6rem' }}
        >
          {row.map((letter) => (
            <HexCell
              key={letter.id}
              label={letter.label}
              status={cells[letter.id]} // ربط الحالة بلون الفريق المستولي
              onClick={() => onCellClick(letter)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PyramidGrid;
