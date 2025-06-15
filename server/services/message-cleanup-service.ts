import MessageModel from "../models/message-model.js";
import SessionModel from "../models/session-model.js";

export class MessageCleanupService {
  static async cleanupOldMessages(
    olderThan: number = 60 * 24 * 60 * 60 * 1000
  ): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - olderThan);
      console.info(
        `Cleaning up messages older than ${cutoffDate.toISOString()}`
      );

      const result = await MessageModel.deleteMany({
        createdAt: { $lt: cutoffDate },
      });

      console.info(`Deleted ${result.deletedCount} old messages`);
      return result.deletedCount;
    } catch (error) {
      console.error("Error cleaning up old messages:", error);
      throw error;
    }
  }

  static async cleanupExpiredSessionMessages(): Promise<number> {
    try {
      const expiredSessions = await SessionModel.find(
        { sessionExpired: true },
        { sessionId: 1 }
      );

      if (expiredSessions.length === 0) {
        console.info("No expired sessions found for cleanup");
        return 0;
      }

      const expiredSessionIds = expiredSessions.map(
        (session) => session.sessionId
      );
      console.info(
        `Found ${expiredSessionIds.length} expired sessions for message cleanup`
      );

      const result = await MessageModel.deleteMany({
        sessionId: { $in: expiredSessionIds },
      });

      console.info(
        `Deleted ${result.deletedCount} messages from expired sessions`
      );
      return result.deletedCount;
    } catch (error) {
      console.error("Error cleaning up expired session messages:", error);
      throw error;
    }
  }

  static async cleanupExpiredMessages(): Promise<number> {
    try {
      const now = new Date();

      const result = await MessageModel.deleteMany({
        displayExpiresAt: { $lt: now },
        $nor: [{ isSystemMessage: true }, { isAIMessage: true }],
      });

      console.info(`Deleted ${result.deletedCount} expired messages`);
      return result.deletedCount;
    } catch (error) {
      console.error("Error cleaning up expired messages:", error);
      throw error;
    }
  }

  static async runFullCleanup(): Promise<{
    oldMessages: number;
    expiredSessionMessages: number;
    expiredMessages: number;
  }> {
    try {
      console.info("Running comprehensive message cleanup");
      console.info("- Removing messages older than 60 days (2 months)");
      console.info("- Removing messages from expired sessions");
      console.info("- Removing individually expired messages");

      const [oldMessages, expiredSessionMessages, expiredMessages] =
        await Promise.all([
          this.cleanupOldMessages(),
          this.cleanupExpiredSessionMessages(),
          this.cleanupExpiredMessages(),
        ]);

      const totalRemoved =
        oldMessages + expiredSessionMessages + expiredMessages;
      console.info(`Total messages removed: ${totalRemoved}`);

      return {
        oldMessages,
        expiredSessionMessages,
        expiredMessages,
      };
    } catch (error) {
      console.error("Error running full message cleanup:", error);
      throw error;
    }
  }
}
