import { Server } from "socket.io";

export const UserJoinedNotification = async (
  io: Server,
  sessionId: string,
  username: string,
  assignedColor: number
) => {
  try {
    io.to(sessionId).emit("userJoined", {
      type: "MM_NOTIFICATION",
      message: "Joined",
      handlerName: username,
      handlerColor: assignedColor,
    });
  } catch (error) {
    console.error("Error in User Joined Notification:", error);
  }
};
