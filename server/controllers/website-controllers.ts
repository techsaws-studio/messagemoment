import { NextFunction, Request, Response } from "express";

import { RedisDatabase } from "../databases/redis-database.js";

import { CatchAsyncErrors } from "../utils/catch-async-errors.js";
import { ErrorHandler } from "../utils/error-handler.js";

const healthCheckRequests = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS_PER_MINUTE = 20;

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const requests = healthCheckRequests.get(ip) || [];

  const validRequests = requests.filter(
    (time) => now - time < RATE_LIMIT_WINDOW
  );

  if (validRequests.length >= MAX_REQUESTS_PER_MINUTE) {
    return true;
  }

  validRequests.push(now);
  healthCheckRequests.set(ip, validRequests);
  return false;
};

// WEBITE CHECKUP FUNCTION
export const WebsiteCheckupFunction = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientIp = req.ip || req.connection.remoteAddress || "unknown";

      if (isRateLimited(clientIp)) {
        return next(new ErrorHandler("Too many requests", 429));
      }

      let status = "healthy";
      let issues: string[] = [];

      // Check Redis connection
      try {
        if (RedisDatabase) {
          await Promise.race([
            RedisDatabase.ping(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Redis timeout")), 3000)
            ),
          ]);
        } else {
          issues.push("Redis not initialized");
          status = "unhealthy";
        }
      } catch (error) {
        issues.push("Redis connection failed");
        status = "unhealthy";
      }

      // Check MongoDB connection
      try {
        if (global.mongooseConnection) {
          if (
            global.mongooseConnection.readyState === 1 &&
            global.mongooseConnection.db
          ) {
            await Promise.race([
              global.mongooseConnection.db.admin().ping(),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("MongoDB timeout")), 3000)
              ),
            ]);
          } else {
            issues.push("MongoDB not ready or db undefined");
            status = "unhealthy";
          }
        } else {
          issues.push("MongoDB not initialized");
          status = "unhealthy";
        }
      } catch (error) {
        issues.push("MongoDB connection failed");
        status = "unhealthy";
      }

      try {
        const memUsage = process.memoryUsage();
        const totalMem = memUsage.rss + memUsage.heapUsed;
        if (totalMem > 1024 * 1024 * 1024) {
          issues.push("High memory usage");
          status = status === "healthy" ? "degraded" : "unhealthy";
        }
      } catch (error) {
        console.warn("Could not check memory usage:", error);
      }

      if (status === "healthy") {
        return res.status(200).json({
          success: true,
          status: "healthy",
          message: "All systems operational",
          timestamp: new Date().toISOString(),
        });
      } else {
        return res.status(503).json({
          success: false,
          status: status,
          message: "System issues detected",
          issues: issues,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error: any) {
      console.error("Health check failed:", error);
      const message =
        error.response?.data?.error || error.message || "Health check failed";
      return next(new ErrorHandler(message, 503));
    }
  }
);
