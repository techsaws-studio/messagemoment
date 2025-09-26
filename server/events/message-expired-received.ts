import { io } from "../socket.js";

import { SubscribeToRedisChannel } from "../databases/redis-database.js";

const MessageExpiredReceived = (): void => {
  console.log("Subscribing to Redis channel: messageExpired:*");

  SubscribeToRedisChannel("messageExpired:*", (message: string) => {
    try {
      const expirationData = JSON.parse(message);
      const { sessionId, messageId, timestamp } = expirationData;

      if (!sessionId || !messageId || !timestamp) {
        console.error("Invalid messageExpired format:", expirationData);
        return;
      }

      console.log(
        `Broadcasting messageExpired to room ${sessionId}: ${messageId}`
      );

      io.to(sessionId).emit("messageExpired", {
        messageId,
        timestamp,
      });
    } catch (error: any) {
      console.error("Error processing messageExpired:", error.message);
    }
  });
};

export { MessageExpiredReceived };
