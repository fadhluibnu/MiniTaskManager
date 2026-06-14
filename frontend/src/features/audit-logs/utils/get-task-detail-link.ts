import type { AuditLog } from '../types/audit-log'

export function getTaskDetailLink(log: AuditLog): string {
  if (log.eventType === 'TASK_DELETED') {
    return `/deleted-tasks/${log.taskId}`
  }
  return `/tasks/${log.taskId}`
}
