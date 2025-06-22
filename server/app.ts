import "dotenv/config";

import express, { NextFunction, Request, Response, urlencoded } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

import { AppErrorHandler } from "./middlewares/app-error-handler.js";
import {
  corsOptions,
  CorsMiddleware,
  getAllowedOrigins,
} from "./middlewares/cors-middleware.js";

import SessionRouter from "./routes/session-routes.js";

export const app = express();

// SERVER CONFIGURATIONS
app.set("trust proxy", 1);

const allowedOrigins = getAllowedOrigins();
const isDevelopment = process.env.NODE_ENV !== "production";
console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
console.log(`🔐 CORS Origins: ${JSON.stringify(allowedOrigins, null, 2)}`);

app.use(cors(corsOptions));
app.use(CorsMiddleware);

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      policy: isDevelopment ? "cross-origin" : "same-site",
    },
    contentSecurityPolicy: isDevelopment
      ? false
      : {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", ...allowedOrigins, "wss:", "ws:"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", "https:", "data:"],
            frameSrc: ["'none'"],
          },
        },
  })
);
app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);
app.use(
  express.json({
    limit: "50mb",
    verify: (req, res, buf) => {
      if (req.method !== "GET" && req.method !== "HEAD" && buf.length === 0) {
        console.warn(`⚠️ Empty request body for ${req.method} ${req.url}`);
      }
    },
  })
);
app.use(
  urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 1000,
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));

app.get("/ping", cors(corsOptions), (req: Request, res: Response): void => {
  console.log(`🏓 Ping received from: ${req.headers.origin || "direct"}`);
  res.json({
    status: "ok",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    server: "MessageMoment API",
    version: "1.0.0",
    allowedOrigins: isDevelopment
      ? allowedOrigins
      : `${allowedOrigins.length} configured`,
  });
});
app.options("/test-cors", cors(corsOptions));
app.get(
  "/test-cors",
  cors(corsOptions),
  (req: Request, res: Response): void => {
    res.json({
      message: "CORS OK",
      origin: req.headers.origin,
      timestamp: new Date().toISOString(),
      headers: req.headers,
    });
  }
);

app.use("/api/v1", SessionRouter);

app.get("/", cors(corsOptions), (req: Request, res: Response): void => {
  res.json({
    message: "MessageMoment API Server",
    status: "running",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/ping",
      cors: "/test-cors",
      api: "/api/v1/*",
    },
  });
});
app.use("*", (req: Request, res: Response): void => {
  console.warn(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    success: false,
    error: "Route Not Found",
    message: `The requested route ${req.method} ${req.originalUrl} was not found.`,
    timestamp: new Date().toISOString(),
    availableRoutes: [
      "GET /",
      "GET /ping",
      "GET /test-cors",
      "POST /api/v1/generate-session-link",
      "GET /api/v1/validate-session/:sessionId",
      "GET /api/v1/fetch-initial-chat-load-data/:sessionId",
      "GET /api/v1/validate-token",
      "POST /api/v1/clear-session",
    ],
  });
});

// ERROR HANDLER
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err.message.includes("CORS")) {
    console.error(
      `🚫 CORS Error: ${err.message} for origin: ${req.headers.origin}`
    );
    console.error(`🔧 Allowed origins: ${JSON.stringify(allowedOrigins)}`);
  }
  AppErrorHandler(err, req, res, next);
});
