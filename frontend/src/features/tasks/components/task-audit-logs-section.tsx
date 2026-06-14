import { Button } from '@/components/ui/button'
import type { AuditLog } from '../types/audit-log'
import AuditLogItem from './audit-log-item'

interface TaskAuditLogsSectionProps {
  logs: AuditLog[]
  isLoading: boolean
  onRefresh: () => void
  emptyTitle?: string
  emptyDescription?: string
}

function AuditLogsEmpty({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  )
}

function AuditLogsSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-dashed border-slate-200 p-6 text-center"
    >
      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      <p className="mt-3 text-xs text-slate-500">Loading logs...</p>
    </div>
  )
}

export default function TaskAuditLogsSection({
  logs,
  isLoading,
  onRefresh,
  emptyTitle = 'No audit logs yet',
  emptyDescription = 'Status changes and task deletion will be recorded here.',
}: TaskAuditLogsSectionProps) {
  const countText = isLoading
    ? 'Loading logs...'
    : `${logs.length} log${logs.length === 1 ? '' : 's'}`

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Task Audit Logs</h2>
          <p className="mt-1 text-sm text-slate-500">{countText}</p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
          className="h-9 rounded-lg border-slate-200 bg-white px-3 text-xs font-medium text-slate-950 hover:bg-slate-50"
        >
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <AuditLogsSkeleton />
      ) : logs.length === 0 ? (
        <AuditLogsEmpty title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <AuditLogItem key={log.id} log={log} />
          ))}
        </div>
      )}
    </section>
  )
}
