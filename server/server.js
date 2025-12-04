import express from "express";
import http from "http";
import cors from "cors";
import api from "./api/index.js";
import { initWebSocket } from "./websocket/wsService.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api", api);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

const server = http.createServer(app);
initWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
