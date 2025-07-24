import { Server, Socket } from "socket.io";

import SessionModel from "../../models/session-model.js";
import ParticipantModel from "../../models/participant-model.js";

import { FetchSessionService } from "../../services/fetch-session-service.js";

import { SameUsernameChecker } from "../../utils/same-username-checker.js";

const LockEvent = (io: Server, socket: Socket): void => {
  socket.on("lockSession", async ({ sessionId, username, isLocking }) => {
    try {
      if (!sessionId || !username) {
        socket.emit("error", "Session ID and Username are required.");
        return;
      }

      const session = await FetchSessionService(sessionId);
      if (!session) {
        socket.emit("error", "Session not found.");
        return;
      }

      if (session.sessionExpired) {
        socket.emit(
          "error",
          "This chat session has expired. Return to the homepage to generate a new chat session."
        );
        return;
      }

      if (session.sessionLocked) {
        if (isLocking) {
          socket.emit(
            "error",
            `Session is already locked by ${
              session.sessionLockedBy || "another user"
            }.`
          );
          return;
        }

        if (!isLocking) {
          if (!session.sessionLockedBy) {
          } else if (!SameUsernameChecker(session.sessionLockedBy, username)) {
            socket.emit(
              "error",
              `Only ${session.sessionLockedBy} can unlock this session.`
            );
            return;
          }
        }
      } else if (!isLocking) {
        socket.emit("error", "Session is not locked.");
        return;
      }

      await SessionModel.updateOne(
        { sessionId },
        {
          $set: {
            sessionLocked: isLocking,
            sessionLockedBy: isLocking ? username : null,
          },
        }
      );

      if (isLocking) {
        await ParticipantModel.updateMany(
          { sessionId },
          { $set: { hasLockedSession: false } }
        );

        await ParticipantModel.updateOne(
          { sessionId, username: { $regex: new RegExp(`^${username}$`, "i") } },
          { $set: { hasLockedSession: true } }
        );
      } else {
        await ParticipantModel.updateMany(
          { sessionId, hasLockedSession: true },
          { $set: { hasLockedSession: false } }
        );
      }

      io.to(sessionId).emit("lockStatusUpdate", {
        locked: isLocking,
        lockedBy: isLocking ? username : null,
        unlockedBy: !isLocking ? username : null,
      });
    } catch (error: any) {
      console.error("Error handling lock/unlock command:", error);
      socket.emit(
        "error",
        error.message || "Server error while processing lock command."
      );
    }
  });
};

export { LockEvent };
