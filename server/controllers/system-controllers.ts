import "dotenv/config";

import { NextFunction, Request, Response } from "express";

import {
  HealthResponseInterface,
  ServiceHealthInterface,
} from "interfaces/controllers-interface.js";

import { CheckAPIHealthService } from "services/check-api-health-service.js";
import { CheckDatabaseHealthService } from "services/check-database-health-service.js";
import { CheckSocketHealthService } from "services/check-socket-health-service.js";
import { CreateErrorService } from "services/create-error-service.js";

import { CatchAsyncErrors } from "../utils/catch-async-errors.js";

// SERVER HEALTH FUNCTION
export const ServerHealthFunction = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    const [apiHealth, databaseHealth, socketHealth] = await Promise.allSettled([
      CheckAPIHealthService(),
      CheckDatabaseHealthService(),
      CheckSocketHealthService(),
    ]);

    const services: ServiceHealthInterface[] = [
      apiHealth.status === "fulfilled"
        ? apiHealth.value
        : CreateErrorService("API", apiHealth.reason),
      databaseHealth.status === "fulfilled"
        ? databaseHealth.value
        : CreateErrorService("Database", databaseHealth.reason),
      socketHealth.status === "fulfilled"
        ? socketHealth.value
        : CreateErrorService("Socket", socketHealth.reason),
    ];

    const summary = {
      total: services.length,
      up: services.filter((s) => s.status === "UP").length,
      down: services.filter((s) => s.status === "DOWN").length,
      degraded: services.filter((s) => s.status === "DEGRADED").length,
    };

    let overallStatus: "UP" | "DOWN" | "DEGRADED" = "UP";

    if (summary.down > 0) {
      const criticalDown = services.some(
        (s) =>
          (s.service === "API" || s.service === "Database") &&
          s.status === "DOWN"
      );
      overallStatus = criticalDown ? "DOWN" : "DEGRADED";
    } else if (summary.degraded > 0) {
      overallStatus = "DEGRADED";
    }

    const response: HealthResponseInterface = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      services,
      summary,
    };

    if (overallStatus !== "UP") {
      console.error("🚨 HEALTH CHECK ALERT:", {
        status: overallStatus,
        issues: services
          .filter((s) => s.status !== "UP")
          .map((s) => `${s.service}: ${s.error || s.status}`),
        responseTime: Date.now() - startTime,
        databaseDetails:
          databaseHealth.status === "fulfilled"
            ? databaseHealth.value.details
            : "Database check failed",
      });
    }

    const statusCode =
      overallStatus === "UP" ? 200 : overallStatus === "DEGRADED" ? 207 : 503;

    return res.status(statusCode).json({
      success: overallStatus === "UP",
      ...response,
    });
  }
);