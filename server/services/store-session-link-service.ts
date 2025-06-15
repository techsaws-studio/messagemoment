import { RedisDatabase } from "../databases/redis-database.js";

export const StoreSessionLinkService = async (
  sessionId: string,
  sessionData: any,
  ttl: number = 600
): Promise<void> => {
  try {
    if (!sessionData.createdAt) {
      sessionData.createdAt = Date.now();
    }

    await RedisDatabase?.setex(sessionId, ttl, JSON.stringify(sessionData));
    console.info(
      `Session stored in Redis with sessionId: ${sessionId}, TTL: ${ttl}s`
    );
  } catch (error) {
    console.error("Error storing session in Redis:", error);
  }
};
