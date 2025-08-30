// GameBoard.jsx
import React from "react";
import "./GameBoard.css";

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
    const [baseRow, baseCol] = hoverCoords;

    if (!canPlacePieceAt(baseRow, baseCol, currentPiece)) return false;

    for (let i = 0; i < currentPiece.length; i++) {
      for (let j = 0; j < currentPiece[i].length; j++) {
        if (
          currentPiece[i][j] === 1 &&
          r === baseRow + i &&
          c === baseCol + j
        ) {
          return true;
        }
      }
    }
    return false;
  }

  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const cellClasses = ["cell"];

          if (cell !== 0) {
            cellClasses.push("filled", `color-${cell}`);
          } else if (isGhostCell(rowIndex, colIndex)) {
            cellClasses.push("ghost");
          }

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cellClasses.join(" ")}
              onDragOver={(e) => {
                e.preventDefault();
                if (!hoverCoords || hoverCoords[0] !== rowIndex || hoverCoords[1] !== colIndex) {
                  setHoverCoords([rowIndex, colIndex]);
                }
              }}

              onDrop={() => {
                if (hoverCoords && currentPiece) {
                  const [r, c] = hoverCoords;
                  onDropPiece(r, c);
                }
              }}
            />
          );
        })
      )}
    </div>
  );
}

export default GameBoard;
