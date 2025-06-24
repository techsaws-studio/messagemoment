import { ServiceHealthInterface } from "interfaces/controllers-interface.js";

export function CreateErrorService(serviceName: string, error: any): ServiceHealthInterface {
  return {
    service: serviceName,
    status: "DOWN",
    responseTime: 0,
    error: error?.message || "Unknown error",
  };
}
