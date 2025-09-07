import React, { useState, useEffect } from "react";
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

  // ---------- Piece Generation ----------
  function generateRandomPiece() {
    const shape = pieces[Math.floor(Math.random() * pieces.length)];
    const colorId = Math.floor(Math.random() * 6) + 1;
    return { shape, colorId };
  }

  function generateThreePieces() {
    return [generateRandomPiece(), generateRandomPiece(), generateRandomPiece()];
  }

  // ---------- Placement Logic ----------
  function canPlacePieceAt(row, col, piece) {
    if (!piece || !piece.shape) return false;

    const { shape } = piece;
    const rows = shape.length;
    const cols = shape[0].length;

    if (row < 0 || col < 0 || row + rows > 8 || col + cols > 8) {
      return false;
    }

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
          newBoard[row + i][col + j] = colorId;
        }
      }
    }
    return newBoard;
  }

  // ---------- Drop Piece ----------
  function onDropPiece(row, col) {
    if (draggedPieceIndex === null) return;
    const piece = availablePieces[draggedPieceIndex];
    if (!piece || !canPlacePieceAt(row, col, piece)) return;

    const placedBoard = placePiece(row, col, piece);

    // Score from placed cells
    const placedCells = piece.shape.flat().filter((v) => v === 1).length;
    setScore((prev) => prev + placedCells * 10);

    setIsDragging(false);
    setDraggedPieceIndex(null);
    setHoverCoords(null);

    // Clear lines
    clearLinesAnimated(placedBoard, setBoard, (finalBoard, clearedLines) => {
      if (clearedLines > 0) {
        setScore((prev) => prev + clearedLines * 100);
      }

      // Remove the used piece
      const updatedPieces = [...availablePieces];
      updatedPieces[draggedPieceIndex] = null;
      setAvailablePieces(updatedPieces);
    });
  }

  // ---------- Clear Lines Animation ----------
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
      setBoard(newBoard);
      onFinish(newBoard, 0);
      return;
    }

    let index = 0;
    function clearNext() {
      if (index >= cellsToClear.length) {
        onFinish(newBoard, 1);
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

  // ---------- Explode Board Animation ----------
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

  // ---------- Game Over ----------
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

  // ---------- Check for Valid Moves ----------
  function hasValidMoves(currentBoard, piecesList) {
    if (!Array.isArray(piecesList)) return false;

    for (const piece of piecesList) {
      if (!piece || !piece.shape) continue;
      const rows = piece.shape.length;
      const cols = piece.shape[0].length;

      for (let row = 0; row <= 8 - rows; row++) {
        for (let col = 0; col <= 8 - cols; col++) {
          if (canPlacePieceAt(row, col, piece)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // ---------- Auto-check Game Over ----------
  useEffect(() => {
    if (gameOver) return;

    const piecesExist = availablePieces.some((p) => p);
    if (piecesExist) {
      if (!hasValidMoves(board, availablePieces)) {
        triggerGameOver(board);
      }
    } else {
      const newPieces = generateThreePieces();
      setAvailablePieces(newPieces);

      if (!hasValidMoves(board, newPieces)) {
        triggerGameOver(board);
      }
    }
  }, [availablePieces, board, gameOver]);

  // ---------- Touch Handlers ----------
  function handleTouchStart(index) {
    setIsDragging(true);
    setDraggedPieceIndex(index);
  }

  function handleTouchEnd(e) {
    if (hoverCoords && draggedPieceIndex !== null) {
      const [row, col] = hoverCoords;
      onDropPiece(row, col);
    }
    setIsDragging(false);
    setDraggedPieceIndex(null);
    setHoverCoords(null);
  }

  // ---------- Render ----------
  return (
    <div className="App">
      <h1 style={{ fontSize: "2rem", textAlign: "center" }}>🧱 Block Blast</h1>
      <h2 style={{ fontSize: "2rem", textAlign: "center" }}>Score: {score}</h2>

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
              onTouchStart={() => handleTouchStart(index)}
              onTouchEnd={handleTouchEnd}
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