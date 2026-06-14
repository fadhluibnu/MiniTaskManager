import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/shared/utils/format-date'
import type { Task } from '../../types/task'
import { formatStatus } from '../../utils/format-status'
import { getNextStatus } from '../../utils/get-next-status'
import StatusBadge from '../../components/status-badge'

interface TaskCardProps {
  task: Task
  isActionDisabled: boolean
  onMove: (taskId: string) => void
  onDelete: (task: Task) => void
}

export default function TaskCard({ task, isActionDisabled, onMove, onDelete }: TaskCardProps) {
  const nextStatus = getNextStatus(task.status)
  const moveLabel = nextStatus ? `Move to ${formatStatus(nextStatus)}` : 'Done'

  return (
    <article className="task-card rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-950">{task.title}</h3>
            <StatusBadge status={task.status} />
          </div>

          {task.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{task.description}</p>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No description</p>
          )}

          <div className="mt-3 grid gap-1 text-xs text-slate-500 sm:grid-cols-2">
            <p>
              Created by:{' '}
              <span className="font-medium text-slate-700">{task.createdByActorName || '-'}</span>
            </p>
            <p>
              Updated:{' '}
              <span className="font-medium text-slate-700">{formatDate(task.updatedAt)}</span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <Link
            to={`/tasks/${task.id}`}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-950 transition hover:bg-slate-50"
          >
            Detail
          </Link>

          <Button
            type="button"
            disabled={isActionDisabled || !nextStatus}
            onClick={() => onMove(task.id)}
            className="h-9 rounded-lg bg-slate-950 px-3 text-xs font-medium text-white hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50"
          >
            {moveLabel}
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isActionDisabled}
            onClick={() => onDelete(task)}
            className="h-9 rounded-lg border-red-200 bg-white px-3 text-xs font-medium text-red-600 hover:bg-red-50 disabled:pointer-events-none disabled:opacity-50"
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  )
}
