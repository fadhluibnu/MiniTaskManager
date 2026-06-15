import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { auditLogsService } from '../services/audit-logs-service'
import type { AuditLog } from '../types/audit-log'

interface UseAuditLogsResult {
  logs: AuditLog[]
  isLoading: boolean
  refetch: () => void
}

/**
 * Fetches the global audit trail (active + deleted task logs),
 * newest first (the backend handles the sort).
 *
 * Search and event-type filtering happen client-side via
 * `filterAuditLogs` because the backend does not support
 * `?search=` or `?eventType=` on this endpoint.
 *
 * Cache stays in sync with the task pages through
 * `useUpdateTaskStatus` and `useDeleteTask`, which both invalidate
 * `QUERY_KEYS.auditLogs.all` (`['audit-logs']`). TanStack Query
 * prefix-matches the per-task audit-logs keys against that prefix
 * too, so the detail pages' audit-logs sections auto-refresh on
 * mutations.
 */
export function useAuditLogs(): UseAuditLogsResult {
  const query = useQuery<AuditLog[]>({
    queryKey: QUERY_KEYS.auditLogs.all,
    queryFn: () => auditLogsService.getAuditLogs(),
  })

  return {
    logs: query.data ?? [],
    isLoading: query.isLoading,
    refetch: () => {
      void query.refetch()
    },
  }
}
