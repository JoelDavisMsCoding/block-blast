// GameBoard.jsx
import React from "react";
import "./GameBoard.css";

// Helper: find top-left filled cell of a piece
function getTopLeftOffset(shape) {
  let top = null;
  let left = null;

  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] === 1) {
        if (top === null || i < top) top = i;
        if (left === null || j < left) left = j;
      }
    }
  }

  return [top || 0, left || 0];
}

function GameBoard({
  board,
  onDropPiece,
  canPlacePieceAt,
  hoverCoords,
  setHoverCoords,
  currentPiece,
}) {
  function isGhostCell(r, c) {
    if (!hoverCoords || !currentPiece) return false;
    const [hoverRow, hoverCol] = hoverCoords;
    const shape = currentPiece.shape;
    const [topOffset, leftOffset] = getTopLeftOffset(shape);
    const baseRow = hoverRow - topOffset;
    const baseCol = hoverCol - leftOffset;

    if (!canPlacePieceAt(baseRow, baseCol, currentPiece)) return false;

    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (
          shape[i][j] === 1 &&
          r === baseRow + i &&
          c === baseCol + j
        ) {
          return true;
        }
      }
    }
    return false;
  }

  function handleDrop(r, c) {
    if (!currentPiece) return;
    const [topOffset, leftOffset] = getTopLeftOffset(currentPiece.shape);
    const dropRow = r - topOffset;
    const dropCol = c - leftOffset;

    onDropPiece(dropRow, dropCol);
  }

  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const cellClasses = ["cell"];

          if (cell < 0) {
            cellClasses.push("exploding", `color-${Math.abs(cell)}`);
          } else if (cell > 0) {
            cellClasses.push("filled", `color-${cell}`);
          } else if (isGhostCell(rowIndex, colIndex)) {
            cellClasses.push("ghost", `ghost-color-${currentPiece.colorId}`);
          }

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cellClasses.join(" ")}
              onDragOver={(e) => {
                e.preventDefault();
                if (
                  !hoverCoords ||
                  hoverCoords[0] !== rowIndex ||
                  hoverCoords[1] !== colIndex
                ) {
                  setHoverCoords([rowIndex, colIndex]);
                }
              }}
              onDrop={() => handleDrop(rowIndex, colIndex)}
            />
          );
        })
      )}
    </div>
  );
}

export default GameBoard;
