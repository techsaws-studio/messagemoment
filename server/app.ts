import "dotenv/config";

import express, { NextFunction, Request, Response, urlencoded } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

import { AppErrorHandler } from "./middlewares/app-error-handler.js";
import { CorsOptions, CorsMiddleware } from "./middlewares/cors-middleware.js";

import SessionRouter from "./routes/session-routes.js";
import BasicRouter from "./routes/basic-routes.js";
import UserRouter from "./routes/user-routes.js";
import SystemRouter from "./routes/system-routes.js";

export const app = express();

// SERVER CONFIGURATIONS
app.set("trust proxy", 1);
app.use(cors(CorsOptions));
app.use(CorsMiddleware);
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// API ROUTES PATH
app.use("/", BasicRouter);
app.use("/api/v1", SessionRouter, UserRouter, SystemRouter);

if (process.env.TESTING_CRASH === "true") {
  console.log("🚨 Testing mode: Crashing server...");
  setTimeout(() => {
    process.exit(1);
  }, 5000);
}

app.use("*", (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: "Route Not Found",
    message: `The route ${req.method} ${req.originalUrl} does not exist`,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      "GET /",
      "GET /health",
      "GET /ping",
      "POST /api/v1/generate-session-link",
      "GET /api/v1/validate-session/:sessionId",
      "GET /api/v1/fetch-initial-chat-load-data/:sessionId",
      "GET /api/v1/validate-token",
      "POST /api/v1/clear-session",
      "POST /api/v1/submit-ticket",
    ],
  });
});

// ERROR HANDLER
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`Error: ${err.message}`);
  AppErrorHandler(err, req, res, next);
});
