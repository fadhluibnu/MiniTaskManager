import { asyncHandler } from '../../shared/utils/async-handler'
import { sendSuccess } from '../../shared/utils/api-response'
import { auditLogService } from '../audit-logs/service'
import { taskService } from './service'

export const taskController = {
  getActiveTasks: asyncHandler(async (req, res) => {
    const tasks = await taskService.getActiveTasks(req.query)
    return sendSuccess(res, {
      message: 'Active tasks retrieved successfully',
      data: tasks
    })
  }),

  getDeletedTasks: asyncHandler(async (_req, res) => {
    const tasks = await taskService.getDeletedTasks()
    return sendSuccess(res, {
      message: 'Deleted tasks retrieved successfully',
      data: tasks
    })
  }),

  getTaskById: asyncHandler(async (req, res) => {
    const taskId = req.params.taskId as string
    const task = await taskService.getActiveTaskById(taskId)
    return sendSuccess(res, {
      message: 'Task retrieved successfully',
      data: task
    })
  }),

  getDeletedTaskById: asyncHandler(async (req, res) => {
    const taskId = req.params.taskId as string
    const task = await taskService.getDeletedTaskById(taskId)
    return sendSuccess(res, {
      message: 'Deleted task retrieved successfully',
      data: task
    })
  }),

  createTask: asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.body)
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Task created successfully',
      data: task
    })
  }),

  updateTask: asyncHandler(async (req, res) => {
    const taskId = req.params.taskId as string
    const result = await taskService.updateTask(taskId, req.body)
    return sendSuccess(res, {
      message: result.changed
        ? 'Task updated successfully'
        : 'No changes to update',
      data: result
    })
  }),

  updateTaskStatus: asyncHandler(async (req, res) => {
    const taskId = req.params.taskId as string
    const result = await taskService.updateTaskStatus(taskId, req.body)
    return sendSuccess(res, {
      message: result.changed
        ? 'Task status updated successfully'
        : 'Task status is already set to the requested status',
      data: result
    })
  }),

  deleteTask: asyncHandler(async (req, res) => {
    const taskId = req.params.taskId as string
    const result = await taskService.deleteTask(taskId, req.body)
    return sendSuccess(res, {
      message: 'Task deleted successfully',
      data: result
    })
  }),

  getTaskAuditLogs: asyncHandler(async (req, res) => {
    const taskId = req.params.taskId as string
    const logs = await auditLogService.getAuditLogsByTaskId(taskId)
    return sendSuccess(res, {
      message: 'Task audit logs retrieved successfully',
      data: logs
    })
  })
}
