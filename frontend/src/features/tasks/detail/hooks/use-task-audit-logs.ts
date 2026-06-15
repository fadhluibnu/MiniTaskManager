import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { ApiError, extractApiError } from '@/shared/lib/api-helpers'
import type { AuditLog } from '@/features/audit-logs/types/audit-log'
import { taskService } from '../../services/task-service'

interface UseTaskAuditLogsResult {
  logs: AuditLog[]
  isLoading: boolean
  isError: boolean
  error: ApiError | null
  refetch: () => void
}

/**
 * Fetches the audit log entries for a single task from the backend.
 *
 * The backend endpoint returns logs in newest-first order, so no
 * client-side sort is needed. `isError` / `error` are exposed so the
 * caller can render an inline error state without crashing the rest
 * of the page.
 */
export function useTaskAuditLogs(taskId: string): UseTaskAuditLogsResult {
  const query = useQuery<AuditLog[]>({
    queryKey: QUERY_KEYS.auditLogs.byTask(taskId),
    enabled: Boolean(taskId),
    queryFn: () => taskService.getTaskAuditLogs(taskId),
  })

  return {
    logs: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ? extractApiError(query.error) : null,
    refetch: () => {
      void query.refetch()
    },
  }
}
