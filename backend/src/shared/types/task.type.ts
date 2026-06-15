export type TaskStatus = 'to_do' | 'pending' | 'in_progress' | 'done'

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
  deletedByActorId: string | null
  deletedByActorName: string | null
}
