import { Server as SocketServer } from "socket.io";

import { JoinRoom } from "./events/join-room.js";
import { SendMessage } from "./events/send-message.js";
import { Disconnect } from "./events/disconnect.js";
import { MessageReceived } from "./events/message-received.js";
import { ErrorHandler } from "./events/error-handler.js";
import { LeaveRoom } from "./events/leave-room.js";
import { TimerEvent } from "./events/chat-events/timer.js";
import { LockEvent } from "./events/chat-events/lock.js";
import { RemoveUserEvent } from "./events/chat-events/remove.js";
import { ChatGPTMessageEvent } from "./events/chat-events/chatgpt-message.js";
import { ProjectModeEvent } from "./events/chat-events/project-mode.js";
import { GetUserListEvent } from "./events/get-user-list.js";
import { ReconnectionEvent } from "./events/reconnection.js";
import { ClearMessagesEvent } from "./events/chat-events/clear.js";

let io: SocketServer;
let messageReceiverInitialized = false;

const InitializeSocket = (server: any) => {
  io = new SocketServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    pingTimeout: 30000,
    pingInterval: 15000,
    connectTimeout: 30000,
    maxHttpBufferSize: 10 * 1024 * 1024,
    transports: ["websocket", "polling"],
    allowUpgrades: true,
    path: "/socket.io",
    cleanupEmptyChildNamespaces: true,
  });

  io.engine.on("connection_error", (err) => {
    console.error("Connection error:", err);
  });

  io.on("connection", (socket) => {
    console.info(`New socket connection: ${socket.id}`);

    const registeredEvents = new Set();

    const registerHandler = (eventName: string, handlerFn: Function) => {
      if (!registeredEvents.has(eventName)) {
        registeredEvents.add(eventName);
        handlerFn(io, socket);
        console.log(
          `Registered handler for ${eventName} on socket ${socket.id}`
        );
      }
    };

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.info(
        `Socket ${socket.id} reconnection attempt #${attemptNumber}`
      );
    });

    socket.on("reconnect", () => {
      console.info(`Socket ${socket.id} reconnected successfully`);
    });

    socket.on("reconnect_error", (err) => {
      console.error(`Socket ${socket.id} reconnection error:`, err);
    });

    registerHandler("joinRoom", JoinRoom);
    registerHandler("sendMessage", SendMessage);
    registerHandler("leaveRoom", LeaveRoom);
    registerHandler("removeUser", RemoveUserEvent);
    registerHandler("timer", TimerEvent);
    registerHandler("lockSession", LockEvent);
    registerHandler("gptMessage", ChatGPTMessageEvent);
    registerHandler("clearMessages", ClearMessagesEvent);
    registerHandler("toggleProjectMode", ProjectModeEvent);
    registerHandler("getUserList", GetUserListEvent);
    registerHandler("attemptReconnection", ReconnectionEvent);

    registerHandler("errorHandler", () => ErrorHandler(socket));

    Disconnect(socket, io);
  });

  if (!messageReceiverInitialized) {
    MessageReceived();
    messageReceiverInitialized = true;
    console.info("MessageReceived initialized once for the server");
  }
};

export { io, InitializeSocket };
