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

      // Check session state
      if (session.sessionExpired) {
        socket.emit("error", "Session is expired.");
        return;
      }

      // Handle session lock state
      if (session.sessionLocked) {
        const lockedByUser = await ParticipantModel.findOne({
          sessionId,
          hasLockedSession: true,
        });

        // Handle lock request on already locked session
        if (isLocking) {
          socket.emit(
            "error",
            `Session is already locked by ${
              lockedByUser?.username || "another user"
            }.`
          );
          return;
        }

        // Handle unlock request when not the user who locked it
        if (!isLocking) {
          if (!lockedByUser) {
            // Continue with unlock as a recovery mechanism
          } else if (!SameUsernameChecker(lockedByUser.username, username)) {
            socket.emit(
              "error",
              `Only ${lockedByUser.username} can unlock this session.`
            );
            return;
          }
        }
      } else if (!isLocking) {
        socket.emit("error", "Session is not locked.");
        return;
      }

      // Update session lock status in DB
      await SessionModel.updateOne(
        { sessionId },
        { $set: { sessionLocked: isLocking } }
      );

      // Update participant lock status
      if (isLocking) {
        await ParticipantModel.updateMany(
          { sessionId },
          { $set: { hasLockedSession: false } }
        );

        // Set current user as lock holder (case-insensitive username match)
        await ParticipantModel.updateOne(
          { sessionId, username: { $regex: new RegExp(`^${username}$`, "i") } },
          { $set: { hasLockedSession: true } }
        );
      } else {
        // Clear lock status on unlock
        await ParticipantModel.updateMany(
          { sessionId, hasLockedSession: true },
          { $set: { hasLockedSession: false } }
        );
      }

      // Notify all session participants (only one notification)
      io.to(sessionId).emit("lockStatusUpdate", {
        locked: isLocking,
        lockedBy: isLocking ? username : null,
        unlockedBy: !isLocking ? username : null,
      });

      // Don't send a separate system message - the client will handle this from lockStatusUpdate
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
