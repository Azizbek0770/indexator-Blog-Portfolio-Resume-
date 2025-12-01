import { useEffect, useRef, useState } from 'react';

import { WS_URL } from '../utils/constants';

export const useWebSocket = (onMessage) => {
  const ws = useRef(null);
  const reconnectTimer = useRef(null);
  const connecting = useRef(false);
  const backoff = useRef(2000);
  const onMessageRef = useRef(onMessage);
  const [connected, setConnected] = useState(false);

  // Keep latest onMessage without re-creating the socket
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const connectWebSocket = () => {
      if (connecting.current) return;
      connecting.current = true;

      try {
        ws.current = new WebSocket(WS_URL);
      } catch (e) {
        scheduleReconnect();
        connecting.current = false;
        return;
      }

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        backoff.current = 2000;
        connecting.current = false;
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (typeof onMessageRef.current === 'function') {
            onMessageRef.current(data);
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        scheduleReconnect();
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    const scheduleReconnect = () => {
      if (reconnectTimer.current) return;
      const delay = Math.min(backoff.current, 30000);
      reconnectTimer.current = setTimeout(() => {
        reconnectTimer.current = null;
        backoff.current = Math.min(backoff.current * 2, 30000);
        connectWebSocket();
      }, delay);
    };

    connectWebSocket();

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      if (ws.current) {
        try {
          ws.current.onopen = null;
          ws.current.onmessage = null;
          ws.current.onclose = null;
          ws.current.onerror = null;
          ws.current.close();
        } catch {}
      }
    };
  }, []);

  const sendMessage = (data) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  };

  return { connected, sendMessage };
};
