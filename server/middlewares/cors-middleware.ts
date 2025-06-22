import "dotenv/config";

import { Request, Response, NextFunction } from "express";
import cors from "cors";

import { CorsConfig } from "interfaces/middlewares-interface.js";

export const getCorsConfiguration = (): CorsConfig => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const allowAllOrigins = process.env.CORS_ALLOW_ALL === "true";
  const enableDebugLogging = process.env.CORS_DEBUG === "true" || isDevelopment;

  return {
    allowedOrigins: getAllowedOrigins(),
    isDevelopment,
    allowAllOrigins,
    enableDebugLogging,
  };
};

export const getAllowedOrigins = (): string[] => {
  const envOrigins =
    process.env.CORS_ORIGINS?.split(",")
      .map((o) => o.trim())
      .filter(Boolean) || [];

  const productionOrigins = [
    "https://messagemoment-one.vercel.app",
    "https://messagemoment.com",
    "https://www.messagemoment.com",
    "https://messagemoment-production-ecf6.up.railway.app",
  ];

  const developmentOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5500",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5500",
    "http://0.0.0.0:3000",
    "http://0.0.0.0:3001",

    "http://localhost:8080",
    "http://localhost:4200",
    "http://localhost:5173",
    "http://localhost:3333",

    "file://",

    "https://railway.com",
    "https://cdpn.io",
    "https://jsfiddle.net",
    "https://codesandbox.io",
    "https://stackblitz.com",

    "https://*.up.railway.app",
  ];

  if (process.env.NODE_ENV === "production") {
    return [...productionOrigins, ...envOrigins];
  }

  return [...developmentOrigins, ...productionOrigins, ...envOrigins];
};

const isOriginAllowed = (
  origin: string | undefined,
  allowedOrigins: string[]
): boolean => {
  if (!origin) return true;

  if (allowedOrigins.includes(origin)) return true;

  for (const allowedOrigin of allowedOrigins) {
    if (allowedOrigin.includes("*")) {
      const pattern = allowedOrigin.replace(/\*/g, ".*");
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(origin)) return true;
    }
  }

  if (process.env.NODE_ENV !== "production") {
    const devPattern =
      /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/;
    if (devPattern.test(origin)) return true;

    if (origin.startsWith("file://")) return true;
  }

  return false;
};

export const corsOptions: cors.CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    const config = getCorsConfiguration();

    if (config.isDevelopment && config.allowAllOrigins) {
      if (config.enableDebugLogging) {
        console.log(`🔓 CORS: Allowing all origins in development mode`);
      }
      return callback(null, true);
    }

    const isAllowed = isOriginAllowed(origin, config.allowedOrigins);

    if (config.enableDebugLogging) {
      console.log(
        `🔍 CORS Check: ${origin || "no-origin"} - ${
          isAllowed ? "✅ ALLOWED" : "❌ BLOCKED"
        }`
      );
      if (!isAllowed && origin) {
        console.log(`📋 Allowed origins:`, config.allowedOrigins);
      }
    }

    if (isAllowed) {
      callback(null, true);
    } else {
      const error = new Error(
        `CORS policy violation: Origin '${origin}' not allowed`
      );
      callback(error, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cache-Control",
    "X-File-Name",
    "X-CSRF-Token",
    "X-Client-Version",
    "User-Agent",
  ],
  exposedHeaders: [
    "Set-Cookie",
    "X-Total-Count",
    "X-Rate-Limit-Remaining",
    "X-Rate-Limit-Reset",
  ],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

export const enhancedCorsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const config = getCorsConfiguration();
  const origin =
    req.get("Origin") || req.get("Referer")?.split("/").slice(0, 3).join("/");

  if (config.enableDebugLogging) {
    console.log(`📡 ${req.method} ${req.path} from: ${origin || "no-origin"}`);
    if (req.method === "OPTIONS") {
      console.log(`🔍 Preflight request headers:`, req.headers);
    }
  }

  if (origin && isOriginAllowed(origin, config.allowedOrigins)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin || config.allowAllOrigins) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS,PATCH,HEAD"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization,Cache-Control,X-File-Name,X-CSRF-Token,X-Client-Version,User-Agent"
  );
  res.setHeader(
    "Access-Control-Expose-Headers",
    "Set-Cookie,X-Total-Count,X-Rate-Limit-Remaining,X-Rate-Limit-Reset"
  );
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    if (config.enableDebugLogging) {
      console.log(`✅ Preflight response sent for ${req.path}`);
    }
    res.status(204).end();
    return;
  }

  next();
};

export const corsHealthCheck = (req: Request, res: Response): void => {
  const config = getCorsConfiguration();
  const origin = req.get("Origin");

  res.json({
    status: "ok",
    cors: {
      origin: origin || "no-origin",
      allowed: isOriginAllowed(origin, config.allowedOrigins),
      environment: process.env.NODE_ENV,
      allowedOrigins: config.isDevelopment
        ? config.allowedOrigins
        : "***HIDDEN***",
      allowAll: config.allowAllOrigins,
      timestamp: new Date().toISOString(),
    },
  });
};
