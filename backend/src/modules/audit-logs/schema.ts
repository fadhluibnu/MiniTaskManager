import { z } from 'zod'

export const taskIdParamSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required')
})
