import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import { MESSAGES } from '@/shared/constants/messages'
import { getJSON, setJSON } from '@/shared/utils/safe-local-storage'
import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import type { ActorCardData } from '@/features/actors/types/actor'
import type { AuditLog } from '@/features/audit-logs/types/audit-log'
import { FALLBACK_AUDIT_LOGS } from '@/features/audit-logs/constants/fallback-audit-logs'
import type { Task } from '../types/task'

interface DeleteTaskVars {
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

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation<Task, Error, DeleteTaskVars>({
    mutationFn: async ({ taskId, actor }) => {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))

      const currentTasks = getJSON<Task[]>(STORAGE_KEYS.previewTasks) ?? []
      const task = currentTasks.find((t) => t.id === taskId)
      if (!task) throw new Error('Task not found')

      const now = new Date().toISOString()
      const deleted: Task = {
        ...task,
        deletedAt: now,
        deletedByActorId: actor.id,
        deletedByActorName: actor.name,
        updatedAt: now,
      }

      setJSON(
        STORAGE_KEYS.previewTasks,
        currentTasks.map((t) => (t.id === taskId ? deleted : t))
      )

      const newLog: AuditLog = {
        id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        taskId,
        taskTitle: task.title,
        actorId: actor.id,
        actorName: actor.name,
        eventType: 'TASK_DELETED',
        fromStatus: task.status,
        toStatus: null,
        createdAt: now,
      }
      const currentLogs = readLocalAuditLogs()
      setJSON(STORAGE_KEYS.previewAuditLogs, [newLog, ...currentLogs])

      return deleted
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auditLogs.all })
      toast.success(MESSAGES.task.deleted)
    },
  })
}
