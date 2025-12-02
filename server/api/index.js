import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.json({ message: "Backend running on Vercel!" });
});

// IMPORTANT: Do NOT use app.listen on Vercel!
export const handler = serverless(app);
