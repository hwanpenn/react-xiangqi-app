import React from "react";
import { Modal } from 'antd';
import type { ColorType } from '../types';

interface NotificationModalProps {
  handleCloseNotificationModal: () => void;
  gameOver: boolean;
  error: boolean;
  currentTurn: ColorType;
}

export default function NotificationModal({
  handleCloseNotificationModal,
  gameOver,
  error,
  currentTurn
}: NotificationModalProps) {
  return (
    <Modal
      open={error || gameOver}
      onCancel={handleCloseNotificationModal}
      footer={null}
      title={error ? "错误" : "游戏结束"}
    >
      {error && (
        <p>错误：您输入的 FEN 格式无效，请重试。</p>
      )}
      {gameOver && (
        <p>{currentTurn === "red" ? "黑方" : "红方"}获胜！</p>
      )}
    </Modal>
  );
}

