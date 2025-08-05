import SessionModel from "../models/session-model.js";

export const UpdateSessionTimerService = async (
  sessionId: string,
  timerSeconds: number,
  timerSetBy: string | null
): Promise<void> => {
  try {
    const updatedSession = await SessionModel.findOneAndUpdate(
      { sessionId },
      {
        sessionTimer: timerSeconds,
        timerSetBy: timerSetBy || "[MessageMoment.com]",
        isExpirationTimeSet: true,
      },
      {
        new: true,
        writeConcern: { w: "majority", j: true },
      }
    );

    if (!updatedSession) {
      console.error(`Session not found in MongoDB: sessionId=${sessionId}`);
      throw new Error("Session not found in MongoDB");
    }
    
    console.log(
      `Updated MongoDB: sessionId=${sessionId}, sessionTimer=${timerSeconds}, timerSetBy=${timerSetBy}`
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error updating session timer: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${JSON.stringify(error)}`);
    }
    throw error;
  }
};
