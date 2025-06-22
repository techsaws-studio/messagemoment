import "dotenv/config";

import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

import { SocketConfig } from "../interfaces/middlewares-interface.js";

import { GetAllowedOrigins } from "./cors-middleware.js";

const GetSocketConfiguration = (): SocketConfig => {
  const isDevelopment = process.env.NODE_ENV !== "production";

  return {
    pingTimeout: isDevelopment ? 30000 : 60000,
    pingInterval: isDevelopment ? 15000 : 25000,
    connectTimeout: isDevelopment ? 30000 : 45000,
    maxHttpBufferSize: 10 * 1024 * 1024, // 10MB
    allowUpgrades: true,
    transports: ["websocket", "polling"] as ("websocket" | "polling")[],
  };
};

export const SocketConfiguration = (server: HttpServer): SocketIOServer => {
  const allowedOrigins = GetAllowedOrigins();
  const socketConfig = GetSocketConfiguration();
  const isDevelopment = process.env.NODE_ENV !== "production";

  console.log(`🔌 Initializing Socket.IO server...`);

  const io = new SocketIOServer(server, {
    cors: {
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, success?: boolean) => void
      ) => {
        if (isDevelopment) {
          console.log(
            `🔌 DEV MODE: Allowing socket origin: ${origin || "no-origin"}`
          );
          return callback(null, true);
        }

        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.log(`🚫 Socket CORS BLOCKED: ${origin}`);
          callback(
            new Error(`Socket CORS: Origin ${origin} not allowed`),
            false
          );
        }
      },
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
    },

    pingTimeout: socketConfig.pingTimeout,
    pingInterval: socketConfig.pingInterval,
    connectTimeout: socketConfig.connectTimeout,
    maxHttpBufferSize: socketConfig.maxHttpBufferSize,
    allowUpgrades: socketConfig.allowUpgrades,
    transports: socketConfig.transports,

    path: "/socket.io",
    cleanupEmptyChildNamespaces: true,

    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
      skipMiddlewares: true,
    },
  });

  let connectionCount = 0;

  io.on("connection", (socket) => {
    connectionCount++;

    const clientInfo = {
      id: socket.id,
      origin: socket.handshake.headers.origin,
      ip: socket.handshake.address,
    };

    console.log(`🔌 Socket connected [${connectionCount}]:`, {
      id: clientInfo.id,
      origin: clientInfo.origin || "no-origin",
      ip: clientInfo.ip,
    });

    socket.on("disconnect", (reason: string) => {
      connectionCount--;
      console.log(`🔌 Socket disconnected [${connectionCount}]:`, {
        id: socket.id,
        reason,
        origin: clientInfo.origin || "no-origin",
      });
    });

    socket.on("error", (error: Error) => {
      console.error(`❌ Socket Error [${socket.id}]:`, error.message);
    });
  });

  io.engine.on("connection_error", (err: any) => {
    console.error(`🔌 Socket Engine Connection Error:`, err.message);
  });

  io.engine.on("error", (error: Error) => {
    console.error(`🔥 Socket Engine Error:`, error.message);
  });

  console.log(`✅ Socket.IO server initialized successfully`);
  return io;
};
