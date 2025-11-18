/**
 * 游戏信息面板组件
 * 显示被吃掉的棋子
 */
import React from "react";
import CapturedPiece from "./CapturedPiece";

export default function BoardInfo() {
  return (
    <div className="board-info">
      {/* 被吃掉的棋子显示区域 */}
      <div className="captured-piece__container">
        <CapturedPiece color={"red"} />
        <CapturedPiece color={"black"} />
      </div>
    </div>
  );
}
