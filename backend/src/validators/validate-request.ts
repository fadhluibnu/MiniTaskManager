import { Request, Response, NextFunction, RequestHandler } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { sendError } from '../shared/utils/api-response'

interface ValidateRequestOptions {
  body?: ZodSchema
  params?: ZodSchema
  query?: ZodSchema
}

/**
 * Middleware factory that validates request body, params, and/or query using Zod schemas.
 * Returns a 400 response with the first validation error if any check fails.
 *
 * Usage:
 *   router.post('/tasks', validateRequest({ body: createTaskSchema }), taskController.create)
 */
function validateRequest(schemas: ValidateRequestOptions): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body)
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as typeof req.query
      }

      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const firstIssue = err.issues[0]
        const field =
          firstIssue.path.length > 0 ? firstIssue.path.join('.') : 'input'
        sendError(res, `${field}: ${firstIssue.message}`, 400, err.issues)
        return
      }

      next(err)
    }
  }
}

export { validateRequest }
