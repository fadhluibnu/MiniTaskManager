import { extractApiData } from '@/shared/lib/api-helpers'
import httpClient from '@/shared/lib/http-client'
import type { AuditLog } from '../types/audit-log'

/**
 * Returns the global audit trail across ALL tasks (active and
 * deleted), newest first.
 *
 * The backend enriches each log with a `taskState` field
 * (`"active"` | `"deleted"` | `"unknown"`) computed at response
 * time so the frontend can navigate to the correct detail page
 * via `getTaskDetailLink`. This field is NOT persisted in
 * `audit-logs.json` — it is recomputed on every request.
 *
 * No `?search=` or `?eventType=` is supported by this endpoint, so
 * the page filters the response client-side via `filterAuditLogs`.
 */
async function getAuditLogs(): Promise<AuditLog[]> {
  const response = await httpClient.get('/audit-logs')
  return extractApiData<AuditLog[]>(response)
}

export const auditLogsService = {
  getAuditLogs,
}
