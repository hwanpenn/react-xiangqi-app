/**
 * SSE (Server-Sent Events) Hook
 * 用于连接训练服务器的SSE流，接收实时棋盘状态
 * 比WebSocket更简单，适合单向流式输出场景
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

export interface ConnectedMessage {
  type: 'connected';
  message: string;
}

export interface PingMessage {
  type: 'ping';
}

export type SSEMessage = BoardStateMessage | ConnectedMessage | PingMessage;

interface UseSSEOptions {
  url: string;
  enabled?: boolean;
  onMessage?: (message: SSEMessage) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export function useSSE({
  url,
  enabled = true,
  onMessage,
  onError,
  onOpen,
  onClose,
}: UseSSEOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (!enabled || eventSourceRef.current?.readyState === EventSource.OPEN) {
      return;
    }

    // 清理旧连接
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    try {
      setConnectionStatus('connecting');
      const eventSource = new EventSource(url);
      
      eventSource.onopen = () => {
        console.log('[SSE] 连接已建立');
        setIsConnected(true);
        setConnectionStatus('connected');
        onOpen?.();
      };

      eventSource.onmessage = (event) => {
        try {
          console.log('[SSE] 收到消息:', event.data);
          const message: SSEMessage = JSON.parse(event.data);
          console.log('[SSE] 解析后的消息:', message);
          onMessage?.(message);
        } catch (error) {
          console.error('[SSE] 解析消息失败:', error, '原始数据:', event.data);
        }
      };

      eventSource.onerror = (error) => {
        console.error('[SSE] 连接错误:', error);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        onError?.(error);
        
        // SSE会自动重连，但如果连接关闭，需要手动处理
        if (eventSource.readyState === EventSource.CLOSED) {
          onClose?.();
        }
      };

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error('[SSE] 创建连接失败:', error);
      setConnectionStatus('disconnected');
    }
  }, [url, enabled, onMessage, onError, onOpen, onClose]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
    setConnectionStatus('disconnected');
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
  };
}

