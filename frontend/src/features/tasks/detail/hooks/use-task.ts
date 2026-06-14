import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { getJSON, setJSON } from '@/shared/utils/safe-local-storage'
import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import { FALLBACK_TASKS } from '../../constants/fallback-tasks'
import type { Task } from '../../types/task'

interface UseTaskResult {
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

/**
 * Fetches a single active task by id. Returns `null` if the task does
 * not exist or has been soft-deleted — callers can use that to render
 * a "not found" state. Reads from the same `previewTasks` store as
 * `useTasks`; the two queries stay in sync via shared cache
 * invalidation on mutations.
 */
export function useTask(taskId: string): UseTaskResult {
  const query = useQuery<Task | null>({
    queryKey: QUERY_KEYS.tasks.detail(taskId),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
      const all = readLocalTasks()
      return all.find((task) => task.id === taskId && !task.deletedAt) ?? null
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
