import { ServiceHealthInterface } from "interfaces/controllers-interface.js";

export async function CheckAPIHealthService(): Promise<ServiceHealthInterface> {
  const startTime = Date.now();

  try {
    const memUsage = process.memoryUsage();
    const memUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    return {
      service: "API",
      status: memUsagePercent > 90 ? "DEGRADED" : "UP",
      responseTime: Date.now() - startTime,
      details: {
        port: process.env.PORT,
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
        memory: {
          used: Math.round(memUsage.heapUsed / 1024 / 1024),
          total: Math.round(memUsage.heapTotal / 1024 / 1024),
          usage: Math.round(memUsagePercent),
        },
      },
    };
  } catch (error: any) {
    return {
      service: "API",
      status: "DOWN",
      responseTime: Date.now() - startTime,
      error: error.message,
    };
  }
}
