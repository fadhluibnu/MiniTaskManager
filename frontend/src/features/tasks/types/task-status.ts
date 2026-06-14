export type TaskStatus = 'to_do' | 'pending' | 'in_progress' | 'done'

export const TASK_STATUSES: readonly TaskStatus[] = [
  'to_do',
  'pending',
  'in_progress',
  'done',
] as const

export const STATUS_LABELS: Record<TaskStatus, string> = {
  to_do: 'to do',
  pending: 'pending',
  in_progress: 'in progress',
  done: 'done',
}
