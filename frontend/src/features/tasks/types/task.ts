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
  // Kept optional so mock fixtures (used by hooks still in preview mode)
  // can omit them. Backend serializes them as `string | null` for
  // real tasks, which is compatible with this looser shape.
  deletedByActorId?: string | null
  deletedByActorName?: string | null
}
