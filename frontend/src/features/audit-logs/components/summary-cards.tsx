import type { AuditLogSummary } from '../utils/summarize-audit-logs'

interface SummaryCardsProps {
  summary: AuditLogSummary
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Total Audit Logs
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{summary.total}</p>
        <p className="mt-1 text-sm text-slate-500">All recorded task events.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Status Changes</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          {summary.statusChanged}
        </p>
        <p className="mt-1 text-sm text-slate-500">Forward status movement events.</p>
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-red-600">Task Deleted</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-red-700">{summary.taskDeleted}</p>
        <p className="mt-1 text-sm text-red-600">Soft delete audit events.</p>
      </div>
    </section>
  )
}
