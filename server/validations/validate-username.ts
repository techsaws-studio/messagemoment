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
    const existingUser = session.participants.find(
      (participant) =>
        participant.username.toLowerCase() === username.toLowerCase()
    );

    if (existingUser) {
      console.log(`Duplicate username attempt: ${username}`);
      socket.emit(
        "usernameError",
        "The Display Name you entered is already in use. Please choose something else."
      );
      return false;
    }

    const previousUser = await ParticipantModel.findOne({
      sessionId: session.sessionId,
      username: { $regex: new RegExp(`^${username}$`, "i") },
      hasLeftSession: true,
    });

    if (previousUser) {
      if (fingerprint && previousUser.fingerprint === fingerprint) {
        console.log(
          `Original user ${username} returning with matching fingerprint`
        );
        return true;
      }
      
      console.log(`Username ${username} was previously used in this session`);
      socket.emit(
        "usernameError",
        "This username was previously used in this session and cannot be reused by another user."
      );
      return false;
    }

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
