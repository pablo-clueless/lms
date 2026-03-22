"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { Maybe, Notification, Undefined } from "@/types";

type ConnectionState = "connected" | "connecting" | "disconnected" | "idle";
type MessageType = "NOTIFICATION" | "NOTIFICATION_READ" | "PING" | "PONG";

interface Message {
  type: MessageType;
  payload: Maybe<Notification>;
}

type MessageHandler = (message: Message) => void;

interface UseWebSocketProps {
  token: Undefined<string>;
  autoConnect?: boolean;
  reconnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

interface UseWebSocketReturn {
  connectionState: ConnectionState;
  send: (message: Message) => void;
  subscribe: (type: MessageType, handler: MessageHandler) => () => void;
}

export function useWebSocket({
  token,
  autoConnect = true,
  reconnect = true,
  reconnectAttempts = 5,
  reconnectInterval = 3000,
}: UseWebSocketProps): UseWebSocketReturn {
  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscribers = useRef<Map<MessageType, Set<MessageHandler>>>(new Map());

  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");

  const send = useCallback((message: Message) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  const subscribe = useCallback((type: MessageType, handler: MessageHandler) => {
    if (!subscribers.current.has(type)) {
      subscribers.current.set(type, new Set());
    }
    subscribers.current.get(type)!.add(handler);

    return () => {
      const handlers = subscribers.current.get(type);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          subscribers.current.delete(type);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!autoConnect || !token) return;

    const createConnection = () => {
      if (ws.current?.readyState === WebSocket.OPEN) return;

      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`;
      const socket = new WebSocket(wsUrl);
      ws.current = socket;

      socket.onopen = () => {
        setConnectionState("connected");
        reconnectCount.current = 0;
      };

      socket.onmessage = (event) => {
        try {
          const message: Message = JSON.parse(event.data);
          const handlers = subscribers.current.get(message.type);
          if (handlers) {
            handlers.forEach((handler) => handler(message));
          }
          if (message.type === "PING" && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "PONG", payload: null }));
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
        setConnectionState("disconnected");

        if (reconnect && reconnectCount.current < reconnectAttempts) {
          reconnectCount.current += 1;
          const delay = reconnectInterval * Math.pow(1.5, reconnectCount.current - 1);

          reconnectTimeout.current = setTimeout(() => {
            createConnection();
          }, delay);
        }
      };
    };

    createConnection();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
      ws.current?.close();
      ws.current = null;
    };
  }, [autoConnect, token, reconnect, reconnectAttempts, reconnectInterval]);

  return {
    connectionState,
    send,
    subscribe,
  };
}
