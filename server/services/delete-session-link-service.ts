import { RedisDatabase } from "../databases/redis-database.js";

export const DeleteSessionLinkService = async (
  sessionId: string
): Promise<void> => {
  try {
    await RedisDatabase?.del(sessionId);
    console.info(`Session deleted from Redis with sessionId: ${sessionId}`);
  } catch (error) {
    console.error("Error deleting session in Redis:", error);
  }
};
