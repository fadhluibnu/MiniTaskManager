import type { AuditLog } from '../../shared/types/audit-log.type'
import type { Task, TaskStatus } from '../../shared/types/task.type'

export type { Task, TaskStatus }

export interface CreateTaskInput {
  title: string
  description?: string
  actorId: string
}

export interface UpdateTaskStatusInput {
  actorId: string
  toStatus: TaskStatus
}

export interface DeleteTaskInput {
  actorId: string
}

export interface GetTasksQuery {
  search?: string
}

/* ──── Service result shapes ──── */

export type UpdateTaskStatusResult =
  | { changed: true; task: Task; auditLog: AuditLog }
  | { changed: false; task: Task; auditLog: null }

export interface DeleteTaskResult {
  task: Task
  auditLog: AuditLog
}
