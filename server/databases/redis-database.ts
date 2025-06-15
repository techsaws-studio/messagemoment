import "dotenv/config";

import { Redis } from "ioredis";

import { RetryHandler } from "../middlewares/retry-handler.js";

// REDIS CONNETION HANDLER
let RedisDatabase: Redis | null = null;

const RedisOperation = async (): Promise<void> => {
  if (!RedisDatabase) {
    RedisDatabase = new Redis(process.env.REDIS_URL || "");
  }

  await RedisDatabase.ping();
};

// CONNECT TO REDIS WITH RETRY MECHANISM
const ConnectRedis = async (): Promise<void> => {
  try {
    await RetryHandler(RedisOperation, {
      maxRetries: parseInt(process.env.MAX_RETRIES || "5", 10),
      retryDelay: parseInt(process.env.RETRY_DELAY || "5000", 10),
    });

    RedisDatabase?.on("connect", () => {
      console.info("Redis connection established successfully.");
    });

    RedisDatabase?.on("error", (err) => {
      console.error(`Redis connection error: ${err.message}`);
    });
  } catch (error) {
    console.error(`Failed to connect to Redis: ${(error as Error).message}`);
  }
};

// DISCONNECT REDIS DATABASE
const DisconnectRedis = async (): Promise<void> => {
  if (RedisDatabase) {
    try {
      await RedisDatabase.quit();
      console.info("Redis connection closed successfully.");
    } catch (error) {
      console.error(
        `Error during Redis disconnection: ${(error as Error).message}`
      );
    }
  } else {
    console.warn("No Redis connection found to close.");
  }
};

// SUBSCRIBE TO REDIS CHANNELS
const SubscribeToRedisChannel = (channel: string, callback: Function) => {
  if (RedisDatabase) {
    RedisDatabase.subscribe(channel, (err, count) => {
      if (err) {
        console.error(`Failed to subscribe to channel: ${channel}`);
      } else {
        console.info(
          `Subscribed to ${channel} channel. Currently subscribed to ${count} channels.`
        );
      }
    });

    // Handle message on the subscribed channel
    RedisDatabase.on("message", (channel, message) => {
      console.info(`Message received from ${channel}: ${message}`);
      callback(message);
    });
  }
};

// PUBLISH A MESSAGE TO REDIS CHANNEL
const PublishToRedisChannel = (channel: string, message: string): void => {
  if (RedisDatabase) {
    RedisDatabase.publish(channel, message);
    console.info(`Message sent to ${channel}: ${message}`);
  } else {
    console.error("Redis connection is not established!");
  }
};

export {
  ConnectRedis,
  DisconnectRedis,
  RedisDatabase,
  SubscribeToRedisChannel,
  PublishToRedisChannel,
};
