import express from "express";

const router = express.Router();

/**
 * Root API check
 * GET /api
 */
router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API is running ✅",
    timestamp: new Date().toISOString()
  });
});

/**
 * Example protected route placeholder
 * GET /api/status
 */
router.get("/status", (req, res) => {
  res.json({
    service: "backend",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    memory: process.memoryUsage().rss
  });
});

export default router;
