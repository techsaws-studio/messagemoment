import MessageModel from "../models/message-model.js";
import SessionModel from "../models/session-model.js";
import ParticipantModel from "../models/participant-model.js";
import TimerChangeModel from "../models/timer-change-model.js";

import { CleanupLogger } from "../utils/cleanup-logger.js";

export class DataCleanupService {
  private static readonly RETENTION_PERIOD = 60 * 24 * 60 * 60 * 1000;

  static async cleanupOldMessages(
    retentionPeriod: number = this.RETENTION_PERIOD
  ): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - retentionPeriod);

      const result = await MessageModel.deleteMany({
        createdAt: { $lt: cutoffDate },
      });

      await CleanupLogger.logOperation("OLD_MESSAGES_CLEANUP", {
        cutoffDate: cutoffDate.toISOString(),
        retentionDays: Math.floor(retentionPeriod / (24 * 60 * 60 * 1000)),
        messagesDeleted: result.deletedCount,
      });

      return result.deletedCount;
    } catch (error) {
      await CleanupLogger.logError("OLD_MESSAGES_CLEANUP", error as Error);
      throw error;
    }
  }

  static async cleanupOldSessions(
    retentionPeriod: number = this.RETENTION_PERIOD
  ): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - retentionPeriod);

      const result = await SessionModel.deleteMany(
        {
          createdAt: { $lt: cutoffDate },
        },
        { writeConcern: { w: 'majority', j: true } }
      );

      await CleanupLogger.logOperation("OLD_SESSIONS_CLEANUP", {
        cutoffDate: cutoffDate.toISOString(),
        retentionDays: Math.floor(retentionPeriod / (24 * 60 * 60 * 1000)),
        sessionsDeleted: result.deletedCount,
      });

      return result.deletedCount;
    } catch (error) {
      await CleanupLogger.logError("OLD_SESSIONS_CLEANUP", error as Error);
      throw error;
    }
  }

  static async cleanupOldParticipants(
    retentionPeriod: number = this.RETENTION_PERIOD
  ): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - retentionPeriod);

      const result = await ParticipantModel.deleteMany(
        {
          createdAt: { $lt: cutoffDate },
        },
        { writeConcern: { w: 'majority', j: true } }
      );

      await CleanupLogger.logOperation("OLD_PARTICIPANTS_CLEANUP", {
        cutoffDate: cutoffDate.toISOString(),
        retentionDays: Math.floor(retentionPeriod / (24 * 60 * 60 * 1000)),
        participantsDeleted: result.deletedCount,
      });

      return result.deletedCount;
    } catch (error) {
      await CleanupLogger.logError("OLD_PARTICIPANTS_CLEANUP", error as Error);
      throw error;
    }
  }

  static async cleanupOldTimerChanges(
    retentionPeriod: number = this.RETENTION_PERIOD
  ): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - retentionPeriod);

      const result = await TimerChangeModel.deleteMany({
        createdAt: { $lt: cutoffDate },
      });

      await CleanupLogger.logOperation("OLD_TIMER_CHANGES_CLEANUP", {
        cutoffDate: cutoffDate.toISOString(),
        retentionDays: Math.floor(retentionPeriod / (24 * 60 * 60 * 1000)),
        timerChangesDeleted: result.deletedCount,
      });

      return result.deletedCount;
    } catch (error) {
      await CleanupLogger.logError("OLD_TIMER_CHANGES_CLEANUP", error as Error);
      throw error;
    }
  }

  static async runDataRetentionCleanup(
    retentionPeriod: number = this.RETENTION_PERIOD
  ): Promise<{
    oldMessages: number;
    oldSessions: number;
    oldParticipants: number;
    oldTimerChanges: number;
    totalRecordsRemoved: number;
  }> {
    const startTime = Date.now();

    try {
      const retentionDays = Math.floor(retentionPeriod / (24 * 60 * 60 * 1000));

      await CleanupLogger.logOperation("DATA_RETENTION_CLEANUP_START", {
        retentionDays,
        retentionPeriodMs: retentionPeriod,
        cutoffDate: new Date(Date.now() - retentionPeriod).toISOString(),
      });

      const [oldMessages, oldSessions, oldParticipants, oldTimerChanges] =
        await Promise.all([
          this.cleanupOldMessages(retentionPeriod),
          this.cleanupOldSessions(retentionPeriod),
          this.cleanupOldParticipants(retentionPeriod),
          this.cleanupOldTimerChanges(retentionPeriod),
        ]);

      const totalRecordsRemoved =
        oldMessages + oldSessions + oldParticipants + oldTimerChanges;
      const executionTime = Date.now() - startTime;

      await CleanupLogger.logStatistics(
        "DATA_RETENTION_CLEANUP",
        {
          oldMessages,
          oldSessions,
          oldParticipants,
          oldTimerChanges,
          totalRecordsRemoved,
        },
        executionTime
      );

      CleanupLogger.logSummaryToConsole(
        "Data retention cleanup",
        totalRecordsRemoved,
        executionTime
      );

      return {
        oldMessages,
        oldSessions,
        oldParticipants,
        oldTimerChanges,
        totalRecordsRemoved,
      };
    } catch (error) {
      await CleanupLogger.logError("DATA_RETENTION_CLEANUP", error as Error);
      throw error;
    }
  }

  static async getCleanupStatistics(
    retentionPeriod: number = this.RETENTION_PERIOD
  ): Promise<{
    messagesCount: number;
    sessionsCount: number;
    participantsCount: number;
    timerChangesCount: number;
    cutoffDate: Date;
  }> {
    try {
      const cutoffDate = new Date(Date.now() - retentionPeriod);

      const [
        messagesCount,
        sessionsCount,
        participantsCount,
        timerChangesCount,
      ] = await Promise.all([
        MessageModel.countDocuments({ createdAt: { $lt: cutoffDate } }),
        SessionModel.countDocuments({ createdAt: { $lt: cutoffDate } }),
        ParticipantModel.countDocuments({ createdAt: { $lt: cutoffDate } }),
        TimerChangeModel.countDocuments({ createdAt: { $lt: cutoffDate } }),
      ]);

      return {
        messagesCount,
        sessionsCount,
        participantsCount,
        timerChangesCount,
        cutoffDate,
      };
    } catch (error) {
      console.error("Error getting cleanup statistics:", error);
      throw error;
    }
  }

  static async emergencyCleanup(olderThanDays: number): Promise<{
    oldMessages: number;
    oldSessions: number;
    oldParticipants: number;
    oldTimerChanges: number;
  }> {
    const emergencyRetentionPeriod = olderThanDays * 24 * 60 * 60 * 1000;

    console.warn(`=== EMERGENCY CLEANUP INITIATED ===`);
    console.warn(`Removing data older than ${olderThanDays} days`);
    console.warn("This action cannot be undone!");

    return await this.runDataRetentionCleanup(emergencyRetentionPeriod);
  }
}
