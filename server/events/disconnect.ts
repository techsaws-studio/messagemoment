import { Socket, Server } from "socket.io";

import { SocketUserInfo } from "../interfaces/events-interface.js";

import { LeaveSessionService } from "../services/leave-session-service.js";
import { FetchSessionService } from "../services/fetch-session-service.js";

import { UserLeftNotification } from "../notifications/user-left-notification.js";

import { UpdateUserList } from "../utils/update-user-list.js";

const socketRegistry = new Map<string, SocketUserInfo>();

const gracePeriodRegistry = new Map<
  string,
  {
    userInfo: SocketUserInfo;
    timer: NodeJS.Timeout;
    disconnectTime: number;
    participantData: any;
  }
>();

const intentionalLeaveRegistry = new Set<string>();

const GRACE_PERIOD_MS = 15000;
const MAX_GRACE_EXTENSIONS = 2;

const registerSocket = (
  socketId: string,
  username: string,
  sessionId: string
): void => {
  socketRegistry.set(socketId, { username, sessionId });

  const gracePeriodKey = `${sessionId}:${username.toLowerCase()}`;
  if (gracePeriodRegistry.has(gracePeriodKey)) {
    const gracePeriod = gracePeriodRegistry.get(gracePeriodKey)!;
    clearTimeout(gracePeriod.timer);
    gracePeriodRegistry.delete(gracePeriodKey);
    console.info(
      `Cleared grace period for ${username} - successfully reconnected`
    );
  }

  console.info(
    `Registered socket ${socketId} for user ${username} in session ${sessionId}`
  );
};

// GET USER INFO FROM SOCKET
const getSocketInfo = (socketId: string): SocketUserInfo | undefined => {
  return socketRegistry.get(socketId);
};

// REMOVE SOCKET FROM THE REGISTRY
const unregisterSocket = (socketId: string): void => {
  socketRegistry.delete(socketId);
  console.info(`Unregistered socket ${socketId}`);
};

// MARK USER AS INTENTIONALLY LEAVING
const markIntentionalLeave = (sessionId: string, username: string): void => {
  const key = `${sessionId}:${username.toLowerCase()}`;
  intentionalLeaveRegistry.add(key);
  console.info(
    `Marked ${username} as intentionally leaving session ${sessionId}`
  );
};

// CHECK IF LEAVE WAS INTENTIONAL
const wasIntentionalLeave = (sessionId: string, username: string): boolean => {
  const key = `${sessionId}:${username.toLowerCase()}`;
  const wasIntentional = intentionalLeaveRegistry.has(key);
  if (wasIntentional) {
    intentionalLeaveRegistry.delete(key); // Clean up
  }
  return wasIntentional;
};

// START GRACE PERIOD FOR USER
const startGracePeriod = async (
  userInfo: SocketUserInfo,
  io: Server,
  participantData: any
): Promise<void> => {
  const { username, sessionId } = userInfo;
  const gracePeriodKey = `${sessionId}:${username.toLowerCase()}`;

  if (gracePeriodRegistry.has(gracePeriodKey)) {
    const existing = gracePeriodRegistry.get(gracePeriodKey)!;
    const timeSinceDisconnect = Date.now() - existing.disconnectTime;

    if (timeSinceDisconnect < GRACE_PERIOD_MS * MAX_GRACE_EXTENSIONS) {
      clearTimeout(existing.timer);
      console.info(
        `Extending grace period for ${username} in session ${sessionId}`
      );
    } else {
      console.info(
        `Max grace period reached for ${username}, proceeding with removal`
      );
      await executeUserRemoval(existing.userInfo, io, existing.participantData);
      return;
    }
  }

  console.info(
    `Starting ${GRACE_PERIOD_MS}ms grace period for ${username} in session ${sessionId}`
  );

  // Notify other users that user is temporarily disconnected
  io.to(sessionId).emit("userTemporarilyDisconnected", {
    username,
    message: `${username} is temporarily disconnected`,
    gracePeriodMs: GRACE_PERIOD_MS,
  });

  const timer = setTimeout(async () => {
    console.info(
      `Grace period expired for ${username} in session ${sessionId}`
    );

    // Check if user reconnected during grace period
    if (!gracePeriodRegistry.has(gracePeriodKey)) {
      console.info(`User ${username} already reconnected, skipping removal`);
      return;
    }

    const gracePeriod = gracePeriodRegistry.get(gracePeriodKey)!;
    gracePeriodRegistry.delete(gracePeriodKey);

    await executeUserRemoval(
      gracePeriod.userInfo,
      io,
      gracePeriod.participantData
    );
  }, GRACE_PERIOD_MS);

  gracePeriodRegistry.set(gracePeriodKey, {
    userInfo,
    timer,
    disconnectTime: Date.now(),
    participantData,
  });
};

