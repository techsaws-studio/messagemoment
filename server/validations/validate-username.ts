import { Socket } from "socket.io";

import { ISession } from "../interfaces/models-interface.js";

import ParticipantModel from "../models/participant-model.js";

export const ValidateUsername = async (
  session: ISession,
  username: string,
  socket: Socket,
  fingerprint?: string
): Promise<boolean> => {
  try {
    console.log("🔍 ValidateUsername called with:", {
      username,
      fingerprint,
      fingerprintType: typeof fingerprint,
      sessionId: session.sessionId,
    });

    const existingUser = session.participants.find(
      (participant) =>
        participant.username.toLowerCase() === username.toLowerCase()
    );

    if (existingUser) {
      console.log(`❌ Duplicate username attempt: ${username}`);
      socket.emit(
        "usernameError",
        "The Display Name you entered is already in use. Please choose something else."
      );
      return false;
    }

    // ✅ FIX: Escape regex special characters
    const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const previousUser = await ParticipantModel.findOne({
      sessionId: session.sessionId,
      username: { $regex: new RegExp(`^${escapedUsername}$`, "i") },
      hasLeftSession: true,
    });

    console.log("🔍 Previous user search:", {
      searchingFor: escapedUsername,
      found: !!previousUser,
      previousFingerprint: previousUser?.fingerprint,
      currentFingerprint: fingerprint,
      fingerprintsMatch: previousUser?.fingerprint === fingerprint,
    });

    if (previousUser) {
      if (fingerprint && previousUser.fingerprint === fingerprint) {
        console.log("✅ Original user returning with matching fingerprint");
        return true;
      }

      console.log("❌ Username was previously used, fingerprints don't match");
      socket.emit(
        "usernameError",
        "The Display Name you entered was previously used in this session and cannot be reused."
      );
      return false;
    }

    console.log("✅ New username, allowing join");
    return true;
  } catch (error) {
    console.error(`Error validating username ${username}:`, error);
    socket.emit(
      "usernameError",
      "An error occurred while validating your username. Please try again."
    );
    return false;
  }
};
