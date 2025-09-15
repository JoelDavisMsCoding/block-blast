import React from "react";
import "./GameBoard.css";

function getTopLeftOffset(shape) {
  let top = null, left = null;
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
  dragSource,
}) {
  function getGhostCells() {
    if (!hoverCoords || !currentPiece) return [];
    const [hoverRow, hoverCol] = hoverCoords;
    const [topOffset, leftOffset] = getTopLeftOffset(currentPiece.shape);
    const baseRow = hoverRow - topOffset;
    const baseCol = hoverCol - leftOffset;

    if (!canPlacePieceAt(baseRow, baseCol, currentPiece)) return [];

    const coords = [];
    currentPiece.shape.forEach((row, i) =>
      row.forEach((val, j) => {
        if (val === 1) coords.push([baseRow + i, baseCol + j]);
      })
    );
    return coords;
  }

  const ghostCells = getGhostCells();

  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const cellClasses = ["cell"];
          let cellStyle = {};

          if (cell < 0) {
            cellClasses.push("exploding", `color-${Math.abs(cell)}`);
          } else if (cell > 0) {
            cellClasses.push("filled", `color-${cell}`);
          } else if (
            ghostCells.some(([r, c]) => r === rowIndex && c === colIndex)
          ) {
            cellClasses.push("ghost", `ghost-color-${currentPiece.colorId}`);
          }

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cellClasses.join(" ")}
              data-row={rowIndex}
              data-col={colIndex}
              style={cellStyle}
              onDragOver={(e) => {
                e.preventDefault();
                setHoverCoords([rowIndex, colIndex]);
              }}
              onDrop={() => onDropPiece(rowIndex, colIndex)}
            />
          );
        })
      )}

      {/* 👉 Ghost overlay container (only in touch mode) */}
      {dragSource === "touch" && ghostCells.length > 0 && (
        <div className="ghost-container touch">
          {ghostCells.map(([r, c]) => (
            <div
              key={`${r}-${c}`}
              className={`cell ghost ghost-color-${currentPiece.colorId}`}
              style={{
                gridRowStart: r + 1,
                gridColumnStart: c + 1,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GameBoard;
