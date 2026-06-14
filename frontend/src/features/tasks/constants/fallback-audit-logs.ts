import type { AuditLog } from '../types/audit-log'

const HOUR_MS = 1000 * 60 * 60
const now = new Date()

/**
 * Static seed for the audit log store, used the first time a user
 * lands on a task detail page without any prior `previewAuditLogs`
 * in localStorage. Mirrors the `fallbackAuditLogs` array from the
 * static HTML prototype: a single "to_do → pending" transition for
 * `task_002` so the detail page has visible history on first run.
 */
export const FALLBACK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_001',
    taskId: 'task_002',
    taskTitle: 'Review UI copy',
    actorId: 'jane.smith',
    actorName: 'Jane Smith',
    eventType: 'STATUS_CHANGED',
    fromStatus: 'to_do',
    toStatus: 'pending',
    createdAt: new Date(now.getTime() - HOUR_MS * 2).toISOString(),
  },
]
