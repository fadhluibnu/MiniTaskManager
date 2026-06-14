import type { TaskStatus } from '../types/task-status'

export function formatStatus(status: TaskStatus): string {
  return status.replace('_', ' ')
}
