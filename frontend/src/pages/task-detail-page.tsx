import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { useStoredActor } from '@/features/actors/hooks/use-stored-actor'
import { MESSAGES } from '@/shared/constants/messages'
import DeleteTaskDialog from '@/features/tasks/components/delete-task-dialog'
import TaskAuditLogsSection from '@/features/tasks/components/task-audit-logs-section'
import TaskDetailError from '@/features/tasks/detail/components/task-detail-error'
import StatusFlowDetail from '@/features/tasks/detail/components/status-flow-detail'
import TaskDetailHeader from '@/features/tasks/detail/components/task-detail-header'
import TaskDetailLoading from '@/features/tasks/detail/components/task-detail-loading'
import TaskInfoCard from '@/features/tasks/detail/components/task-info-card'
import TaskNotFound from '@/features/tasks/detail/components/task-not-found'
import { useDeleteTask } from '@/features/tasks/hooks/use-delete-task'
import { useTask } from '@/features/tasks/detail/hooks/use-task'
import { useTaskAuditLogs } from '@/features/tasks/detail/hooks/use-task-audit-logs'
import { useUpdateTaskStatus } from '@/features/tasks/hooks/use-update-task-status'
import type { Task } from '@/features/tasks/types/task'

export default function TaskDetailPage() {
  useEffect(() => {
    document.title = 'Task Detail - Mini Task Manager'
  }, [])

  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const actor = useStoredActor()
  const hasActor = actor !== null

  const { task, isLoading, isError, error, refetch } = useTask(taskId ?? '')
  const {
    logs,
    isLoading: isAuditLoading,
    error: auditError,
    refetch: refetchLogs,
  } = useTaskAuditLogs(taskId ?? '')
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateTaskStatus()
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  const handleMove = () => {
    if (!actor || !task) {
      toast.error(MESSAGES.actor.required)
      return
    }
    updateStatus({ task, actor })
  }

  const handleDeleteRequest = () => {
    if (!actor || !task) {
      toast.error(MESSAGES.actor.required)
      return
    }
    setTaskToDelete(task)
  }

  const handleDeleteConfirm = () => {
    if (!taskToDelete || !actor) return
    deleteTask({ taskId: taskToDelete.id, actor }, { onSuccess: () => navigate('/deleted-tasks') })
    setTaskToDelete(null)
  }

  return (
    <main
      className="min-h-screen px-4 py-6 sm:px-6 lg:px-8"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(15, 23, 42, 0.04), transparent 28rem), #f8fafc',
      }}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <TaskDetailHeader actor={actor} />

        {isLoading ? (
          <TaskDetailLoading />
        ) : isError ? (
          <TaskDetailError error={error!} onRetry={refetch} />
        ) : !task ? (
          <TaskNotFound />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="space-y-6">
              <TaskInfoCard
                task={task}
                isActionDisabled={!hasActor || isUpdating || isDeleting}
                onMove={handleMove}
                onDelete={handleDeleteRequest}
              />
              <StatusFlowDetail currentStatus={task.status} />
            </div>

            <TaskAuditLogsSection
              logs={logs}
              isLoading={isAuditLoading}
              error={auditError}
              onRefresh={refetchLogs}
            />
          </div>
        )}
      </div>

      <DeleteTaskDialog
        task={taskToDelete}
        onCancel={() => setTaskToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </main>
  )
}
