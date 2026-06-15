import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { taskService, type GetTasksParams } from '../../services/task-service'
import type { Task } from '../../types/task'

interface UseTasksResult {
  tasks: Task[]
  isLoading: boolean
  refetch: () => void
}

/**
 * Fetches the list of active (non-deleted) tasks from the backend.
 *
 * Search is performed server-side via `?search=` so the result is
 * always consistent with the backend source of truth. The query key
 * includes the search term so each unique search gets its own cache
 * entry.
 */
export function useTasks(params?: GetTasksParams): UseTasksResult {
  const query = useQuery<Task[]>({
    queryKey: QUERY_KEYS.tasks.list(params),
    queryFn: () => taskService.getActiveTasks(params),
  })

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    refetch: () => {
      void query.refetch()
    },
  }
}
