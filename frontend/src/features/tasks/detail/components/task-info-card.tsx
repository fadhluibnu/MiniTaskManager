import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/shared/utils/format-date'
import type { Task } from '../../types/task'
import { formatStatus } from '../../utils/format-status'
import { getNextStatus } from '../../utils/get-next-status'
import StatusBadge from '../../components/status-badge'

interface TaskInfoCardProps {
  task: Task
  isActionDisabled: boolean
  onMove: () => void
  onDelete: () => void
}

export default function TaskInfoCard({
  task,
  isActionDisabled,
  onMove,
  onDelete,
}: TaskInfoCardProps) {
  const nextStatus = getNextStatus(task.status)
  const moveLabel = nextStatus ? `Move to ${formatStatus(nextStatus)}` : 'Status Done'

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={task.status} />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {task.id}
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">{task.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {task.description || 'No description provided.'}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            to={`/tasks/${task.id}/edit`}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 transition hover:bg-slate-50"
          >
            Edit Task
          </Link>

          <Button
            type="button"
            onClick={onMove}
            disabled={isActionDisabled || !nextStatus}
            className="h-10 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50"
          >
            {moveLabel}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onDelete}
            disabled={isActionDisabled}
            className="h-10 rounded-lg border-red-200 bg-white px-4 text-sm font-medium text-red-600 hover:bg-red-50 disabled:pointer-events-none disabled:opacity-50"
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Created By</p>
          <p className="mt-2 text-sm font-semibold text-slate-950">
            {task.createdByActorName || '-'}
          </p>
          <p className="mt-1 text-xs text-slate-500">{task.createdByActorId || '-'}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Current Status
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-950">{formatStatus(task.status)}</p>
          <p className="mt-1 text-xs text-slate-500">
            {nextStatus ? `Next status: ${formatStatus(nextStatus)}` : 'This task is already done.'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Created At</p>
          <p className="mt-2 text-sm font-semibold text-slate-950">{formatDate(task.createdAt)}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Updated At</p>
          <p className="mt-2 text-sm font-semibold text-slate-950">{formatDate(task.updatedAt)}</p>
        </div>
      </div>
    </section>
  )
}
