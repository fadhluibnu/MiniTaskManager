import type { TaskStatus } from './task.type'

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
