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
  const [gameOver, setGameOver] = useState(false);

  function generateRandomPiece() {
    const shape = pieces[Math.floor(Math.random() * pieces.length)];
    const colorId = Math.floor(Math.random() * 6) + 1;
    return { shape, colorId };
  }

  function generateThreePieces() {
    return [generateRandomPiece(), generateRandomPiece(), generateRandomPiece()];
  }

  function canPlacePieceAt(row, col, piece) {
    if (!piece || !piece.shape) return false;

    const { shape } = piece;
    const rows = shape.length;
    const cols = shape[0].length;

    // ✅ Quick rejection if piece doesn't fit on board
    if (row < 0 || col < 0 || row + rows > 8 || col + cols > 8) {
      return false;
    }

    // ✅ Check each cell in the piece
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (shape[i][j] === 1 && board[row + i][col + j] !== 0) {
          return false; // Overlap with filled cell
        }
      }
    }

    return true; // ✅ Valid placement
  }


  function placePiece(row, col, piece) {
    const newBoard = board.map((r) => [...r]);
    const { shape, colorId } = piece;
    const rows = shape.length;
    const cols = shape[0].length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (shape[i][j] === 1) {
          newBoard[row + i][col + j] = colorId;
        }
      }
    }
    clearLinesAnimated(newBoard, setBoard, (finalBoard) => {
      setBoard(finalBoard);
    });
    return newBoard;
  }

  function onDropPiece(row, col) {
    if (draggedPieceIndex === null) return;

    const piece = availablePieces[draggedPieceIndex];

    // ✅ Safety check
    if (!piece || !canPlacePieceAt(row, col, piece)) {
      return;
    }

    // Place the piece on the board
    const newBoard = placePiece(row, col, piece);

    // Scoring
    const placedCells = piece.shape.flat().filter((v) => v === 1).length;
    const cleared = countClearedLines(board, newBoard);
    const points = placedCells * 10 + cleared * 100;
    setScore((prev) => prev + points);

    // Update pieces: remove the one just placed
    const updatedPieces = [...availablePieces];
    updatedPieces[draggedPieceIndex] = null;
    setAvailablePieces(updatedPieces);

    // Reset drag state
    setIsDragging(false);
    setDraggedPieceIndex(null);
    setHoverCoords(null);
    setBoard(newBoard);

    // --- 🔑 Game over check ---
    // 1. If there are still pieces left, check them
    if (updatedPieces.some((p) => p)) {
      if (!hasValidMoves(newBoard, updatedPieces)) {
        triggerGameOver(newBoard);
      }
      return;
    }

    // 2. If all 3 pieces were used, generate a new set
    const newPieces = generateThreePieces();
    setAvailablePieces(newPieces);

    // 3. Immediately check if new pieces are playable
    if (!hasValidMoves(newBoard, newPieces)) {
      triggerGameOver(newBoard);
    }
  }


  function clearLinesAnimated(startBoard, setBoard, onFinish) {
    const newBoard = startBoard.map((r) => [...r]);
    let cellsToClear = [];

    for (let i = 0; i < 8; i++) {
      if (newBoard[i].every((cell) => cell !== 0)) {
        for (let j = 0; j < 8; j++) {
          cellsToClear.push([i, j, newBoard[i][j]]);
        }
      }
    }

    for (let j = 0; j < 8; j++) {
      if (newBoard.every((row) => row[j] !== 0)) {
        for (let i = 0; i < 8; i++) {
          cellsToClear.push([i, j, newBoard[i][j]]);
        }
      }
    }

    if (cellsToClear.length === 0) {
      onFinish(newBoard);
      return;
    }

    let index = 0;

    function clearNext() {
      if (index >= cellsToClear.length) {
        onFinish(newBoard);
        return;
      }

      const [r, c, colorId] = cellsToClear[index];
      newBoard[r][c] = -Math.abs(colorId);
      setBoard(newBoard.map((row) => [...row]));

      setTimeout(() => {
        newBoard[r][c] = 0;
        setBoard(newBoard.map((row) => [...row]));
        index++;
        clearNext();
      }, 250);
    }
    clearNext();
  }

  function explodeBoardAnimated(startBoard, setBoard, onFinish) {
    const cells = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (startBoard[i][j] !== 0) {
          cells.push([i, j, startBoard[i][j]]);
        }
      }
    }

    let index = 0;
    function explodeNext() {
      if (index >= cells.length) {
        onFinish();
        return;
      }
      const [r, c, colorId] = cells[index];
      startBoard[r][c] = -Math.abs(colorId);
      setBoard(startBoard.map((row) => [...row]));

      setTimeout(() => {
        startBoard[r][c] = 0;
        setBoard(startBoard.map((row) => [...row]));
        index++;
        explodeNext();
      }, 100);
    }
    explodeNext();
  }

  function triggerGameOver(currentBoard) {
    setGameOver(true);
    setTimeout(() => {
      explodeBoardAnimated(currentBoard, setBoard, () => {
        setBoard(emptyBoard);
        setScore(0);
        setAvailablePieces(generateThreePieces());
        setGameOver(false);
      });
    }, 500);
  }

  function countClearedLines(oldBoard, newBoard) {
    let cleared = 0;

    for (let i = 0; i < 8; i++) {
      const oldRow = oldBoard[i].join("");
      const newRow = newBoard[i].join("");
      if (oldRow !== newRow && newRow === "00000000") {
        cleared++;
      }
    }

    for (let j = 0; j < 8; j++) {
      const oldCol = oldBoard.map((row) => row[j]).join("");
      const newCol = newBoard.map((row) => row[j]).join("");
      if (oldCol !== newCol && newCol === "00000000") {
        cleared++;
      }
    }
    return cleared;
  }

  function hasValidMoves(currentBoard, piecesList) {
    if (!Array.isArray(piecesList)) return false;

    for (const piece of piecesList) {
      if (!piece || !piece.shape) continue; // ✅ skip null or broken pieces

      const rows = piece.shape.length;
      const cols = piece.shape[0].length;

      // Loop through all possible board positions
      for (let row = 0; row <= 8 - rows; row++) {
        for (let col = 0; col <= 8 - cols; col++) {
          if (canPlacePieceAt(row, col, piece)) {
            return true; // ✅ Found at least one valid move
          }
        }
      }
    }

    return false; // No moves for any piece
  }


  return (
    <div className="App">
      <h1 style={{ fontSize: "1.5rem", textAlign: "center" }}>🧱 Block Blast</h1>
      <h2 style={{ textAlign: "center" }}>Score: {score}</h2>

      {gameOver && (
        <h2 style={{ textAlign: "center", color: "red" }}>Game Over!</h2>
      )}

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
                    className={`cell ${
                      cell === 1 ? `filled color-${piece.colorId}` : ""
                    }`}
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
