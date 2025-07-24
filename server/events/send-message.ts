import type { Server, Socket } from "socket.io";

import type { SendMessagePayload } from "../interfaces/events-interface.js";

import { PublishToRedisChannel } from "../databases/redis-database.js";

import MessageModel from "../models/message-model.js";

import { FetchSessionService } from "../services/fetch-session-service.js";

const SendMessage = (io: Server, socket: Socket): void => {
  socket.on("sendMessage", async (data: SendMessagePayload) => {
    try {
      const { sessionId, username, message } = data;
      console.log(
        `sendMessage: sessionId=${sessionId}, username=${username}, message=${message}`
      );

      if (!sessionId || !username || !message) {
        console.log(
          "Validation failed: missing sessionId, username, or message"
        );
        socket.emit("error", "Session ID, username, and message are required.");
        return;
      }

      if (message.trim().length === 0) {
        console.log("Validation failed: empty message");
        socket.emit("error", "Message cannot be empty.");
        return;
      }

      const session = await FetchSessionService(sessionId);
      if (!session) {
        console.log(`Session not found in MongoDB: ${sessionId}`);
        socket.emit("error", "Session not found.");
        return;
      }

      if (session.sessionExpired) {
        console.log(`Session is expired: ${sessionId}`);
        socket.emit("error", "Session is expired.");
        return;
      }

      const timestamp = Date.now();

      if (session.isProjectModeOn && message.startsWith("/mm ")) {
        const gptMessage = message.substring(4).trim();

        if (gptMessage.length === 0) {
          socket.emit("error", "Please provide a message after /mm");
          return;
        }

        socket.emit("gptMessage", {
          sessionId,
          username,
          message: gptMessage,
        });

        try {
          await new MessageModel({
            sessionId,
            username,
            message: message.trim(),
            timestamp,
            displayExpiresAt: null,
            isSystemMessage: false,
            isPermanent: session.isProjectModeOn,
          }).save();
        } catch (dbError) {
          console.error("Failed to save /mm command to database:", dbError);
        }

        return;
      }

      const participant = session.participants.find(
        (p) => p.username.toLowerCase() === username.toLowerCase()
      );
      if (!participant) {
        console.log(
          `User ${username} not a participant in session ${sessionId}`
        );
        socket.emit("error", "User is not a participant in this session.");
        return;
      }

      const displayExpiresAt = session.isProjectModeOn
        ? null
        : new Date(timestamp + session.sessionTimer * 1000);

      const isSystemMessage = username === "System";
      const isAIMessage = username === "ChatGPT";

      try {
        await new MessageModel({
          sessionId,
          username,
          message: message.trim(),
          timestamp,
          displayExpiresAt,
          isSystemMessage,
          isAIMessage,

          isPermanent:
            session.isProjectModeOn || isSystemMessage || isAIMessage,
        }).save();
        console.log(
          `Message saved to MongoDB: sessionId=${sessionId}, username=${username}, message=${message}, isPermanent=${
            session.isProjectModeOn || isSystemMessage || isAIMessage
          }`
        );
      } catch (dbError: any) {
        console.error(`Failed to save message to MongoDB: ${dbError.message}`);
        socket.emit("error", "Failed to save message, but it will be sent.");
      }

      const messageData = {
        sessionId,
        sender: username,
        message: message.trim(),
        timestamp,
        isSystem: isSystemMessage,
        isAI: isAIMessage,
        isPermanent: session.isProjectModeOn,
        assignedColor: participant ? participant.assignedColor : 0,
      };
      console.log(
        `Publishing to Redis channel chatRoom:${sessionId}:`,
        messageData
      );
      await PublishToRedisChannel(
        `chatRoom:${sessionId}`,
        JSON.stringify(messageData)
      );
      console.info(
        `Message from ${username} published to chatRoom:${sessionId}`
      );

      console.log(
        `Temporary Fallback: Emitting receiveMessage directly to room ${sessionId}`
      );

      io.to(sessionId).emit("receiveMessage", {
        sender: username,
        message: message.trim(),
        timestamp,
        isSystem: isSystemMessage,
        isAI: isAIMessage,
        isPermanent: session.isProjectModeOn,
        timerValue: session.sessionTimer,
        assignedColor: participant ? participant.assignedColor : 0,
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      socket.emit(
        "error",
        error.message || "Server error while sending message."
      );
    }
  });
};

export { SendMessage };
