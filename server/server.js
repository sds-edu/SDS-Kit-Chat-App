import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

// === TODO: [Websocket Server] START ===

const server = // Your code here
const wss = // Your code here

// === TODO: [Websocket Server] END ===

// === TODO [Function to broadcast] START ===
const broadcastUserCount = () => {

  // Your code here

};
// === TODO [Function to broadcast] END ===


wss.on("connection", (ws) => {
  console.log("New user connected. Total:", wss.clients.size);

  // Broadcast the updated count immediately on new connection
  broadcastUserCount();

  // === TODO [Message] START ===

  ws.on("message", (data) => {

    // Your code here

  });

  // === TODO [Message] END ===


  // === TODO [Disconnect] START ===

  ws.on("close", () => {

    // Your code here

  });

  // === TODO [Disconnect] END ===

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
  console.log("\nShutting down graciously...");
  wss.close(() => {
    console.log("WebSocket server closed.");
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  });

  setTimeout(() => {
    console.error("Forcefully shutting down...");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
