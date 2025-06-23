import "dotenv/config";

import { Request, Response, NextFunction } from "express";

export const MaintenanceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const excludedPaths = ["/health", "/ping", "/"];

  const isExcluded = excludedPaths.some((path) => req.path === path);

  if (isExcluded) {
    return next();
  }

  if (process.env.IS_MAINTENANCE === "true") {
    console.log(`🚧 Maintenance mode: Blocking ${req.method} ${req.path}`);

    res.status(503).json({
      success: false,
      redirect: "/maintenance",
      message: "System is currently under maintenance. Please try again later.",
      maintenanceMode: true,
      timestamp: new Date().toISOString(),
      retryAfter: "Please check back later",
    });
    return;
  }

  next();
};
