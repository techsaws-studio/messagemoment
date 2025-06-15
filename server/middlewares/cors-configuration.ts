import "dotenv/config";

import cors from "cors";

const isDev = process.env.NODE_ENV !== "production";

const corsOriginsEnv = process.env.CORS_ORIGINS;
const corsOrigins = corsOriginsEnv
  ? corsOriginsEnv.split(",").map((origin) => origin.trim())
  : [];
const allowAll = corsOrigins.includes("*");

export const CorsConfiguration = cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (isDev && allowAll) return callback(null, true);
    if (corsOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS policy violation"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["set-cookie"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
});
