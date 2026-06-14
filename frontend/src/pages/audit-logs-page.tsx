import { useEffect, useMemo, useState } from 'react'
import { useStoredActor } from '@/features/actors/hooks/use-stored-actor'
import { useAuditLogs } from '@/features/audit-logs/hooks/use-audit-logs'
import AuditLogList from '@/features/audit-logs/components/audit-log-list'
import AuditLogsPageHeader from '@/features/audit-logs/components/page-header'
import SummaryCards from '@/features/audit-logs/components/summary-cards'
import {
  filterAuditLogs,
  type EventTypeFilter,
} from '@/features/audit-logs/utils/filter-audit-logs'
import { summarizeAuditLogs } from '@/features/audit-logs/utils/summarize-audit-logs'

export default function AuditLogsPage() {
  useEffect(() => {
    document.title = 'Global Audit Trail - Mini Task Manager'
  }, [])

  const actor = useStoredActor()
  const { logs, isLoading, refetch } = useAuditLogs()
  const [searchQuery, setSearchQuery] = useState('')
  const [eventType, setEventType] = useState<EventTypeFilter>('all')

  const filteredLogs = useMemo(
    () => filterAuditLogs(logs, searchQuery, eventType),
    [logs, searchQuery, eventType]
  )
  const summary = useMemo(() => summarizeAuditLogs(logs), [logs])

  const handleClear = () => {
    setSearchQuery('')
    setEventType('all')
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
        <AuditLogsPageHeader actor={actor} />

        <SummaryCards summary={summary} />

        <AuditLogList
          logs={filteredLogs}
          totalCount={logs.length}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          eventType={eventType}
          onEventTypeChange={setEventType}
          onClear={handleClear}
          onRefresh={() => {
            void refetch()
          }}
        />
      </div>
    </main>
  )
}
