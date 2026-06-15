import { z } from 'zod'
import { TASK_STATUSES } from '../../shared/constants/task-status.constant'

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters'),
  description: z
    .string()
    .trim()
    .max(2000, 'Description must be at most 2000 characters')
    .optional(),
  actorId: z.string().min(1, 'Actor ID is required')
})

export const updateTaskStatusSchema = z.object({
  actorId: z.string().min(1, 'Actor ID is required'),
  toStatus: z.enum(TASK_STATUSES, {
    message: `toStatus must be one of: ${TASK_STATUSES.join(', ')}`
  })
})

export const deleteTaskSchema = z.object({
  actorId: z.string().min(1, 'Actor ID is required')
})

export const taskParamsSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required')
})

// Express 5 types `req.query` values as `string | string[]`. Coerce
// duplicate query params to the first occurrence so the downstream
// service always sees a clean string or undefined.
export const getTasksQuerySchema = z.object({
  search: z.preprocess(
    (val) => (Array.isArray(val) ? val[0] : val),
    z.string().trim().optional()
  )
})
