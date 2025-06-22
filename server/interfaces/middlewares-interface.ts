export interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
}

export interface CustomError extends Error {
  statusCode?: number;
  code?: number;
}

export interface SocketConfig {
  pingTimeout: number;
  pingInterval: number;
  connectTimeout: number;
  maxHttpBufferSize: number;
  allowUpgrades: boolean;
  transports: ("websocket" | "polling")[];
}
