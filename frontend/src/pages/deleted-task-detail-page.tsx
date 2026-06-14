import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useStoredActor } from '@/features/actors/hooks/use-stored-actor'
import TaskAuditLogsSection from '@/features/tasks/components/task-audit-logs-section'
import DeletedDetailPageHeader from '@/features/tasks/deleted-detail/components/page-header'
import DeletedTaskInfoCard from '@/features/tasks/deleted-detail/components/task-info-card'
import DeletedTaskNotFound from '@/features/tasks/deleted-detail/components/deleted-task-not-found'
import DeletedTaskPolicy from '@/features/tasks/deleted-detail/components/deleted-task-policy'
import TaskDeletedDetailLoading from '@/features/tasks/deleted-detail/components/task-deleted-detail-loading'
import { useDeletedTask } from '@/features/tasks/deleted-detail/hooks/use-deleted-task'
import { useTaskAuditLogs } from '@/features/tasks/detail/hooks/use-task-audit-logs'

export default function DeletedTaskDetailPage() {
  useEffect(() => {
    document.title = 'Deleted Task Detail - Mini Task Manager'
  }, [])

  const { taskId } = useParams<{ taskId: string }>()
  const actor = useStoredActor()
  const { task, isLoading } = useDeletedTask(taskId ?? '')
  const { logs, isLoading: isAuditLoading, refetch: refetchLogs } = useTaskAuditLogs(taskId ?? '')

  return (
    <main
      className="min-h-screen px-4 py-6 sm:px-6 lg:px-8"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(15, 23, 42, 0.04), transparent 28rem), #f8fafc',
      }}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <DeletedDetailPageHeader actor={actor} />

        {isLoading ? (
          <TaskDeletedDetailLoading />
        ) : !task ? (
          <DeletedTaskNotFound />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="space-y-6">
              <DeletedTaskInfoCard task={task} />
              <DeletedTaskPolicy />
            </div>

            <TaskAuditLogsSection
              logs={logs}
              isLoading={isAuditLoading}
              onRefresh={() => {
                void refetchLogs()
              }}
              emptyTitle="No audit logs found"
              emptyDescription="This deleted task should normally have at least one delete audit log."
            />
          </div>
        )}
      </div>
    </main>
  )
}
