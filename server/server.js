import dotenv from 'dotenv';
import { createServer } from 'http';
import { initWebSocket } from './websocket/wsService.js';

dotenv.config();

const { app } = await import('../api/index.js');

// Optional local health check
app.get('/health', (req, res) => {
  res.json({ status: 'success', message: 'Server is running', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
const server = createServer(app);

// Initialize WebSocket (Railway/full server only)
initWebSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
  console.log(`💾 Database: Supabase`);
  console.log(`🔌 WebSocket: Enabled`);
});

export default app;
