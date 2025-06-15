import { Server } from "http";

import { HandleRejection } from "../middlewares/rejection-handler.js";
import { GracefullyShutdown } from "../middlewares/gracefully-shutdown.js";

import { StopCleanupService } from "./startup-cleanup-data.js";
import { DisconnectAllDatabases } from "./startup-connect-databases.js";

export const SetupProcessHandlers = (server: Server): void => {
  HandleRejection(server);
  GracefullyShutdown(server);

  const cleanup = async () => {
    console.info("Performing graceful shutdown...");
    StopCleanupService();
    await DisconnectAllDatabases();
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
