import { formatDate } from '@/shared/utils/format-date'
import StatusBadge from '../../components/status-badge'
import type { Task } from '../../types/task'
import { formatStatus } from '../../utils/format-status'

interface DeletedTaskInfoCardProps {
  task: Task
}

export default function DeletedTaskInfoCard({ task }: DeletedTaskInfoCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={task.status} />
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
              Deleted
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {task.id}
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">{task.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {task.description || 'No description provided.'}
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          This task is read-only because it has been soft deleted.
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

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-red-600">Deleted By</p>
          <p className="mt-2 text-sm font-semibold text-red-700">
            {task.deletedByActorName || '-'}
          </p>
          <p className="mt-1 text-xs text-red-600">{task.deletedByActorId || '-'}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Last Status</p>
          <p className="mt-2 text-sm font-semibold text-slate-950">{formatStatus(task.status)}</p>
          <p className="mt-1 text-xs text-slate-500">Status before deletion.</p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-red-600">Deleted At</p>
          <p className="mt-2 text-sm font-semibold text-red-700">{formatDate(task.deletedAt)}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Created At</p>
          <p className="mt-2 text-sm font-semibold text-slate-950">{formatDate(task.createdAt)}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Last Updated At
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-950">{formatDate(task.updatedAt)}</p>
        </div>
      </div>
    </section>
  )
}
