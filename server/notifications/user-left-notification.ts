import { Server } from "socket.io";

export const UserLeftNotification = async (
  io: Server,
  sessionId: string,
  username: string,
  assignedColor: number
) => {
  try {
    io.to(sessionId).emit("userLeft", {
      type: "MM_NOTIFICATION",
      message: "Left",
      handlerName: username,
      handlerColor: assignedColor,
    });
  } catch (error) {
    console.error("Error in User Left Notification:", error);
  }
};
