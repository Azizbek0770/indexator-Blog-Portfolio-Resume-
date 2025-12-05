import 'dotenv/config';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config();
import http from 'http';
import express from 'express';
import cors from 'cors';
import apiRouter from './api/index.js';
import { initWebSocket } from './websocket/wsService.js';

const app = express();

const origins = String(process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const vercelRegex = process.env.CORS_ALLOW_VERCEL_REGEX
  ? new RegExp(process.env.CORS_ALLOW_VERCEL_REGEX)
  : null;
const debug = process.env.CORS_DEBUG === 'true';
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) {
      if (debug) console.log('no-origin allowance');
      return cb(null, true);
    }
    if (origins.includes(origin)) {
      if (debug) console.log('allowed origin', origin);
      return cb(null, true);
    }
    if (vercelRegex && vercelRegex.test(origin)) {
      if (debug) console.log('regex matches', vercelRegex.source, '→', origin);
      return cb(null, true);
    }
    if (debug) console.log('blocked origin', origin);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

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
