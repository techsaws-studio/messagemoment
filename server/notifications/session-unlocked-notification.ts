import { Server } from "socket.io";

export const SessionUnlockedNotification = async (
  io: Server,
  sessionId: string,
  username: string
) => {
  try {
    io.to(sessionId).emit("sessionUnlocked", {
      type: "MM_NOTIFICATION",
      message: "Session Unlocked",
      handlerName: username,
    });
  } catch (error) {
    console.error("Error in Session Unlocked Notification:", error);
  }
};
