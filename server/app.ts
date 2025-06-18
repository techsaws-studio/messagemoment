import "dotenv/config";

import express, { NextFunction, Request, Response, urlencoded } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

import { AppErrorHandler } from "./middlewares/app-error-handler.js";

import BasicRouter from "./routes/basic-routes.js";
import SessionRouter from "./routes/session-routes.js";

export const app = express();

// SERVER CONFIGURATIONS
app.set("trust proxy", 1);
const corsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    console.log("🔍 CORS Preflight for:", req.headers.origin);
  }
  next();
});
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);
app.use(compression());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
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

// API ROUTES
app.use("/api/v1", SessionRouter);

// BASIC ROUTES
app.use("", BasicRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  AppErrorHandler(err, req, res, next);
});

app.get("/ping", (req, res) => {
  res.json({ status: "ok", origin: req.headers.origin });
});
