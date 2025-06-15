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

HandleException();
InitializeSocket(SERVER);
 
const StartServer = async (): Promise<void> => {
  try {
    SERVER.listen(PORT, () => {
      console.info(`Server is running on port: ${PORT}`);
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
