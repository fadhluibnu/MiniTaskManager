import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { MESSAGES } from '@/shared/constants/messages'
import { extractApiError } from '@/shared/lib/api-helpers'
import { taskService, type UpdateTaskInput, type UpdateTaskResult } from '../services/task-service'

/**
 * Edits a task's title and/or description.
 *
 * - Invalidates the active tasks list and the specific task-detail
 *   query so cards and the detail page reflect the new values.
 * - Intentionally does NOT invalidate audit-log queries: the edit
 *   endpoint does not create an audit log (per the task edit spec).
 * - On `changed: false` (no-op, identical values) shows a neutral
 *   toast and skips the cache invalidation overhead.
 */
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation<UpdateTaskResult, Error, UpdateTaskInput>({
    mutationFn: async (input) => taskService.updateTask(input),
    onSuccess: (result, variables) => {
      if (result.changed) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks.all })
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks.detail(variables.taskId) })
        toast.success(MESSAGES.task.updated)
      } else {
        toast(MESSAGES.task.noChanges)
      }
    },
    onError: (error) => {
      toast.error(extractApiError(error).message || MESSAGES.generic.somethingWrong)
    },
  })
}
