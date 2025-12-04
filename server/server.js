import dotenv from 'dotenv';
import http from 'http';
import express from 'express';
import cors from 'cors';
import apiRouter from './api/index.js';
import { initWebSocket } from './websocket/wsService.js';

dotenv.config();

const app = express();

// parse JSON
app.use(express.json());

// CORS via env
// CORS_ALLOWED_ORIGINS = " `https://frontend.app,https://another.app` "
const { CORS_ALLOWED_ORIGINS = '', CORS_ALLOW_ALL = 'false' } = process.env;
let corsOptions = {};
if (CORS_ALLOW_ALL === 'true') {
  corsOptions = { origin: true, credentials: true };
} else {
  const origins = CORS_ALLOWED_ORIGINS
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  corsOptions = {
    origin: (origin, cb) => {
      // allow non-browser (curl/postman) requests that have no origin
      if (!origin) return cb(null, true);
      if (origins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    credentials: true
  };
}
app.use(cors(corsOptions));

// Mount API router under /api
app.use('/api', apiRouter);

// Health endpoints
app.get('/', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', api: true }));

// Create HTTP server (needed for WebSocket)
const server = http.createServer(app);

// Init WebSocket only if enabled
if (process.env.WS_ENABLED === 'true') {
  initWebSocket(server);
  console.log('WebSocket: enabled');
} else {
  console.log('WebSocket: disabled');
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
