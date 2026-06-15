import type { TaskStatus } from '../types/task.type'

export const TASK_STATUSES = [
  'to_do',
  'pending',
  'in_progress',
  'done'
] as const satisfies readonly TaskStatus[]

export const STATUS_FLOW: Record<TaskStatus, TaskStatus | null> = {
  to_do: 'pending',
  pending: 'in_progress',
  in_progress: 'done',
  done: null
}
