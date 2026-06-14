import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { MESSAGES } from '@/shared/constants/messages'
import { getJSON, setJSON } from '@/shared/utils/safe-local-storage'
import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import type { ActorCardData } from '@/features/actors/types/actor'
import type { AuditLog } from '../types/audit-log'
import { FALLBACK_AUDIT_LOGS } from '../constants/fallback-audit-logs'
import type { Task } from '../types/task'
import { formatStatus } from '../utils/format-status'
import { getNextStatus } from '../utils/get-next-status'

interface UpdateStatusVars {
  taskId: string
  actor: ActorCardData
}

const SIMULATED_DELAY_MS = 200

function readLocalAuditLogs(): AuditLog[] {
  const stored = getJSON<AuditLog[]>(STORAGE_KEYS.previewAuditLogs)
  if (stored && Array.isArray(stored)) return stored
  setJSON(STORAGE_KEYS.previewAuditLogs, FALLBACK_AUDIT_LOGS)
  return FALLBACK_AUDIT_LOGS
}

/**
 * Moves a task one step forward in the status flow and appends a
 * `STATUS_CHANGED` audit log entry capturing the actor, both statuses,
 * and a task title snapshot (so the log remains understandable after
 * the task is later deleted). The actor is required by the backend
 * audit contract; it is passed here so the page can show a clear
 * "no actor" error before the request fires.
 */
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()

  return useMutation<Task, Error, UpdateStatusVars>({
    mutationFn: async ({ taskId, actor }) => {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))

      const currentTasks = getJSON<Task[]>(STORAGE_KEYS.previewTasks) ?? []
      const task = currentTasks.find((t) => t.id === taskId)
      if (!task) throw new Error('Task not found')

      const nextStatus = getNextStatus(task.status)
      if (!nextStatus) throw new Error('Task is already at the final status')

      const previousStatus = task.status
      const now = new Date().toISOString()
      const updated: Task = {
        ...task,
        status: nextStatus,
        updatedAt: now,
      }

      setJSON(
        STORAGE_KEYS.previewTasks,
        currentTasks.map((t) => (t.id === taskId ? updated : t))
      )

      const newLog: AuditLog = {
        id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        taskId,
        taskTitle: task.title,
        actorId: actor.id,
        actorName: actor.name,
        eventType: 'STATUS_CHANGED',
        fromStatus: previousStatus,
        toStatus: nextStatus,
        createdAt: now,
      }
      const currentLogs = readLocalAuditLogs()
      setJSON(STORAGE_KEYS.previewAuditLogs, [newLog, ...currentLogs])

      return updated
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auditLogs.all })
      toast.success(MESSAGES.task.statusUpdated(formatStatus(updated.status)))
    },
  })
}
