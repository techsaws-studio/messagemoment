import { MessageCleanupService } from "../services/message-cleanup-service.js";

let cleanupTimer: NodeJS.Timeout | null = null;

export const SetupCleanupService = async (): Promise<void> => {
  try {
    await MessageCleanupService.runFullCleanup();

    const scheduleNextCleanup = () => {
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

      cleanupTimer = setTimeout(async () => {
        try {
          console.info("Running scheduled message cleanup");
          const results = await MessageCleanupService.runFullCleanup();
          console.info("Cleanup complete:", results);
        } catch (err) {
          console.error("Cleanup error:", err);
        } finally {
          scheduleNextCleanup();
        }
      }, delay);
    };

    scheduleNextCleanup();

    console.info("Message cleanup scheduled (daily at midnight)");
  } catch (error) {
    console.error("Message cleanup initialization failed:", error);
  }
};

export const StopCleanupService = (): void => {
  if (cleanupTimer) {
    clearTimeout(cleanupTimer);
    cleanupTimer = null;
    console.info("Cleanup timer stopped.");
  }
};
