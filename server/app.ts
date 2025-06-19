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
const allowedOrigins: string[] =
  process.env.NODE_ENV === "production"
    ? ["https://messagemoment-one.vercel.app"]
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "https://messagemoment-one.vercel.app",
      ];
const corsOptions = { 
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin) {
      console.warn("⚠️ No Origin header found on request. Denying CORS.");
      return callback(new Error("No origin header"));
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
  ],
  exposedHeaders: ["Set-Cookie"],
  maxAge: 86400,
  optionsSuccessStatus: 200,
};
app.use((req, res, next) => {
  console.log(
    `📡 ${req.method} ${req.url} from origin: ${req.headers.origin || "none"}`
  );

  if (req.method === "OPTIONS") {
    console.log(`🔍 CORS Preflight detected for: ${req.url}`);
    console.log(`🌍 Origin: ${req.headers.origin}`);
    console.log(
      `🔧 Requested Headers: ${req.headers["access-control-request-headers"]}`
    );
    console.log(
      `⚡ Requested Method: ${req.headers["access-control-request-method"]}`
    );
  }

  next();
});
app.options("*", cors(corsOptions));
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

// HEALTH CHECK ROUTE
app.get("/ping", (req, res) => {
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
app.get("/test-cors", cors(corsOptions), (req, res) => {
  res.json({ message: "CORS OK" });
});


// API ROUTES
app.use("/api/v1", SessionRouter);

// BASIC ROUTES
app.use("", BasicRouter);

// ERROR HANDLER
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.message.includes("CORS")) {
    console.error(
      `🚫 CORS Error: ${err.message} for origin: ${req.headers.origin}`
    );
    console.error(`🔧 Allowed origins: ${JSON.stringify(allowedOrigins)}`);
  }
  AppErrorHandler(err, req, res, next);
});
