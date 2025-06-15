import SessionModel from "../models/session-model.js";

import { GetGeoLocation } from "../utils/geo-location.js";

export const CreateSessionService = async (sessionData: any) => {
  try {
    const geoLocation = await GetGeoLocation(sessionData.sessionIp);

    const newSession = new SessionModel({
      sessionId: sessionData.sessionId,
      sessionType: sessionData.sessionType,
      sessionSecurityCode: sessionData.sessionSecurityCode,
      sessionIp: sessionData.sessionIp,
      sessionLocation: geoLocation || {},
      participantCount: 0,
      sessionTimer: 30,
      isExpirationTimeSet: false,
      isProjectModeOn: false,
      sessionLocked: false,
      sessionExpired: false,
      participants: [],
    });

    await newSession.save();
    return newSession;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};
