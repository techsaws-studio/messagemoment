import { Server, Socket } from "socket.io";

import { GetUserListPayload } from "../interfaces/events-interface.js";

import { FetchSessionService } from "../services/fetch-session-service.js";

const GetUserListEvent = (io: Server, socket: Socket): void => {
  socket.on("getUserList", async (data: GetUserListPayload) => {
    try {
      const { sessionId } = data;
      console.log(`getUserList: sessionId=${sessionId}`);

      if (!sessionId) {
        console.log("Validation failed: missing sessionId");
        socket.emit("error", "Session ID is required.");
        return;
      }

      const session = await FetchSessionService(sessionId);
      if (!session) {
        console.log(`Session not found in MongoDB: ${sessionId}`);
        socket.emit("error", "Session not found.");
        return;
      }

      // Send user list back to the requesting client
      socket.emit("userList", {
        participants: session.participants,
      });
    } catch (error: any) {
      console.error("Error fetching user list:", error);
      socket.emit(
        "error",
        error.message || "Server error while fetching user list."
      );
    }
  });
};

export { GetUserListEvent };
