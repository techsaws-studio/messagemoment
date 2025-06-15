import { MessageCleanupService } from "../services/message-cleanup-service.js";
import { DataCleanupService } from "../services/data-cleanup-service.js";

import { CleanupLogger } from "../utils/cleanup-logger.js";

let messageCleanupTimer: NodeJS.Timeout | null = null;
let dataRetentionTimer: NodeJS.Timeout | null = null;

export const SetupCleanupServices = async (): Promise<void> => {
  try {
    await CleanupLogger.initialize();

    await Promise.all([
      MessageCleanupService.runSessionBasedCleanup(),
      DataCleanupService.runDataRetentionCleanup(),
    ]);

    setupMessageCleanupScheduler();
    setupDataRetentionScheduler();

    console.info("🧹 Cleanup services initialized");
  } catch (error) {
    console.error("❌ Cleanup services initialization failed:", error);
    throw error;
  }
};

const setupMessageCleanupScheduler = (): void => {
  const MESSAGE_CLEANUP_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours

  const runMessageCleanup = async () => {
    try {
      await MessageCleanupService.runSessionBasedCleanup();
    } catch (error) {
      await CleanupLogger.logError("SCHEDULED_MESSAGE_CLEANUP", error as Error);
    }
  };

  messageCleanupTimer = setInterval(
    runMessageCleanup,
    MESSAGE_CLEANUP_INTERVAL
  );

  CleanupLogger.logSchedule(
    "MessageCleanup",
    "every 4 hours",
    new Date(Date.now() + MESSAGE_CLEANUP_INTERVAL)
  );
};

const setupDataRetentionScheduler = (): void => {
  const scheduleNextDataRetentionCleanup = () => {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    );
    const delay = nextMidnight.getTime() - now.getTime();

    dataRetentionTimer = setTimeout(async () => {
      try {
        const stats = await DataCleanupService.getCleanupStatistics();

        await CleanupLogger.logOperation("PRE_CLEANUP_STATISTICS", {
          cutoffDate: stats.cutoffDate.toISOString(),
          recordsToRemove:
            stats.messagesCount +
            stats.sessionsCount +
            stats.participantsCount +
            stats.timerChangesCount,
          breakdown: {
            messages: stats.messagesCount,
            sessions: stats.sessionsCount,
            participants: stats.participantsCount,
            timerChanges: stats.timerChangesCount,
          },
        });

        await DataCleanupService.runDataRetentionCleanup();
      } catch (error) {
        await CleanupLogger.logError(
          "SCHEDULED_DATA_RETENTION_CLEANUP",
          error as Error
        );
      } finally {
        scheduleNextDataRetentionCleanup();
      }
    }, delay);
  };

  scheduleNextDataRetentionCleanup();
  CleanupLogger.logSchedule(
    "DataRetentionCleanup",
    "daily at midnight",
    new Date(new Date().setHours(24, 0, 0, 0))
  );
};

export const StopCleanupServices = (): void => {
  if (messageCleanupTimer) {
    clearInterval(messageCleanupTimer);
    messageCleanupTimer = null;
  }

  if (dataRetentionTimer) {
    clearTimeout(dataRetentionTimer);
    dataRetentionTimer = null;
  }

  console.info("🛑 Cleanup services stopped");
};

export const ManualCleanupTriggers = {
  triggerMessageCleanup: async () => {
    await CleanupLogger.logOperation("MANUAL_TRIGGER", {
      type: "message_cleanup",
    });
    return await MessageCleanupService.runSessionBasedCleanup();
  },

  triggerDataRetentionCleanup: async () => {
    await CleanupLogger.logOperation("MANUAL_TRIGGER", {
      type: "data_retention_cleanup",
    });
    return await DataCleanupService.runDataRetentionCleanup();
  },

  getCleanupStatistics: async () => {
    return await DataCleanupService.getCleanupStatistics();
  },

  emergencyCleanup: async (olderThanDays: number) => {
    await CleanupLogger.logOperation(
      "EMERGENCY_CLEANUP_TRIGGER",
      {
        olderThanDays,
        warning: "EMERGENCY_CLEANUP_INITIATED",
      },
      "WARN"
    );
    return await DataCleanupService.emergencyCleanup(olderThanDays);
  },

  getRecentLogs: async (days: number = 7) => {
    return await CleanupLogger.getRecentStatistics(days);
  },
};
