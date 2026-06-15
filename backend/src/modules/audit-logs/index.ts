import { Router } from 'express'
import { auditLogController } from './controller'

const router = Router()

router.get('/', auditLogController.getAuditLogs)

export default router
