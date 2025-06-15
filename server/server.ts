import "dotenv/config";

import { createServer } from "http";

import { app } from "./app.js";
import { InitializeSocket } from "./socket.js";

import { HandleException } from "./middlewares/exception-handler.js";

import { ConnectAllDatabases } from "services/startup-connect-databases.js";
import { SetupCleanupService } from "services/startup-cleanup-data.js";
import { SetupProcessHandlers } from "services/startup-process-handlers.js";

const SERVER = createServer(app);
const PORT = process.env.PORT || 8000;

HandleException();
InitializeSocket(SERVER);
 
const StartServer = async (): Promise<void> => {
  try {
    SERVER.listen(PORT, () => {
      console.info(`Server is running on port: ${PORT}`);
    });

    await ConnectAllDatabases();
    SetupCleanupService();
    SetupProcessHandlers(SERVER);
  } catch (error) {
    console.error(`Failed to start the server: ${(error as Error).message}`);
    process.exit(1);
  }
};

StartServer();
