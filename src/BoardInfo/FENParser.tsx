import React, { useState } from "react";
import { Button, Input, Space } from 'antd';
import { useGameStore } from '../store/gameStore';

const { TextArea } = Input;

export default function FENParser() {
  const [isClicked, setIsClicked] = useState(false);
  const [inputFEN, setInputFEN] = useState("");
  const { handleParseFENInput, validFENInput, handleOpenErrorModal } = useGameStore();

  function handleClickParseFEN() {
    if (validFENInput(inputFEN)) {
      handleParseFENInput(inputFEN);
    } else {
      handleOpenErrorModal();
    }
    setInputFEN("");
  }

  function handleInputFEN(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputFEN(e.target.value);
  }

  function handleClose() {
    setIsClicked(false);
  }

  function handleOpen() {
    setIsClicked(true);
  }

  return (
    <>
      {!isClicked && (
        <Button type="primary" onClick={handleOpen}>
          Parse FEN
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

