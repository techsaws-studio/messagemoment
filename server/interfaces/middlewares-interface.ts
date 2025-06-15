export interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
}

export interface CustomError extends Error {
  statusCode?: number;
  code?: number;
}
