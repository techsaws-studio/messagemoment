import "dotenv/config";

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import {
  AuthenticatedRequest,
  SessionTokenPayload,
} from "interfaces/utils-interface.js";

class JWTSessionManager {
  private readonly SECRET_KEY: string;
  private readonly TOKEN_EXPIRY: string;
  private readonly COOKIE_NAME: string;
  private readonly REFRESH_THRESHOLD: number;

  constructor() {
    this.SECRET_KEY = process.env.JWT_SECRET_KEY || this.getDefaultSecret();
    this.TOKEN_EXPIRY = process.env.JWT_EXPIRY || "24h";
    this.COOKIE_NAME = "mm_session_token";
    this.REFRESH_THRESHOLD = 3600;

    this.validateProductionConfig();
  }

  private getDefaultSecret(): string {
    const defaultSecret =
      "fee461cbdb12a2fa22442fe598e68f714a648a902829dad38f0362c8a07f6fe8baa58faf60445193e8c8c9468719d8d24186b1f89d194062d02d795e6ef3b97fd10bdf49fbc7325a78c7bdfdc3eb0c4ee054560a35fa8e8792b987cfb2ff3a621da164638a42ee39d8927625cafa28a413266ca9d657b1a48a634b17c83cec144653d3394ea487ddf1a8afc6e667b67296f84f0e821dd39d9581818f0dba4dc145c42817b13fa157e129c3444b24c1e28da6e1211c77333c8bb60abfb156de1c5080c7ac4af1dc84d3e9aa4fc78ba095f6e072192ef15ac276822bd413ac3f72803acf7fcfaa6c3c8772a7cdb077532e6af77d8096facc5ca028e4543fdd72aa";

    if (process.env.NODE_ENV === "production") {
      console.warn(
        "⚠️ Using default JWT secret in production. Please set JWT_SECRET_KEY environment variable!"
      );
    }

    return defaultSecret;
  }

