import React, { useState } from "react";
import GameBoard from "./GameBoard";
import { pieces } from "./pieces";
import "./GameBoard.css";

function App() {
  const emptyBoard = Array(8)
    .fill()
    .map(() => Array(8).fill(0));

  const [score, setScore] = useState(0);
  const [board, setBoard] = useState(emptyBoard);
  const [availablePieces, setAvailablePieces] = useState(generateThreePieces());
  const [isDragging, setIsDragging] = useState(false);
  const [hoverCoords, setHoverCoords] = useState(null);
  const [draggedPieceIndex, setDraggedPieceIndex] = useState(null);

  function generateRandomPiece() {
    const shape = pieces[Math.floor(Math.random() * pieces.length)];
    const colorId = Math.floor(Math.random() * 6) + 1; // 🎨 pick 1–6
    return { shape, colorId };
  }

  function generateThreePieces() {
    return [generateRandomPiece(), generateRandomPiece(), generateRandomPiece()];
  }

  function canPlacePieceAt(row, col, piece) {
    if (!piece) return false;

    const { shape } = piece;
    const rows = shape.length;
    const cols = shape[0].length;

    if (row + rows > 8 || col + cols > 8) return false;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (shape[i][j] === 1 && board[row + i][col + j] !== 0) {
          return false;
        }
      }
    }
    return true;
  }

  function placePiece(row, col, piece) {
    const newBoard = board.map((r) => [...r]);
    const { shape, colorId } = piece;
    const rows = shape.length;
    const cols = shape[0].length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (shape[i][j] === 1) {
          newBoard[row + i][col + j] = colorId; // 🎨 piece keeps its own color
        }
      }
    }
    return clearLines(newBoard);
  }

  function onDropPiece(row, col) {
    if (draggedPieceIndex === null) return;

    const piece = availablePieces[draggedPieceIndex];
    if (canPlacePieceAt(row, col, piece)) {
      const newBoard = placePiece(row, col, piece);

      const placedCells = piece.shape.flat().filter((v) => v === 1).length;
      const cleared = countClearedLines(board, newBoard);
      const points = placedCells * 10 + cleared * 100;

      setScore((prev) => prev + points);
      setBoard(newBoard);

      const updatedPieces = [...availablePieces];
      updatedPieces[draggedPieceIndex] = null;

      if (updatedPieces.every((p) => p === null)) {
        setAvailablePieces(generateThreePieces());
      } else {
        setAvailablePieces(updatedPieces);
      }

      setIsDragging(false);
      setDraggedPieceIndex(null);
      setHoverCoords(null);
    }
  }

  function clearLines(board) {
    const newBoard = board.map((r) => [...r]);

    // Clear full rows
    for (let i = 0; i < 8; i++) {
      if (newBoard[i].every((cell) => cell !== 0)) {
        newBoard[i] = Array(8).fill(0);
      }
    }

    // Clear full columns
    for (let j = 0; j < 8; j++) {
      if (newBoard.every((row) => row[j] !== 0)) {
        for (let i = 0; i < 8; i++) {
          newBoard[i][j] = 0;
        }
      }
    }

    return newBoard;
  }

  function countClearedLines(oldBoard, newBoard) {
    let cleared = 0;

    // Rows
    for (let i = 0; i < 8; i++) {
      const oldRow = oldBoard[i].join("");
      const newRow = newBoard[i].join("");
      if (oldRow !== newRow && newRow === "00000000") {
        cleared++;
      }
    }

    // Columns
    for (let j = 0; j < 8; j++) {
      const oldCol = oldBoard.map((row) => row[j]).join("");
      const newCol = newBoard.map((row) => row[j]).join("");
      if (oldCol !== newCol && newCol === "00000000") {
        cleared++;
      }
    }

    return cleared;
  }

  return (
    <div className="App">
      <h1 style={{ fontSize: "1.5rem", textAlign: "center" }}>🧱 Block Blast</h1>
      <h2 style={{ textAlign: "center" }}>Score: {score}</h2>

      <GameBoard
        board={board}
        onDropPiece={onDropPiece}
        canPlacePieceAt={canPlacePieceAt}
        hoverCoords={hoverCoords}
        setHoverCoords={setHoverCoords}
        currentPiece={
          draggedPieceIndex !== null ? availablePieces[draggedPieceIndex] : null
        }
      />

      <h3 style={{ textAlign: "center" }}>Available Pieces:</h3>
      <div
        className="pieces-container"
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "center",
        }}
      >
        {availablePieces.map((piece, index) =>
          piece ? (
            <div
              key={index}
              draggable
              onDragStart={() => {
                setIsDragging(true);
                setDraggedPieceIndex(index);
              }}
              onDragEnd={() => {
                setIsDragging(false);
                setDraggedPieceIndex(null);
                setHoverCoords(null);
              }}
              className="available-piece"
              style={{
                gridTemplateRows: `repeat(${piece.shape.length}, var(--cell-size))`,
                gridTemplateColumns: `repeat(${piece.shape[0].length}, var(--cell-size))`,
              }}
            >
              {piece.shape.map((row, i) =>
                row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`cell ${cell === 1 ? `filled color-${piece.colorId}` : ""}`}
                    style={{
                      visibility: cell === 1 ? "visible" : "hidden",
                    }}
                  />
                ))
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default App;