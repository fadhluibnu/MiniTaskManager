import { formatStatus } from '@/features/tasks/utils/format-status'
import type { AuditLog } from '../types/audit-log'

export type EventTypeFilter = 'all' | 'STATUS_CHANGED' | 'TASK_DELETED'

export function filterAuditLogs(
  logs: AuditLog[],
  query: string,
  eventType: EventTypeFilter
): AuditLog[] {
  return logs.filter((log) => {
    if (eventType !== 'all' && log.eventType !== eventType) return false

    const q = query.trim().toLowerCase()
    if (!q) return true

    const searchable = [
      log.id,
      log.taskId,
      log.taskTitle,
      log.actorId,
      log.actorName,
      log.eventType,
      log.fromStatus,
      formatStatus(log.fromStatus),
      log.toStatus,
      log.toStatus ? formatStatus(log.toStatus) : null,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchable.includes(q)
  })
}
