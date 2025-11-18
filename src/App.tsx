/**
 * 主应用组件
 * 负责渲染整个象棋应用界面，包括棋盘、控制选项和游戏信息面板
 */
import React, { useEffect } from "react";
import Board from "./Board/Board";
import BoardOptions from "./Board/BoardOptions";
import BoardInfo from "./BoardInfo/BoardInfo";
import NotificationModal from "./BoardInfo/NotificationModal";
import { useGameStore } from "./store/gameStore";

function App() {
  // 从 Zustand store 获取游戏状态和方法
  const {
    squares,
    error,
    gameOver,
    currentTurn,
    handleGenerateFEN,
    handleInit,
    handleFlipBoard,
    handleCloseNotificationModal,
    checkGameOver,
  } = useGameStore();

  // 组件挂载时初始化游戏
  useEffect(() => {
    handleInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当棋盘状态或当前回合改变时，更新 FEN 并检查游戏是否结束
  useEffect(() => {
    handleGenerateFEN();
    checkGameOver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squares, currentTurn]);

  return (
    <div>
      {/* 通知模态框：显示错误信息或游戏结束提示 */}
      <NotificationModal
        handleCloseNotificationModal={handleCloseNotificationModal}
        error={error}
        gameOver={gameOver}
        currentTurn={currentTurn}
      />
      
      {/* 应用头部：显示标题和控制选项 */}
      <div className={`app__header ${error || gameOver ? "disabled" : ""}`}>
        <h1 className={currentTurn === "red" ? "red" : "black"}>
          Xiang Qi App
        </h1>
        <BoardOptions
          handleFlipBoard={handleFlipBoard}
          handleInit={handleInit}
        />
      </div>
      
      {/* 主容器：棋盘和游戏信息面板 */}
      <div className={`app__container ${error ? "disabled" : ""}`}>
        <Board squares={squares} />
        <BoardInfo />
      </div>
    </div>
  );
}

export default App;
