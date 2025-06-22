import "dotenv/config";

import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

import { getAllowedOrigins } from "./cors-middleware.js";

export const SocketConfiguration = (server: HttpServer): SocketIOServer => {
  const allowedOrigins = getAllowedOrigins();

  return new SocketIOServer(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) {
          console.log("✅ Socket: No origin header - allowing connection");
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
          console.log(`✅ Socket: CORS allowed for origin: ${origin}`);
          return callback(null, true);
        }

        console.warn(`❌ Socket: CORS blocked origin: ${origin}`);
        console.warn(
          `🔧 Socket: Allowed origins: ${JSON.stringify(allowedOrigins)}`
        );
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
