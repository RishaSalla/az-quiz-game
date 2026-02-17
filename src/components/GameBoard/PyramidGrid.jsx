import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import HexCell from './HexCell';

const PyramidGrid = ({ onCellClick }) => {
  const grid = useGameStore((state) => state.grid);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* رسم الهرم بناءً على الصفوف */}
      {[...Array(7)].map((_, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex justify-center -mt-3 md:-mt-4" // تداخل الخلايا لتشكيل النمط السداسي
        >
          {grid
            .filter((cell) => cell.row === rowIndex)
            .map((cell) => (
              <HexCell
                key={cell.id}
                cell={cell}
                onClick={() => onCellClick(cell)}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default PyramidGrid;
