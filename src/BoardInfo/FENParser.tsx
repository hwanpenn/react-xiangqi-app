/**
 * FEN 解析器组件
 * 允许用户输入 FEN 字符串并加载到棋盘上
 */
import React, { useState } from "react";
import { Button, Input, Space } from 'antd';
import { useGameStore } from '../store/gameStore';

const { TextArea } = Input;

export default function FENParser() {
  const [isClicked, setIsClicked] = useState(false);
  const [inputFEN, setInputFEN] = useState("");
  const { handleParseFENInput, validFENInput, handleOpenErrorModal } = useGameStore();

  /**
   * 解析 FEN 输入
   * 验证格式后加载到棋盘，无效则显示错误
   */
  function handleClickParseFEN() {
    if (validFENInput(inputFEN)) {
      handleParseFENInput(inputFEN);
    } else {
      handleOpenErrorModal();
    }
    setInputFEN("");
  }

  /**
   * 处理输入变化
   */
  function handleInputFEN(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputFEN(e.target.value);
  }

  /**
   * 关闭输入框
   */
  function handleClose() {
    setIsClicked(false);
  }

  /**
   * 打开输入框
   */
  function handleOpen() {
    setIsClicked(true);
  }

  return (
    <>
      {!isClicked && (
        <Button type="primary" onClick={handleOpen}>
          解析FEN
        </Button>
      )}
      {isClicked && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <TextArea
            value={inputFEN}
            onChange={handleInputFEN}
            placeholder="输入 FEN 字符串"
            rows={3}
          />
          <Space>
            <Button type="primary" onClick={handleClickParseFEN}>
              Parse
            </Button>
            <Button onClick={handleClose}>
              Close
            </Button>
          </Space>
        </Space>
      )}
    </>
  );
}
