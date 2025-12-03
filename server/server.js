import express from "express";
import api from "./api/index.js";

const app = express();

// middleware
app.use(express.json());

// mount API
app.use("/api", api);

// root health check
app.get("/", (req, res) => {
  res.send("Server running ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server started");
  console.log(`🌍 Port: ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
});
