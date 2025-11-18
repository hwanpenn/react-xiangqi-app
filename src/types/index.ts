export type PieceType = "pawn" | "advisor" | "bishop" | "king" | "rook" | "cannon" | "knight" | null;
export type ColorType = "red" | "black" | null;

export interface Square {
  id: string;
  piece: PieceType;
  color: ColorType;
  row: number;
  column: number;
  isAvailable: boolean;
  isPreviousMoved: boolean;
  isJustMoved: boolean;
  isSelected: boolean;
}

export interface GameState {
  squares: Square[];
  isFlipped: boolean;
  selectedSquareInfo: Square | null;
  availableSquares: Square[];
  counter: number;
  currentTurn: ColorType;
  capturedPieceList: Square[];
  FENOutput: string;
  error: boolean;
  gameOver: boolean;
}

