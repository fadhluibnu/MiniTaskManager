import type { Task } from '../../types/task'
import { formatStatus } from '../../utils/format-status'

/**
 * Case-insensitive substring search across the fields most useful
 * for inspecting a deleted task: id, title, description, status
 * (raw + formatted), creator, and the actor that performed the
 * soft delete. Mirrors `filterTasks` but includes the extra
 * `deletedBy*` fields.
 */
export function filterDeletedTasks(tasks: Task[], query: string): Task[] {
  const q = query.trim().toLowerCase()
  if (!q) return tasks

  return tasks.filter((task) => {
    const searchable = [
      task.id,
      task.title,
      task.description,
      task.status,
      formatStatus(task.status),
      task.createdByActorId,
      task.createdByActorName,
      task.deletedByActorId,
      task.deletedByActorName,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchable.includes(q)
  })
}
