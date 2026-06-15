import path from 'path'
import env from '../../config/env'
import { jsonStorage } from '../../shared/lib/json-storage'
import type { AuditLog } from '../../shared/types/audit-log.type'

const AUDIT_LOGS_FILE = path.join(env.dataDir, 'audit-logs.json')

export const auditLogRepository = {
  findAll(): AuditLog[] {
    return jsonStorage.readAll<AuditLog>(AUDIT_LOGS_FILE)
  },
  findByTaskId(taskId: string): AuditLog[] {
    return jsonStorage.findMany<AuditLog>(AUDIT_LOGS_FILE, 'taskId', taskId)
  },
  insert(auditLog: AuditLog): AuditLog {
    return jsonStorage.insert<AuditLog>(AUDIT_LOGS_FILE, auditLog)
  }
}
