import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// ---- Your routes here ----
// Example:
// import router from './routes/index.js';
// app.use('/api', router);


// ⭐ LOCAL ONLY ― DO NOT RUN ON VERCEL
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Local dev server running at http://localhost:${PORT}`);
  });
}

// Export app for Vercel (required)
export default app;
