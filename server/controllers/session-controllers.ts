import "dotenv/config";

import { NextFunction, Request, Response } from "express";

import { RedisDatabase } from "../databases/redis-database.js";

import { SessionTypeEnum } from "../enums/session-type-enum.js";
import { AuthenticatedRequest } from "../interfaces/utils-interface.js";

import { StoreSessionLinkService } from "../services/store-session-link-service.js";
import { FetchSessionService } from "../services/fetch-session-service.js";

import { CatchAsyncErrors } from "../utils/catch-async-errors.js";
import { ErrorHandler } from "../utils/error-handler.js";
import { SessionIdGenerator } from "../utils/session-id-generator.js";
import { SecurityCodeGenerator } from "../utils/security-code-generator.js";
import { jwtSessionManager } from "../utils/jwt-session-manager.js";

// GENERATE SESSION LINK FUNCTION
export const GenerateSessionLinkFunction = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionType } = req.body;

      if (!Object.values(SessionTypeEnum).includes(sessionType)) {
        return next(new ErrorHandler("Invalid session type", 400));
      }

      const sessionId = SessionIdGenerator();
      const sessionSecurityCode =
        sessionType === SessionTypeEnum.SECURE
          ? SecurityCodeGenerator()
          : undefined;

      const sessionIp =
        req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
        req.socket.remoteAddress ||
        "Unknown";

      const sessionData = {
        sessionId,
        sessionType,
        sessionSecurityCode,
        sessionIp,
      };

      await StoreSessionLinkService(sessionId, sessionData);

      console.log(`✅ Session link generated: ${sessionId}`);

      return res.status(201).json({
        success: true,
        message: "Session link generated successfully",
        data: {
          sessionId,
          sessionType,
          sessionSecurityCode,
          sessionIp,
        },
      });
    } catch (error: any) {
      console.error("❌ Error generating session link:", error);
      const message = error.response?.data?.error || error.message;
      return next(new ErrorHandler(message, error.response?.status || 500));
    }
  }
);

// VALIDATE SEESION FUNTION
export const ValidationSessionFunction = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;

      if (process.env.IS_MAINTENANCE === "true") {
        console.log(`🚧 Maintenance mode active - blocking session validation`);
        return res.status(200).json({
          success: false,
          redirect: "/maintenance",
          message:
            "System is currently under maintenance. Please try again later.",
        });
      }

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          redirect: "/invalid-session",
          message: "Session ID is required",
        });
      }

      if (!RedisDatabase) {
        console.error("❌ RedisDatabase is not initialized.");
        return res.status(500).json({
          success: false,
          redirect: "/error",
          message: "Internal server error",
        });
      }

      const sessionData = await RedisDatabase.get(sessionId);
      const session = await FetchSessionService(sessionId);

      // Case 1: Session exists in Redis → Allow access
      if (sessionData) {
        console.log(`✅ Session found in Redis: ${sessionId}`);
        return res.status(200).json({ success: true, redirect: null });
      }

      // Case 2: Session exists in MongoDB and is not expired
      if (session && !session.sessionExpired) {
        // Condition 1: If session is locked, redirect to "/locked-session"
        if (session.sessionLocked) {
          return res.status(200).json({
            success: false,
            redirect: "/locked-session",
            message: "Session is locked",
          });
        }

        // Condition 2: If session is full (participantCount >= 10), redirect to "/full-session"
        if (session.participantCount >= 10) {
          return res.status(200).json({
            success: false,
            redirect: "/full-session",
            message: "Session is full",
          });
        }

        // Otherwise, allow access
        console.log(`✅ Session found in MongoDB: ${sessionId}`);
        return res.status(200).json({ success: true, redirect: null });
      }

      // Case 3 & 4: Session is missing or expired → Redirect to "/expired-session"
      console.log(`⚠️ Session expired or not found: ${sessionId}`);
      return res.status(200).json({
        success: false,
        redirect: "/expired-session",
        message: "Session is expired or does not exist",
      });
    } catch (error: any) {
      console.error("❌ Error validating session:", error);
      const message = error.response?.data?.error || error.message;
      return next(new ErrorHandler(message, error.response?.status || 500));
    }
  }
);

