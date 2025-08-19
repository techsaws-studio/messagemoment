import { Server, Socket } from "socket.io";

import { JoinRoom } from "../events/join-room.js";
import { SendMessage } from "../events/send-message.js";
import { LeaveRoom } from "../events/leave-room.js";
import { RemoveUserEvent } from "../events/chat-events/remove.js";
import { TimerEvent } from "../events/chat-events/timer.js";
import { LockEvent } from "../events/chat-events/lock.js";
import { AIResearchCompanionMessageEvent } from "../events/chat-events/ai-chat-companion-message.js";
import { ClearMessagesEvent } from "../events/chat-events/clear.js";
import { ProjectModeEvent } from "../events/chat-events/project-mode.js";
import { GetUserListEvent } from "../events/get-user-list.js";
import { ReconnectionEvent } from "../events/reconnection.js";
import { ErrorHandler } from "../events/error-handler.js";
import { Disconnect } from "../events/disconnect.js";
import { MessageTypingComplete } from "events/message-typing-complete.js";

export const SocketEventsRegistry = (io: Server, socket: Socket): void => {
  const register = (event: string, handler: Function): void => {
    handler(io, socket);
    console.info(`🧩 Registered event: ${event} on ${socket.id}`);
  };

  register("joinRoom", JoinRoom);
  register("sendMessage", SendMessage);
  register("leaveRoom", LeaveRoom);
  register("removeUser", RemoveUserEvent);
  register("timer", TimerEvent);
  register("lockSession", LockEvent);
  register("aiResearchCompanionMessage", AIResearchCompanionMessageEvent);
  register("clearMessages", ClearMessagesEvent);
  register("toggleProjectMode", ProjectModeEvent);
  register("getUserList", GetUserListEvent);
  register("attemptReconnection", ReconnectionEvent);
  register("messageTypingComplete", MessageTypingComplete);
  register("errorHandler", () => ErrorHandler(socket));

  Disconnect(socket, io);
};
