import "dotenv/config";
import cors from "cors";

import { CorsConfig } from "interfaces/middlewares-interface.js";

class CorsManager {
  private config: CorsConfig;

  constructor() {
    this.config = this.initializeConfig();
    this.validateConfiguration();
  }

  private initializeConfig(): CorsConfig {
    const nodeEnv = process.env.NODE_ENV || "development";
    const isDevelopment = nodeEnv !== "production";

    const corsOriginsEnv = process.env.CORS_ORIGINS || "";
    const allowedOrigins = this.parseOrigins(corsOriginsEnv);

    const allowAllOrigins =
      corsOriginsEnv.includes("*") ||
      (isDevelopment && process.env.CORS_ALLOW_ALL === "true");

    return {
      allowedOrigins,
      isDevelopment,
      allowAllOrigins,
      enableDebugLogging: process.env.CORS_DEBUG === "true" || isDevelopment,
    };
  }

  private parseOrigins(corsOriginsEnv: string): string[] {
    if (!corsOriginsEnv) {
      console.warn(
        "⚠️  CORS_ORIGINS not set - using default localhost origins"
      );
      return ["http://localhost:3000", "http://localhost:3001"];
    }

    return corsOriginsEnv
      .split(",")
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0)
      .map((origin) => this.normalizeOrigin(origin));
  }

  private normalizeOrigin(origin: string): string {
    if (!origin.startsWith("http://") && !origin.startsWith("https://")) {
      origin = `https://${origin}`;
    }

    return origin.replace(/\/$/, "");
  }

  private validateConfiguration(): void {
    const { allowedOrigins, isDevelopment, allowAllOrigins } = this.config;

    if (allowedOrigins.length === 0 && !allowAllOrigins) {
      throw new Error(
        "CORS_ORIGINS must be configured for production deployments"
      );
    }

    if (!isDevelopment && allowAllOrigins) {
      console.warn(
        "🚨 Production environment with CORS_ALLOW_ALL=true is a security risk"
      );
    }

    if (this.config.enableDebugLogging) {
      console.log("🔧 CORS Configuration:");
      console.log(
        `   Environment: ${isDevelopment ? "development" : "production"}`
      );
      console.log(`   Allow All Origins: ${allowAllOrigins}`);
      console.log(`   Allowed Origins: ${allowedOrigins.join(", ")}`);
    }
  }

  private isOriginAllowed(origin: string): boolean {
    const { allowedOrigins, allowAllOrigins } = this.config;

    if (allowAllOrigins) return true;

    const normalizedOrigin = this.normalizeOrigin(origin);
    return allowedOrigins.includes(normalizedOrigin);
  }

  public getCorsConfiguration() {
    return cors({
      origin: (origin, callback) => {
        if (!origin) {
          if (this.config.enableDebugLogging) {
            console.log("✅ CORS: Allowing request with no origin");
          }
          return callback(null, true);
        }

        const isAllowed = this.isOriginAllowed(origin);

        if (this.config.enableDebugLogging) {
          console.log(
            `${isAllowed ? "✅" : "❌"} CORS: Origin ${origin} ${
              isAllowed ? "allowed" : "blocked"
            }`
          );
        }

        if (isAllowed) {
          return callback(null, true);
        }

        const error = new Error(
          `CORS policy violation: Origin '${origin}' not allowed. Configured origins: ${this.config.allowedOrigins.join(
            ", "
          )}`
        );
        return callback(error, false);
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
        "X-API-Key",
        "Cache-Control",
      ],
      exposedHeaders: [
        "set-cookie",
        "X-Total-Count",
        "X-Rate-Limit-Remaining",
        "X-Rate-Limit-Reset",
      ],
      preflightContinue: false,
      optionsSuccessStatus: 204,
      maxAge: this.config.isDevelopment ? 0 : 86400,
    });
  }
}

const corsManager = new CorsManager();
export const CorsConfiguration = corsManager.getCorsConfiguration();
