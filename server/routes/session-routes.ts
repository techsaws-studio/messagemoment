import express from "express";
import cookieParser from "cookie-parser";

import {
  FetchInitialChatLoadDataFunction,
  GenerateSessionLinkFunction,
  ValidationSessionFunction,
  ValidateSessionTokenFunction,
  ClearSessionTokenFunction,
} from "../controllers/session-controllers.js";

const SessionRouter = express.Router();
SessionRouter.use(cookieParser());

SessionRouter.post("/generate-session-link", GenerateSessionLinkFunction);
SessionRouter.get("/validate-session/:sessionId", ValidationSessionFunction);
SessionRouter.get(
  "/fetch-initial-chat-load-data/:sessionId",
  FetchInitialChatLoadDataFunction
);
SessionRouter.get("/validate-token", ValidateSessionTokenFunction);
SessionRouter.post("/clear-session", ClearSessionTokenFunction);

export default SessionRouter;
