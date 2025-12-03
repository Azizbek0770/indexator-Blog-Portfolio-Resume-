import express from "express";
import http from "http";
import api from "./api/index.js";
import { initWebSocket } from "./websocket/wsService.js";

const app = express();
app.use(express.json());

// API routes
app.use("/api", api);

// Health check
app.get("/", (req, res) => {
  res.send("Server running ✅");
});

// ✅ create ONE http server
const server = http.createServer(app);

// ✅ attach WebSocket to SAME server
initWebSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("🚀 Server started");
  console.log(`🌍 Port: ${PORT}`);
  console.log("📡 WebSocket attached");
});
