import { Request, Response, NextFunction } from 'express'
import { AppError } from '../shared/utils/app-error'
import { sendError } from '../shared/utils/api-response'
import env from '../config/env'

/**
 * Centralized error handling middleware.
 * Must be registered last in app.ts after all routes.
 */
function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  // Express requires the 4-argument signature for error middleware
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    // Operational errors — known and expected
    sendError(res, err.message, err.statusCode)
    return
  }

  // Unexpected errors — log and return generic message
  if (env.nodeEnv !== 'production') {
    console.error('[Error]', err)
  }

  sendError(res, 'Internal server error', 500)
}

export { errorMiddleware }
