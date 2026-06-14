import { Link } from 'react-router-dom'
import ActorBadge from '@/features/actors/components/actor-badge'
import type { ActorCardData } from '@/features/actors/types/actor'

interface AuditLogsPageHeaderProps {
  actor: ActorCardData | null
}

const NAV_LINKS = [
  { label: 'Change Actor', to: '/select-actor' },
  { label: 'Deleted Tasks', to: '/deleted-tasks' },
] as const

export default function AuditLogsPageHeader({ actor }: AuditLogsPageHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Link
            to="/tasks"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-950 transition hover:bg-slate-50"
          >
            ← Back to Tasks
          </Link>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Newest to Oldest
          </span>
        </div>

        <p className="text-sm font-medium text-slate-500">Mini Task Manager</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
          Global Audit Trail
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          View all task audit logs across active and deleted tasks. Audit logs are append-only and
          cannot be edited or deleted.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:items-end">
        <ActorBadge actor={actor} />

        <div className="flex flex-wrap gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-950 transition hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
