import type { AuditLog } from '../types/audit-log'

const HOUR_MS = 1000 * 60 * 60
const now = new Date()

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
  {
    id: 'audit_deleted_001',
    taskId: 'task_deleted_001',
    taskTitle: 'Archive old onboarding checklist',
    actorId: 'john.doe',
    actorName: 'John Doe',
    eventType: 'STATUS_CHANGED',
    fromStatus: 'to_do',
    toStatus: 'pending',
    createdAt: new Date(now.getTime() - HOUR_MS * 7).toISOString(),
  },
  {
    id: 'audit_deleted_002',
    taskId: 'task_deleted_001',
    taskTitle: 'Archive old onboarding checklist',
    actorId: 'admin.user',
    actorName: 'Admin User',
    eventType: 'STATUS_CHANGED',
    fromStatus: 'pending',
    toStatus: 'in_progress',
    createdAt: new Date(now.getTime() - HOUR_MS * 5).toISOString(),
  },
  {
    id: 'audit_deleted_003',
    taskId: 'task_deleted_001',
    taskTitle: 'Archive old onboarding checklist',
    actorId: 'admin.user',
    actorName: 'Admin User',
    eventType: 'TASK_DELETED',
    fromStatus: 'in_progress',
    toStatus: null,
    createdAt: new Date(now.getTime() - HOUR_MS * 3).toISOString(),
  },
]
