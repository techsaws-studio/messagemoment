import "dotenv/config";

import type { Server, Socket } from "socket.io";

import type { JoinRoomPayload } from "../interfaces/events-interface.js";
import { SessionTypeEnum } from "../enums/session-enum.js";

import { RedisDatabase } from "../databases/redis-database.js";

import { ValidateUsername } from "../validations/validate-username.js";
import { ValidateSessionSecurityCode } from "../validations/validate-session-security-code.js";

import { registerSocket } from "../events/disconnect.js";

import { CreateSessionService } from "../services/create-session-service.js";
import { CreateParticipantService } from "../services/create-participant-service.js";
import { UpdateSessionParticipantsService } from "../services/update-session-participants-service.js";
import { DeleteSessionLinkService } from "../services/delete-session-link-service.js";
import { FetchSessionService } from "../services/fetch-session-service.js";
import { FetchSessionMessagesService } from "../services/fetch-session-messages-service.js";

import { UpdateUserList } from "../utils/update-user-list.js";
import { jwtSessionManager } from "../utils/jwt-session-manager.js";

import { UserJoinedNotification } from "../notifications/user-joined-notification.js";
import { SessionFullNotification } from "../notifications/session-full-notification.js";

const JoinRoom = (io: Server, socket: Socket): void => {
  socket.on("joinRoom", async (data: JoinRoomPayload) => {
    try {
      const { sessionId, sessionSecurityCode, username, fingerprint } = data;
      console.info(`User attempting to join session: ${sessionId}`);

      if (!sessionId || !username) {
        socket.emit("error", "Session ID and Username are required.");
        return;
      }

      if (!RedisDatabase) {
        console.error("RedisDatabase is not initialized.");
        socket.emit("error", "Database connection error. Please try again.");
        return;
      }

      const sessionData = await RedisDatabase.get(sessionId);
      let session = await FetchSessionService(sessionId);

      if (sessionData && !session) {
        console.log(`Creating new session in MongoDB from Redis data`);
        const parsedSession = JSON.parse(sessionData);
        session = await CreateSessionService(parsedSession);
        await DeleteSessionLinkService(sessionId);
      }

      if (!session) {
        socket.emit("redirect", "/expired-session");
        return;
      }

      if (session.sessionExpired) {
        socket.emit("redirect", "/expired-session");
        return;
      }

      if (session.sessionLocked) {
        socket.emit("redirect", "/session-locked");
        return;
      }

      if (session.isProjectModeOn) {
        socket.emit("projectModeUpdate", {
          enabled: true,
          toggledBy: "System",
        });

        console.info(`Sending project mode status to new user ${username}`);
      }

      const usernameValid = await ValidateUsername(
        session,
        username,
        socket,
        fingerprint
      );

      if (!usernameValid) return;

      if (session.sessionType === SessionTypeEnum.SECURE) {
        if (
          !ValidateSessionSecurityCode(session, sessionSecurityCode, socket)
        ) {
          return;
        }
      }

      if (session.participantCount >= 10) {
        socket.emit("redirect", "/full-session");
        return;
      }

      const participant = await CreateParticipantService(
        session,
        username,
        socket,
        fingerprint
      );

      await UpdateSessionParticipantsService(session, participant);

      socket.join(sessionId);
      console.info(`Socket ${socket.id} joined room ${sessionId}`);

      registerSocket(socket.id, username, sessionId);

      try {
        const sessionToken = jwtSessionManager.generateSessionToken({
          sessionId: session.sessionId,
          username: participant.username,
          userId: participant.userId,
          assignedColor: participant.assignedColor,
          sessionType: session.sessionType,
        });

        socket.emit("sessionTokenGenerated", {
          token: sessionToken,
          expiresIn: "24h",
          secure: process.env.NODE_ENV === "production",
        });

        console.info(
          `JWT session token generated for user: ${username} in session: ${sessionId}`
        );
      } catch (tokenError) {
        console.error("Error generating session token:", tokenError);
      }

      await UserJoinedNotification(
        io,
        sessionId,
        username,
        participant.assignedColor
      );

      socket.emit("setActiveUser", { username });

      await UpdateUserList(io, sessionId);
      await SessionFullNotification(io, sessionId);

      socket.emit("joinedRoom", {
        sessionId,
        userId: participant.userId,
        assignedColor: participant.assignedColor,
        message: "Successfully joined room",
        isProjectModeOn: session.isProjectModeOn,
        sessionData: {
          sessionId: session.sessionId,
          username: participant.username,
          userId: participant.userId,
          assignedColor: participant.assignedColor,
          sessionType: session.sessionType,
        },
        session: {
          sessionTimer: session.sessionTimer,
          isExpirationTimeSet: session.isExpirationTimeSet,
          timerSetBy: session.timerSetBy,
          isProjectModeOn: session.isProjectModeOn,
          sessionLocked: session.sessionLocked,
          sessionLockedBy: session.sessionLockedBy,
          participantCount: session.participantCount,
        },
      });

      // socket.emit("timerUpdate", {
      //   seconds: session.sessionTimer,
      //   setBy: session.timerSetBy || "System",
      //   isProjectMode: session.isProjectModeOn,
      // });

      try {
        const messages = await FetchSessionMessagesService(
          sessionId,
          50,
          !session.isProjectModeOn
        );

        if (messages && messages.length > 0) {
          console.info(
            `Sending ${messages.length} historical messages to new user ${username}`
          );

          socket.emit("historicalMessages", {
            messages: messages.map((msg) => ({
              sender: msg.username,
              message: msg.message,
              timestamp: msg.timestamp,
              isSystem: msg.isSystemMessage || false,
              isAI: msg.isAIMessage || false,
              expiresAt: msg.displayExpiresAt
                ? msg.displayExpiresAt.getTime()
                : null,
              isPermanent: msg.isPermanent || false,
              timerValue: msg.timerValue || session.sessionTimer,
            })),
            timerSeconds: session.sessionTimer,
            timerSetBy: session.timerSetBy || "System",
            isProjectModeOn: session.isProjectModeOn,
          });
        }
      } catch (historyError) {
        console.error("Error fetching message history:", historyError);
      }

      socket.data.sessionId = sessionId;
      socket.data.username = username;
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", "Server error while joining room.");
    }
  });
};

export { JoinRoom };
