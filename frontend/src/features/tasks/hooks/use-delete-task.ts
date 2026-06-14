import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { MESSAGES } from '@/shared/constants/messages'
import { getJSON, setJSON } from '@/shared/utils/safe-local-storage'
import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import type { ActorCardData } from '@/features/actors/types/actor'
import type { Task } from '../types/task'

interface DeleteTaskVars {
  taskId: string
  actor: ActorCardData
}

const SIMULATED_DELAY_MS = 200

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation<Task, Error, DeleteTaskVars>({
    mutationFn: async ({ taskId, actor }) => {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))

      const current = getJSON<Task[]>(STORAGE_KEYS.previewTasks) ?? []
      const task = current.find((t) => t.id === taskId)
      if (!task) throw new Error('Task not found')

      const now = new Date().toISOString()
      const deleted: Task = {
        ...task,
        deletedAt: now,
        deletedByActorId: actor.id,
        deletedByActorName: actor.name,
        updatedAt: now,
      }

      setJSON(
        STORAGE_KEYS.previewTasks,
        current.map((t) => (t.id === taskId ? deleted : t))
      )

      return deleted
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks.all })
      toast.success(MESSAGES.task.deleted)
    },
  })
}
