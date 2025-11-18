import type { Square, ColorType } from './types';

function addAvailableSqrId(ary: string[], row: number, column: number): void {
  ary.push(`${row}-${column}`);
}

const palace = {
  redRow: [1, 2, 3],
  blackRow: [10, 9, 8],
  column: [4, 5, 6],
};

export function pawn(color: ColorType, row: number, column: number): string[] {
  const availableSqrId: string[] = [];
  if (color === "red") {
    if (row >= 4 && row <= 9) {
      addAvailableSqrId(availableSqrId, row + 1, column);
    }
    if (row >= 6 && column > 1) {
      addAvailableSqrId(availableSqrId, row, column - 1);
    }
    if (row >= 6 && column < 9) {
      addAvailableSqrId(availableSqrId, row, column + 1);
    }
  } else if (color === "black") {
    if (row <= 7 && row >= 2) {
      addAvailableSqrId(availableSqrId, row - 1, column);
    }
    if (row <= 5 && column > 1) {
      addAvailableSqrId(availableSqrId, row, column - 1);
    }
    if (row <= 5 && column < 9) {
      addAvailableSqrId(availableSqrId, row, column + 1);
    }
  }
  return availableSqrId;
}

export function advisor(color: ColorType, row: number, column: number): string[] {
  const availableSqrId: string[] = [];
  if (color === "red") {
    if (palace.redRow.includes(row + 1)) {
      if (palace.column.includes(column + 1)) {
        addAvailableSqrId(availableSqrId, row + 1, column + 1);
      }
      if (palace.column.includes(column - 1)) {
        addAvailableSqrId(availableSqrId, row + 1, column - 1);
      }
    }
    if (palace.redRow.includes(row - 1)) {
      if (palace.column.includes(column + 1)) {
        addAvailableSqrId(availableSqrId, row - 1, column + 1);
      }
      if (palace.column.includes(column - 1)) {
        addAvailableSqrId(availableSqrId, row - 1, column - 1);
      }
    }
  } else if (color === "black") {
    if (palace.blackRow.includes(row + 1)) {
      if (palace.column.includes(column + 1)) {
        addAvailableSqrId(availableSqrId, row + 1, column + 1);
      }
      if (palace.column.includes(column - 1)) {
        addAvailableSqrId(availableSqrId, row + 1, column - 1);
      }
    }
    if (palace.blackRow.includes(row - 1)) {
      if (palace.column.includes(column + 1)) {
        addAvailableSqrId(availableSqrId, row - 1, column + 1);
      }
      if (palace.column.includes(column - 1)) {
        addAvailableSqrId(availableSqrId, row - 1, column - 1);
      }
    }
  }
  return availableSqrId;
}

export function bishop(sqr: Square[], color: ColorType, row: number, column: number): string[] {
  const availableSqrId: string[] = [];
  if (color === "red") {
    if (row < 5) {
      const topLeftObstacle = sqr.find(
        (s) => s.id === `${row + 1}-${column - 1}`
      );
      const topRightObstacle = sqr.find(
        (s) => s.id === `${row + 1}-${column + 1}`
      );
      if (column !== 1 && topLeftObstacle && topLeftObstacle.piece === null) {
        addAvailableSqrId(availableSqrId, row + 2, column - 2);
      }
      if (column !== 9 && topRightObstacle && topRightObstacle.piece === null) {
        addAvailableSqrId(availableSqrId, row + 2, column + 2);
      }
    }
    if (row > 1) {
      const bottomLeftObstacle = sqr.find(
        (s) => s.id === `${row - 1}-${column - 1}`
      );
      const bottomRightObstacle = sqr.find(
        (s) => s.id === `${row - 1}-${column + 1}`
      );
      if (column !== 1 && bottomLeftObstacle && bottomLeftObstacle.piece === null) {
        addAvailableSqrId(availableSqrId, row - 2, column - 2);
      }
      if (column !== 9 && bottomRightObstacle && bottomRightObstacle.piece === null) {
        addAvailableSqrId(availableSqrId, row - 2, column + 2);
      }
    }
  } else if (color === "black") {
    if (row < 10) {
      const topLeftObstacle = sqr.find(
        (s) => s.id === `${row + 1}-${column - 1}`
      );
      const topRightObstacle = sqr.find(
        (s) => s.id === `${row + 1}-${column + 1}`
      );
      if (column !== 1 && topLeftObstacle && topLeftObstacle.piece === null) {
        addAvailableSqrId(availableSqrId, row + 2, column - 2);
      }
      if (column !== 9 && topRightObstacle && topRightObstacle.piece === null) {
        addAvailableSqrId(availableSqrId, row + 2, column + 2);
      }
    }
    if (row > 6) {
      const bottomLeftObstacle = sqr.find(
        (s) => s.id === `${row - 1}-${column - 1}`
      );
      const bottomRightObstacle = sqr.find(
        (s) => s.id === `${row - 1}-${column + 1}`
      );
      if (column !== 1 && bottomLeftObstacle && bottomLeftObstacle.piece === null) {
        addAvailableSqrId(availableSqrId, row - 2, column - 2);
      }
      if (column !== 9 && bottomRightObstacle && bottomRightObstacle.piece === null) {
        addAvailableSqrId(availableSqrId, row - 2, column + 2);
      }
    }
  }
  return availableSqrId;
}

