import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import { getJSON, setJSON } from '@/shared/utils/safe-local-storage'
import { FALLBACK_AUDIT_LOGS } from '../constants/fallback-audit-logs'
import type { AuditLog } from '../types/audit-log'

export function readLocalAuditLogs(): AuditLog[] {
  const stored = getJSON<AuditLog[]>(STORAGE_KEYS.previewAuditLogs)
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored
  }
  setJSON(STORAGE_KEYS.previewAuditLogs, FALLBACK_AUDIT_LOGS)
  return FALLBACK_AUDIT_LOGS
}
