export enum EDomainExceptionCode {
  /**
   * common
   */
  NotFound = 'COMMON.NOT_FOUND',
  BadRequest = 'COMMON.BAD_REQUEST',
  Forbidden = 'COMMON.FORBIDDEN',
  InternalServerError = 'COMMON.INTERNAL_SERVER_ERROR',
  ValidationError = 'COMMON.VALIDATION_ERROR',
  TooManyRequests = 'COMMON.TOO_MANY_REQUESTS',
  /**
   * auth
   */
  Unauthorized = 'AUTH.UNAUTHORIZED',
  EmailNotConfirmed = 'AUTH.EMAIL_NOT_CONFIRMED',
  ConfirmationCodeExpired = 'AUTH.CONFIRMATION_CODE_EXPIRED',
  PasswordRecoveryCodeExpired = 'AUTH.PASSWORD_RECOVERY_CODE_EXPIRED',
}
