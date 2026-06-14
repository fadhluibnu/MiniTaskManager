import type { Task } from '../types/task'

const HOUR_MS = 1000 * 60 * 60
const now = new Date()

export const FALLBACK_TASKS: Task[] = [
  {
    id: 'task_001',
    title: 'Prepare sprint report',
    description: 'Summarize current task progress for the internal team.',
    status: 'to_do',
    createdByActorId: 'john.doe',
    createdByActorName: 'John Doe',
    createdAt: new Date(now.getTime() - HOUR_MS * 8).toISOString(),
    updatedAt: new Date(now.getTime() - HOUR_MS * 8).toISOString(),
    deletedAt: null,
  },
  {
    id: 'task_002',
    title: 'Review UI copy',
    description: 'Check the wording for actor selection and task manager pages.',
    status: 'pending',
    createdByActorId: 'jane.smith',
    createdByActorName: 'Jane Smith',
    createdAt: new Date(now.getTime() - HOUR_MS * 5).toISOString(),
    updatedAt: new Date(now.getTime() - HOUR_MS * 2).toISOString(),
    deletedAt: null,
  },
  {
    id: 'task_deleted_001',
    title: 'Archive old onboarding checklist',
    description: 'This task was removed because the onboarding checklist is no longer used.',
    status: 'in_progress',
    createdByActorId: 'john.doe',
    createdByActorName: 'John Doe',
    deletedByActorId: 'admin.user',
    deletedByActorName: 'Admin User',
    createdAt: new Date(now.getTime() - HOUR_MS * 30).toISOString(),
    updatedAt: new Date(now.getTime() - HOUR_MS * 3).toISOString(),
    deletedAt: new Date(now.getTime() - HOUR_MS * 3).toISOString(),
  },
]
