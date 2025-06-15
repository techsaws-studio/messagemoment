import { Server } from "socket.io";

import SessionModel from "../models/session-model.js";

export async function EnableProjectMode(
  sessionId: string,
  username: string,
  session: any,
  io: Server
): Promise<void> {
  const projectModeEnabledAt = Date.now();

  await SessionModel.updateOne(
    { sessionId },
    {
      $set: {
        isProjectModeOn: true,
        isExpirationTimeSet: false,
        projectModeEnabledAt: projectModeEnabledAt,
        projectModeDisabledAt: null,
      },

      $push: {
        messageClearHistory: {
          clearedAt: projectModeEnabledAt,
          clearedBy: username,
        },
      },
    }
  );

  await StoreProjectModeActivator(sessionId, username);

  io.to(sessionId).emit("projectModeUpdate", {
    enabled: true,
    toggledBy: username,
    enabledAt: projectModeEnabledAt,
    messagesCleared: true,
  });

  io.to(sessionId).emit("receiveMessage", {
    sender: "System",
    message: `Project Mode has been enabled. Previous messages cleared. Use /mm to interact with AI.`,
    timestamp: projectModeEnabledAt,
    isSystemMessage: true,
  });
}

export async function DisableProjectMode(
  sessionId: string,
  username: string,
  io: Server
): Promise<void> {
  const projectModeDisabledAt = Date.now();

  await SessionModel.updateOne(
    { sessionId },
    {
      $set: {
        isProjectModeOn: false,
        projectModeDisabledAt: projectModeDisabledAt,
      },
    }
  );

  await ClearProjectModeActivator(sessionId);

  io.to(sessionId).emit("projectModeUpdate", {
    enabled: false,
    toggledBy: username,
    disabledAt: projectModeDisabledAt,
  });

  io.to(sessionId).emit("receiveMessage", {
    sender: "System",
    message: `Project Mode has been disabled. Regular chatting resumed.`,
    timestamp: Date.now(),
    isSystemMessage: true,
  });
}

export async function StoreProjectModeActivator(
  sessionId: string,
  username: string
): Promise<void> {
  try {
    await SessionModel.updateOne(
      { sessionId },
      { $set: { "metadata.projectModeActivator": username } }
    );
  } catch (error) {
    console.error("Error storing project mode activator:", error);
  }
}

export async function GetProjectModeActivator(
  sessionId: string
): Promise<string | null> {
  try {
    const session = await SessionModel.findOne(
      { sessionId },
      { "metadata.projectModeActivator": 1 }
    );
    return session?.metadata?.projectModeActivator || null;
  } catch (error) {
    console.error("Error getting project mode activator:", error);
    return null;
  }
}

export async function ClearProjectModeActivator(
  sessionId: string
): Promise<void> {
  try {
    await SessionModel.updateOne(
      { sessionId },
      { $unset: { "metadata.projectModeActivator": "" } }
    );
  } catch (error) {
    console.error("Error clearing project mode activator:", error);
  }
}
