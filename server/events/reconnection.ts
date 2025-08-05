import { Server, Socket } from "socket.io";

import { ReconnectPayload } from "../interfaces/events-interface.js";

import ParticipantModel from "../models/participant-model.js";
import SessionModel from "../models/session-model.js";

import { registerSocket, cancelGracePeriod } from "./disconnect.js";

import { FetchSessionService } from "../services/fetch-session-service.js";
import { FetchSessionMessagesService } from "../services/fetch-session-messages-service.js";

import { UpdateUserList } from "../utils/update-user-list.js";
import { jwtSessionManager } from "../utils/jwt-session-manager.js";

import { UserJoinedNotification } from "../notifications/user-joined-notification.js";

export const ReconnectionEvent = (io: Server, socket: Socket): void => {
  socket.on(
    "markIntentionalLeave",
    async (data: { sessionId: string; username: string }) => {
      console.info(
        `Marking intentional leave for ${data.username} in session ${data.sessionId}`
      );
    }
  );

  socket.on("attemptJWTReconnection", async (data: { token?: string }) => {
    try {
      console.info(
        `🔍 Attempting JWT-based reconnection for socket: ${socket.id}`
      );

      const { token } = data;
      if (!token) {
        console.warn("❌ No session token provided for JWT reconnection");
        socket.emit("jwtReconnectionFailed", {
          message: "No session token provided",
          redirectTo: "/join-session",
          requiresAuth: true,
        });
        return;
      }

      console.log(
        "🔑 Received token for JWT reconnection:",
        token ? "***EXISTS***" : "***MISSING***"
      );

      const sessionData = jwtSessionManager.verifySessionToken(token);
      if (!sessionData) {
        console.warn(
          "❌ Invalid or expired session token for JWT reconnection"
        );
        socket.emit("jwtReconnectionFailed", {
          message: "Invalid or expired session token",
          redirectTo: "/join-session",
          requiresAuth: true,
        });
        return;
      }

      console.log(`✅ JWT token verified for user: ${sessionData.username}`);

      const { sessionId, username, userId, assignedColor } = sessionData;

      const session = await FetchSessionService(sessionId);
      if (!session) {
        console.warn(`❌ Session not found: ${sessionId}`);
        socket.emit("jwtReconnectionFailed", {
          message: "Session no longer exists",
          redirectTo: "/expired-session",
        });
        return;
      }

      if (session.sessionExpired) {
        console.warn(`❌ Session expired: ${sessionId}`);
        socket.emit("jwtReconnectionFailed", {
          message: "Session has expired",
          redirectTo: "/expired-session",
        });
        return;
      }

      if (session.sessionLocked) {
        console.warn(`❌ Session locked: ${sessionId}`);
        socket.emit("jwtReconnectionFailed", {
          message: "Session is locked",
          redirectTo: "/locked-session",
        });
        return;
      }

      const participant = await ParticipantModel.findOne({
        sessionId,
        username: { $regex: new RegExp(`^${username}$`, "i") },
      });

      if (!participant) {
        console.warn(
          `❌ Participant not found: ${username} in session ${sessionId}`
        );
        socket.emit("jwtReconnectionFailed", {
          message: "User not found in session",
          redirectTo: "/join-session",
        });
        return;
      }

      const gracePeriodCancelled = cancelGracePeriod(sessionId, username);

      if (gracePeriodCancelled) {
        console.info(
          `✅ Grace period cancelled for ${username} - successful reconnection`
        );

        io.to(sessionId).emit("userReconnected", {
          username,
          message: `${username} has reconnected`,
        });
      }

      if (participant.hasLeftSession) {
        console.info(`User ${username} reconnecting after previous departure`);

        await ParticipantModel.findOneAndUpdate(
          { _id: participant._id },
          {
            hasLeftSession: false,
            isActive: true,
            sessionCount: (participant.sessionCount || 1) + 1,
          }
        );

        await SessionModel.findOneAndUpdate(
          { sessionId },
          { $inc: { participantCount: 1 } }
        );

        const doesParticipantExist = session.participants.some(
          (p) => p.username.toLowerCase() === username.toLowerCase()
        );

        if (!doesParticipantExist) {
          await SessionModel.findOneAndUpdate(
            { sessionId },
            {
              $push: {
                participants: {
                  userId: participant.userId,
                  username: participant.username,
                  assignedColor: participant.assignedColor,
                  joinedAt: new Date(),
                },
              },
            }
          );
        }

        if (!gracePeriodCancelled) {
          await UserJoinedNotification(io, sessionId, username, assignedColor);
        }
      }

      socket.join(sessionId);
      registerSocket(socket.id, username, sessionId);
      socket.data.sessionId = sessionId;
      socket.data.username = username;

      const newToken = jwtSessionManager.generateSessionToken({
        sessionId,
        username,
        userId,
        assignedColor,
        sessionType: sessionData.sessionType,
      });

      socket.emit("jwtReconnectionSuccessful", {
        sessionId,
        username,
        userId,
        assignedColor,
        sessionType: sessionData.sessionType,
        newToken,
        session: {
          isProjectModeOn: session.isProjectModeOn,
          sessionLocked: session.sessionLocked,
          sessionTimer: session.sessionTimer,
          timerSetBy: session.timerSetBy,
          participantCount: session.participantCount,
        },
        message: gracePeriodCancelled
          ? "Successfully reconnected within grace period"
          : "Successfully reconnected to session",
        wasGracePeriod: gracePeriodCancelled,
      });

      if (session.isProjectModeOn) {
        socket.emit("projectModeUpdate", {
          enabled: true,
          toggledBy: "[MessageMoment.com]",
        });
      }

      socket.emit("timerUpdate", {
        seconds: session.sessionTimer,
        setBy: session.timerSetBy || "[MessageMoment.com]",
        isProjectMode: session.isProjectModeOn,
      });

      try {
        const messages = await FetchSessionMessagesService(
          sessionId,
          50,
          !session.isProjectModeOn
        );

        if (messages && messages.length > 0) {
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
            timerSetBy: session.timerSetBy || "[MessageMoment.com]",
            isProjectModeOn: session.isProjectModeOn,
          });
        }
      } catch (historyError) {
        console.error(
          "Error fetching message history during reconnection:",
          historyError
        );
      }

      await UpdateUserList(io, sessionId);

      console.info(
        `✅ User ${username} successfully reconnected to session ${sessionId} via JWT (grace period: ${gracePeriodCancelled})`
      );
    } catch (error) {
      console.error(`❌ Error in JWT reconnection attempt:`, error);
      socket.emit("jwtReconnectionFailed", {
        message: "Server error during reconnection",
        redirectTo: "/error",
      });
    }
  });

  socket.on("attemptReconnection", async (data: ReconnectPayload) => {
    try {
      const { sessionId, username, fingerprint } = data;
      if (!sessionId || !username) {
        socket.emit("error", "Session ID and Username are required.");
        return;
      }

      console.info(
        `User ${username} attempting manual reconnection to session: ${sessionId}`
      );

      const session = await FetchSessionService(sessionId);
      if (!session) {
        console.warn(`Session not found for reconnection: ${sessionId}`);
        socket.emit("reconnectionFailed", {
          message: "Session no longer exists",
          redirectTo: "/expired-session",
        });
        return;
      }

      if (session.sessionExpired) {
        console.warn(`Session expired for reconnection: ${sessionId}`);
        socket.emit("reconnectionFailed", {
          message: "Session has expired",
          redirectTo: "/expired-session",
        });
        return;
      }

      if (session.sessionLocked) {
        console.warn(`Session locked for reconnection: ${sessionId}`);
        socket.emit("reconnectionFailed", {
          message: "Session is locked",
          redirectTo: "/locked-session",
        });
        return;
      }

      const participant = await ParticipantModel.findOne({
        sessionId,
        username: { $regex: new RegExp(`^${username}$`, "i") },
      });

      if (!participant) {
        console.warn(
          `User ${username} not found in session ${sessionId} for reconnection`
        );
        socket.emit("reconnectionFailed", {
          message: "User not found in session",
          redirectTo: "/join-session",
        });
        return;
      }

      const gracePeriodCancelled = cancelGracePeriod(sessionId, username);

      if (participant.hasLeftSession) {
        if (
          fingerprint &&
          participant.fingerprint &&
          participant.fingerprint !== fingerprint
        ) {
          console.warn(
            `Fingerprint mismatch for user ${username} trying to reconnect to session ${sessionId}`
          );
          socket.emit("reconnectionFailed", {
            message:
              "The Display Name you entered was previously used in this session and cannot be reused.",
            redirectTo: "/join-session",
          });
          return;
        }

        console.info(
          `User ${username} reconnecting after previously leaving session ${sessionId}`
        );

        await ParticipantModel.findOneAndUpdate(
          { _id: participant._id },
          {
            hasLeftSession: false,
            isActive: true,
            sessionCount: (participant.sessionCount || 1) + 1,
          }
        );

        await SessionModel.findOneAndUpdate(
          { sessionId },
          { $inc: { participantCount: 1 } }
        );

        const doesParticipantExist = session.participants.some(
          (p) => p.username.toLowerCase() === username.toLowerCase()
        );

        if (!doesParticipantExist) {
          await SessionModel.findOneAndUpdate(
            { sessionId },
            {
              $push: {
                participants: {
                  userId: participant.userId,
                  username: participant.username,
                  assignedColor: participant.assignedColor,
                  joinedAt: new Date(),
                },
              },
            }
          );
        }

        if (!gracePeriodCancelled) {
          await UserJoinedNotification(
            io,
            sessionId,
            username,
            participant.assignedColor
          );
        }
      }

      socket.join(sessionId);
      registerSocket(socket.id, username, sessionId);
      socket.data.sessionId = sessionId;
      socket.data.username = username;

      try {
        const sessionToken = jwtSessionManager.generateSessionToken({
          sessionId,
          username,
          userId: participant.userId,
          assignedColor: participant.assignedColor,
          sessionType: session.sessionType,
        });

        socket.emit("sessionTokenGenerated", {
          token: sessionToken,
          expiresIn: "24h",
        });

        console.info(
          `JWT token generated for manual reconnection: ${username}`
        );
      } catch (tokenError) {
        console.error(
          "Error generating token for manual reconnection:",
          tokenError
        );
      }

      socket.emit("reconnectionSuccessful", {
        sessionId,
        username,
        message: gracePeriodCancelled
          ? "Successfully reconnected within grace period"
          : "Successfully reconnected to session",
        wasGracePeriod: gracePeriodCancelled,
      });

      socket.emit("getUserList", { sessionId });

      if (gracePeriodCancelled) {
        io.to(sessionId).emit("userReconnected", {
          username,
          message: `${username} has reconnected`,
        });
      }

      console.info(
        `User ${username} successfully reconnected to session ${sessionId} (grace period: ${gracePeriodCancelled})`
      );
    } catch (error) {
      console.error(`Error in manual reconnection attempt:`, error);
      socket.emit("reconnectionFailed", {
        message: "Server error during reconnection",
        redirectTo: "/error",
      });
    }
  });
};
