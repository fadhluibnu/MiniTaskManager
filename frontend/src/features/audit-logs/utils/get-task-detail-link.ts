import type { AuditLog } from '../types/audit-log'

/**
 * Returns the React Router path for the "View Task" button.
 *
 * Prefers `log.taskState` (computed by the global audit-logs
 * endpoint) when available — this stays correct even for
 * `STATUS_CHANGED` logs whose task has since been soft-deleted, and
 * for `TASK_DELETED` logs that are later restored. Falls back to
 * the `eventType` heuristic for logs without `taskState` (per-task
 * endpoint payload or older records).
 *
 *   taskState === 'active'   → /tasks/:taskId
 *   taskState === 'deleted'  → /deleted-tasks/:taskId
 *   taskState === 'unknown'  → /tasks/:taskId (best effort; the
 *                              detail page will render `TaskNotFound`
 *                              and the user can navigate back)
 *   no taskState             → fall back to eventType
 *                              - STATUS_CHANGED → /tasks/:taskId
 *                              - TASK_DELETED    → /deleted-tasks/:taskId
 */
export function getTaskDetailLink(log: AuditLog): string {
  if (log.taskState === 'active' || log.taskState === 'unknown') {
    return `/tasks/${log.taskId}`
  }
  if (log.taskState === 'deleted') {
    return `/deleted-tasks/${log.taskId}`
  }
  // Fallback for logs without taskState (per-task endpoint payload)
  if (log.eventType === 'TASK_DELETED') {
    return `/deleted-tasks/${log.taskId}`
  }
  return `/tasks/${log.taskId}`
}
