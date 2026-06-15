import axios, { type AxiosError, type AxiosResponse } from 'axios'

/**
 * Shape of the standardized API response envelope returned by every
 * backend endpoint (see `docs/API_DOCUMENTATION.md`).
 *
 * Service functions must use `extractApiData` to unwrap this envelope
 * before returning to hooks — hooks should never see the envelope.
 */
interface ApiResponseEnvelope<T> {
  success: boolean
  message: string
  data: T | null
  error?: { code: string; details: unknown }
}

/**
 * Normalized error thrown when an API call fails — either because the
 * backend returned `{ success: false, error: { code, details } }` or
 * because axios itself rejected (network error, timeout, etc.).
 *
 * Carries the machine-readable `code` so hooks can branch on it
 * (e.g. render a "not found" state on `TASK_NOT_FOUND`).
 */
export class ApiError extends Error {
  public readonly code: string
  public readonly status: number
  public readonly details: unknown

  constructor(message: string, code: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}

/**
 * Unwrap the backend envelope and return the inner `data` payload.
 *
 * Throws an `ApiError` if the envelope reports `success: false`.
 * Should be called by every service function as the last step before
 * returning to the caller.
 */
export function extractApiData<T>(response: AxiosResponse): T {
  const body = response.data as ApiResponseEnvelope<T> | undefined
  if (!body || typeof body !== 'object' || !('success' in body)) {
    throw new ApiError(
      'Malformed API response',
      'INTERNAL_SERVER_ERROR',
      response.status
    )
  }
  if (body.success === false) {
    throw new ApiError(
      body.message || 'Request failed',
      body.error?.code || 'INTERNAL_SERVER_ERROR',
      response.status,
      body.error?.details
    )
  }
  return body.data as T
}

/**
 * Normalize any error caught by a TanStack Query hook into an
 * `ApiError` instance. Safe to call with anything — it falls back to
 * `UNKNOWN_ERROR` for non-Error throwables.
 *
 * Use in `onError` handlers so the toast message and any
 * `error.code`-based branching stays consistent across the app.
 */
export function extractApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponseEnvelope<unknown>>
    const body = axiosError.response?.data
    if (body && typeof body === 'object' && 'success' in body) {
      return new ApiError(
        body.message || axiosError.message,
        body.error?.code || 'INTERNAL_SERVER_ERROR',
        axiosError.response?.status ?? 0,
        body.error?.details
      )
    }
    return new ApiError(axiosError.message || 'Network error', 'NETWORK_ERROR', 0)
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 'UNKNOWN_ERROR', 0)
  }

  return new ApiError('Unknown error', 'UNKNOWN_ERROR', 0)
}
