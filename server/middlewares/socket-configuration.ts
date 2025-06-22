import "dotenv/config";

import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

import {
  SocketConfig,
  ClientInfo,
  ConnectionMetrics,
} from "../interfaces/middlewares-interface.js";

import { getAllowedOrigins, getCorsConfiguration } from "./cors-middleware.js";

const getSocketConfiguration = (): SocketConfig => {
  const isDevelopment = process.env.NODE_ENV !== "production";

  return {
    pingTimeout: isDevelopment ? 30000 : 60000,
    pingInterval: isDevelopment ? 15000 : 25000,
    connectTimeout: isDevelopment ? 30000 : 45000,
    maxHttpBufferSize: 10 * 1024 * 1024, // 10MB
    allowUpgrades: true,
    transports: ["websocket", "polling"],
  };
};

const isSocketOriginAllowed = (
  origin: string | undefined,
  allowedOrigins: string[]
): boolean => {
  if (!origin) return true;

  // Direct match
  if (allowedOrigins.includes(origin)) return true;

  // Wildcard pattern matching
  for (const allowedOrigin of allowedOrigins) {
    if (allowedOrigin.includes("*")) {
      const pattern = allowedOrigin.replace(/\*/g, ".*");
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(origin)) return true;
    }
  }

  // Development-specific allowances
  if (process.env.NODE_ENV !== "production") {
    const devPattern =
      /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/;
    if (devPattern.test(origin)) return true;

    if (origin.startsWith("file://")) return true;
    if (origin === "null") return true;
  }

  return false;
};

