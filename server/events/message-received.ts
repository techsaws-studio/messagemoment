import { io } from "../socket.js";

import { SubscribeToRedisChannel } from "../databases/redis-database.js";

const MessageReceived = (): void => {
  console.log("Subscribing to Redis channel: chatRoom:*");
  
  SubscribeToRedisChannel("chatRoom:*", (message: string) => {
    try {
      console.log("Redis received raw message:", message);
      const parsedMessage = JSON.parse(message);
      const {
        sessionId,
        sender,
        message: msg,
        timestamp,
        isSystem,
        isAI,
      } = parsedMessage;

      if (!sessionId || !sender || !msg || !timestamp) {
        console.error("Invalid message format:", parsedMessage);
        return;
      }

      console.log(`Emitting receiveMessage to room ${sessionId}:`, {
        sender,
        message: msg,
        timestamp,
        isSystem: isSystem || false,
        isAI: isAI || false,
      });

      io.to(sessionId).emit("receiveMessage", {
        sender,
        message: msg,
        timestamp,
        isSystem: isSystem || false,
        isAI: isAI || false,
      });

      io.in(sessionId)
        .allSockets()
        .then((clients) => {
          console.log(
            `Number of clients in room ${sessionId}: ${clients.size}`
          );
          if (clients.size === 0) {
            console.warn(
              `No clients found in room ${sessionId}. Users may not have joined the room correctly.`
            );
          }
        });

      console.info(
        `Message from ${sender} sent to clients in session ${sessionId}`
      );
    } catch (error: any) {
      console.error("Error processing received message:", error.message);
    }
  });
};

export { MessageReceived };
