/**
 * 被吃掉棋子显示组件
 * 显示指定颜色（红方或黑方）被吃掉的棋子列表
 */
import React from 'react';
import Piece from '../Board/Piece';
import { useGameStore } from '../store/gameStore';
import type { ColorType } from '../types';

interface CapturedPieceProps {
  color: ColorType;
}

export default function CapturedPiece({ color }: CapturedPieceProps) {
  const { capturedPieceList } = useGameStore();
  
  // 过滤出指定颜色的被吃掉棋子
  const filteredList = capturedPieceList.filter(p => p.color === color);
  
  // 按棋子类型排序（用于更好的显示效果）
  filteredList.sort((a, b) => {
    const pieceA = a.piece || '';
    const pieceB = b.piece || '';
    return (pieceA > pieceB ? -1 : 1);
  });

  return (
    <div className='captured-piece-list__container'>
      {filteredList.map((p, index) => (
        <Piece pieceInfo={p} key={`${p.id}-${index}`} />
      ))}
    </div>
  );
}
