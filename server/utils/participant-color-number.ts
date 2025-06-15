import SessionModel from "../models/session-model.js";

export const AssignParticipantColorNumber = async (
  sessionId: string
): Promise<number> => {
  try {
    const session = await SessionModel.findOne({ sessionId });
    if (!session) {
      throw new Error("Session not found.");
    }

    const usedNumbers = session.participants.map((p) => p.assignedColor);

    for (let i = 0; i < 10; i++) {
      if (!usedNumbers.includes(i)) {
        return i;
      }
    }

    return -1;
  } catch (error) {
    console.error("Error assigning user number:", error);
    return -1;
  }
};
