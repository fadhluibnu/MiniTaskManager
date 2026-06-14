import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { MESSAGES } from '@/shared/constants/messages'
import { getJSON, setJSON } from '@/shared/utils/safe-local-storage'
import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import type { ActorCardData } from '@/features/actors/types/actor'
import type { Task } from '../types/task'
import { formatStatus } from '../utils/format-status'
import { getNextStatus } from '../utils/get-next-status'

interface UpdateStatusVars {
  taskId: string
  actor: ActorCardData
}

const SIMULATED_DELAY_MS = 200

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()

  return useMutation<Task, Error, UpdateStatusVars>({
    mutationFn: async ({ taskId }) => {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))

      const current = getJSON<Task[]>(STORAGE_KEYS.previewTasks) ?? []
      const task = current.find((t) => t.id === taskId)
      if (!task) throw new Error('Task not found')

      const nextStatus = getNextStatus(task.status)
      if (!nextStatus) throw new Error('Task is already at the final status')

      const updated: Task = {
        ...task,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      }

      setJSON(
        STORAGE_KEYS.previewTasks,
        current.map((t) => (t.id === taskId ? updated : t))
      )

      return updated
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks.all })
      toast.success(MESSAGES.task.statusUpdated(formatStatus(updated.status)))
    },
  })
}
