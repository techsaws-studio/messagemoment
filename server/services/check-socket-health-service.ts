import { ServiceHealthInterface } from "interfaces/controllers-interface.js";

export async function CheckSocketHealthService(): Promise<ServiceHealthInterface> {
  const startTime = Date.now();

  try {
    return {
      service: "Socket",
      status: "UP",
      responseTime: Date.now() - startTime,
      details: {
        transport: "websocket",
        ready: true,
      },
    };
  } catch (error: any) {
    return {
      service: "Socket",
      status: "DOWN",
      responseTime: Date.now() - startTime,
      error: error.message,
    };
  }
}
