import type { AuditLogEventType } from '../types/audit-log.type'

export const AUDIT_LOG_EVENT_TYPES = [
  'STATUS_CHANGED',
  'TASK_DELETED'
] as const satisfies readonly AuditLogEventType[]