export function king(color: ColorType, row: number, column: number): string[] {
  const availableSqrId: string[] = [];
  if (column > 4) {
    addAvailableSqrId(availableSqrId, row, column - 1);
  }
  if (column < 6) {
    addAvailableSqrId(availableSqrId, row, column + 1);
  }
  if (color === "red") {
    if (row < 3) {
      addAvailableSqrId(availableSqrId, row + 1, column);
    }
    if (row > 1) {
      addAvailableSqrId(availableSqrId, row - 1, column);
    }
  } else if (color === "black") {
    if (row < 10) {
      addAvailableSqrId(availableSqrId, row + 1, column);
    }
    if (row > 8) {
      addAvailableSqrId(availableSqrId, row - 1, column);
    }
  }
  return availableSqrId;
}

export function rook(sqr: Square[], row: number, column: number): string[] {
  const availableSqrId: string[] = [];
  const horizontal = sqr.filter((s) => s.row === row);
  const vertical = sqr.filter((s) => s.column === column);
  
  if (row < 10) {
    const up = vertical
      .filter((s) => s.row > row)
      .sort((a, b) => a.row - b.row);
    const havePiece = up.filter((s) => s.piece !== null);
    if (havePiece.length !== 0) {
      for (let i = row + 1; i <= havePiece[0].row; i++) {
        addAvailableSqrId(availableSqrId, i, column);
      }
    } else {
      up.forEach((item) => {
        addAvailableSqrId(availableSqrId, item.row, item.column);
      });
    }
  }
  
  if (row > 1) {
    const down = vertical
      .filter((s) => s.row < row)
      .sort((a, b) => b.row - a.row);
    const havePiece = down.filter((s) => s.piece !== null);
    if (havePiece.length !== 0) {
      for (let i = row - 1; i >= havePiece[0].row; i--) {
        addAvailableSqrId(availableSqrId, i, column);
      }
    } else {
      down.forEach((item) => {
        addAvailableSqrId(availableSqrId, item.row, item.column);
      });
    }
  }
  
  if (column < 9) {
    const right = horizontal
      .filter((s) => s.column > column)
      .sort((a, b) => a.column - b.column);
    const havePiece = right.filter((s) => s.piece !== null);
    if (havePiece.length !== 0) {
      for (let i = column + 1; i <= havePiece[0].column; i++) {
        addAvailableSqrId(availableSqrId, row, i);
      }
    } else {
      right.forEach((item) => {
        addAvailableSqrId(availableSqrId, item.row, item.column);
      });
    }
  }
  
  if (column > 1) {
    const left = horizontal
      .filter((s) => s.column < column)
      .sort((a, b) => b.column - a.column);
    const havePiece = left.filter((s) => s.piece !== null);
    if (havePiece.length !== 0) {
      for (let i = column - 1; i >= havePiece[0].column; i--) {
        addAvailableSqrId(availableSqrId, row, i);
      }
    } else {
      left.forEach((item) => {
        addAvailableSqrId(availableSqrId, item.row, item.column);
      });
    }
  }
  
  return availableSqrId;
}

