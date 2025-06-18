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
