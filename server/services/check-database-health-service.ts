import mongoose from "mongoose";

import { ServiceHealthInterface } from "interfaces/controllers-interface.js";
import { DatabaseHealthDetails } from "interfaces/services-interface.js";

import { RedisDatabase } from "databases/redis-database.js";

import { GetConnectionState } from "utils/connection-state.js";
import { DatabaseStatus } from "utils/database-status.js";

export async function CheckDatabaseHealthService(): Promise<ServiceHealthInterface> {
  const startTime = Date.now();

  try {
    const [mongoHealth, redisHealth] = await Promise.allSettled([
      CheckMongoDBHealth(),
      CheckRedisHealth(),
    ]);

    const mongoResult =
      mongoHealth.status === "fulfilled"
        ? mongoHealth.value
        : {
            status: "DOWN" as const,
            responseTime: 0,
            readyState: "error",
            error: "MongoDB check failed",
          };

    const redisResult =
      redisHealth.status === "fulfilled"
        ? redisHealth.value
        : {
            status: "DOWN" as const,
            responseTime: 0,
            error: "Redis check failed",
          };

    const overallStatus = DatabaseStatus(
      mongoResult.status,
      redisResult.status
    );
    const totalResponseTime = Date.now() - startTime;

    const errors: string[] = [];
    if (mongoResult.error) errors.push(`MongoDB: ${mongoResult.error}`);
    if (redisResult.error) errors.push(`Redis: ${redisResult.error}`);

    const details: DatabaseHealthDetails = {
      mongodb: mongoResult,
      redis: redisResult,
    };

    return {
      service: "Database",
      status: overallStatus,
      responseTime: totalResponseTime,
      error: errors.length > 0 ? errors.join("; ") : undefined,
      details,
    };
  } catch (error: any) {
    return {
      service: "Database",
      status: "DOWN",
      responseTime: Date.now() - startTime,
      error: `Database health check failed: ${error.message}`,
      details: {
        mongodb: {
          status: "DOWN",
          responseTime: 0,
          readyState: "error",
          error: error.message,
        },
        redis: { status: "DOWN", responseTime: 0, error: error.message },
      },
    };
  }
}

async function CheckMongoDBHealth(): Promise<DatabaseHealthDetails["mongodb"]> {
  const startTime = Date.now();

  try {
    if (mongoose.connection.readyState !== 1) {
      return {
        status: "DOWN",
        responseTime: Date.now() - startTime,
        readyState: GetConnectionState(mongoose.connection.readyState),
        error: `Connection not ready: ${GetConnectionState(
          mongoose.connection.readyState
        )}`,
      };
    }

    const connection = global.mongooseConnection || mongoose.connection;

    if (!connection.db) {
      return {
        status: "DOWN",
        responseTime: Date.now() - startTime,
        readyState: GetConnectionState(connection.readyState),
        error: "Database connection not properly initialized",
      };
    }

    try {
      await connection.db.admin().ping();
    } catch (pingError: any) {
      return {
        status: "DOWN",
        responseTime: Date.now() - startTime,
        readyState: GetConnectionState(connection.readyState),
        error: `Ping failed: ${pingError.message}`,
      };
    }

    let collectionsCount = 0;
    try {
      const collections = await connection.db.listCollections().toArray();
      collectionsCount = collections.length;
    } catch (collectionsError: any) {
      console.warn("Failed to list collections:", collectionsError.message);
    }

    const responseTime = Date.now() - startTime;

    return {
      status: responseTime > 2000 ? "DEGRADED" : "UP",
      responseTime,
      host: connection.host || "unknown",
      database: connection.name || "unknown",
      collections: collectionsCount,
      readyState: "connected",
    };
  } catch (error: any) {
    return {
      status: "DOWN",
      responseTime: Date.now() - startTime,
      readyState: GetConnectionState(mongoose.connection.readyState),
      error: `MongoDB health check failed: ${error.message}`,
    };
  }
}

async function CheckRedisHealth(): Promise<DatabaseHealthDetails["redis"]> {
  const startTime = Date.now();

  try {
    if (!RedisDatabase) {
      return {
        status: "DOWN",
        responseTime: Date.now() - startTime,
        error: "Redis client not initialized",
      };
    }

    const pingResult = await RedisDatabase.ping();
    if (pingResult !== "PONG") {
      return {
        status: "DEGRADED",
        responseTime: Date.now() - startTime,
        redisStatus: RedisDatabase.status,
        error: `Ping returned: ${pingResult}`,
      };
    }

    const testKey = `healthcheck:${Date.now()}`;
    const testValue = "OK";

    await RedisDatabase.setex(testKey, 10, testValue);
    const retrievedValue = await RedisDatabase.get(testKey);
    await RedisDatabase.del(testKey);

    if (retrievedValue !== testValue) {
      return {
        status: "DEGRADED",
        responseTime: Date.now() - startTime,
        redisStatus: RedisDatabase.status,
        mode: RedisDatabase.mode || "standalone",
        error: "Read/write test failed",
      };
    }

    const responseTime = Date.now() - startTime;

    return {
      status: responseTime > 1000 ? "DEGRADED" : "UP",
      responseTime,
      redisStatus: RedisDatabase.status,
      mode: RedisDatabase.mode || "standalone",
    };
  } catch (error: any) {
    return {
      status: "DOWN",
      responseTime: Date.now() - startTime,
      error: error.message,
    };
  }
}