export function cannon(sqr: Square[], color: ColorType, row: number, column: number): string[] {
  const availableSqrId: string[] = [];
  const horizontalC = sqr.filter((s) => s.row === row);
  const verticalC = sqr.filter((s) => s.column === column);
  
  if (row < 10) {
    const up = verticalC
      .filter((s) => s.row > row)
      .sort((a, b) => a.row - b.row);
    const havePiece = up.filter((s) => s.piece !== null);
    if (havePiece.length !== 0) {
      for (let i = row + 1; i < havePiece[0].row; i++) {
        addAvailableSqrId(availableSqrId, i, column);
      }
      if (havePiece.length > 1) {
        if (havePiece[1].color !== color) {
          addAvailableSqrId(availableSqrId, havePiece[1].row, havePiece[1].column);
        }
      }
    } else {
      up.forEach((item) => {
        addAvailableSqrId(availableSqrId, item.row, item.column);
      });
    }
  }
  
  if (row > 1) {
    const down = verticalC
      .filter((s) => s.row < row)
      .sort((a, b) => b.row - a.row);
    const havePiece = down.filter((item) => item.piece !== null);
    if (havePiece.length !== 0) {
      for (let i = row - 1; i > havePiece[0].row; i--) {
        addAvailableSqrId(availableSqrId, i, column);
      }
      if (havePiece.length > 1) {
        if (havePiece[1].color !== color) {
          addAvailableSqrId(availableSqrId, havePiece[1].row, havePiece[1].column);
        }
      }
    } else {
      down.forEach((item) => {
        addAvailableSqrId(availableSqrId, item.row, item.column);
      });
    }
  }
  
  if (column < 9) {
    const right = horizontalC
      .filter((s) => s.column > column)
      .sort((a, b) => a.column - b.column);
    const havePiece = right.filter((s) => s.piece !== null);
    if (havePiece.length !== 0) {
      for (let i = column + 1; i < havePiece[0].column; i++) {
        addAvailableSqrId(availableSqrId, row, i);
      }
      if (havePiece.length > 1) {
        if (havePiece[1].color !== color) {
          addAvailableSqrId(availableSqrId, havePiece[1].row, havePiece[1].column);
        }
      }
    } else {
      right.forEach((item) => {
        addAvailableSqrId(availableSqrId, item.row, item.column);
      });
    }
  }
  
  if (column > 1) {
    const left = horizontalC
      .filter((s) => s.column < column)
      .sort((a, b) => b.column - a.column);
    const havePiece = left.filter((item) => item.piece !== null);
    if (havePiece.length !== 0) {
      for (let i = column - 1; i > havePiece[0].column; i--) {
        addAvailableSqrId(availableSqrId, row, i);
      }
      if (havePiece.length > 1) {
        if (havePiece[1].color !== color) {
          addAvailableSqrId(availableSqrId, havePiece[1].row, havePiece[1].column);
        }
      }
    } else {
      left.forEach((item) => {
        addAvailableSqrId(availableSqrId, item.row, item.column);
      });
    }
  }
  
  return availableSqrId;
}

export function knight(sqr: Square[], row: number, column: number): string[] {
  const availableSqrId: string[] = [];
  const upObstacle = sqr.find(s => s.id === `${row + 1}-${column}`);
  const downObstacle = sqr.find(s => s.id === `${row - 1}-${column}`);
  const leftObstacle = sqr.find(s => s.id === `${row}-${column - 1}`);
  const rightObstacle = sqr.find(s => s.id === `${row}-${column + 1}`);
  
  if (row < 9 && upObstacle && upObstacle.piece === null) {
    if (column > 1) {
      addAvailableSqrId(availableSqrId, row + 2, column - 1);
    }
    if (column < 9) {
      addAvailableSqrId(availableSqrId, row + 2, column + 1);
    }
  }
  
  if (row > 2 && downObstacle && downObstacle.piece === null) {
    if (column > 1) {
      addAvailableSqrId(availableSqrId, row - 2, column - 1);
    }
    if (column < 9) {
      addAvailableSqrId(availableSqrId, row - 2, column + 1);
    }
  }
  
  if (column > 2 && leftObstacle && leftObstacle.piece === null) {
    if (row > 1) {
      addAvailableSqrId(availableSqrId, row - 1, column - 2);
    }
    if (row < 10) {
      addAvailableSqrId(availableSqrId, row + 1, column - 2);
    }
  }
  
  if (column < 8 && rightObstacle && rightObstacle.piece === null) {
    if (row > 1) {
      addAvailableSqrId(availableSqrId, row - 1, column + 2);
    }
    if (row < 10) {
      addAvailableSqrId(availableSqrId, row + 1, column + 2);
    }
  }
  
  return availableSqrId;
}

