import { Response } from 'express'

interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T | null
  error?: { code: string; details: unknown }
}

interface SendSuccessOptions<T> {
  message: string
  data: T
  statusCode?: number
}


function sendSuccess<T>(
  res: Response,
  options: SendSuccessOptions<T>
): Response {
  const body: ApiResponse<T> = {
    success: true,
    message: options.message,
    data: options.data
  }
  return res.status(options.statusCode ?? 200).json(body)
}


interface SendErrorOptions {
  message: string
  statusCode?: number
  code?: string
  details?: unknown
}


function sendError(res: Response, options: SendErrorOptions): Response {
  const body: ApiResponse<null> = {
    success: false,
    message: options.message,
    data: null,
    error: {
      code: options.code ?? 'INTERNAL_SERVER_ERROR',
      details: options.details ?? null
    }
  }
  return res.status(options.statusCode ?? 500).json(body)
}

export { sendSuccess, sendError }
export type { ApiResponse, SendSuccessOptions, SendErrorOptions }
