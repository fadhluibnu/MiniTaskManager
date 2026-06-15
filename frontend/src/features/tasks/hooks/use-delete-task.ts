import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { MESSAGES } from '@/shared/constants/messages'
import { extractApiError } from '@/shared/lib/api-helpers'
import type { ActorCardData } from '@/features/actors/types/actor'
import { taskService, type DeleteTaskResult } from '../services/task-service'

interface DeleteTaskVars {
  taskId: string
  actor: ActorCardData
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation<DeleteTaskResult, Error, DeleteTaskVars>({
    mutationFn: async ({ taskId, actor }) =>
      taskService.deleteTask({ taskId, actorId: actor.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auditLogs.all })
      toast.success(MESSAGES.task.deleted)
    },
    onError: (error) => {
      toast.error(extractApiError(error).message || MESSAGES.generic.somethingWrong)
    },
  })
}
