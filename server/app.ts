import "dotenv/config";

import express, { NextFunction, Request, Response, urlencoded } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

import { AppErrorHandler } from "./middlewares/app-error-handler.js";
import { CorsOptions, CorsMiddleware } from "./middlewares/cors-middleware.js";

import SessionRouter from "./routes/session-routes.js";

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

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    port: process.env.PORT,
    host: process.env.HOST,
  });
});
app.get("/debug", (req: Request, res: Response) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    origin: req.headers.origin,
    allHeaders: req.headers,
    timestamp: new Date().toISOString(),
  });
});
app.get("/ping", (req: Request, res: Response) => {
  console.log(`🏓 Ping from: ${req.headers.origin || "direct"}`);
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});
app.get("/test-cors", (req: Request, res: Response) => {
  res.json({
    message: "CORS working!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
});
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "MessageMoment API",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});
app.use("/api/v1", SessionRouter);
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// ERROR HANDLER
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`Error: ${err.message}`);
  AppErrorHandler(err, req, res, next);
});
