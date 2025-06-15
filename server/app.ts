import "dotenv/config";

import express, { NextFunction, Request, Response, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { AppErrorHandler } from "./middlewares/app-error-handler.js";

import BasicRouter from "./routes/basic-routes.js";
import SessionRouter from "./routes/session-routes.js";

export const app = express();

// ENHANCED CORS CONFIGURATION
const corsOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://messagemoment.com", "https://www.messagemoment.com"]
    : [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:5500",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
      ];

// SERVER CONFIGURATIONS
app.use(express.json({ limit: "50mb" }));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// PROPER CORS CONFIGURATION
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      return callback(new Error("CORS policy violation"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-requested-with",
      "Access-Control-Allow-Credentials",
    ],
    exposedHeaders: ["set-cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

  app.options("*", cors());

// API ROUTES
app.use("/api/v1", SessionRouter);

// BASIC ROUTES
app.use("", BasicRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  AppErrorHandler(err, req, res, next);
});
