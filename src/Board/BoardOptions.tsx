/**
 * 棋盘控制选项组件
 * 提供翻转棋盘和重新开始游戏的功能
 */
import React from 'react';
import { Button, Space } from 'antd';

interface BoardOptionsProps {
  handleFlipBoard: () => void;
  handleInit: () => void;
}

export default function BoardOptions({ handleFlipBoard, handleInit }: BoardOptionsProps) {
  return (
    <div className='board-options-container'>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button type="primary" onClick={handleFlipBoard} block>翻转棋盘</Button>
        <Button type="primary" onClick={handleInit} block>重新开始</Button>
      </Space>
    </div>
  );
}
