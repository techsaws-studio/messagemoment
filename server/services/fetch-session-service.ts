import SessionModel from "../models/session-model.js";

export const FetchSessionService = async (sessionId: string) => {
  return await SessionModel.findOne({ sessionId });
};
