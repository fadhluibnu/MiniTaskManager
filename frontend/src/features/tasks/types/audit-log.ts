import type { TaskStatus } from './task-status'

/**
 * Mirrors the backend `AuditLog` shape defined in
 * `docs/SYSTEM_DESIGN.md` §10.4. Audit logs are append-only records
 * of either a status change or a task deletion; `toStatus` is `null`
 * for delete events.
 */
export type AuditLogEventType = 'STATUS_CHANGED' | 'TASK_DELETED'

export interface AuditLog {
  id: string
  taskId: string
  taskTitle: string
  actorId: string
  actorName: string
  eventType: AuditLogEventType
  fromStatus: TaskStatus
  toStatus: TaskStatus | null
  createdAt: string
}
