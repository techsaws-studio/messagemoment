import { Server } from "socket.io";

import SessionModel from "../models/session-model.js";

export const UpdateUserList = async (io: Server, sessionId: string) => {
  try {
    console.log(`Updating user list for session: ${sessionId}`);
    const session = await SessionModel.findOne({ sessionId });

    if (!session) {
      console.warn(`Session not found for updating user list: ${sessionId}`);
      return;
    }

    io.to(sessionId).emit("userList", {
      participants: session.participants,
    });

    const users = session.participants.map((p) => p.username);
    io.to(sessionId).emit("updateUserList", { users });

    console.log(
      `User list updated for session ${sessionId} with ${session.participants.length} participants`
    );
  } catch (error) {
    console.error("Error updating user list:", error);
  }
};
