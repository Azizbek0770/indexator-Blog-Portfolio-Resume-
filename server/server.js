import express from "express";
import http from "http";
import cors from "cors";
import api from "./api/index.js";
import { initWebSocket } from "./websocket/wsService.js";

const app = express();

/* ===== Middleware ===== */
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://indexator-blog-portfolio-resume.vercel.app",
      "https://indexator-blog-portfolio-resume-git-main-azizbek0770s-projects.vercel.app",
      "https://indexator-blog-portfolio-resume-rfygqmxgk-azizbek0770s-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

/* ===== API Routes ===== */
app.use("/api", api);

/* ===== Health Check ===== */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend running ✅"
  });
});

/* ===== HTTP + WebSocket Server ===== */
const server = http.createServer(app);
initWebSocket(server);

/* ===== Start Server (Railway) ===== */
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🌍 CORS enabled");
  console.log("📡 WebSocket active");
});
