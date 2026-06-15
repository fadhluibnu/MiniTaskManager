import type { TaskStatus } from '@/features/tasks/types/task-status'

export type AuditLogEventType = 'STATUS_CHANGED' | 'TASK_DELETED'

/**
 * Per `docs/API_DOCUMENTATION.md` §"Global audit trail response
 * shape": computed at response time by the backend (NOT persisted in
 * `audit-logs.json`). The frontend uses this to navigate to the
 * correct detail page via `getTaskDetailLink`.
 *
 * - `"active"`  — task exists and is not soft-deleted → /tasks/:id
 * - `"deleted"` — task exists and has been soft-deleted → /deleted-tasks/:id
 * - `"unknown"` — task cannot be found (orphaned log, defensive case)
 *
 * Optional in `AuditLog` because the per-task endpoint
 * (`GET /api/tasks/:taskId/audit-logs`) does not return it.
 */
export type TaskState = 'active' | 'deleted' | 'unknown'

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
  taskState?: TaskState
}
