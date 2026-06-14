import type { TaskStatus } from './task-status'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  createdByActorId: string
  createdByActorName: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedByActorId?: string | null
  deletedByActorName?: string | null
}
