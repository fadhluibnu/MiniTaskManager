import { Request, Response, NextFunction } from 'express'
import { AppError } from '../shared/utils/app-error'
import { sendError } from '../shared/utils/api-response'
import env from '../config/env'

function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    sendError(res, {
      message: err.message,
      statusCode: err.statusCode,
      code: err.code
    })
    return
  }

  if (env.nodeEnv !== 'production') {
    console.error('[Error]', err)
  }

  sendError(res, {
    message: 'Internal server error',
    statusCode: 500,
    code: 'INTERNAL_SERVER_ERROR'
  })
}

export { errorMiddleware }
