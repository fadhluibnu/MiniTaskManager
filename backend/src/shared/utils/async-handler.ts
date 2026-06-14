import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Wraps an async route handler to automatically catch errors
 * and forward them to the centralized error middleware.
 *
 * Usage:
 *   router.get('/tasks', asyncHandler(taskController.getAll))
 */
function asyncHandler(
  fn: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void | Response>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export { asyncHandler }
