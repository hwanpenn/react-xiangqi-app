/**
 * 走子历史列表组件
 * 显示游戏中的走子历史记录
 */
import React from 'react';
import { useGameStore } from '../store/gameStore';
import type { MoveHistory } from '../types';

/**
 * 将棋子类型转换为中文显示名称
 */
const getPieceName = (piece: string | null | undefined): string => {
  if (!piece) return '';
  const pieceMap: Record<string, string> = {
    'king': '将',
    'advisor': '士',
    'bishop': '象',
    'knight': '马',
    'rook': '车',
    'cannon': '炮',
    'pawn': '兵',
  };
  return pieceMap[piece] || piece;
};

/**
 * 将行列坐标转换为中文坐标表示
 */
const getPositionName = (row: number, column: number): string => {
  const columnNames = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  return `${columnNames[column]}${row}`;
};

/**
 * 格式化走子记录显示
 */
const formatMove = (move: MoveHistory): string => {
  const pieceName = getPieceName(move.piece || null);
  const fromPos = getPositionName(move.fromRow, move.fromColumn);
  const toPos = getPositionName(move.toRow, move.toColumn);
  const capture = move.capturedPiece ? `吃${getPieceName(move.capturedPiece)}` : '';
  const colorName = move.color === 'red' ? '红' : '黑';
  return `${colorName}${pieceName}${fromPos}→${toPos}${capture}`;
};

export default function MoveList() {
  const { moveHistory } = useGameStore();

  return (
    <div>
      <h3>走子历史</h3>
      <div className="move-list-container">
        {moveHistory.length === 0 ? (
          <div className="move-list-empty">暂无走子记录</div>
        ) : (
          <div className="move-list">
            {moveHistory.map((move, index) => (
              <div key={index} className="move-item">
                <span className="move-number">{index + 1}.</span>
                <span className={`move-text ${move.color === 'red' ? 'move-red' : 'move-black'}`}>
                  {formatMove(move)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
