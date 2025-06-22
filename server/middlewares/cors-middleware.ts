import "dotenv/config";

import { Request, Response, NextFunction } from "express";
import cors from "cors";

const GetAllowedOrigins = (): string[] => {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    return ["*"];
  }

  return ["https://messagemoment.com", "https://www.messagemoment.com"];
};

export const CorsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = GetAllowedOrigins();

    if (process.env.NODE_ENV !== "production") {
      console.log(`🔓 DEV MODE: Allowing origin: ${origin || "no-origin"}`);
      return callback(null, true);
    }

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ BLOCKED: ${origin}`);
      callback(new Error(`CORS: Origin ${origin} not allowed`), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  maxAge: 86400,
};

export const CorsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const origin = req.headers.origin;

  res.header(
    "Access-Control-Allow-Origin",
    process.env.NODE_ENV !== "production" ? "*" : origin
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,Origin,Accept"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
};

export { GetAllowedOrigins };
