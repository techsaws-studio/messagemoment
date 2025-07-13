import MessageModel from "../models/message-model.js";
import SessionModel from "../models/session-model.js";

import { CleanupLogger } from "../utils/cleanup-logger.js";

export class MessageCleanupService {
  static async cleanupExpiredSessionMessages(): Promise<number> {
    try {
      const expiredSessions = await SessionModel.find(
        { sessionExpired: true },
        { sessionId: 1 }
      ).lean();

      if (expiredSessions.length === 0) {
        await CleanupLogger.logOperation("EXPIRED_SESSION_MESSAGES", {
          expiredSessionsFound: 0,
          messagesDeleted: 0,
        });
        return 0;
      }

      const expiredSessionIds = expiredSessions.map(
        (session) => session.sessionId
      );

      const result = await MessageModel.deleteMany(
        {
          sessionId: { $in: expiredSessionIds },
        },
        { writeConcern: { w: 'majority', j: true } }
      );

      await CleanupLogger.logOperation("EXPIRED_SESSION_MESSAGES", {
        expiredSessionsFound: expiredSessionIds.length,
        messagesDeleted: result.deletedCount,
        sessionIds: expiredSessionIds,
      });

      return result.deletedCount;
    } catch (error) {
      await CleanupLogger.logError("EXPIRED_SESSION_MESSAGES", error as Error);
      throw error;
    }
  }

  static async cleanupExpiredMessages(): Promise<number> {
    try {
      const now = new Date();

      const result = await MessageModel.deleteMany(
        {
          displayExpiresAt: { $lt: now },
          $nor: [
            { isSystemMessage: true },
            { isAIMessage: true },
            { isPermanent: true },
          ],
        },
        { writeConcern: { w: 'majority', j: true } }
      );

      await CleanupLogger.logOperation("INDIVIDUALLY_EXPIRED_MESSAGES", {
        messagesDeleted: result.deletedCount,
        cutoffTime: now.toISOString(),
      });

      return result.deletedCount;
    } catch (error) {
      await CleanupLogger.logError(
        "INDIVIDUALLY_EXPIRED_MESSAGES",
        error as Error
      );
      throw error;
    }
  }

  static async runSessionBasedCleanup(): Promise<{
    expiredSessionMessages: number;
    expiredMessages: number;
  }> {
    const startTime = Date.now();

    try {
      const [expiredSessionMessages, expiredMessages] = await Promise.all([
        this.cleanupExpiredSessionMessages(),
        this.cleanupExpiredMessages(),
      ]);

      const totalRemoved = expiredSessionMessages + expiredMessages;
      const executionTime = Date.now() - startTime;

      await CleanupLogger.logStatistics(
        "SESSION_BASED_CLEANUP",
        {
          expiredSessionMessages,
          expiredMessages,
          totalRemoved,
        },
        executionTime
      );

      CleanupLogger.logSummaryToConsole(
        "Message cleanup",
        totalRemoved,
        executionTime
      );

      return {
        expiredSessionMessages,
        expiredMessages,
      };
    } catch (error) {
      await CleanupLogger.logError("SESSION_BASED_CLEANUP", error as Error);
      throw error;
    }
  }

  static async cleanupSpecificSessionMessages(
    sessionId: string
  ): Promise<number> {
    try {
      const result = await MessageModel.deleteMany(
        {
          sessionId: sessionId,
        },
        { writeConcern: { w: 'majority', j: true } }
      );

      await CleanupLogger.logOperation("SPECIFIC_SESSION_CLEANUP", {
        sessionId,
        messagesDeleted: result.deletedCount,
      });

      return result.deletedCount;
    } catch (error) {
      await CleanupLogger.logError("SPECIFIC_SESSION_CLEANUP", error as Error, {
        sessionId,
      });
      throw error;
    }
  }
}
