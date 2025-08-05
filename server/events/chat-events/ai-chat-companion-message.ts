import "dotenv/config";

import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import axios from "axios";

import { AIResearchCompanionMessagePayload } from "../../interfaces/events-interface.js";

import MessageModel from "../../models/message-model.js";

import { FetchSessionService } from "../../services/fetch-session-service.js";

import {
  generateSimulatedResponse,
  handleAIResearchCompanionError,
} from "../../utils/ai-chat-companion-simulated-response.js";

dotenv.config();

const AIResearchCompanionMessageEvent = (io: Server, socket: Socket): void => {
  socket.on(
    "aiResearchCompanionMessage",
    async (data: AIResearchCompanionMessagePayload) => {
      try {
        const { sessionId, username, message } = data;
        console.info(
          `[AI Research Companion] User ${username} sent message in session: ${sessionId}`
        );

        if (!sessionId || !username || !message) {
          throw new Error("Session ID, Username, and Message are required.");
        }

        const session = await FetchSessionService(sessionId);
        if (!session) {
          throw new Error("Session not found.");
        }

        if (session.sessionExpired) {
          throw new Error(
            "This chat session has expired. Return to the homepage to generate a new chat session."
          );
        }

        if (!session.isProjectModeOn) {
          throw new Error(
            "Project Mode is not enabled. Enable it with /project on"
          );
        }

        io.to(sessionId).emit("receiveMessage", {
          sender: username,
          message: message,
          timestamp: Date.now(),
          isAIInput: true,
        });

        const processingMsgTime = Date.now();

        // LOADER
        io.to(sessionId).emit("receiveMessage", {
          sender: "[MessageMoment.com]",
          message: "Processing your request with AI Research Companion...",
          timestamp: processingMsgTime,
          isSystem: true,
        });

        const USE_SIMULATION = false;
        const API_URL = process.env.AI_RESEARCH_COMPANION_API_URL;
        const API_KEY = process.env.AI_RESEARCH_COMPANION_API_KEY;

        if (!API_URL || !API_KEY) {
          throw new Error(
            "Missing AI Research Companion API URL or API KEY in environment variables."
          );
        }

        if (USE_SIMULATION) {
          setTimeout(() => {
            try {
              const AIResearchCompanionResponse =
                generateSimulatedResponse(message);
              const timestamp = Date.now();

              io.to(sessionId).emit("receiveMessage", {
                sender: "[AI_RESEARCH_COMPANION]",
                message: AIResearchCompanionResponse,
                timestamp,
                isAI: true,
              });

              try {
                new MessageModel({
                  sessionId,
                  username: "[AI_RESEARCH_COMPANION]",
                  message: AIResearchCompanionResponse,
                  timestamp,
                  displayExpiresAt: null,
                  isAIMessage: true,
                })
                  .save()
                  .then(() => {
                    console.log(
                      `[AI Research Companion] Saved simulated AI response to database for session ${sessionId}`
                    );
                  })
                  .catch((saveError: any) => {
                    console.error(
                      "[AI Research Companion] Failed to save simulated AI message to database:",
                      saveError
                    );
                  });
              } catch (dbError) {
                console.error(
                  "[AI Research Companion] Failed to save simulated AI message to database:",
                  dbError
                );
              }
            } catch (error) {
              handleAIResearchCompanionError(error, io, sessionId);
            }
          }, 1500);
        } else {
          try {
            console.log(
              "[AI Research Companion] Making API request with key:",
              API_KEY ? "***REDACTED***" : "MISSING"
            );

            const requestPayload = {
              model: "llama3-70b-8192",
              messages: [{ role: "user", content: message }],
              temperature: 0.7,
              max_tokens: 1024,
            };

            const response = await axios.post(API_URL, requestPayload, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
              },
              timeout: 10000,
            });

            console.log("[AI Research Companion] API Response:", {
              status: response.status,
              data: response.data,
            });

            if (!response.data?.choices?.[0]?.message?.content) {
              throw new Error(
                "Unexpected response format from AI Research Companion"
              );
            }

            const AIResearchCompanionResponse =
              response.data.choices[0].message.content;
            const timestamp = Date.now();

            io.to(sessionId).emit("receiveMessage", {
              sender: "[AI_RESEARCH_COMPANION]",
              message: AIResearchCompanionResponse,
              timestamp,
              isAI: true,
            });

            try {
              await new MessageModel({
                sessionId,
                username: "[AI_RESEARCH_COMPANION]",
                message: AIResearchCompanionResponse,
                timestamp,
                displayExpiresAt: null,
                isAIMessage: true,
              }).save();

              console.log(
                `[AI Research Companion] Saved AI response to database for session ${sessionId}`
              );
            } catch (dbError) {
              console.error(
                "[AI Research Companion] Failed to save AI message to database:",
                dbError
              );
            }
          } catch (apiError: any) {
            console.error("[AI Research Companion] Full Error Details:", {
              timestamp: new Date().toISOString(),
              error: {
                name: apiError.name,
                message: apiError.message,
                stack: apiError.stack,
                code: apiError.code,
              },
              response: {
                status: apiError.response?.status,
                statusText: apiError.response?.statusText,
                data: apiError.response?.data,
              },
              request: {
                url: apiError.config?.url,
                method: apiError.config?.method,
                data: apiError.config?.data,
                headers: apiError.config?.headers,
              },
            });

            let errorMessage =
              "Failed to get response from AI Research Companion";

            if (apiError.response?.data?.error?.message) {
              errorMessage = apiError.response.data.error.message;
            } else if (apiError.message) {
              errorMessage = apiError.message;
            }

            io.to(sessionId).emit("receiveMessage", {
              sender: "[MessageMoment.com]",
              message: `AI Research Companion Error: ${errorMessage}`,
              timestamp: Date.now(),
              isSystem: true,
            });
          }
        }
      } catch (error: any) {
        console.error(
          "[AI Research Companion] Message Processing Error:",
          error
        );
        socket.emit(
          "error",
          error.message ||
            "Server error while processing AI Research Companion message."
        );
      }
    }
  );
};

export { AIResearchCompanionMessageEvent };
