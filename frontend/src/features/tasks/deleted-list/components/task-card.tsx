import { Link } from 'react-router-dom'
import { formatDate } from '@/shared/utils/format-date'
import StatusBadge from '../../components/status-badge'
import type { Task } from '../../types/task'

interface DeletedTaskCardProps {
  task: Task
}

export default function DeletedTaskCard({ task }: DeletedTaskCardProps) {
  return (
    <article className="task-card rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-950">{task.title}</h3>
            <StatusBadge status={task.status} />
            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
              Deleted
            </span>
          </div>

          {task.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{task.description}</p>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No description</p>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Created By
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                {task.createdByActorName || '-'}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{task.createdByActorId || '-'}</p>
            </div>

            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-red-600">Deleted By</p>
              <p className="mt-1 text-sm font-semibold text-red-700">
                {task.deletedByActorName || '-'}
              </p>
              <p className="mt-0.5 text-xs text-red-600">{task.deletedByActorId || '-'}</p>
            </div>
          </div>

          <div className="mt-3 grid gap-1 text-xs text-slate-500 sm:grid-cols-2">
            <p>
              Deleted at:{' '}
              <span className="font-medium text-slate-700">{formatDate(task.deletedAt)}</span>
            </p>
            <p>
              Last updated:{' '}
              <span className="font-medium text-slate-700">{formatDate(task.updatedAt)}</span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
          <Link
            to={`/deleted-tasks/${task.id}`}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-950 px-3 text-xs font-medium text-white transition hover:bg-slate-800"
          >
            View Detail
          </Link>

          <Link
            to="/audit-logs"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-950 transition hover:bg-slate-50"
          >
            Audit Trail
          </Link>
        </div>
      </div>
    </article>
  )
}
