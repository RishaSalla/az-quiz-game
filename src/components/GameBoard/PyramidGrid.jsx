import React from 'react';
// التصحيح: استدعاء المخزن بدون أقواس لأنه "Default Export"
import useGameStore from '../../store/useGameStore';
import HexCell from './HexCell';

const PyramidGrid = ({ onCellClick }) => {
  const { cells } = useGameStore();

  // قائمة الحروف العربية الـ 28 لبناء الهرم
  const letters = [
    { id: 1, label: 'أ' }, { id: 2, label: 'ب' }, { id: 3, label: 'ت' }, { id: 4, label: 'ث' },
    { id: 5, label: 'ج' }, { id: 6, label: 'ح' }, { id: 7, label: 'خ' }, { id: 8, label: 'د' },
    { id: 9, label: 'ذ' }, { id: 10, label: 'ر' }, { id: 11, label: 'ز' }, { id: 12, label: 'س' },
    { id: 13, label: 'ش' }, { id: 14, label: 'ص' }, { id: 15, label: 'ض' }, { id: 16, label: 'ط' },
    { id: 17, label: 'ظ' }, { id: 18, label: 'ع' }, { id: 19, label: 'غ' }, { id: 20, label: 'ف' },
    { id: 21, label: 'ق' }, { id: 22, label: 'ك' }, { id: 23, label: 'ل' }, { id: 24, label: 'م' },
    { id: 25, label: 'ن' }, { id: 26, label: 'هـ' }, { id: 27, label: 'و' }, { id: 28, label: 'ي' }
  ];

  // تقسيم الحروف إلى صفوف لبناء شكل الهرم (1, 2, 3, 4, 5, 6, 7)
  const rows = [];
  let currentIdx = 0;
  for (let i = 1; i <= 7; i++) {
    rows.push(letters.slice(currentIdx, currentIdx + i));
    currentIdx += i;
  }

  return (
    <div className="flex flex-col items-center gap-1 scale-90 sm:scale-100 origin-top select-none">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((letter) => (
            <HexCell
              key={letter.id}
              label={letter.label}
              status={cells[letter.id]} // تحديد لون الخلية بناءً على الفريق المستولي عليها
              onClick={() => onCellClick(letter)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PyramidGrid;
