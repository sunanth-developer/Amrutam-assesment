export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'INVALID_JSON'
  | 'EMPTY_RESPONSE'
  | 'PARTIAL_RESPONSE'
  | 'SESSION_EXPIRED'
  | 'SLOT_CONFLICT'
  | 'SLOT_EXPIRED'
  | 'DOUBLE_BOOKING'
  | 'NOT_FOUND'
  | 'UNKNOWN';

export class AppError extends Error {
  constructor(
    public code: AppErrorCode,
    message: string,
    public recoverable = true,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