export const SocketConfiguration = (server: HttpServer): SocketIOServer => {
  const allowedOrigins = getAllowedOrigins();
  const config = getCorsConfiguration();
  const socketConfig = getSocketConfiguration();

  console.log(`🔌 Initializing Socket.IO server...`);

  const io = new SocketIOServer(server, {
    cors: {
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, success?: boolean) => void
      ) => {
        const isAllowed = isSocketOriginAllowed(origin, allowedOrigins);

        if (config.enableDebugLogging) {
          console.log(
            `🔌 Socket CORS: ${origin || "no-origin"} - ${
              isAllowed ? "✅ ALLOWED" : "❌ BLOCKED"
            }`
          );
        }

        if (isAllowed || config.allowAllOrigins) {
          callback(null, true);
        } else {
          console.warn(`🚫 Socket CORS blocked: ${origin}`);
          console.warn(`📋 Allowed origins:`, allowedOrigins);
          callback(new Error(`Socket CORS policy violation: ${origin}`), false);
        }
      },
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: [
        "Authorization",
        "Content-Type",
        "X-Requested-With",
        "Accept",
        "Origin",
        "Cache-Control",
      ],
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

    allowRequest: (req, callback) => {
      const origin = req.headers.origin;
      const userAgent = req.headers["user-agent"] || "";
      const ip = req.socket.remoteAddress;

      if (config.enableDebugLogging) {
        console.log(`🔍 Socket connection attempt:`, {
          origin: origin || "no-origin",
          userAgent:
            userAgent.substring(0, 50) + (userAgent.length > 50 ? "..." : ""),
          ip: ip,
          headers: Object.keys(req.headers),
        });
      }

      const botPatterns = [
        /bot/i,
        /crawler/i,
        /spider/i,
        /scraper/i,
        /python/i,
        /curl/i,
        /wget/i,
        /http/i,
        /postman/i,
        /insomnia/i,
        /test/i,
      ];

      if (botPatterns.some((pattern) => pattern.test(userAgent))) {
        console.warn(
          `🤖 Bot connection rejected: ${userAgent.substring(0, 100)}`
        );
        return callback("Bot connections not allowed", false);
      }

      if (
        !isSocketOriginAllowed(origin, allowedOrigins) &&
        !config.allowAllOrigins
      ) {
        console.warn(`🚫 Socket connection rejected:`, {
          origin: origin || "no-origin",
          ip: ip,
          reason: "Invalid origin",
          allowedOrigins: config.enableDebugLogging
            ? allowedOrigins
            : `${allowedOrigins.length} configured`,
        });
        return callback("Invalid origin", false);
      }

      if (ip) {
        console.log(
          `✅ Socket request approved for IP: ${ip}, Origin: ${
            origin || "no-origin"
          }`
        );
      }

      callback(null, true);
    },
  });

  io.engine.on("connection_error", (err) => {
    console.error(`🔌 Socket Engine Connection Error:`, {
      message: err.message,
      description: err.description,
      context: err.context,
      code: err.code,
      timestamp: new Date().toISOString(),
    });
  });

  io.engine.on("error", (error) => {
    console.error(`🔥 Socket Engine Error:`, {
      message: error.message,
      stack: config.enableDebugLogging ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  });

  let connectionCount = 0;
  const metrics: ConnectionMetrics = {
    totalConnections: 0,
    activeConnections: 0,
    totalDisconnections: 0,
    errors: 0,
  };

  const connectionStartTime = Date.now();
  const activeConnections = new Map<string, ClientInfo>();

  io.on("connection", (socket) => {
    connectionCount++;
    metrics.totalConnections++;
    metrics.activeConnections++;

    const clientInfo: ClientInfo = {
      id: socket.id,
      origin: socket.handshake.headers.origin,
      userAgent: socket.handshake.headers["user-agent"],
      ip: socket.handshake.address,
      timestamp: new Date().toISOString(),
    };

    activeConnections.set(socket.id, clientInfo);

    console.log(
      `🔌 Socket connected [${connectionCount}/${metrics.totalConnections}]:`,
      {
        id: clientInfo.id,
        origin: clientInfo.origin || "no-origin",
        ip: clientInfo.ip,
        transport: socket.conn.transport.name,
      }
    );

    socket.on("disconnect", (reason) => {
      connectionCount--;
      metrics.activeConnections--;
      metrics.totalDisconnections++;

      activeConnections.delete(socket.id);

      const duration = Date.now() - new Date(clientInfo.timestamp).getTime();

      console.log(
        `🔌 Socket disconnected [${connectionCount}/${metrics.totalConnections}]:`,
        {
          id: socket.id,
          reason,
          duration: `${Math.round(duration / 1000)}s`,
          origin: clientInfo.origin || "no-origin",
        }
      );

      const unexpectedReasons = [
        "transport close",
        "transport error",
        "ping timeout",
        "parse error",
        "packet parsing error",
      ];

      const clientInitiatedReasons = [
        "client namespace disconnect",
        "client disconnect",
      ];

      if (unexpectedReasons.includes(reason)) {
        console.warn(`⚠️ Unexpected socket disconnect:`, {
          socketId: socket.id,
          reason,
          origin: clientInfo.origin,
          duration,
          transport: socket.conn?.transport?.name,
        });
      } else if (!clientInitiatedReasons.includes(reason)) {
        console.log(`ℹ️ Server-initiated disconnect: ${reason}`);
      }
    });

    socket.on("ping", () => {
      socket.emit("pong", {
        timestamp: Date.now(),
        server: "MessageMoment",
        socketId: socket.id,
      });
    });

    socket.on("error", (error) => {
      metrics.errors++;
      console.error(`❌ Socket Error [${socket.id}]:`, {
        message: error.message,
        origin: clientInfo.origin,
        timestamp: new Date().toISOString(),
        stack: config.enableDebugLogging ? error.stack : undefined,
      });
    });

    const connectionTimeout = setTimeout(() => {
      if (socket.connected) {
        console.warn(`⏰ Socket connection timeout for ${socket.id}`);
        socket.disconnect(true);
      }
    }, socketConfig.connectTimeout + 10000);

    socket.on("disconnect", () => {
      clearTimeout(connectionTimeout);
    });
  });

  if (config.enableDebugLogging) {
    const metricsInterval = setInterval(() => {
      if (metrics.activeConnections > 0) {
        const uptime = Math.round(
          (Date.now() - connectionStartTime) / 1000 / 60
        );

        console.log(`📊 Socket Server Metrics:`, {
          active: metrics.activeConnections,
          total: metrics.totalConnections,
          disconnections: metrics.totalDisconnections,
          errors: metrics.errors,
          uptime: `${uptime}m`,
          avgConnectionsPerMinute:
            uptime > 0 ? Math.round(metrics.totalConnections / uptime) : 0,
        });

        const transports = Array.from(activeConnections.values()).reduce(
          (acc, client) => {
            const transport = "websocket";
            acc[transport] = (acc[transport] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        if (Object.keys(transports).length > 0) {
          console.log(`🚀 Transport distribution:`, transports);
        }
      }
    }, 5 * 60 * 1000);

    process.on("SIGTERM", () => {
      clearInterval(metricsInterval);
    });
  }

  console.log(
    `✅ Socket.IO server initialized successfully with ${allowedOrigins.length} allowed origins`
  );
  return io;
};
