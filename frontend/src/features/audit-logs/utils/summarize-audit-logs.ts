import type { AuditLog } from '../types/audit-log'

export interface AuditLogSummary {
  total: number
  statusChanged: number
  taskDeleted: number
}

export function summarizeAuditLogs(logs: AuditLog[]): AuditLogSummary {
  return {
    total: logs.length,
    statusChanged: logs.filter((l) => l.eventType === 'STATUS_CHANGED').length,
    taskDeleted: logs.filter((l) => l.eventType === 'TASK_DELETED').length,
  }
}
