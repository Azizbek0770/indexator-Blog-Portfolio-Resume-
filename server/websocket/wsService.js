import { WebSocketServer } from 'ws';

let wss = null;

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received:', data);

        // Echo back or handle specific events
        ws.send(JSON.stringify({
          type: 'acknowledgment',
          message: 'Message received'
        }));
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to portfolio server'
    }));
  });

  console.log('WebSocket server initialized');
  return wss;
};

// Broadcast to all connected clients
export const broadcast = (data) => {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN state
      client.send(JSON.stringify(data));
    }
  });
};

// Broadcast content update notification
export const broadcastContentUpdate = (type, action, data) => {
  broadcast({
    type: 'content_update',
    contentType: type,
    action: action, // 'create', 'update', 'delete'
    data: data,
    timestamp: new Date().toISOString()
  });
};

export default { initWebSocket, broadcast, broadcastContentUpdate };