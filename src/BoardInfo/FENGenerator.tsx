/**
 * FEN 生成器组件
 * 将当前棋盘局面转换为 FEN 格式字符串，并支持复制到剪贴板
 */
import React, { useState } from "react";
import { Button, Input, Space } from 'antd';
import { useGameStore } from '../store/gameStore';

const { TextArea } = Input;

export default function FENGenerator() {
  const [showFEN, setShowFEN] = useState(false);
  const { handleGenerateFEN, FENOutput } = useGameStore();

  /**
   * 点击生成 FEN 按钮
   */
  function handleClickGenerateFEN() {
    setShowFEN(true);
    handleGenerateFEN();
  }

  /**
   * 隐藏 FEN 显示
   */
  function handleHideFEN() {
    setShowFEN(false);
  }

  /**
   * 复制 FEN 到剪贴板
   */
  function handleCopyFEN() {
    navigator.clipboard.writeText(FENOutput);
  }

  return (
    <>
      {!showFEN && (
        <Button type="primary" onClick={handleClickGenerateFEN}>
          Get FEN
        </Button>
      )}
      {showFEN && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <TextArea readOnly value={FENOutput} rows={3} />
          <Space>
            <Button type="primary" onClick={handleCopyFEN}>
              Copy
            </Button>
            <Button onClick={handleHideFEN}>
              Close
            </Button>
          </Space>
        </Space>
      )}
    </>
  );
}
