import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import { getJSON, setJSON } from '@/shared/utils/safe-local-storage'
import { FALLBACK_TASKS } from '../../constants/fallback-tasks'
import type { Task } from '../../types/task'

interface UseDeletedTasksResult {
  tasks: Task[]
  isLoading: boolean
  isUsingFallback: boolean
  refetch: () => void
}

const SIMULATED_DELAY_MS = 300

function readLocalTasks(): Task[] {
  const stored = getJSON<Task[]>(STORAGE_KEYS.previewTasks)
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored
  }
  setJSON(STORAGE_KEYS.previewTasks, FALLBACK_TASKS)
  return FALLBACK_TASKS
}

/**
 * Fetches the soft-deleted task list, sorted newest-deleted first.
 * Reads from the same `previewTasks` store as `useTasks`; the
 * `tasks.deleted` key prefix keeps this query in sync via cascading
 * invalidation from `useDeleteTask` (which invalidates `tasks.all`
 * = `['tasks']`, the parent prefix).
 */
export function useDeletedTasks(): UseDeletedTasksResult {
  const query = useQuery<Task[]>({
    queryKey: QUERY_KEYS.tasks.deleted,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
      return readLocalTasks()
        .filter((task) => task.deletedAt !== null)
        .sort(
          (a, b) =>
            new Date(b.deletedAt as string).getTime() - new Date(a.deletedAt as string).getTime()
        )
    },
  })

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    isUsingFallback: false,
    refetch: () => {
      void query.refetch()
    },
  }
}
