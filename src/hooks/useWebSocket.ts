/**
 * WebSocket Hook
 * 用于连接训练服务器的WebSocket，接收实时棋盘状态
 */

import { useEffect, useRef, useState, useCallback } from 'react';

export interface BoardStateMessage {
  type: 'board_state';
  data: {
    fen: string;
    move_count: number;
    current_player: number;
    current_player_name: string;
  };
}

export interface GameStartMessage {
  type: 'game_start';
  data: any;
}

export interface GameEndMessage {
  type: 'game_end';
  data: any;
}

export interface TrainingInfoMessage {
  type: 'training_info';
  data: any;
}

export interface PingMessage {
  type: 'ping';
}

export type WebSocketMessage = BoardStateMessage | GameStartMessage | GameEndMessage | TrainingInfoMessage | PingMessage;

interface UseWebSocketOptions {
  url: string;
  enabled?: boolean;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket({
  url,
  enabled = true,
  onMessage,
  onError,
  onOpen,
  onClose,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
}: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    // 如果已经连接或正在连接，不重复创建
    if (!enabled) {
      return;
    }
    
    const currentState = wsRef.current?.readyState;
    if (currentState === WebSocket.OPEN || currentState === WebSocket.CONNECTING) {
      console.log('WebSocket已连接或正在连接，跳过重复连接');
      return;
    }

    // 清理旧连接
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {
        // 忽略关闭错误
      }
      wsRef.current = null;
    }

    try {
      setConnectionStatus('connecting');
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('WebSocket连接已建立');
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        onOpen?.();
      };

      ws.onmessage = (event) => {
        try {
          console.log('[WebSocket] 收到消息:', event.data);
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('[WebSocket] 解析后的消息:', message);
          onMessage?.(message);
        } catch (error) {
          console.error('[WebSocket] 解析WebSocket消息失败:', error, '原始数据:', event.data);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket错误:', error);
        onError?.(error);
      };

      ws.onclose = (event) => {
        console.log('WebSocket连接已关闭', event.code, event.reason);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        wsRef.current = null;
        onClose?.();

        // 只有在非手动关闭的情况下才自动重连
        // 1000 = 正常关闭，1001 = 端点离开
        if (event.code !== 1000 && event.code !== 1001 && enabled && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`尝试重连 (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.error('达到最大重连次数，停止重连');
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('创建WebSocket连接失败:', error);
      setConnectionStatus('disconnected');
      wsRef.current = null;
    }
  }, [url, enabled, onMessage, onError, onOpen, onClose, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    // 清除重连定时器
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // 重置重连计数
    reconnectAttemptsRef.current = 0;
    
    // 关闭WebSocket连接
    if (wsRef.current) {
      try {
        // 使用正常关闭代码，避免触发自动重连
        wsRef.current.close(1000, '手动断开');
      } catch (e) {
        // 忽略关闭错误
      }
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket未连接，无法发送消息');
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      // 组件卸载时清理连接
      disconnect();
    };
    // 只在enabled变化时重新连接，避免url变化导致重复连接
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
  };
}

