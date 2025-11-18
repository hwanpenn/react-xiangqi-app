/**
 * 游戏信息面板组件
 * 显示被吃掉的棋子、走子历史、FEN 生成器和解析器
 */
import React from "react";
import MoveList from "./MoveList";
import FENGenerator from "./FENGenerator";
import FENParser from "./FENParser";
import CapturedPiece from "./CapturedPiece";

export default function BoardInfo() {
  return (
    <div className="board-info">
      {/* 被吃掉的棋子显示区域 */}
      <div className="captured-piece__container">
        <CapturedPiece color={"red"} />
        <MoveList />
        <CapturedPiece color={"black"} />
      </div>
      
      {/* FEN 生成器：将当前局面转换为 FEN 字符串 */}
      <div className="FEN-generator__container">
        <FENGenerator />
      </div>
      
      {/* FEN 解析器：从 FEN 字符串加载局面 */}
      <div className="FEN-parser__container">
        <FENParser />
      </div>
    </div>
  );
}
