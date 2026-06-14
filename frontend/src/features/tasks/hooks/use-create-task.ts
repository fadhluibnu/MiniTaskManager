import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { MESSAGES } from '@/shared/constants/messages'
import { getJSON, setJSON } from '@/shared/utils/safe-local-storage'
import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import type { ActorCardData } from '@/features/actors/types/actor'
import type { CreateTaskInput } from '../schemas/create-task-schema'
import type { Task } from '../types/task'

interface CreateTaskVars {
  actor: ActorCardData
  input: CreateTaskInput
}

const SIMULATED_DELAY_MS = 200

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation<Task, Error, CreateTaskVars>({
    mutationFn: async ({ actor, input }) => {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))

      const now = new Date().toISOString()
      const newTask: Task = {
        id: `task_${Date.now()}`,
        title: input.title,
        description: input.description || undefined,
        status: 'to_do',
        createdByActorId: actor.id,
        createdByActorName: actor.name,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      }

      const current = getJSON<Task[]>(STORAGE_KEYS.previewTasks) ?? []
      setJSON(STORAGE_KEYS.previewTasks, [newTask, ...current])

      return newTask
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks.all })
      toast.success(MESSAGES.task.created)
    },
  })
}
