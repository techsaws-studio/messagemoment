import fs from "fs/promises";
import path from "path";

export class CleanupLogger {
  private static logDir = path.join(process.cwd(), "logs", "cleanup");
  private static maxLogSize = 10 * 1024 * 1024;
  private static maxLogFiles = 30;

  static async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create cleanup log directory:", error);
    }
  }

  static async logOperation(
    operation: string,
    details: Record<string, any>,
    level: "INFO" | "WARN" | "ERROR" = "INFO"
  ): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      const logEntry = {
        timestamp,
        level,
        operation,
        details,
        environment: process.env.NODE_ENV || "development",
      };

      const logLine = JSON.stringify(logEntry) + "\n";
      const logFile = path.join(
        this.logDir,
        `cleanup-${this.getDateString()}.log`
      );

      await fs.appendFile(logFile, logLine, "utf8");

      this.rotateLogsIfNeeded().catch((error) => {
        console.error("Log rotation failed:", error);
      });
    } catch (error) {
      console.error("Cleanup logging failed:", error);
    }
  }

  static async logStatistics(
    operation: string,
    stats: Record<string, number>,
    executionTime?: number
  ): Promise<void> {
    const details: Record<string, any> = {
      statistics: stats,
      totalRecords: Object.values(stats).reduce((sum, count) => sum + count, 0),
    };

    if (executionTime) {
      details.executionTimeMs = executionTime;
      details.executionTimeSec = Math.round(executionTime / 1000);
    }

    await this.logOperation(`${operation}_STATISTICS`, details, "INFO");
  }

  static logSummaryToConsole(
    operation: string,
    totalRecords: number,
    executionTime?: number
  ): void {
    const timeStr = executionTime
      ? ` (${Math.round(executionTime / 1000)}s)`
      : "";
    console.info(`✅ ${operation}: ${totalRecords} records cleaned${timeStr}`);
  }

  static async logError(
    operation: string,
    error: Error,
    context?: Record<string, any>
  ): Promise<void> {
    await this.logOperation(
      `${operation}_ERROR`,
      {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        context,
      },
      "ERROR"
    );
  }

  static async logSchedule(
    service: string,
    schedule: string,
    nextRun?: Date
  ): Promise<void> {
    await this.logOperation(
      "SCHEDULE_SETUP",
      {
        service,
        schedule,
        nextRun: nextRun?.toISOString(),
      },
      "INFO"
    );
  }

  private static getDateString(): string {
    return new Date().toISOString().split("T")[0];
  }

  private static async rotateLogsIfNeeded(): Promise<void> {
    try {
      const files = await fs.readdir(this.logDir);
      const logFiles = files
        .filter((file) => file.startsWith("cleanup-") && file.endsWith(".log"))
        .sort((a, b) => b.localeCompare(a));

      if (logFiles.length > this.maxLogFiles) {
        const filesToDelete = logFiles.slice(this.maxLogFiles);
        for (const file of filesToDelete) {
          await fs.unlink(path.join(this.logDir, file));
        }
      }

      const currentLogFile = path.join(
        this.logDir,
        `cleanup-${this.getDateString()}.log`
      );
      try {
        const stats = await fs.stat(currentLogFile);
        if (stats.size > this.maxLogSize) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          const rotatedName = `cleanup-${this.getDateString()}-${timestamp}.log`;
          await fs.rename(currentLogFile, path.join(this.logDir, rotatedName));
        }
      } catch {}
    } catch (error) {
      console.error("Log rotation error:", error);
    }
  }

  static async getRecentStatistics(days: number = 7): Promise<any[]> {
    try {
      const files = await fs.readdir(this.logDir);
      const recentFiles = files
        .filter((file) => file.startsWith("cleanup-") && file.endsWith(".log"))
        .sort((a, b) => b.localeCompare(a))
        .slice(0, days);

      const statistics = [];
      for (const file of recentFiles) {
        try {
          const content = await fs.readFile(
            path.join(this.logDir, file),
            "utf8"
          );
          const lines = content.trim().split("\n");

          for (const line of lines) {
            if (line.trim()) {
              const logEntry = JSON.parse(line);
              if (logEntry.operation.includes("STATISTICS")) {
                statistics.push(logEntry);
              }
            }
          }
        } catch {
          // Skip corrupted files
        }
      }

      return statistics;
    } catch (error) {
      console.error("Failed to get recent statistics:", error);
      return [];
    }
  }
}
