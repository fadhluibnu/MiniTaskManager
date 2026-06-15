import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { MESSAGES } from '@/shared/constants/messages'
import { extractApiError } from '@/shared/lib/api-helpers'
import type { ActorCardData } from '@/features/actors/types/actor'
import { taskService, type UpdateTaskStatusResult } from '../services/task-service'
import type { Task } from '../types/task'
import { formatStatus } from '../utils/format-status'
import { getNextStatus } from '../utils/get-next-status'

interface UpdateStatusVars {
  task: Task
  actor: ActorCardData
}

/**
 * Moves a task one step forward in the status flow.
 *
 * The next status is derived client-side from the current status via
 * `getNextStatus` and sent to the backend's `PATCH /tasks/:id/status`
 * endpoint. The backend is the source of truth for valid transitions
 * and returns the actual updated task (or a `changed: false`
 * no-op result if the current status already matches `toStatus`).
 */
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()

  return useMutation<UpdateTaskStatusResult, Error, UpdateStatusVars>({
    mutationFn: async ({ task, actor }) => {
      const nextStatus = getNextStatus(task.status)
      if (!nextStatus) {
        throw new Error('Task is already at the final status')
      }
      return taskService.updateTaskStatus({
        taskId: task.id,
        actorId: actor.id,
        toStatus: nextStatus,
      })
    },
    onSuccess: (result) => {
      // No-op (same-status) responses don't change anything, so skip
      // the cache invalidation to avoid a needless refetch.
      if (result.changed) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks.all })
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auditLogs.all })
      }
      toast.success(MESSAGES.task.statusUpdated(formatStatus(result.task.status)))
    },
    onError: (error) => {
      toast.error(extractApiError(error).message || MESSAGES.generic.somethingWrong)
    },
  })
}
