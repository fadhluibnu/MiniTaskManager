import { ArrowRight, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { formatDate } from '@/shared/utils/format-date'
import { formatStatus } from '@/features/tasks/utils/format-status'
import { getTaskDetailLink } from '../utils/get-task-detail-link'
import type { AuditLog } from '../types/audit-log'

interface AuditLogItemProps {
  log: AuditLog
}

export default function AuditLogItem({ log }: AuditLogItemProps) {
  const isDeleteEvent = log.eventType === 'TASK_DELETED'

  return (
    <article className="timeline-line relative pl-12">
      <div
        className={cn(
          'absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full',
          isDeleteEvent ? 'bg-red-100 text-red-700' : 'bg-slate-950 text-white'
        )}
      >
        {isDeleteEvent ? (
          <Trash2 className="size-4" aria-hidden="true" />
        ) : (
          <ArrowRight className="size-4" aria-hidden="true" />
        )}
      </div>

      <div className="audit-card rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium',
                  isDeleteEvent ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                )}
              >
                {log.eventType}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {formatDate(log.createdAt)}
              </span>
            </div>

            <h3 className="mt-3 text-sm font-semibold text-slate-950">
              {log.taskTitle || 'Untitled task'}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {isDeleteEvent
                ? `${log.actorName} deleted this task.`
                : `${log.actorName} changed task status.`}
            </p>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Actor</p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{log.actorName || '-'}</p>
                <p className="mt-0.5 text-xs text-slate-500">{log.actorId || '-'}</p>
              </div>

              <div className={cn('rounded-lg p-3', isDeleteEvent ? 'bg-red-50' : 'bg-slate-50')}>
                <p
                  className={cn(
                    'text-xs font-medium uppercase tracking-wide',
                    isDeleteEvent ? 'text-red-600' : 'text-slate-500'
                  )}
                >
                  Change
                </p>
                <p
                  className={cn(
                    'mt-1 text-sm font-semibold',
                    isDeleteEvent ? 'text-red-700' : 'text-slate-950'
                  )}
                >
                  {isDeleteEvent
                    ? `Deleted from ${formatStatus(log.fromStatus)}`
                    : `${formatStatus(log.fromStatus)} → ${
                        log.toStatus ? formatStatus(log.toStatus) : '—'
                      }`}
                </p>
                <p
                  className={cn(
                    'mt-0.5 text-xs',
                    isDeleteEvent ? 'text-red-600' : 'text-slate-500'
                  )}
                >
                  Task ID: {log.taskId}
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
            <Link
              to={getTaskDetailLink(log)}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-950 transition hover:bg-slate-50"
            >
              View Task
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
