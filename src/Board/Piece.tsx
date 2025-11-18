import React from 'react';
import type { Square } from '../types';

// Import images
import redKing from '../images/red_king.svg';
import redRook from '../images/red_rook.svg';
import redKnight from '../images/red_knight.svg';
import redCannon from '../images/red_cannon.svg';
import redAdvisor from '../images/red_advisor.svg';
import redBishop from '../images/red_bishop.svg';
import redPawn from '../images/red_pawn.svg';
import blackKing from '../images/black_king.svg';
import blackRook from '../images/black_rook.svg';
import blackKnight from '../images/black_knight.svg';
import blackCannon from '../images/black_cannon.svg';
import blackAdvisor from '../images/black_advisor.svg';
import blackBishop from '../images/black_bishop.svg';
import blackPawn from '../images/black_pawn.svg';

const pieceImages: Record<string, string> = {
  'red_king': redKing,
  'red_rook': redRook,
  'red_knight': redKnight,
  'red_cannon': redCannon,
  'red_advisor': redAdvisor,
  'red_bishop': redBishop,
  'red_pawn': redPawn,
  'black_king': blackKing,
  'black_rook': blackRook,
  'black_knight': blackKnight,
  'black_cannon': blackCannon,
  'black_advisor': blackAdvisor,
  'black_bishop': blackBishop,
  'black_pawn': blackPawn,
};

interface PieceProps {
  pieceInfo: Square;
}

export default function Piece({ pieceInfo }: PieceProps) {
  if (!pieceInfo.piece || !pieceInfo.color) return null;
  
  const imageKey = `${pieceInfo.color}_${pieceInfo.piece}`;
  const imageSrc = pieceImages[imageKey];
  
  return (
    <img
      className="piece"
      src={imageSrc}
      alt={imageKey}
      draggable={true}
    />
  );
}

