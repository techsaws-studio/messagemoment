import "dotenv/config";

import { createServer } from "http";

import { app } from "./app.js";
import { InitializeSocket } from "./socket.js";

import { HandleException } from "./middlewares/exception-handler.js";

import { ConnectAllDatabasesService } from "services/startup-connect-databases-service.js";
import { SetupCleanupServices } from "services/startup-cleanup-service.js";
import { SetupProcessHandlersService } from "services/startup-process-handlers-service.js";

const SERVER = createServer(app);

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "0.0.0.0";

console.log(`🚀 Starting server on ${HOST}:${PORT}`);
console.log(`📍 Environment: ${process.env.NODE_ENV}`);
console.log(
  `🌐 Railway URL: ${process.env.RAILWAY_PUBLIC_DOMAIN || "Not set"}`
);

HandleException();
InitializeSocket(SERVER);

const StartServer = async (): Promise<void> => {
  try {
    SERVER.listen(PORT, () => {
      console.info(`✅ Server is running on ${HOST}:${PORT}`);
      console.info(
        `🌍 Public URL: https://${
          process.env.RAILWAY_PUBLIC_DOMAIN || "localhost"
        }`
      );
      console.info(
        `🔗 Health check: https://${
          process.env.RAILWAY_PUBLIC_DOMAIN || "localhost"
        }/ping`
      );
    });

    await ConnectAllDatabasesService();
    SetupCleanupServices();
    SetupProcessHandlersService(SERVER);
  } catch (error) {
    console.error(`Failed to start the server: ${(error as Error).message}`);
    process.exit(1);
  }
};

StartServer();
