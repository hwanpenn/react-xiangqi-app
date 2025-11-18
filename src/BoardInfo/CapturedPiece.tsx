import React from 'react';
import Piece from '../Board/Piece';
import { useGameStore } from '../store/gameStore';
import type { ColorType } from '../types';

interface CapturedPieceProps {
  color: ColorType;
}

export default function CapturedPiece({ color }: CapturedPieceProps) {
  const { capturedPieceList } = useGameStore();
  const filteredList = capturedPieceList.filter(p => p.color === color);
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

