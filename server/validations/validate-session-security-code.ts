import { Socket } from "socket.io";

import { SessionTypeEnum } from "../enums/session-type-enum.js";
import { ISession } from "../interfaces/models-interface.js";

export const ValidateSessionSecurityCode = (
  session: ISession,
  sessionSecurityCode: string | undefined,
  socket: Socket
): boolean => {
  if (session.sessionType === SessionTypeEnum.SECURE) {
    if (!sessionSecurityCode) {
      socket.emit("error", "Security code is required for secure sessions.");
      return false;
    }

    if (session.sessionSecurityCode !== sessionSecurityCode) {
      socket.emit("error", "Invalid security code.");
      return false;
    }
  }

  return true;
};
