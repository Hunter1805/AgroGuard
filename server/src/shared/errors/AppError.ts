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
  | 'PERMISSION_DENIED'
  | 'ORGANIZATION_SCOPE_REQUIRED'
  | 'CROSS_TENANT_FORBIDDEN'
  | 'RATE_LIMIT_EXCEEDED'
  | 'ARCHIVED_RECORD'
  | 'EXPIRED_RESOURCE'
  | 'INTERNAL_ERROR'
  | 'AUTH_CONFIG_ERROR'
  | 'AUTH_USER_NOT_FOUND'
  | 'AUTH_LIST_ERROR'
  | 'AUTH_UPDATE_ERROR'
  | 'AUTH_CREATE_ERROR'
  | 'AUTH_SIGNOUT_ERROR'
  | 'USER_ALREADY_MEMBER'
  | 'INVITATION_ALREADY_EXISTS'
  | 'INVITATION_INVALID'
  | 'INVITATION_NOT_FOUND'
  | 'INVITATION_NOT_PENDING'
  | 'MEMBER_NOT_FOUND'
  | 'OWNER_ROLE_IMMUTABLE'
  | 'SELF_BLOCK_FORBIDDEN'
  | 'OWNER_BLOCK_FORBIDDEN'
  | 'MEMBER_AUTH_NOT_FOUND';

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
