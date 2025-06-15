import { Server, Socket } from "socket.io";

import { RemoveUserPayload } from "../../interfaces/events-interface.js";

import SessionModel from "../../models/session-model.js";
import ParticipantModel from "../../models/participant-model.js";

import { getSocketInfo } from "../disconnect.js";

import { FetchSessionService } from "../../services/fetch-session-service.js";

import { UpdateUserList } from "../../utils/update-user-list.js";

const RemoveUserEvent = (io: Server, socket: Socket): void => {
  socket.on("removeUser", async (data: RemoveUserPayload) => {
    try {
      const { sessionId, username, targetUsername } = data;
      console.info(
        `User ${username} attempting to remove ${targetUsername} from session: ${sessionId}`
      );

      if (!sessionId || !username || !targetUsername) {
        socket.emit(
          "error",
          "Session ID, username, and target username are required."
        );
        return;
      }

      // Can't remove yourself
      if (username.toLowerCase() === targetUsername.toLowerCase()) {
        socket.emit(
          "error",
          "You cannot remove yourself from the session. Use the leave button instead."
        );
        return;
      }

      // Fetch session
      const session = await FetchSessionService(sessionId);
      if (!session) {
        socket.emit("error", "Session not found.");
        return;
      }

      // Check if session is active
      if (session.sessionExpired) {
        socket.emit("error", "Session is expired.");
        return;
      }

      // Verify target user exists in the session
      const normalizedTargetUsername = targetUsername.toLowerCase();
      const targetParticipant = session.participants.find(
        (p) => p.username.toLowerCase() === normalizedTargetUsername
      );

      if (!targetParticipant) {
        socket.emit(
          "error",
          `User '${targetUsername}' is not in this session.`
        );
        return;
      }

      // Store the assigned color for notifications
      const assignedColor = targetParticipant.assignedColor;

      // Find the socket of the target user to disconnect them
      const connectedSockets = await io.in(sessionId).fetchSockets();
      const targetSocketId = connectedSockets.find((s) => {
        const info = getSocketInfo(s.id);
        return info && info.username.toLowerCase() === normalizedTargetUsername;
      })?.id;

      // *** DIRECT DATABASE OPERATIONS INSTEAD OF USING LeaveSessionService ***
      try {
        await ParticipantModel.findOneAndUpdate(
          {
            sessionId,
            username: { $regex: new RegExp(`^${targetUsername}$`, "i") },
          },
          {
            isActive: false,
            hasLeftSession: true,
          }
        );

        await SessionModel.findOneAndUpdate(
          { sessionId },
          {
            $pull: { participants: { userId: targetParticipant.userId } },
            $inc: { participantCount: -1 },
          }
        );

        const updatedSession = await FetchSessionService(sessionId);
        if (updatedSession && updatedSession.participantCount <= 0) {
          await SessionModel.updateOne(
            { sessionId },
            { $set: { sessionExpired: true } }
          );
        }
      } catch (dbError) {
        console.error("Database error during user removal:", dbError);
        socket.emit(
          "error",
          "Database error while removing user. Please try again."
        );
        return;
      }

      // Notify all users in the session about the removal
      io.to(sessionId).emit("userRemoved", {
        removedBy: username,
        removedUser: targetUsername,
        timestamp: Date.now(),
      });

      // Send system message
      io.to(sessionId).emit("receiveMessage", {
        sender: "System",
        message: `${targetUsername} has been removed from the session by ${username}.`,
        timestamp: Date.now(),
      });

      // Update the user list for everyone
      io.to(sessionId).emit("getUserList", { sessionId });

      await UpdateUserList(io, sessionId);

      if (targetSocketId) {
        io.to(targetSocketId).emit("youWereRemoved", {
          removedBy: username,
          message: `You have been removed from the session by ${username}.`,
        });

        const targetSocket = io.sockets.sockets.get(targetSocketId);
        if (targetSocket) {
          targetSocket.leave(sessionId);
        }
      }
    } catch (error: any) {
      console.error("Error removing user:", error);
      socket.emit(
        "error",
        error.message || "Server error while removing user."
      );
    }
  });
};

export { RemoveUserEvent };
