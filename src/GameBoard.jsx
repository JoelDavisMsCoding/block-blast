import React from 'react';
import './GameBoard.css';

const GameBoard = ({ board, onDropPiece }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`cell ${cell ? 'filled' : ''}`}
            onDragOver={(e) => e.preventDefault()} // allow dropping
            onDrop={() => onDropPiece(rowIndex, colIndex)} // drop target
          />
        ))
      )}
    </div>
  );
};

export default GameBoard;
