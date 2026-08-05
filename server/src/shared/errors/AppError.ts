export type AppErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'DUPLICATE_RECORD'
  | 'BUSINESS_RULE_VIOLATION'
  | 'INVALID_STATUS_TRANSITION'
  | 'OPTIMISTIC_LOCK_ERROR'
  | 'INSUFFICIENT_STOCK'
  | 'RESOURCE_UNAVAILABLE'
  | 'ACCESS_DENIED'
  | 'ARCHIVED_RECORD'
  | 'EXPIRED_RESOURCE'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: AppErrorCode;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 400, code: AppErrorCode = 'BUSINESS_RULE_VIOLATION', details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
