/**
 * 训练监控组件 (SSE版本)
 * 显示训练过程中的实时棋盘状态
 */

import React, { useState } from 'react';
import { useSSE, BoardStateMessage } from '../hooks/useSSE';
import { useGameStore } from '../store/gameStore';
import { Button, Space, Typography, Card, Badge } from 'antd';
import { WifiOutlined, DisconnectOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface TrainingMonitorSSEProps {
  sseUrl?: string;
  enabled?: boolean;
}

export default function TrainingMonitorSSE({ 
  sseUrl = 'http://localhost:8001/sse/training',
  enabled = true 
}: TrainingMonitorSSEProps) {
  const [lastMessage, setLastMessage] = useState<BoardStateMessage | null>(null);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const { handleParseFENInput } = useGameStore();

  const { isConnected, connectionStatus, connect, disconnect } = useSSE({
    url: sseUrl,
    enabled,
    onMessage: (message) => {
      console.log('[TrainingMonitor] 收到消息:', message);
      
      // 忽略ping和connected消息
      if (message.type === 'ping' || message.type === 'connected') {
        return;
      }
      
      if (message.type === 'board_state') {
        const boardState = message as BoardStateMessage;
        console.log('[TrainingMonitor] 收到棋盘状态:', {
          move_count: boardState.data.move_count,
          current_player: boardState.data.current_player_name,
          fen: boardState.data.fen.substring(0, 50) + '...',
          autoUpdate
        });
        
        setLastMessage(boardState);
        
        // 如果启用自动更新，自动解析FEN并更新棋盘
        if (autoUpdate) {
          console.log('[TrainingMonitor] 自动更新棋盘，FEN:', boardState.data.fen);
          try {
            handleParseFENInput(boardState.data.fen);
            console.log('[TrainingMonitor] 棋盘更新成功');
          } catch (error) {
            console.error('[TrainingMonitor] 更新棋盘失败:', error);
          }
        } else {
          console.log('[TrainingMonitor] 自动更新已关闭，跳过更新');
        }
      }
    },
    onOpen: () => {
      console.log('训练监控已连接 (SSE)');
    },
    onClose: () => {
      console.log('训练监控已断开 (SSE)');
    },
    onError: (error) => {
      console.error('训练监控连接错误 (SSE):', error);
    },
  });

  // 手动更新棋盘
  const handleManualUpdate = () => {
    if (lastMessage) {
      handleParseFENInput(lastMessage.data.fen);
    }
  };

  return (
    <Card 
      title={
        <Space>
          <Badge 
            status={isConnected ? 'success' : 'error'} 
            text={isConnected ? '已连接 (SSE)' : '未连接'}
          />
          <Text type="secondary">训练监控 (SSE)</Text>
        </Space>
      }
      extra={
        <Space>
          {isConnected ? (
            <Button 
              icon={<DisconnectOutlined />} 
              onClick={disconnect}
              size="small"
            >
              断开
            </Button>
          ) : (
            <Button 
              icon={<WifiOutlined />} 
              onClick={connect}
              size="small"
              type="primary"
            >
              连接
            </Button>
          )}
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>连接状态: </Text>
          <Badge 
            status={isConnected ? 'success' : 'error'} 
            text={
              connectionStatus === 'connected' ? '已连接' :
              connectionStatus === 'connecting' ? '连接中...' :
              '未连接'
            }
          />
        </div>

        {lastMessage && (
          <>
            <div>
              <Text strong>步数: </Text>
              <Text>{lastMessage.data.move_count}</Text>
            </div>
            <div>
              <Text strong>当前玩家: </Text>
              <Text>{lastMessage.data.current_player_name}</Text>
            </div>
            <div>
              <Text strong>FEN: </Text>
              <Text code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                {lastMessage.data.fen}
              </Text>
            </div>
            
            <Space>
              <Button 
                type="primary" 
                onClick={handleManualUpdate}
                disabled={!lastMessage}
                size="small"
              >
                更新棋盘
              </Button>
              <Button 
                type={autoUpdate ? 'default' : 'dashed'}
                onClick={() => setAutoUpdate(!autoUpdate)}
                size="small"
              >
                {autoUpdate ? '自动更新: 开' : '自动更新: 关'}
              </Button>
            </Space>
          </>
        )}

        {!lastMessage && isConnected && (
          <Text type="secondary">等待训练数据...</Text>
        )}

        {!isConnected && (
          <Text type="secondary">
            请确保训练服务器已启动并启用了SSE功能
          </Text>
        )}
      </Space>
    </Card>
  );
}

