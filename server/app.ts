import "dotenv/config";

import express, { NextFunction, Request, Response, urlencoded } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

import { AppErrorHandler } from "./middlewares/app-error-handler.js";
import {
  CorsHeadersMiddleware,
  corsOptions,
  getAllowedOrigins,
} from "./middlewares/cors-middleware.js";

import BasicRouter from "./routes/basic-routes.js";
import SessionRouter from "./routes/session-routes.js";

export const app = express();

// SERVER CONFIGURATIONS
app.set("trust proxy", 1);
const allowedOrigins = getAllowedOrigins();
app.use(CorsHeadersMiddleware);
app.use(cors(corsOptions));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", ...allowedOrigins],
      },
    },
  })
);
app.use(compression());
app.use(
  express.json({
    limit: "50mb",
    verify: (req, res, buf) => {
      if (buf.length === 0) {
        throw new Error("Empty request body");
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
  
app.get("/ping", (req: Request, res: Response): void => {
  console.log(`🏓 Ping received from: ${req.headers.origin || "direct"}`);
  res.json({
    status: "ok",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    allowedOrigins: allowedOrigins,
  });
});
app.options("/test-cors", cors(corsOptions));
app.get(
  "/test-cors",
  cors(corsOptions),
  (req: Request, res: Response): void => {
    res.json({ message: "CORS OK" });
  }
);

app.use("/api/v1", SessionRouter);
app.use("", BasicRouter);

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
