import cuid from 'cuid'
import type { AuditLog } from '../../shared/types/audit-log.type'
import { auditLogRepository } from './repository'
import type { CreateAuditLogInput } from './type'

function sortByCreatedAtDesc(logs: AuditLog[]): AuditLog[] {
  return [...logs].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

function getAuditLogs(): AuditLog[] {
  return sortByCreatedAtDesc(auditLogRepository.findAll())
}

function getAuditLogsByTaskId(taskId: string): AuditLog[] {
  return sortByCreatedAtDesc(auditLogRepository.findByTaskId(taskId))
}

function createAuditLog(input: CreateAuditLogInput): AuditLog {
  const auditLog: AuditLog = {
    id: cuid(),
    createdAt: new Date().toISOString(),
    ...input
  }
  return auditLogRepository.insert(auditLog)
}

export const auditLogService = {
  getAuditLogs,
  getAuditLogsByTaskId,
  createAuditLog
}
