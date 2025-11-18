import React from "react";
import Square from "./Square";
import type { Square as SquareType } from '../types';

interface BoardProps {
  squares: SquareType[];
}

export default function Board({ squares }: BoardProps) {
  return (
    <div className="board">
      <Square squares={squares} />
    </div>
  );
}

