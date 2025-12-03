import express from "express";
import http from "http";
import cors from "cors";
import api from "./api/index.js";
import { initWebSocket } from "./websocket/wsService.js";

const app = express();

/* ✅ CORS FIX */
app.use(
  cors({
    origin: [
      "https://indexator-blog-portfolio-resume.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use(express.json());

// API routes
app.use("/api", api);

// Health check
app.get("/", (req, res) => {
  res.send("Server running ✅");
});

const server = http.createServer(app);

// WebSocket
initWebSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 Backend running");
  console.log("🌍 CORS enabled");
  console.log("📡 WebSocket active");
});
