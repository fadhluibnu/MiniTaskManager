import { Router } from 'express'
import { sendSuccess } from './shared/utils/api-response'
import actorRouter from './modules/actors'
import taskRouter from './modules/tasks'
import auditLogRouter from './modules/audit-logs'

/**
 * Root API router — mounted at /api in src/app.ts.
 *
 * Endpoints:
 *   GET  /api/status              → health check
 *   GET  /api/actors              → list predefined actors
 *   GET  /api/tasks               → list active tasks
 *   POST /api/tasks               → create a new task
 *   GET  /api/tasks/:taskId/audit-logs  → task audit logs
 *   PATCH /api/tasks/:taskId/status     → update task status
 *   DELETE /api/tasks/:taskId/delete    → soft delete task
 *   GET  /api/audit-logs          → global audit trail
 */
const router = Router()

router.get('/status', (_req, res) => {
  sendSuccess(res, { message: 'Server is running', data: { status: 'ok' } })
})

router.use('/actors', actorRouter)
router.use('/tasks', taskRouter)
router.use('/audit-logs', auditLogRouter)

export default router
