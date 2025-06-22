import "dotenv/config";

import { Request, Response, NextFunction } from "express";
import cors from "cors";

export const getAllowedOrigins = (): string[] => {
  const envOrigins =
    process.env.CORS_ORIGINS?.split(",").map((o) => o.trim()) || [];

  if (process.env.NODE_ENV === "production") {
    return [
      "https://messagemoment-one.vercel.app",
      "https://messagemoment.com",
      "https://www.messagemoment.com",
      ...envOrigins,
    ];
  }

  return [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "https://messagemoment-one.vercel.app",
    "https://railway.com",
    "https://cdpn.io",
    "https://jsfiddle.net",
    ...envOrigins,
  ];
};

export const corsOptions: cors.CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    const allowedOrigins = getAllowedOrigins();

    if (!origin) {
      console.log("✅ No origin header - allowing request");
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS allowed for origin: ${origin}`);
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cache-Control",
    "X-File-Name",
    // ✅ REMOVED: "Access-Control-Allow-Credentials" (not a request header)
  ],
  exposedHeaders: ["Set-Cookie"],
  maxAge: 86400,
  optionsSuccessStatus: 200,
};

export const CorsHeadersMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();

  console.log(`📡 ${req.method} ${req.url} from origin: ${origin || "none"}`);

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    res.header("Access-Control-Allow-Origin", "*");
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS,PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization,Cache-Control,X-File-Name"
  );

  if (req.method === "OPTIONS") {
    console.log(`🔍 CORS Preflight for: ${req.url} from ${origin || "none"}`);
    res.status(200).end();
    return;
  }

  next();
};