// EXECUTE ACTUAL USER REMOVAL
const executeUserRemoval = async (
  userInfo: SocketUserInfo,
  io: Server,
  participantData: any
): Promise<void> => {
  const { username, sessionId } = userInfo;

  try {
    console.info(`Executing removal for ${username} from session ${sessionId}`);

    await LeaveSessionService(sessionId, username, io);

    await UserLeftNotification(
      io,
      sessionId,
      username,
      participantData?.assignedColor || 0
    );

    await UpdateUserList(io, sessionId);

    // Notify users that the temporary disconnect became permanent
    io.to(sessionId).emit("userPermanentlyLeft", {
      username,
      message: `${username} has left the session`,
      wasTemporary: true,
    });

    console.info(
      `Successfully removed ${username} from session ${sessionId} after grace period`
    );
  } catch (error) {
    console.error(`Error during delayed user removal for ${username}:`, error);
  }
};

// CANCEL GRACE PERIOD (user reconnected)
const cancelGracePeriod = (sessionId: string, username: string): boolean => {
  const gracePeriodKey = `${sessionId}:${username.toLowerCase()}`;

  if (gracePeriodRegistry.has(gracePeriodKey)) {
    const gracePeriod = gracePeriodRegistry.get(gracePeriodKey)!;
    clearTimeout(gracePeriod.timer);
    gracePeriodRegistry.delete(gracePeriodKey);

    console.info(`Cancelled grace period for ${username} - user reconnected`);
    return true;
  }

  return false;
};

// MAIN DISCONNECT HANDLER
const Disconnect = (socket: Socket, io: Server): void => {
  socket.on("disconnect", async (reason) => {
    console.info(`Socket ${socket.id} disconnected. Reason: ${reason}`);

    try {
      const userInfo = getSocketInfo(socket.id);
      if (!userInfo) {
        console.info(`No user info found for socket ${socket.id}`);
        unregisterSocket(socket.id);
        return;
      }

      const { username, sessionId } = userInfo;
      console.info(
        `User ${username} in session ${sessionId} disconnected. Reason: ${reason}`
      );

      // Check if this was an intentional leave
      if (wasIntentionalLeave(sessionId, username)) {
        console.info(
          `Intentional leave detected for ${username}, proceeding with immediate removal`
        );
        unregisterSocket(socket.id);

        const session = await FetchSessionService(sessionId);
        if (session) {
          const participant = session.participants.find(
            (p) => p.username.toLowerCase() === username.toLowerCase()
          );

          await executeUserRemoval(userInfo, io, participant);
        }
        return;
      }

      // For unintentional disconnects, fetch user data and start grace period
      const session = await FetchSessionService(sessionId);
      if (!session) {
        console.warn(`Session not found for sessionId: ${sessionId}`);
        unregisterSocket(socket.id);
        return;
      }

      const participant = session.participants.find(
        (p) => p.username.toLowerCase() === username.toLowerCase()
      );

      if (!participant) {
        console.warn(
          `Participant ${username} not found in session ${sessionId}`
        );
        unregisterSocket(socket.id);
        return;
      }

      unregisterSocket(socket.id);

      // Determine if this looks like a page refresh/temporary disconnect
      const isLikelyTemporary =
        reason === "transport close" ||
        reason === "client namespace disconnect" ||
        reason === "ping timeout";

      if (isLikelyTemporary) {
        console.info(
          `Temporary disconnect detected for ${username}, starting grace period`
        );
        await startGracePeriod(userInfo, io, participant);
      } else {
        console.info(
          `Permanent disconnect detected for ${username}, removing immediately`
        );
        await executeUserRemoval(userInfo, io, participant);
      }
    } catch (error) {
      console.error("Error handling disconnect:", error);
      try {
        unregisterSocket(socket.id);
      } catch (unregisterError) {
        console.error(`Error unregistering socket: ${unregisterError}`);
      }
    }
  });
};

// CLEANUP FUNCTION FOR GRACEFUL SHUTDOWN
const cleanupGracePeriods = (): void => {
  console.info("Cleaning up all grace periods...");
  gracePeriodRegistry.forEach((gracePeriod, key) => {
    clearTimeout(gracePeriod.timer);
  });
  gracePeriodRegistry.clear();
  intentionalLeaveRegistry.clear();
  console.info("Grace period cleanup completed");
};

export {
  Disconnect,
  registerSocket,
  getSocketInfo,
  unregisterSocket,
  markIntentionalLeave,
  cancelGracePeriod,
  cleanupGracePeriods,
};
