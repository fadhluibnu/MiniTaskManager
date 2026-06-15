import { Router } from 'express'
import { validateRequest } from '../../validators/validate-request'
import { taskController } from './controller'
import {
  createTaskSchema,
  deleteTaskSchema,
  getTasksQuerySchema,
  taskParamsSchema,
  updateTaskStatusSchema
} from './schema'

const router = Router()

router.get(
  '/',
  validateRequest({ query: getTasksQuerySchema }),
  taskController.getActiveTasks
)
router.post(
  '/',
  validateRequest({ body: createTaskSchema }),
  taskController.createTask
)
router.get(
  '/:taskId/audit-logs',
  validateRequest({ params: taskParamsSchema }),
  taskController.getTaskAuditLogs
)
router.patch(
  '/:taskId/status',
  validateRequest({ params: taskParamsSchema, body: updateTaskStatusSchema }),
  taskController.updateTaskStatus
)
router.delete(
  '/:taskId/delete',
  validateRequest({ params: taskParamsSchema, body: deleteTaskSchema }),
  taskController.deleteTask
)

export default router
