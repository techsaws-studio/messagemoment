import { Server, Socket } from "socket.io";

const MessageTypingComplete = (io: Server, socket: Socket): void => {
  socket.on(
    "messageTypingComplete",
    async (data: { messageId: string; timestamp: number }) => {
      try {
        const { messageId, timestamp } = data;

        if (!messageId) {
          console.warn("⚠️ messageTypingComplete: Missing messageId");
          return;
        }

        console.info(
          `⌨️ Message typing completed: ${messageId} at ${timestamp}`
        );

        io.to(socket.data.sessionId).emit("messageTypingCompleted", {
          messageId,
          timestamp,
        });
      } catch (error) {
        console.error("❌ Error handling messageTypingComplete:", error);
      }
    }
  );
};

export { MessageTypingComplete };