// FETCH INTIAL CHAT LOAD DATA FUNCTION
export const FetchInitialChatLoadDataFunction = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;
      if (!sessionId) {
        return next(new ErrorHandler("Session ID is required", 400));
      }

      let data = null;

      if (!RedisDatabase) {
        return next(new ErrorHandler("RedisDatabase is not initialized.", 500));
      }
      const redisSessionData = await RedisDatabase.get(sessionId);
      if (redisSessionData) {
        data = JSON.parse(redisSessionData);
      } else {
        const session = await FetchSessionService(sessionId);
        if (session) {
          data = {
            sessionType: session.sessionType,
            sessionSecurityCode: session.sessionSecurityCode || null,
            sessionTimer: session.sessionTimer || 30,
            timerSetBy: session.timerSetBy || "System",
            isExpirationTimeSet: session.isExpirationTimeSet || false,
            isProjectModeOn: session.isProjectModeOn || false,
            sessionLocked: session.sessionLocked || false,
          };
        }
      }

      if (!data) {
        return res.status(200).json({
          success: false,
          message: "Session not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data,
        message: "Session details fetched successfully.",
      });
    } catch (error: any) {
      const message = error.response?.data?.error || error.message;
      return next(new ErrorHandler(message, error.response?.status || 500));
    }
  }
);

// VALIDATE EXISTING SESSION TOKEN
export const ValidateSessionTokenFunction = CatchAsyncErrors(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      console.log("🔍 Validating session token...");

      const token = jwtSessionManager.extractTokenFromRequest(req);

      if (!token) {
        console.log("⚠️ No session token found in request");
        return res.status(200).json({
          success: true,
          hasValidSession: false,
          message: "No session token found",
        });
      }

      console.log("✅ Session token found, verifying...");
      const sessionData = jwtSessionManager.verifySessionToken(token);

      if (!sessionData) {
        console.log("⚠️ Invalid session token received");
        jwtSessionManager.clearSessionCookie(res);
        return res.status(200).json({
          success: true,
          hasValidSession: false,
          message: "Invalid or expired session token",
        });
      }

      console.log(
        `🔍 Checking session existence for: ${sessionData.sessionId}`
      );
      const session = await FetchSessionService(sessionData.sessionId);

      if (!session || session.sessionExpired) {
        console.log(`⚠️ Session no longer exists: ${sessionData.sessionId}`);
        jwtSessionManager.clearSessionCookie(res);
        return res.status(200).json({
          success: true,
          hasValidSession: false,
          message: "Session no longer exists or has expired",
        });
      }

      const isStillParticipant = session.participants.some(
        (p) => p.username.toLowerCase() === sessionData.username.toLowerCase()
      );

      if (!isStillParticipant) {
        console.log(`⚠️ User no longer participant: ${sessionData.username}`);
        jwtSessionManager.clearSessionCookie(res);
        return res.status(200).json({
          success: true,
          hasValidSession: false,
          message: "User is no longer a participant in this session",
        });
      }

      const refreshed = jwtSessionManager.refreshTokenIfNeeded(req, res);
      if (refreshed) {
        console.log(`🔄 Token refreshed for user: ${sessionData.username}`);
      }

      console.log(
        `✅ Valid session token validated for user: ${sessionData.username}`
      );

      return res.status(200).json({
        success: true,
        hasValidSession: true,
        sessionData: {
          sessionId: sessionData.sessionId,
          username: sessionData.username,
          userId: sessionData.userId,
          assignedColor: sessionData.assignedColor,
          sessionType: sessionData.sessionType,
        },
        session: {
          isProjectModeOn: session.isProjectModeOn,
          sessionLocked: session.sessionLocked,
          sessionTimer: session.sessionTimer,
          timerSetBy: session.timerSetBy,
          participantCount: session.participantCount,
        },
        message: "Valid session found",
      });
    } catch (error: any) {
      console.error("❌ Error validating session token:", error);
      jwtSessionManager.clearSessionCookie(res);
      return res.status(200).json({
        success: true,
        hasValidSession: false,
        message: "Error validating session",
      });
    }
  }
);

// CLEAR SESSION TOKEN
export const ClearSessionTokenFunction = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      jwtSessionManager.clearSessionCookie(res);

      console.log("✅ Session token cleared successfully");

      return res.status(200).json({
        success: true,
        message: "Session cleared successfully",
      });
    } catch (error: any) {
      console.error("❌ Error clearing session token:", error);
      const message = error.response?.data?.error || error.message;
      return next(new ErrorHandler(message, error.response?.status || 500));
    }
  }
);
