import { Server, Socket } from "socket.io";

import SessionModel from "models/session-model.js";

import { FetchSessionService } from "../../services/fetch-session-service.js";

export const ClearMessagesEvent = (io: Server, socket: Socket): void => {
  socket.on("clearMessages", async (data) => {
    try {
      const { sessionId, username } = data;

      if (!sessionId || !username) {
        socket.emit("error", "Session ID and Username are required.");
        return;
      }

      const session = await FetchSessionService(sessionId);
      if (!session) {
        socket.emit("error", "Session not found.");
        return;
      }

      if (!session.isProjectModeOn) {
        socket.emit(
          "error",
          "Clear command is only available in Project Mode."
        );
        return;
      }

      const clearTimestamp = Date.now();

      await SessionModel.updateOne(
        { sessionId },
        {
          $push: {
            messageClearHistory: {
              clearedAt: clearTimestamp,
              clearedBy: username,
            },
          },
        }
      );

      io.to(sessionId).emit("messageCleared", {
        clearedBy: username,
        timestamp: clearTimestamp,
      });

      io.to(sessionId).emit("receiveMessage", {
        sender: "System",
        message: `Chat messages have been cleared by ${username}.`,
        timestamp: clearTimestamp,
        isSystemMessage: true,
      });
    } catch (error: any) {
      console.error("Error clearing messages:", error);
      socket.emit(
        "error",
        error.message || "Server error while clearing messages."
      );
    }
  });
};
