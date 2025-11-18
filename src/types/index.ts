/**
 * 类型定义文件
 * 定义整个应用使用的 TypeScript 类型和接口
 */

/** 棋子类型 */
export type PieceType = "pawn" | "advisor" | "bishop" | "king" | "rook" | "cannon" | "knight" | null;

/** 棋子颜色类型 */
export type ColorType = "red" | "black" | null;

/**
 * 棋盘格子接口
 * 表示棋盘上的一个格子及其状态
 */
export interface Square {
  id: string;                    // 唯一标识符，格式："{row}-{column}"
  piece: PieceType;              // 棋子类型
  color: ColorType;              // 棋子颜色
  row: number;                   // 行号（1-10）
  column: number;                // 列号（1-9）
  isAvailable: boolean;         // 是否为可移动目标
  isPreviousMoved: boolean;      // 是否为上次移动的起始位置
  isJustMoved: boolean;          // 是否为刚刚移动的目标位置
  isSelected: boolean;           // 是否被选中
}

/**
 * 走子历史记录接口
 */
export interface MoveHistory {
  moveNumber: number;            // 走子序号
  color: ColorType;              // 走子方颜色
  piece: PieceType;              // 棋子类型
  fromRow: number;               // 起始行
  fromColumn: number;            // 起始列
  toRow: number;                 // 目标行
  toColumn: number;              // 目标列
  capturedPiece?: PieceType;     // 被吃的棋子（如果有）
}

/**
 * 游戏状态接口
 * 包含整个游戏的所有状态信息
 */
export interface GameState {
  squares: Square[];             // 所有棋盘格子
  isFlipped: boolean;            // 棋盘是否已翻转
  selectedSquareInfo: Square | null;  // 当前选中的格子信息
  availableSquares: Square[];    // 当前可移动的目标格子列表
  counter: number;               // 点击计数器（用于判断是选择还是移动）
  currentTurn: ColorType;        // 当前回合方
  capturedPieceList: Square[];   // 被吃掉的棋子列表
  moveHistory: MoveHistory[];    // 走子历史记录
  FENOutput: string;            // 当前局面的 FEN 字符串
  error: boolean;               // 是否有错误
  gameOver: boolean;            // 游戏是否结束
}
