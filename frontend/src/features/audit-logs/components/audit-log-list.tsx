import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AuditLog } from '../types/audit-log'
import type { EventTypeFilter } from '../utils/filter-audit-logs'
import AuditLogItem from './audit-log-item'

interface AuditLogListProps {
  logs: AuditLog[]
  totalCount: number
  isLoading: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  eventType: EventTypeFilter
  onEventTypeChange: (value: EventTypeFilter) => void
  onClear: () => void
  onRefresh: () => void
}

function AuditLogListSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-dashed border-slate-200 p-8 text-center"
    >
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      <p className="mt-3 text-sm text-slate-500">Loading audit logs...</p>
    </div>
  )
}

function AuditLogListEmpty({
  searchQuery,
  eventType,
  totalCount,
}: {
  searchQuery: string
  eventType: EventTypeFilter
  totalCount: number
}) {
  const hasFilter = searchQuery.trim().length > 0 || eventType !== 'all'
  const isSearchResult = hasFilter && totalCount > 0
  return (
    <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600">
        —
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-950">
        {isSearchResult ? 'No matching audit logs' : 'No audit logs'}
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        {isSearchResult
          ? 'Try another keyword, event type, or clear the filter.'
          : 'Audit logs will appear after task status changes or task deletions.'}
      </p>
    </div>
  )
}

export default function AuditLogList({
  logs,
  totalCount,
  isLoading,
  searchQuery,
  onSearchChange,
  eventType,
  onEventTypeChange,
  onClear,
  onRefresh,
}: AuditLogListProps) {
  const isLoadingText = isLoading
    ? 'Loading audit logs...'
    : searchQuery.trim() || eventType !== 'all'
      ? `Showing ${logs.length} of ${totalCount} audit logs`
      : `${totalCount} audit log${totalCount === 1 ? '' : 's'}`

  const hasActiveFilter = searchQuery.trim().length > 0 || eventType !== 'all'

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Audit Log List</h2>
          <p className="mt-1 text-sm text-slate-500">{isLoadingText}</p>
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

      <div className="mb-4 grid gap-2 lg:grid-cols-[1fr_220px_auto]">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            Search
          </span>
          <Input
            type="search"
            placeholder="Search by task, actor, event, or status"
            className="h-11 w-full rounded-lg border-slate-300 bg-white py-2 pl-[4.25rem] pr-3 text-sm outline-none transition placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-slate-200"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Select value={eventType} onValueChange={(v) => onEventTypeChange(v as EventTypeFilter)}>
          <SelectTrigger className="h-11 w-full rounded-lg border-slate-300 bg-white px-3 text-sm focus:border-slate-900 focus:ring-slate-200">
            <SelectValue placeholder="All Events" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="STATUS_CHANGED">Status Changed</SelectItem>
            <SelectItem value="TASK_DELETED">Task Deleted</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          onClick={onClear}
          disabled={!hasActiveFilter}
          className="h-11 rounded-lg border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
        >
          Clear
        </Button>
      </div>

      {isLoading ? (
        <AuditLogListSkeleton />
      ) : logs.length === 0 ? (
        <AuditLogListEmpty
          searchQuery={searchQuery}
          eventType={eventType}
          totalCount={totalCount}
        />
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
