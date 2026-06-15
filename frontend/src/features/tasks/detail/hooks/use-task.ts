import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { ApiError, extractApiError } from '@/shared/lib/api-helpers'
import { taskService } from '../../services/task-service'
import type { Task } from '../../types/task'

interface UseTaskResult {
  task: Task | null
  isLoading: boolean
  isError: boolean
  error: ApiError | null
  refetch: () => void
}

/**
 * Fetches a single active task by id from the backend.
 *
 * `TASK_NOT_FOUND` (404) is mapped to `task: null` so callers can
 * render the dedicated "not found" state without having to branch on
 * the error code. Other errors (500, network) bubble up to React
 * Query so `isError` and `error` expose the underlying `ApiError`.
 */
export function useTask(taskId: string): UseTaskResult {
  const query = useQuery<Task | null>({
    queryKey: QUERY_KEYS.tasks.detail(taskId),
    enabled: Boolean(taskId),
    queryFn: async () => {
      try {
        return await taskService.getActiveTaskById(taskId)
      } catch (err) {
        if (extractApiError(err).code === 'TASK_NOT_FOUND') return null
        throw err
      }
    },
  })

  return {
    task: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ? extractApiError(query.error) : null,
    refetch: () => {
      void query.refetch()
    },
  }
}
