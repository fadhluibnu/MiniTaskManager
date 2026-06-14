import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { getJSON, setJSON } from '@/shared/utils/safe-local-storage'
import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import { FALLBACK_TASKS } from '../../constants/fallback-tasks'
import type { Task } from '../../types/task'

interface UseTasksResult {
  tasks: Task[]
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

export function useTasks(): UseTasksResult {
  const query = useQuery<Task[]>({
    queryKey: QUERY_KEYS.tasks.all,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
      return readLocalTasks().filter((task) => !task.deletedAt)
    },
  })

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    // We always read from local storage in preview mode, so we never
    // surface the "backend unavailable" notice. Flip to `true` here
    // when the queryFn catches a real network failure.
    isUsingFallback: false,
    refetch: () => {
      void query.refetch()
    },
  }
}
