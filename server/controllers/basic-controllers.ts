import { NextFunction, Request, Response } from "express";

import { CatchAsyncErrors } from "../utils/catch-async-errors.js";

// HEALTH CHECK FUNCTION
export const HealthCheckFunction = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      port: process.env.PORT,
      host: process.env.HOST,
    });
  }
);

// BASIC PING FUNCTION
export const BasicPingFunction = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  }
);

// ROOT ENDPOINT FUNCTION
export const RootEndpointFunction = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    res.json({
      message: "MessageMoment API",
      status: "running",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      endpoints: {
        health: "/health",
        api: "/api/v1/*",
      },
    });
  }
);
