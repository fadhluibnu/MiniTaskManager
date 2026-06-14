import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { readLocalAuditLogs } from '../utils/read-local-audit-logs'
import type { AuditLog } from '../types/audit-log'

interface UseAuditLogsResult {
  logs: AuditLog[]
  isLoading: boolean
  refetch: () => void
}

const SIMULATED_DELAY_MS = 300

export function useAuditLogs(): UseAuditLogsResult {
  const query = useQuery<AuditLog[]>({
    queryKey: QUERY_KEYS.auditLogs.all,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
      return readLocalAuditLogs().sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    },
  })

  return {
    logs: query.data ?? [],
    isLoading: query.isLoading,
    refetch: () => {
      void query.refetch()
    },
  }
}
