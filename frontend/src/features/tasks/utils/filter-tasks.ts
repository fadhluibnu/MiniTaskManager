import type { Task } from '../types/task'
import { formatStatus } from './format-status'

export function filterTasks(tasks: Task[], query: string): Task[] {
  const q = query.trim().toLowerCase()
  if (!q) return tasks

  return tasks.filter((task) => {
    const searchable = [
      task.title,
      task.description,
      task.status,
      formatStatus(task.status),
      task.createdByActorName,
      task.createdByActorId,
      task.id,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchable.includes(q)
  })
}
