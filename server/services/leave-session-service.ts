import { Server } from "socket.io";

import SessionModel from "../models/session-model.js";
import ParticipantModel from "../models/participant-model.js";

import { SessionUnlockedNotification } from "../notifications/session-unlocked-notification.js";

import { FormatDuration } from "../utils/format-duration.js";

export const LeaveSessionService = async (
  sessionId: string,
  username: string,
  io: Server
) => {
  try {
    if (!sessionId || !username) {
      throw new Error("Session ID and Username are required.");
    }

    const normalizedUsername = username.toLowerCase();
    console.info(`User ${normalizedUsername} leaving session: ${sessionId}`);

    const participant = await ParticipantModel.findOne({
      sessionId,
      username: { $regex: new RegExp(`^${username}$`, "i") },
    });

    let hasLockedSession = false;
    if (participant && participant.hasLockedSession) {
      hasLockedSession = true;
    }

    // Calculate session duration
    if (!participant) {
      console.warn(`Participant ${username} not found in session ${sessionId}`);
    } else if (!participant.createdAt) {
      console.warn(
        `Participant ${username} missing creation timestamp in session ${sessionId}`
      );
    } else {
      const leaveTime = new Date();
      const sessionDurationSeconds = Math.floor(
        (leaveTime.getTime() - participant.createdAt.getTime()) / 1000
      );
      const formattedSessionDuration = FormatDuration(sessionDurationSeconds);
      console.info(
        `User ${username} session duration: ${formattedSessionDuration}`
      );

      await ParticipantModel.findOneAndUpdate(
        { _id: participant._id },
        {
          isActive: false,
          sessionDuration: sessionDurationSeconds,
          hasLeftSession: true,
        },
        { new: true }
      ).catch((err) => {
        console.error(
          `Error updating participant ${username} leave status:`,
          err
        );
      });
    }

    if (hasLockedSession) {
      try {
        await SessionModel.findOneAndUpdate(
          { sessionId },
          { sessionLocked: false }
        );

        // Send unlock notification to all users in the room
        if (io) {
          await SessionUnlockedNotification(io, sessionId, normalizedUsername);
        }
        console.info(`Session ${sessionId} unlocked because ${username} left`);
      } catch (unlockError) {
        console.error(`Error unlocking session ${sessionId}:`, unlockError);
      }
    }

    try {
      const session = await SessionModel.findOneAndUpdate(
        { sessionId },
        {
          $pull: {
            participants: {
              username: { $regex: new RegExp(`^${username}$`, "i") },
            },
          },
          $inc: { participantCount: -1 },
        },
        { new: true }
      );

      if (session && session.participantCount <= 0) {
        console.info(`Session ${sessionId} is now empty, marking as expired`);
        await SessionModel.updateOne({ sessionId }, { sessionExpired: true });
      }
    } catch (removeError: any) {
      console.error(
        `Error removing user ${username} from session ${sessionId}:`,
        removeError
      );
      throw new Error(
        `Failed to remove user from session: ${removeError.message}`
      );
    }

    return {
      success: true,
      username: normalizedUsername,
    };
  } catch (error: any) {
    console.error("Error in LeaveSessionService:", error);
    throw new Error(error.message || "Unknown error in LeaveSessionService");
  }
};
