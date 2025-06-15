import { Server } from "http";

import { HandleRejection } from "../middlewares/rejection-handler.js";
import { GracefullyShutdown } from "../middlewares/gracefully-shutdown.js";

import { StopCleanupServices } from "./startup-cleanup-service.js";
import { DisconnectAllDatabasesService } from "./startup-connect-databases-service.js";

export const SetupProcessHandlersService = (server: Server): void => {
  HandleRejection(server);
  GracefullyShutdown(server);

  const cleanup = async () => {
    console.info("Performing graceful shutdown...");
    StopCleanupServices();
    await DisconnectAllDatabasesService();
  };

  process.on("SIGTERM", async () => {
    console.info("SIGTERM received");
    await cleanup();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    console.info("SIGINT received");
    await cleanup();
    process.exit(0);
  });
};
