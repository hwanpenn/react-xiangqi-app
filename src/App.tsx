/**
 * 主应用组件
 * 负责渲染整个象棋应用界面，包括棋盘、控制选项和游戏信息面板
 */
import { useEffect } from "react";
import Board from "./Board/Board";
import BoardOptions from "./Board/BoardOptions";
import BoardInfo from "./BoardInfo/BoardInfo";
import MoveList from "./BoardInfo/MoveList";
import FENGenerator from "./BoardInfo/FENGenerator";
import FENParser from "./BoardInfo/FENParser";
import NotificationModal from "./BoardInfo/NotificationModal";
import TrainingMonitorSSE from "./components/TrainingMonitorSSE";
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
      
      {/* 应用头部：显示标题 */}
      <div className={`app__header ${error || gameOver ? "disabled" : ""}`}>
        <h1 className={currentTurn === "red" ? "red" : "black"}>
          中国象棋{currentTurn === "red" ? "（红方持棋）" : "（黑方持棋）"}
        </h1>
      </div>
      
      {/* 主容器：左侧功能按钮、中间棋盘、右侧走子列表 */}
      <div className={`app__container ${error ? "disabled" : ""}`}>
        {/* 左侧功能按钮区域 */}
        <div className="app__left-panel">
          <div className="app__control-buttons">
            {/* 训练监控组件 - SSE版本（推荐） */}
            <TrainingMonitorSSE 
              sseUrl={(import.meta as any).env?.VITE_SSE_URL || 'http://localhost:8001/sse/training'}
              enabled={true}
            />
            
            {/* 训练监控组件 - WebSocket版本（备选） */}
            {/* <TrainingMonitor 
              wsUrl={import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/training'}
              enabled={false}
            /> */}
            
            <BoardOptions
              handleFlipBoard={handleFlipBoard}
              handleInit={handleInit}
            />
            <div className="app__fen-generator">
              <FENGenerator />
            </div>
            <div className="app__fen-parser">
              <FENParser />
            </div>
          </div>
        </div>
        
        {/* 中间棋盘 */}
        <div className="app__board-center">
          <Board squares={squares} />
        </div>
        
        {/* 右侧走子列表 */}
        <div className="app__right-panel">
          <MoveList />
        </div>
      </div>
      
      {/* 底部信息面板：被吃掉的棋子、FEN解析器等 */}
      <div className={`app__bottom-panel ${error ? "disabled" : ""}`}>
        <BoardInfo />
      </div>
    </div>
  );
}

export default App;
