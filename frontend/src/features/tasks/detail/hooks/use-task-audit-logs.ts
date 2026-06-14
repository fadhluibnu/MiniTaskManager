import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { getJSON, setJSON } from '@/shared/utils/safe-local-storage'
import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import { FALLBACK_AUDIT_LOGS } from '@/features/audit-logs/constants/fallback-audit-logs'
import type { AuditLog } from '@/features/audit-logs/types/audit-log'

interface UseTaskAuditLogsResult {
  logs: AuditLog[]
  isLoading: boolean
  refetch: () => void
}

const SIMULATED_DELAY_MS = 300

function readLocalAuditLogs(): AuditLog[] {
  const stored = getJSON<AuditLog[]>(STORAGE_KEYS.previewAuditLogs)
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored
  }
  setJSON(STORAGE_KEYS.previewAuditLogs, FALLBACK_AUDIT_LOGS)
  return FALLBACK_AUDIT_LOGS
}

export function useTaskAuditLogs(taskId: string): UseTaskAuditLogsResult {
  const query = useQuery<AuditLog[]>({
    queryKey: QUERY_KEYS.auditLogs.byTask(taskId),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
      return readLocalAuditLogs()
        .filter((log) => log.taskId === taskId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
