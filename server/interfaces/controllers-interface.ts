export interface CreateTicketRequest {
  firstName: string;
  lastName: string;
  emailAddress: string;
  topic: string;
  query: string;
}

export interface ServiceHealthInterface {
  service: string;
  status: "UP" | "DOWN" | "DEGRADED";
  responseTime: number;
  details?: any;
  error?: string;
}

export interface HealthResponseInterface {
  status: "UP" | "DOWN" | "DEGRADED";
  timestamp: string;
  uptime: number;
  services: ServiceHealthInterface[];
  summary: {
    total: number;
    up: number;
    down: number;
    degraded: number;
  };
}
