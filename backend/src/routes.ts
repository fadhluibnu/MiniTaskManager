import { Router, Request, Response } from 'express'
import { sendSuccess } from './shared/utils/api-response'

const router = Router()

/**
 * GET /api/status
 * Health check endpoint — confirms the server is running.
 */
router.get('/status', (_req: Request, res: Response) => {
  sendSuccess(res, { status: 'ok' }, 'Server is running')
})

export default router
