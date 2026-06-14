/**
 * Custom error class for operational (expected) errors.
 * Use this to signal known error conditions with a specific HTTP status code.
 *
 * Usage:
 *   throw new AppError('Task not found', 404)
 */
class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    // Maintains proper stack trace in V8
    Error.captureStackTrace(this, this.constructor)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export { AppError }
