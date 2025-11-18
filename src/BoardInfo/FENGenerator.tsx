import React, { useState } from "react";
import { Button, Input, Space } from 'antd';
import { useGameStore } from '../store/gameStore';

const { TextArea } = Input;

export default function FENGenerator() {
  const [showFEN, setShowFEN] = useState(false);
  const { handleGenerateFEN, FENOutput } = useGameStore();

  function handleClickGenerateFEN() {
    setShowFEN(true);
    handleGenerateFEN();
  }

  function handleHideFEN() {
    setShowFEN(false);
  }

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

