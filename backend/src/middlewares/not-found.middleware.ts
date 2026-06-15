import { Request, Response } from 'express'
import { sendError } from '../shared/utils/api-response'

function notFoundMiddleware(req: Request, res: Response): void {
  sendError(res, {
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    statusCode: 404,
    code: 'ROUTE_NOT_FOUND'
  })
}

export { notFoundMiddleware }
