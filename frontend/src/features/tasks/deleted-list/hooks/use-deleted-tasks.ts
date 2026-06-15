import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { taskService } from '../../services/task-service'
import type { Task } from '../../types/task'

interface UseDeletedTasksResult {
  tasks: Task[]
  isLoading: boolean
  refetch: () => void
}

/**
 * Fetches the soft-deleted task list, sorted newest-deleted first
 * (the backend handles the sort — see `GET /api/tasks/deleted`).
 *
 * Search is intentionally **client-side** because the backend does
 * not support `?search=` on this endpoint
 * (see `docs/API_DOCUMENTATION.md` §"Deleted Tasks" note 1). The
 * page filters the response via `filterDeletedTasks`.
 *
 * The cache stays in sync with the active task list through
 * `useDeleteTask`, which invalidates `QUERY_KEYS.tasks.all`
 * (`['tasks']`). TanStack Query prefix-matches that against
 * `['tasks', 'deleted']`, so deleting a task from `/tasks`
 * automatically refreshes this list on next mount or refetch.
 */
export function useDeletedTasks(): UseDeletedTasksResult {
  const query = useQuery<Task[]>({
    queryKey: QUERY_KEYS.tasks.deleted,
    queryFn: () => taskService.getDeletedTasks(),
  })

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    refetch: () => {
      void query.refetch()
    },
  }
}
