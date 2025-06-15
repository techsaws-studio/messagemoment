import mongoose from "mongoose";
import { Redis } from "ioredis";

import { io } from "../socket.js";

// Default check interval in milliseconds (30 seconds)
const DEFAULT_CHECK_INTERVAL = 30000;

let isMongoHealthy = true;
let isRedisHealthy = true;

export class DatabaseHealthMonitor {
  private checkInterval: number;
  private intervalId: NodeJS.Timeout | null = null;
  private mongooseConnection: mongoose.Connection | null = null;
  private redisConnection: Redis | null = null;

  constructor(
    mongooseConnection: mongoose.Connection,
    redisConnection: Redis,
    checkInterval: number = DEFAULT_CHECK_INTERVAL
  ) {
    this.mongooseConnection = mongooseConnection;
    this.redisConnection = redisConnection;
    this.checkInterval = checkInterval;
  }

  public start(): void {
    console.info(
      `Starting database health monitoring (interval: ${this.checkInterval}ms)`
    );

    this.checkHealth();

    this.intervalId = setInterval(() => {
      this.checkHealth();
    }, this.checkInterval);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.info("Database health monitoring stopped");
    }
  }

  private async checkHealth(): Promise<void> {
    await Promise.all([this.checkMongoHealth(), this.checkRedisHealth()]);
  }

  private async checkMongoHealth(): Promise<void> {
    try {
      if (!this.mongooseConnection) {
        console.error("MongoDB connection not initialized");
        this.updateMongoHealth(false);
        return;
      }

      const isConnected = this.mongooseConnection.readyState === 1;

      if (!isConnected) {
        console.error(
          `MongoDB is disconnected (state: ${this.mongooseConnection.readyState})`
        );
        this.updateMongoHealth(false);
        return;
      }

      const db = this.mongooseConnection.db;

      if (!db) {
        console.error("MongoDB database object not available");
        this.updateMongoHealth(false);
        return;
      }

      try {
        const result = await db.command({ ping: 1 });
        if (result?.ok === 1) {
          this.updateMongoHealth(true);
        } else {
          console.error("MongoDB ping command failed:", result);
          this.updateMongoHealth(false);
        }
      } catch (error) {
        console.error("MongoDB ping failed:", error);
        this.updateMongoHealth(false);
      }
    } catch (error) {
      console.error("Error checking MongoDB health:", error);
      this.updateMongoHealth(false);
    }
  }

  private async checkRedisHealth(): Promise<void> {
    try {
      if (!this.redisConnection) {
        console.error("Redis connection not initialized");
        this.updateRedisHealth(false);
        return;
      }

      try {
        const pong = await this.redisConnection.ping();

        if (pong !== "PONG") {
          console.error(`Redis ping failed: unexpected response "${pong}"`);
          this.updateRedisHealth(false);
          return;
        }

        this.updateRedisHealth(true);
      } catch (error) {
        console.error("Redis ping failed:", error);
        this.updateRedisHealth(false);
      }
    } catch (error) {
      console.error("Error checking Redis health:", error);
      this.updateRedisHealth(false);
    }
  }

  private updateMongoHealth(healthy: boolean): void {
    if (isMongoHealthy !== healthy) {
      isMongoHealthy = healthy;

      if (healthy) {
        console.info("MongoDB connection is healthy again");
      } else {
        console.error("MongoDB connection is unhealthy");
      }

      this.emitHealthStatus();
    }
  }

  private updateRedisHealth(healthy: boolean): void {
    if (isRedisHealthy !== healthy) {
      isRedisHealthy = healthy;

      if (healthy) {
        console.info("Redis connection is healthy again");
      } else {
        console.error("Redis connection is unhealthy");
      }

      this.emitHealthStatus();
    }
  }

  private emitHealthStatus(): void {
    if (io) {
      try {
        io.emit("systemHealth", {
          timestamp: new Date().toISOString(),
          mongodb: isMongoHealthy,
          redis: isRedisHealthy,
          overall: isMongoHealthy && isRedisHealthy,
        });
      } catch (error) {
        console.error("Failed to emit health status:", error);
      }
    }
  }

  public getHealthStatus(): {
    mongodb: boolean;
    redis: boolean;
    overall: boolean;
  } {
    return {
      mongodb: isMongoHealthy,
      redis: isRedisHealthy,
      overall: isMongoHealthy && isRedisHealthy,
    };
  }
}
