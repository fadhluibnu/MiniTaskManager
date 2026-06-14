import { Link } from 'react-router-dom'
import ActorBadge from '@/features/actors/components/actor-badge'
import type { ActorCardData } from '@/features/actors/types/actor'

interface DeletedDetailPageHeaderProps {
  actor: ActorCardData | null
}

const NAV_LINKS = [
  { label: 'Change Actor', to: '/select-actor' },
  { label: 'Active Tasks', to: '/tasks' },
  { label: 'Audit Trail', to: '/audit-logs' },
] as const

export default function DeletedDetailPageHeader({ actor }: DeletedDetailPageHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Link
            to="/deleted-tasks"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-950 transition hover:bg-slate-50"
          >
            ← Back to Deleted Tasks
          </Link>
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            Deleted Task Detail
          </span>
        </div>

        <p className="text-sm font-medium text-slate-500">Mini Task Manager</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
          Deleted Task Detail
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          View soft-deleted task information and its immutable audit history. This page is
          read-only.
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
