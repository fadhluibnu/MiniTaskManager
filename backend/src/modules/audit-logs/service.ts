import cuid from 'cuid'
import type { AuditLog } from '../../shared/types/audit-log.type'
import { taskRepository } from '../tasks/repository'
import { auditLogRepository } from './repository'
import type { AuditLogWithState, CreateAuditLogInput, TaskState } from './type'

function sortByCreatedAtDesc<T extends { createdAt: string }>(logs: T[]): T[] {
  return [...logs].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

function buildTaskStateMap(): Map<string, Exclude<TaskState, 'unknown'>> {
  const map = new Map<string, Exclude<TaskState, 'unknown'>>()
  for (const task of taskRepository.findAll()) {
    map.set(task.id, task.deletedAt === null ? 'active' : 'deleted')
  }
  return map
}

function getAuditLogs(): AuditLogWithState[] {
  const stateMap = buildTaskStateMap()
  return sortByCreatedAtDesc(auditLogRepository.findAll()).map((log) => ({
    ...log,
    taskState: stateMap.get(log.taskId) ?? 'unknown'
  }))
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
