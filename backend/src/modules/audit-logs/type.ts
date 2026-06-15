import type {
  AuditLog,
  AuditLogEventType
} from '../../shared/types/audit-log.type'

export type { AuditLog, AuditLogEventType }

export type CreateAuditLogInput = Omit<AuditLog, 'id' | 'createdAt'>

export type TaskState = 'active' | 'deleted' | 'unknown'

export interface AuditLogWithState extends AuditLog {
  taskState: TaskState
}