export function checkDanger(sqr: Square[], color: ColorType, row: number, column: number): boolean | undefined {
  const vertical = sqr.filter(s => s.column === column);
  const horizontal = sqr.filter(s => s.row === row);
  
  // Threats from top
  if (row < 10) {
    const piecesAbove = vertical.filter(item => item.piece !== null && item.row > row);
    piecesAbove.sort((a, b) => a.row - b.row);
    if (piecesAbove.length > 0) {
      if (piecesAbove[0].color !== color) {
        if (piecesAbove[0].piece === 'rook' || piecesAbove[0].piece === 'king') {
          return true;
        }
        if (piecesAbove[0].piece === 'pawn') {
          if (color === 'red' && piecesAbove[0].row === row + 1) {
            return true;
          }
        }
      }
      if (piecesAbove.length > 1) {
        if (piecesAbove[1].color !== color) {
          if (piecesAbove[1].piece === 'cannon') {
            return true;
          }
        }
      }
    }
  }
  
  // Threats from bottom
  if (row > 1) {
    const piecesBelow = vertical.filter(item => item.piece !== null && item.row < row);
    piecesBelow.sort((a, b) => b.row - a.row);
    if (piecesBelow.length > 0) {
      if (piecesBelow[0].color !== color) {
        if (piecesBelow[0].piece === 'rook' || piecesBelow[0].piece === 'king') {
          return true;
        }
        if (piecesBelow[0].piece === 'pawn') {
          if (color === 'black' && piecesBelow[0].row === row - 1) {
            return true;
          }
        }
      }
      if (piecesBelow.length > 1) {
        if (piecesBelow[1].color !== color) {
          if (piecesBelow[1].piece === 'cannon') {
            return true;
          }
        }
      }
    }
  }
  
  // Threats from left
  if (column > 1) {
    const piecesLeft = horizontal.filter(item => item.piece !== null && item.column < column);
    piecesLeft.sort((a, b) => b.column - a.column);
    if (piecesLeft.length > 0) {
      if (piecesLeft[0].color !== color) {
        if (piecesLeft[0].piece === 'rook') {
          return true;
        }
        if (piecesLeft[0].piece === 'pawn') {
          if (piecesLeft[0].column === column - 1) {
            return true;
          }
        }
      }
      if (piecesLeft.length > 1) {
        if (piecesLeft[1].color !== color) {
          if (piecesLeft[1].piece === 'cannon') {
            return true;
          }
        }
      }
    }
  }
  
  // Threats from right
  if (column < 9) {
    const piecesRight = horizontal.filter(item => item.piece !== null && item.column > column);
    piecesRight.sort((a, b) => a.column - b.column);
    if (piecesRight.length > 0) {
      if (piecesRight[0].color !== color) {
        if (piecesRight[0].piece === 'rook') {
          return true;
        }
        if (piecesRight[0].piece === 'pawn') {
          if (piecesRight[0].column === column + 1) {
            return true;
          }
        }
      }
      if (piecesRight.length > 1) {
        if (piecesRight[1].color !== color) {
          if (piecesRight[1].piece === 'cannon') {
            return true;
          }
        }
      }
    }
  }
  
  // Threats from knight
  const topLeftObstacle = sqr.find(s => s.id === `${row + 1}-${column - 1}`);
  const bottomLeftObstacle = sqr.find(s => s.id === `${row - 1}-${column - 1}`);
  const topRightObstacle = sqr.find(s => s.id === `${row + 1}-${column + 1}`);
  const bottomRightObstacle = sqr.find(s => s.id === `${row - 1}-${column + 1}`);
  
  function checkKnightSquare(r: number, c: number): boolean {
    const target = sqr.find(s => s.id === `${r}-${c}`);
    if (target && target.piece === 'knight' && target.color !== color) {
      return true;
    }
    return false;
  }
  
  if (row < 9) {
    if (column > 1 && topLeftObstacle && topLeftObstacle.piece === null) {
      if (checkKnightSquare(row + 2, column - 1)) {
        return true;
      }
    }
    if (column < 9 && topRightObstacle && topRightObstacle.piece === null) {
      if (checkKnightSquare(row + 2, column + 1)) {
        return true;
      }
    }
  }
  
  if (row > 2) {
    if (column > 1 && bottomLeftObstacle && bottomLeftObstacle.piece === null) {
      if (checkKnightSquare(row - 2, column - 1)) {
        return true;
      }
    }
    if (column < 9 && bottomRightObstacle && bottomRightObstacle.piece === null) {
      if (checkKnightSquare(row - 2, column + 2)) {
        return true;
      }
    }
  }
  
  if (column > 2) {
    if (row < 10 && topLeftObstacle && topLeftObstacle.piece === null) {
      if (checkKnightSquare(row + 1, column - 2)) {
        return true;
      }
    }
    if (row > 1 && bottomLeftObstacle && bottomLeftObstacle.piece === null) {
      if (checkKnightSquare(row - 1, column - 2)) {
        return true;
      }
    }
  }
  
  if (column < 8) {
    if (row < 10 && topRightObstacle && topRightObstacle.piece === null) {
      if (checkKnightSquare(row + 1, column + 2)) {
        return true;
      }
    }
    if (row > 1 && bottomRightObstacle && bottomRightObstacle.piece === null) {
      if (checkKnightSquare(row - 1, column + 2)) {
        return true;
      }
    }
  }
  
  return undefined;
}

