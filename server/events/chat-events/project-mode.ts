import { Server, Socket } from "socket.io";

import { ProjectModePayload } from "../../interfaces/events-interface.js";

import { FetchSessionService } from "../../services/fetch-session-service.js";

import {
  DisableProjectMode,
  EnableProjectMode,
  GetProjectModeActivator,
} from "../../utils/project-mode-helper-functions.js";

const ProjectModeEvent = (io: Server, socket: Socket): void => {
  socket.on("toggleProjectMode", async (data: ProjectModePayload) => {
    try {
      const { sessionId, username, command = "" } = data;
      console.info(
        `User ${username} toggling project mode in session: ${sessionId} with command: ${command}`
      );

      if (!sessionId || !username) {
        socket.emit("error", "Session ID and Username are required.");
        return;
      }

      const session = await FetchSessionService(sessionId);
      if (!session) {
        socket.emit("error", "Session not found.");
        return;
      }

      if (session.sessionExpired) {
        socket.emit("error", "Session is expired.");
        return;
      }

      // Check the command specifically
      if (command === "on") {
        if (session.isProjectModeOn) {
          const timestamp = new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
          console.log(
            `[PROJECT-MODE] Already enabled at ${timestamp} - silently ignoring command`
          );
          return;
        }
        await EnableProjectMode(sessionId, username, session, io);
      } else if (command === "off") {
        if (!session.isProjectModeOn) {
          const timestamp = new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
          console.log(
            `[PROJECT-MODE] Not enabled at ${timestamp} - silently ignoring command`
          );

          return;
        }

        const projectModeUser = await GetProjectModeActivator(sessionId);
        if (
          projectModeUser &&
          projectModeUser.toLowerCase() !== username.toLowerCase()
        ) {
          socket.emit(
            "error",
            `Only ${projectModeUser} can turn off Project Mode.`
          );
          return;
        }
        await DisableProjectMode(sessionId, username, io);
      } else {
        socket.emit(
          "error",
          "Invalid project mode command. Use '/project on' to enable or '/project off' to disable."
        );
        return;
      }
    } catch (error: any) {
      console.error("Error toggling project mode:", error);
      socket.emit(
        "error",
        error.message || "Server error while toggling project mode."
      );
    }
  });
};

export { ProjectModeEvent };
