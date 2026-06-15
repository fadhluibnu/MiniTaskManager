import { z } from 'zod'

export const editTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Title must be 120 characters or fewer'),
  description: z
    .string()
    .max(400, 'Description must be 400 characters or fewer')
    .optional()
    .or(z.literal('')),
})

export type EditTaskFormValues = z.infer<typeof editTaskSchema>