  private validateProductionConfig(): void {
    if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY must be set in production environment");
    }
  }

  generateSessionToken(
    payload: Omit<SessionTokenPayload, "iat" | "exp">
  ): string {
    try {
      this.validateTokenPayload(payload);

      const jwtPayload: Record<string, any> = {
        sessionId: String(payload.sessionId),
        username: String(payload.username),
        userId: String(payload.userId),
        assignedColor: Number(payload.assignedColor) || 0,
        sessionType: String(payload.sessionType),
        generatedAt: Date.now(),
      };

      const token = jwt.sign(jwtPayload, this.SECRET_KEY, {
        expiresIn: this.TOKEN_EXPIRY,
        issuer: "messagemoment",
        audience: "messagemoment-users",
        algorithm: "HS256",
      } as jwt.SignOptions);

      console.log(`✅ JWT token generated for user: ${payload.username}`);
      return token;
    } catch (error) {
      console.error("❌ Error generating JWT token:", error);
      throw new Error("Failed to generate session token");
    }
  }

  private validateTokenPayload(
    payload: Omit<SessionTokenPayload, "iat" | "exp">
  ): void {
    const requiredFields = ["sessionId", "username", "userId"];
    const missingFields = requiredFields.filter(
      (field) => !payload[field as keyof typeof payload]
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required fields in token payload: ${missingFields.join(", ")}`
      );
    }
  }

  verifySessionToken(token: string): SessionTokenPayload | null {
    try {
      if (!token || typeof token !== "string") {
        console.warn("⚠️ Invalid token format received");
        return null;
      }

      const cleanToken = token.replace(/^Bearer\s+/, "").trim();

      const decoded = jwt.verify(cleanToken, this.SECRET_KEY, {
        issuer: "messagemoment",
        audience: "messagemoment-users",
        algorithms: ["HS256"],
      });

      if (this.isValidDecodedToken(decoded)) {
        const payload = decoded as SessionTokenPayload;
        console.log(`✅ JWT token verified for user: ${payload.username}`);
        return payload;
      }

      console.warn("⚠️ JWT token has invalid structure");
      return null;
    } catch (error) {
      this.handleTokenError(error);
      return null;
    }
  }

  private isValidDecodedToken(decoded: any): boolean {
    return (
      typeof decoded === "object" &&
      decoded !== null &&
      "sessionId" in decoded &&
      "username" in decoded &&
      "userId" in decoded &&
      decoded.sessionId &&
      decoded.username &&
      decoded.userId
    );
  }

  private handleTokenError(error: any): void {
    if (error instanceof jwt.JsonWebTokenError) {
      console.warn(`⚠️ Invalid JWT token: ${error.message}`);
    } else if (error instanceof jwt.TokenExpiredError) {
      console.warn(`⚠️ JWT token expired: ${error.message}`);
    } else {
      console.error("❌ JWT verification error:", error);
    }
  }

  setSessionCookie(res: Response, token: string): void {
    const isProduction = process.env.NODE_ENV === "production";

    try {
      res.cookie(this.COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
        domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
      });

      console.log(`✅ Session cookie set successfully`);
    } catch (error) {
      console.error("❌ Error setting session cookie:", error);
    }
  }

  clearSessionCookie(res: Response): void {
    const isProduction = process.env.NODE_ENV === "production";

    try {
      res.clearCookie(this.COOKIE_NAME, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        path: "/",
        domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
      });

      console.log(`✅ Session cookie cleared successfully`);
    } catch (error) {
      console.error("❌ Error clearing session cookie:", error);
    }
  }

  extractTokenFromRequest(req: Request): string | null {
    let token = req.cookies?.[this.COOKIE_NAME];

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    return token || null;
  }

  authenticateSession = (required: boolean = true) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const token = this.extractTokenFromRequest(req);

        if (!token) {
          if (required) {
            return res.status(401).json({
              success: false,
              message: "No session token found",
              requiresAuth: true,
            });
          }
          return next();
        }

        const sessionData = this.verifySessionToken(token);

        if (!sessionData) {
          this.clearSessionCookie(res);
          if (required) {
            return res.status(401).json({
              success: false,
              message: "Invalid or expired session token",
              requiresAuth: true,
            });
          }
          return next();
        }

        req.sessionData = sessionData;

        this.refreshTokenIfNeeded(req, res);

        next();
      } catch (error) {
        console.error("❌ Authentication middleware error:", error);
        this.clearSessionCookie(res);

        if (required) {
          return res.status(401).json({
            success: false,
            message: "Authentication error",
            requiresAuth: true,
          });
        }

        next();
      }
    };
  };

  refreshTokenIfNeeded(req: AuthenticatedRequest, res: Response): boolean {
    if (!req.sessionData) return false;

    const token = this.extractTokenFromRequest(req);
    if (!token) return false;

    try {
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      if (!decoded?.exp) return false;

      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - now;

      if (timeUntilExpiry < this.REFRESH_THRESHOLD) {
        const newToken = this.generateSessionToken({
          sessionId: req.sessionData.sessionId,
          username: req.sessionData.username,
          userId: req.sessionData.userId,
          assignedColor: req.sessionData.assignedColor,
          sessionType: req.sessionData.sessionType,
        });

        this.setSessionCookie(res, newToken);
        console.log(`🔄 Token refreshed for user: ${req.sessionData.username}`);
        return true;
      }
    } catch (error) {
      console.error("❌ Error refreshing token:", error);
    }

    return false;
  }

  isTokenValid(token: string): boolean {
    try {
      const result = this.verifySessionToken(token);
      return result !== null;
    } catch {
      return false;
    }
  }

  getTokenExpiry(token: string): number | null {
    try {
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      return decoded?.exp || null;
    } catch {
      return null;
    }
  }
}

export const jwtSessionManager = new JWTSessionManager();
