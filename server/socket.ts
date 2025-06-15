import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { SocketConfiguration } from "./middlewares/socket-configuration.js";
import { SocketEventsRegistry } from "./routes/socket-events-registry.js";
import { GlobalSocketListeners } from "./middlewares/socket-globals.js";

let io: SocketIOServer;

const InitializeSocket = (server: HttpServer): void => {
  io = SocketConfiguration(server);
  GlobalSocketListeners(io);

  io.on("connection", (socket) => {
    console.info(`✅ Socket connected: ${socket.id}`);
    SocketEventsRegistry(io, socket);
  });
};

export { io, InitializeSocket };
