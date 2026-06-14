import { Response } from 'express'

/**
 * Consistent API response shape for all endpoints.
 */
interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T | null
  error?: unknown
}

/**
 * Send a successful response.
 */
function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): Response {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data
  }
  return res.status(statusCode).json(body)
}

/**
 * Send an error response.
 */
function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  error?: unknown
): Response {
  const body: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    ...(error !== undefined && { error })
  }
  return res.status(statusCode).json(body)
}

export { sendSuccess, sendError }
export type { ApiResponse }
