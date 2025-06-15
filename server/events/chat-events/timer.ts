import { Server, Socket } from "socket.io";

import { RedisDatabase } from "../../databases/redis-database.js";

import SessionModel from "../../models/session-model.js";

import { CreateSessionService } from "../../services/create-session-service.js";
import { DeleteSessionLinkService } from "../../services/delete-session-link-service.js";
import { FetchSessionService } from "../../services/fetch-session-service.js";
import { UpdateSessionTimerService } from "../../services/update-session-timer-service.js";
import TimerChangeModel from "models/timer-change-model.js";

const TimerEvent = (io: Server, socket: Socket): void => {
  socket.on("timer", async ({ sessionId, username, seconds }) => {
    try {
      if (!sessionId || !username) {
        socket.emit("error", "Session ID and Username are required.");
        return;
      }

      if (!Number.isInteger(seconds) || seconds < 3 || seconds > 300) {
        socket.emit(
          "error",
          "Timer must be an integer between 3 and 300 seconds."
        );
        return;
      }

      let sessionData = await RedisDatabase?.get(sessionId);
      let session = await FetchSessionService(sessionId);

      if (sessionData && !session) {
        const parsedSession = JSON.parse(sessionData);
        session = await CreateSessionService(parsedSession);
        await DeleteSessionLinkService(sessionId);
      }

      if (!session) {
        socket.emit("error", "Session not found.");
        return;
      }

      if (session.sessionExpired || session.sessionLocked) {
        socket.emit("error", "Session is expired or locked.");
        return;
      }

      if (session.isProjectModeOn) {
        socket.emit(
          "error",
          "Timer cannot be set while Project Mode is active."
        );
        return;
      }

      if (session.isExpirationTimeSet) {
        socket.emit(
          "error",
          "Timer has already been set and cannot be changed."
        );
        return;
      }

      const previousTimerValue = session.sessionTimer;

      if (previousTimerValue === seconds) {
        socket.emit("info", `Timer is already set to ${seconds} seconds.`);
        return;
      }

      await UpdateSessionTimerService(sessionId, seconds, username);
      await SessionModel.updateOne(
        { sessionId },
        { $set: { isExpirationTimeSet: true } }
      );

      const changeTimestamp = Date.now();
      await TimerChangeModel.create({
        sessionId,
        timestamp: changeTimestamp,
        setBy: username,
        newTimerValue: seconds,
        previousTimerValue,
      });

      io.to(sessionId).emit("timerUpdate", {
        seconds,
        setBy: username,
        changeTimestamp,
      });
    } catch (error: any) {
      console.error("Error setting timer:", error);
      socket.emit(
        "error",
        error.message || "Server error while setting timer."
      );
    }
  });
};

export { TimerEvent };
