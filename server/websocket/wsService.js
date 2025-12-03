import { WebSocketServer, WebSocket } from 'ws';

let wss = null;

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('🔌 WebSocket client connected');

    // Welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to portfolio server'
    }));

    ws.on('message', (message) => {
      try {
        const data =
          typeof message === 'string'
            ? JSON.parse(message)
            : JSON.parse(message.toString());

        console.log('📩 Received:', data);

        ws.send(JSON.stringify({
          type: 'acknowledgment',
          message: 'Message received'
        }));
      } catch (error) {
        console.error('❌ WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('❌ WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('⚠️ WebSocket error:', error);
    });
  });

  console.log('✅ WebSocket server initialized');
  return wss;
};

// Broadcast to all clients
export const broadcast = (data) => {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Content update helper
export const broadcastContentUpdate = (type, action, data) => {
  broadcast({
    type: 'content_update',
    contentType: type,
    action, // create | update | delete
    data,
    timestamp: new Date().toISOString(),
  });
};
