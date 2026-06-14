import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import { getJSON, setJSON } from '@/shared/utils/safe-local-storage'
import { FALLBACK_TASKS } from '../../constants/fallback-tasks'
import type { Task } from '../../types/task'

interface UseDeletedTaskResult {
  task: Task | null
  isLoading: boolean
  isUsingFallback: boolean
  refetch: () => void
}

const SIMULATED_DELAY_MS = 300

function readLocalTasks(): Task[] {
  const stored = getJSON<Task[]>(STORAGE_KEYS.previewTasks)
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored
  }
  setJSON(STORAGE_KEYS.previewTasks, FALLBACK_TASKS)
  return FALLBACK_TASKS
}

export function useDeletedTask(taskId: string): UseDeletedTaskResult {
  const query = useQuery<Task | null>({
    queryKey: QUERY_KEYS.tasks.deletedDetail(taskId),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
      const all = readLocalTasks()
      return all.find((task) => task.id === taskId && task.deletedAt !== null) ?? null
    },
  })

  return {
    task: query.data ?? null,
    isLoading: query.isLoading,
    isUsingFallback: false,
    refetch: () => {
      void query.refetch()
    },
  }
}
