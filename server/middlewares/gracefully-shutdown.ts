import { Server } from "http";

import { DisconnectMongooseDatabase } from "../databases/mongoose-database.js";
import { DisconnectRedis } from "../databases/redis-database.js";

export const GracefullyShutdown = (server: Server): void => {
  process.on("SIGINT", async () => {
    console.info("Shutting down gracefully...");
    await DisconnectMongooseDatabase();
    await DisconnectRedis();
    server.close(() => {
      console.info("HTTP server closed.");
      process.exit(0);
    });
  });
};
