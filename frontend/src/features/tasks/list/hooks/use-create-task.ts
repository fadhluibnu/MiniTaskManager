import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { MESSAGES } from '@/shared/constants/messages'
import { extractApiError } from '@/shared/lib/api-helpers'
import type { ActorCardData } from '@/features/actors/types/actor'
import type { CreateTaskInput } from '../../schemas/create-task-schema'
import { taskService } from '../../services/task-service'
import type { Task } from '../../types/task'

interface CreateTaskVars {
  actor: ActorCardData
  input: CreateTaskInput
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation<Task, Error, CreateTaskVars>({
    mutationFn: async ({ actor, input }) =>
      taskService.createTask({
        title: input.title,
        description: input.description?.trim() ? input.description.trim() : undefined,
        actorId: actor.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks.all })
      toast.success(MESSAGES.task.created)
    },
    onError: (error) => {
      toast.error(extractApiError(error).message || MESSAGES.generic.somethingWrong)
    },
  })
}
