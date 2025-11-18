/**
 * 棋盘格子组件
 * 渲染所有90个格子，处理点击事件并显示棋子
 */
import React from 'react';
import Piece from './Piece';
import { useGameStore } from '../store/gameStore';
import type { Square as SquareType } from '../types';

interface SquareProps {
  squares: SquareType[];
}

export default function Square({ squares }: SquareProps) {
  const { handleMovePiece } = useGameStore();

  // 渲染所有格子
  const sqr = squares.map((sq) => {
    return (
      <div
        className={`square ${sq.isAvailable ? "square__available" : ""} ${sq.isSelected || sq.isJustMoved || sq.isPreviousMoved ? "square__selected" : ""}`}
        data-row={sq.row}
        data-column={sq.column}
        key={sq.id}
        onClick={() => handleMovePiece(sq.piece, sq.color, sq.row, sq.column)}
      >
        {sq.piece !== null && <Piece pieceInfo={sq} />}
      </div>
    );
  });

  return <>{sqr}</>;
}
