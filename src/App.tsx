import React, { useEffect } from "react";
import Board from "./Board/Board";
import BoardOptions from "./Board/BoardOptions";
import BoardInfo from "./BoardInfo/BoardInfo";
import NotificationModal from "./BoardInfo/NotificationModal";
import { useGameStore } from "./store/gameStore";

function App() {
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

  useEffect(() => {
    handleInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleGenerateFEN();
    checkGameOver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squares, currentTurn]);

  return (
    <div>
      <NotificationModal
        handleCloseNotificationModal={handleCloseNotificationModal}
        error={error}
        gameOver={gameOver}
        currentTurn={currentTurn}
      />
      <div className={`app__header ${error || gameOver ? "disabled" : ""}`}>
        <h1 className={currentTurn === "red" ? "red" : "black"}>
          Xiang Qi App
        </h1>
        <BoardOptions
          handleFlipBoard={handleFlipBoard}
          handleInit={handleInit}
        />
      </div>
      <div className={`app__container ${error ? "disabled" : ""}`}>
        <Board squares={squares} />
        <BoardInfo />
      </div>
    </div>
  );
}

export default App;

