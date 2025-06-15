import "dotenv/config";

import { createServer } from "http";
import mongoose from "mongoose";

import { app } from "./app.js";
import { InitializeSocket } from "./socket.js";

import {
  ConnectMongooseDatabase,
  DisconnectMongooseDatabase,
} from "./databases/mongoose-database.js";
import {
  ConnectRedis,
  DisconnectRedis,
  RedisDatabase,
} from "./databases/redis-database.js";

import { HandleException } from "./middlewares/exception-handler.js";
import { HandleRejection } from "./middlewares/rejection-handler.js";
import { GracefullyShutdown } from "./middlewares/gracefully-shutdown.js";

import { MessageCleanupService } from "./services/message-cleanup-service.js";

import { DatabaseHealthMonitor } from "./utils/database-health-monitor.js";

let healthMonitor: DatabaseHealthMonitor | null = null;
let messageCleanupInterval: NodeJS.Timeout | null = null;

const SERVER = createServer(app);
const PORT = process.env.PORT || 8000;

  HandleException();
InitializeSocket(SERVER);

const StartServer = async (): Promise<void> => {
  try {
    SERVER.listen(PORT, () => {
      console.info(`Server is running on port: ${PORT}`);
    });

    // CONNECT TO DATABASES
    await ConnectMongooseDatabase();
    await ConnectRedis();

    if (global.mongooseConnection && RedisDatabase) {
      try {
        healthMonitor = new DatabaseHealthMonitor(
          mongoose.connection,
          RedisDatabase,
          parseInt(process.env.HEALTH_CHECK_INTERVAL || "30000", 10)
        );

        healthMonitor.start();
        console.info("Database health monitoring started");
      } catch (monitorError) {
        console.error("Failed to initialize health monitor:", monitorError);
      }
    } else {
      console.warn(
        "Could not initialize health monitor - database connections not available"
      );
    }

    try {
      await MessageCleanupService.runFullCleanup();

      const scheduleNextCleanup = () => {
        const now = new Date();
        const nextMidnight = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          0,
          0,
          0
        );
        const timeUntilMidnight = nextMidnight.getTime() - now.getTime();

        const timeoutId = setTimeout(async () => {
          try {
            console.info("Running scheduled daily message cleanup");
            console.info("Enforcing 60-day (2-month) message retention policy");
            const results = await MessageCleanupService.runFullCleanup();
            console.info("Message cleanup completed:", results);
          } catch (cleanupError) {
            console.error(
              "Error during scheduled message cleanup:",
              cleanupError
            );
          } finally {
            scheduleNextCleanup();
          }
        }, timeUntilMidnight);

        // Store for cleanup during shutdown
        if (messageCleanupInterval) clearTimeout(messageCleanupInterval);
        messageCleanupInterval = timeoutId;
      };

      scheduleNextCleanup();

      console.info(
        "Message cleanup service scheduled (daily at midnight, 60-day retention)"
      );
    } catch (serviceError) {
      console.error(
        "Failed to initialize message cleanup service:",
        serviceError
      );
    }

    // PROCESS HANDLER
    HandleRejection(SERVER);
    GracefullyShutdown(SERVER);
  } catch (error) {
    console.error(`Failed to start the server: ${(error as Error).message}`);
    process.exit(1);
  }
};

const cleanup = async () => {
  console.info("Cleaning up resources...");

  if (messageCleanupInterval) {
    clearTimeout(messageCleanupInterval);
    messageCleanupInterval = null;
    console.info("Message cleanup service stopped");
  }

  if (healthMonitor) {
    healthMonitor.stop();
    healthMonitor = null;
  }

  await DisconnectRedis();
  await DisconnectMongooseDatabase();
};

process.on("SIGTERM", async () => {
  console.info("SIGTERM received, shutting down gracefully");
  await cleanup();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.info("SIGINT received, shutting down gracefully");
  await cleanup();
  process.exit(0);
});

StartServer();
