import { TASK_STATUSES, type TaskStatus } from '../types/task-status'

export function getNextStatus(status: TaskStatus): TaskStatus | null {
  const idx = TASK_STATUSES.indexOf(status)
  if (idx === -1 || idx === TASK_STATUSES.length - 1) return null
  return TASK_STATUSES[idx + 1] ?? null
}
