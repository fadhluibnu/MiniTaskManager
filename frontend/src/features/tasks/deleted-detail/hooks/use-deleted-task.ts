import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { ApiError, extractApiError } from '@/shared/lib/api-helpers'
import { taskService } from '../../services/task-service'
import type { Task } from '../../types/task'

interface UseDeletedTaskResult {
  task: Task | null
  isLoading: boolean
  isError: boolean
  error: ApiError | null
  refetch: () => void
}

/**
 * Fetches a single soft-deleted task by id from the backend.
 *
 * `DELETED_TASK_NOT_FOUND` (404) — which the backend returns both for
 * a missing task AND for a task that still exists but has not been
 * soft-deleted — is mapped to `task: null` so the page can render the
 * dedicated `DeletedTaskNotFound` component without inspecting the
 * error code itself.
 *
 * Other errors (500, network) bubble up to React Query so `isError`
 * and `error` expose the underlying `ApiError` for the page to render
 * `TaskDetailError` with a Retry button.
 */
export function useDeletedTask(taskId: string): UseDeletedTaskResult {
  const query = useQuery<Task | null>({
    queryKey: QUERY_KEYS.tasks.deletedDetail(taskId),
    enabled: Boolean(taskId),
    queryFn: async () => {
      try {
        return await taskService.getDeletedTaskById(taskId)
      } catch (err) {
        if (extractApiError(err).code === 'DELETED_TASK_NOT_FOUND') return null
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
