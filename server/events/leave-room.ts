import { Server, Socket } from "socket.io";

import { unregisterSocket, markIntentionalLeave } from "./disconnect.js";

import { LeaveSessionService } from "../services/leave-session-service.js";
import { FetchSessionService } from "../services/fetch-session-service.js";

import { UserLeftNotification } from "../notifications/user-left-notification.js";

import { UpdateUserList } from "../utils/update-user-list.js";

const LeaveRoom = (io: Server, socket: Socket): void => {
  socket.on("leaveRoom", async (data) => {
    try {
      const { sessionId, username } = data;
      if (!sessionId || !username) {
        socket.emit("error", "Session ID and Username are required.");
        return;
      }

      console.info(
        `User ${username} intentionally leaving session: ${sessionId}`
      );

      markIntentionalLeave(sessionId, username);

      const session = await FetchSessionService(sessionId);
      if (!session) {
        console.warn(`Session not found for sessionId: ${sessionId}`);
        socket.leave(sessionId);
        unregisterSocket(socket.id);
        socket.emit("leftRoom", { success: true });
        return;
      }

      const participant = session.participants.find(
        (p) => p.username.toLowerCase() === username.toLowerCase()
      );
      const assignedColor = participant ? participant.assignedColor : 0;

      try {
        unregisterSocket(socket.id);

        await LeaveSessionService(sessionId, username, io);
        await UserLeftNotification(io, sessionId, username, assignedColor);
        await UpdateUserList(io, sessionId);

        socket.leave(sessionId);

        socket.emit("leftRoom", { success: true });

        console.info(`User ${username} successfully left session ${sessionId}`);
      } catch (leaveError: any) {
        console.error("Error processing leave room:", leaveError);

        socket.leave(sessionId);
        unregisterSocket(socket.id);

        socket.emit("leftRoom", {
          success: true,
          warning:
            "There was an issue updating the server state, but you have been removed from the session.",
        });
      }
    } catch (error: any) {
      console.error("Error leaving room:", error);
      socket.emit("error", error.message || "Server error while leaving room.");

      try {
        if (data && data.sessionId && data.username) {
          markIntentionalLeave(data.sessionId, data.username);
          socket.leave(data.sessionId);
          unregisterSocket(socket.id);
        }
      } catch (cleanupError) {
        console.error("Error during cleanup after failed leave:", cleanupError);
      }
    }
  });
};

export { LeaveRoom };
