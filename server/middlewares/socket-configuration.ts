import "dotenv/config";

import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

const corsOriginsEnv = process.env.CORS_ORIGINS || "";
const allowedOrigins = corsOriginsEnv.split(",").map((o) => o.trim());

export const SocketConfiguration = (server: HttpServer): SocketIOServer => {
  return new SocketIOServer(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes("*")) {
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        console.warn(`❌ CORS blocked socket origin: ${origin}`);
        return callback(new Error("Socket CORS policy violation"), false);
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 30000,
    pingInterval: 15000,
    connectTimeout: 30000,
    maxHttpBufferSize: 10 * 1024 * 1024,
    transports: ["websocket", "polling"],
    allowUpgrades: true,
    path: "/socket.io",
    cleanupEmptyChildNamespaces: true,
  });
};
