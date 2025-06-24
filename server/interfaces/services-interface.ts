export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface DatabaseHealthDetails {
  mongodb: {
    status: "UP" | "DOWN" | "DEGRADED";
    responseTime: number;
    host?: string;
    database?: string;
    collections?: number;
    readyState: string;
    error?: string;
  };
  redis: {
    status: "UP" | "DOWN" | "DEGRADED";
    responseTime: number;
    mode?: string;
    redisStatus?: string;
    error?: string;
  };
}