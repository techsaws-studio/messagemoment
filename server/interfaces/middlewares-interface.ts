export interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
}

export interface CustomError extends Error {
  statusCode?: number;
  code?: number;
}

export interface CorsConfig {
  allowedOrigins: string[];
  isDevelopment: boolean;
  allowAllOrigins: boolean;
  enableDebugLogging: boolean;
}

export interface SocketConfig {
  pingTimeout: number;
  pingInterval: number;
  connectTimeout: number;
  maxHttpBufferSize: number;
  allowUpgrades: boolean;
  transports: ("websocket" | "polling")[];
}

export interface ClientInfo {
  id: string;
  origin: string | undefined;
  userAgent: string | undefined;
  ip: string;
  timestamp: string;
}

export interface ConnectionMetrics {
  totalConnections: number;
  activeConnections: number;
  totalDisconnections: number;
  errors: number;
}
