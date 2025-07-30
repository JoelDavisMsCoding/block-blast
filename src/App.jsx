import React, { useState } from 'react';
import GameBoard from './GameBoard';
import { pieces } from './pieces';
import './GameBoard.css';

function App() {
  const emptyBoard = Array(8).fill().map(() => Array(8).fill(0));
  const [score, setScore] = useState(0);
  const [board, setBoard] = useState(emptyBoard);
  const [currentPiece, setCurrentPiece] = useState(pieces[0]);
  const [isDragging, setIsDragging] = useState(false);

  function generatePiece() {
    const random = pieces[Math.floor(Math.random() * pieces.length)];
    setCurrentPiece(random);
  }

  function canPlacePieceAt(row, col, piece) {
    const rows = piece.length;
    const cols = piece[0].length;

    if (row + rows > 8 || col + cols > 8) return false;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (piece[i][j] === 1 && board[row + i][col + j] === 1) {
          return false;
        }
      }
    }

    return true;
  }

  function placePiece(row, col, piece) {
    const newBoard = board.map(r => [...r]);
    const rows = piece.length;
    const cols = piece[0].length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (piece[i][j] === 1) {
          newBoard[row + i][col + j] = 1;
        }
      }
    }

    return clearLines(newBoard);
  }

  function onDropPiece(row, col) {
  if (canPlacePieceAt(row, col, currentPiece)) {
    const newBoard = placePiece(row, col, currentPiece);

    const placedCells = currentPiece.flat().filter((v) => v === 1).length;
    const cleared = countClearedLines(board, newBoard);

    // Basic scoring:
    const points = placedCells * 10 + cleared * 100;

    setScore(prev => prev + points);
    setBoard(newBoard);
    generatePiece();
    setIsDragging(false);
  }
}


  function clearLines(board) {
    const newBoard = board.map(r => [...r]);

    for (let i = 0; i < 8; i++) {
      if (newBoard[i].every(cell => cell === 1)) {
        newBoard[i] = Array(8).fill(0);
      }
    }

    for (let j = 0; j < 8; j++) {
      if (newBoard.every(row => row[j] === 1)) {
        for (let i = 0; i < 8; i++) {
          newBoard[i][j] = 0;
        }
      }
    }
    return newBoard;
  }

  function countClearedLines(oldBoard, newBoard) {
    let cleared = 0;

    for (let i = 0; i < 8; i++) {
      const oldRow = oldBoard[i].join('');
      const newRow = newBoard[i].join('');
      if (oldRow !== newRow && newRow === '00000000') {
        cleared++;
      }
    }

    for (let j = 0; j < 8; j++) {
      const oldCol = oldBoard.map(row => row[j]).join('');
      const newCol = newBoard.map(row => row[j]).join('');
      if (oldCol !== newCol && newCol === '00000000') {
        cleared++;
      }
    }
    return cleared;
  }

  return (
    <div
      className="App"
      style={{
        padding: '10px',
        fontFamily: 'Arial',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', textAlign: 'center' }}>🧱 Block Blast</h1>
      <h2 style={{ textAlign: 'center' }}>Score: {score}</h2>

      <GameBoard board={board} onDropPiece={onDropPiece} />

      <h3>Current Piece:</h3>
      <div
        draggable
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        style={{
          display: 'inline-grid',
          gridTemplateColumns: `repeat(${currentPiece[0].length}, min(40px, 10vw))`,
          gap: '4px',
          marginBottom: '1rem',
          opacity: isDragging ? 0.5 : 1,
          cursor: 'grab',
        }}
      >
        {currentPiece.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`cell ${cell === 1 ? 'filled' : 'empty'}`}
            />
          ))
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={generatePiece}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#1976d2',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          🔁 New Piece
        </button>
      </div>
    </div>
  );

}

export default App;
