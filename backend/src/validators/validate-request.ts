import { Request, Response, NextFunction, RequestHandler } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { sendError } from '../shared/utils/api-response'

interface ValidateRequestOptions {
  body?: ZodSchema
  params?: ZodSchema
  query?: ZodSchema
}

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
        const parsed = schemas.query.parse(req.query) as Record<string, unknown>
        const query = req.query as Record<string, unknown>
        for (const key of Object.keys(query)) {
          delete query[key]
        }
        Object.assign(query, parsed)
      }

      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const firstIssue = err.issues[0]
        const field =
          firstIssue.path.length > 0 ? firstIssue.path.join('.') : 'input'
        sendError(res, {
          message: `${field}: ${firstIssue.message}`,
          statusCode: 400,
          code: 'VALIDATION_ERROR',
          details: err.issues
        })
        return
      }

      next(err)
    }
  }
}

export { validateRequest }
