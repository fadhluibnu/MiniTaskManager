import { ArrowRight, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/shared/utils/format-date'
import type { AuditLog } from '@/features/audit-logs/types/audit-log'
import { formatStatus } from '../utils/format-status'

interface AuditLogItemProps {
  log: AuditLog
}

export default function AuditLogItem({ log }: AuditLogItemProps) {
  const isDeleteEvent = log.eventType === 'TASK_DELETED'

  return (
    <div className="timeline-line relative pl-12">
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

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-medium',
              isDeleteEvent ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
            )}
          >
            {log.eventType}
          </span>
          <span className="text-xs text-slate-500">{formatDate(log.createdAt)}</span>
        </div>

        <p className="mt-3 text-sm font-medium text-slate-950">
          {log.actorName} changed this task.
        </p>

        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          {isDeleteEvent ? (
            <>
              Deleted from status{' '}
              <span className="font-semibold text-slate-950">{formatStatus(log.fromStatus)}</span>
            </>
          ) : (
            <>
              From{' '}
              <span className="font-semibold text-slate-950">{formatStatus(log.fromStatus)}</span>{' '}
              to <span className="font-semibold text-slate-950">{formatStatus(log.toStatus!)}</span>
            </>
          )}
        </div>

        <p className="mt-2 text-xs text-slate-500">Actor ID: {log.actorId}</p>
      </div>
    </div>
  )
}
