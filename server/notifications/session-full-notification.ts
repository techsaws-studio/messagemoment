import { Server } from "socket.io";

import { FetchSessionService } from "../services/fetch-session-service.js";

export const SessionFullNotification = async (
  io: Server,
  sessionId: string
) => {
  try {
    const updatedSession = await FetchSessionService(sessionId);
    if (!updatedSession) {
      console.warn(`Session not found for sessionId: ${sessionId}`);
      return;
    }
    
    if (updatedSession.participantCount === 10) {
      io.to(sessionId).emit("sessionFull", {
        type: "MM_ERROR_MSG",
        message:
          "The chat session is full! There are currently 10/10 users joined.",
      });
    }
  } catch (error) {
    console.error("Error in Session Full Notification:", error);
  }
};
