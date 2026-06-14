import { Request, Response } from 'express'
import { sendError } from '../shared/utils/api-response'

/**
 * Not found (404) middleware.
 * Catches any request that did not match any registered route.
 * Must be registered after all routes, and before the error middleware.
 */
function notFoundMiddleware(req: Request, res: Response): void {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404)
}

export { notFoundMiddleware }
