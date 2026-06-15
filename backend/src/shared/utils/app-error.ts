
class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly isOperational: boolean

  constructor(
    message: string,
    statusCode = 500,
    code = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true

    // Maintains proper stack trace in V8
    Error.captureStackTrace(this, this.constructor)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export { AppError }
