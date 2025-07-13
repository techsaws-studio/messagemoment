import { Server } from "socket.io";

import SessionModel from "../models/session-model.js";
import ParticipantModel from "../models/participant-model.js";

import { SessionUnlockedNotification } from "../notifications/session-unlocked-notification.js";

import { MessageCleanupService } from "./message-cleanup-service.js";

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

    const cleanUsername = username.replace(/[\[\]]/g, "");
    const usernameRegex = new RegExp(
      `^\\[?${cleanUsername.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]?$`,
      "i"
    );

    const participant = await ParticipantModel.findOne({
      sessionId,
      username: { $regex: usernameRegex },
    });

    console.info(`Found participant for ${username}:`, {
      found: !!participant,
      isActive: participant?.isActive,
      hasLeftSession: participant?.hasLeftSession,
      participantId: participant?._id,
    });

    let hasLockedSession = false;
    if (participant && participant.hasLockedSession) {
      hasLockedSession = true;
    }

    if (!participant) {
      console.warn(`Participant ${username} not found in session ${sessionId}`);
    } else {
      let sessionDurationSeconds = 0;
      if (participant.createdAt) {
        const leaveTime = new Date();
        sessionDurationSeconds = Math.floor(
          (leaveTime.getTime() - participant.createdAt.getTime()) / 1000
        );
        const formattedSessionDuration = FormatDuration(sessionDurationSeconds);
        console.info(
          `User ${username} session duration: ${formattedSessionDuration}`
        );
      } else {
        console.warn(
          `Participant ${username} missing creation timestamp in session ${sessionId}, using duration 0`
        );
      }

      console.info(
        `Attempting to update participant ${username} with ID: ${participant._id}`
      );

      const updatedParticipant = await ParticipantModel.updateOne(
        { _id: participant._id },
        {
          $set: {
            isActive: false,
            sessionDuration: sessionDurationSeconds,
            hasLeftSession: true,
          },
        },
        {
          writeConcern: { w: "majority", j: true },
        }
      ).catch((err) => {
        console.error(
          `Error updating participant ${username} leave status:`,
          err
        );
        throw err;
      });

      if (updatedParticipant.matchedCount === 0) {
        console.error(
          `Failed to update participant ${username} - no document matched`
        );
        throw new Error(`Failed to update participant ${username}`);
      }

      const verifyUpdate = await ParticipantModel.findById(participant._id);
      console.info(`Database verification for ${username}:`, {
        isActive: verifyUpdate?.isActive,
        hasLeftSession: verifyUpdate?.hasLeftSession,
        sessionDuration: verifyUpdate?.sessionDuration,
      });
    }

    if (hasLockedSession) {
      try {
        await SessionModel.findOneAndUpdate(
          { sessionId },
          { sessionLocked: false },
          { writeConcern: { w: "majority", j: true } }
        );

        if (io) {
          await SessionUnlockedNotification(io, sessionId, normalizedUsername);
        }
        console.info(`Session ${sessionId} unlocked because ${username} left`);
      } catch (unlockError) {
        console.error(`Error unlocking session ${sessionId}:`, unlockError);
      }
    }

    try {
      const session = await SessionModel.findOne({ sessionId });
      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      console.info(
        `Session before update - participantCount: ${
          session.participantCount
        }, participants: ${JSON.stringify(session.participants)}`
      );

      const participantIndex = session.participants.findIndex(
        (p) => p.username.toLowerCase() === username.toLowerCase()
      );

      if (participantIndex !== -1) {
        await SessionModel.updateOne(
          { sessionId },
          {
            $pull: { participants: { username: { $regex: usernameRegex } } },
            $inc: { participantCount: -1 },
          },
          { writeConcern: { w: "majority", j: true } }
        );
        console.info(
          `Successfully removed participant ${username} from session ${sessionId}`
        );
      } else {
        console.warn(
          `Participant ${username} not found in session ${sessionId} participants array`
        );
        await SessionModel.updateOne(
          { sessionId },
          { $inc: { participantCount: -1 } },
          { writeConcern: { w: "majority", j: true } }
        );
      }

      const updatedSession = await SessionModel.findOne({ sessionId });
      console.info(
        `Session after update - participantCount: ${
          updatedSession?.participantCount
        }, participants: ${JSON.stringify(updatedSession?.participants)}`
      );

      if (updatedSession && updatedSession.participantCount <= 0) {
        console.info(`Session ${sessionId} is now empty, marking as expired`);
        await SessionModel.updateOne(
          { sessionId },
          { sessionExpired: true },
          { writeConcern: { w: "majority", j: true } }
        );

        const deletedCount =
          await MessageCleanupService.cleanupSpecificSessionMessages(sessionId);
        console.info(
          `Cleaned up ${deletedCount} messages for expired session ${sessionId}`
        );
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

    const finalParticipantCheck = participant
      ? await ParticipantModel.findById(participant._id)
      : null;
    const finalSessionCheck = await SessionModel.findOne({ sessionId });

    console.info(`Final verification for ${username}:`, {
      participantIsActive: finalParticipantCheck?.isActive,
      participantHasLeftSession: finalParticipantCheck?.hasLeftSession,
      sessionParticipantCount: finalSessionCheck?.participantCount,
      participantsInArray: finalSessionCheck?.participants.length,
      userStillInArray: finalSessionCheck?.participants.some(
        (p) => p.username.toLowerCase() === username.toLowerCase()
      ),
    });

    return {
      success: true,
      username: normalizedUsername,
    };
  } catch (error: any) {
    console.error("Error in LeaveSessionService:", error);
    throw new Error(error.message || "Unknown error in LeaveSessionService");
  }
};
